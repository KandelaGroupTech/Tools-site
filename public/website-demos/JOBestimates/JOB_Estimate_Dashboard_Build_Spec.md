# Build Spec — JOB Estimate Review Dashboard

**Client:** Journey Office Builders, Inc. (JOB) — commercial interior / tenant improvement contractor, DC and Northern Virginia
**Deliverable:** A private, hosted web dashboard that mirrors an Excel estimate workbook, backed by Airtable
**Audience for this document:** the coding agent

---

## 0. How to run this build

Use **Planning mode**. Produce an implementation plan artifact and stop for approval before writing code. Do not begin scaffolding until the plan is approved.

When implementing, verify each acceptance criterion in Section 9 using the built-in browser and attach screenshots as artifacts. A task is not done until its acceptance criterion has a screenshot behind it.

**Do not invent scope.** If something in this spec is ambiguous, add it to a `QUESTIONS.md` file at the repo root and continue with the rest. Do not guess at business logic.

---

## 1. What this application is, and what it is not

An estimator prices tenant improvement jobs in an Excel workbook. Quantities arrive in that workbook automatically from Bluebeam Revu via a feature called Quantity Link. Rates and multipliers live in that workbook. **Excel is the calculation engine and it stays that way.**

This dashboard is a **mirror**, not a second engine. Its job is to let collaborators (project managers, a reviewer, occasionally a client) see how a number was arrived at, attach subcontractor quote PDFs to specific line items, leave comments, and record two human decisions the spreadsheet is bad at holding.

**The single most important rule in this build:**

> Computed values flow one direction only: Excel → Airtable → dashboard. The dashboard must never calculate a quantity, a base rate, a modifier, or a preliminary cost. It displays what it was given.

If you find yourself writing arithmetic that reproduces spreadsheet logic, stop. That is the failure mode this rule exists to prevent. Two engines will drift, and the drift will not be discovered until it is in a client's hands.

There are exactly two exceptions, both defined precisely in Section 4.4.

---

## 2. Domain concepts the code must respect

Read this section carefully. These are not preferences, they are correctness constraints.

### 2.1 Cost codes

JOB uses 1995 16-division MasterFormat cost codes. A cost code looks like `09250-01`: five digits, zero-padded, then a hyphen and a two-digit line sequence.

- **Store and handle cost codes as strings, never as numbers.** `09250-01` parsed as a number loses the leading zero and becomes a different code. This breaks the join to Excel and to Bluebeam silently.
- Sorting must be lexicographic on the padded string. That is precisely why the padding exists: unpadded, `10160` sorts between `1000` and `1743` and scrambles the divisions.
- There is a second, unpadded code (`9250`) used on the printed bid form. Store it, display it where noted, never join on it.

### 2.2 The four states

Every line item carries a **State**, and the vocabulary is closed:

| State | Meaning | Additional required field |
|---|---|---|
| `PRICED` | A dollar amount for this line is in the estimate | — |
| `BY OTHERS` | Real scope on this job, but not JOB's to perform | `Responsible Party` must be non-empty |
| `EXCLUDED` | Could be JOB's scope, deliberately not carried | `Exclusion Reason` must be non-empty |
| `N-A` | This scope does not exist on this job | — |

**Blank is not a fifth state. Blank is an unfinished bid.** A line item with no State is a defect, and the entire purpose of this system is to make that defect impossible to overlook. See Section 4.3.

Do not add states. Do not offer a "TBD" or "Pending" option. Do not auto-assign a default state on record creation.

### 2.3 The counter

The estimator's gate before a bid is submitted is: **the count of line items with a blank State must equal zero.** Not low. Zero.

This number is the most important element on the entire interface. Treat it as the primary metric, the way a trading dashboard treats P&L.

---

## 3. Airtable schema

Create a base named `JOB Estimating`. Five tables.

### 3.1 `Projects`

| Field | Type | Notes |
|---|---|---|
| `Project Number` | Single line text | **Primary field.** e.g. `2026-041` |
| `Project Name` | Single line text | e.g. `National Press Building, Suite 814` |
| `Address` | Single line text | |
| `Jurisdiction` | Single select | `DC`, `VA`, `MD` |
| `Job Size` | Single select | `Small`, `Mid-sized`, `Big` |
| `USF` | Number, integer | Usable square feet |
| `RSF` | Number, integer | Rentable square feet |
| `Architect` | Single line text | |
| `Bid Due Date` | Date | |
| `Addendum No.` | Number, integer | Default 0 |
| `Status` | Single select | `Active`, `Submitted`, `Awarded`, `Lost`, `No Bid` |
| `Last Synced` | Date with time | Written by the sync process |

### 3.2 `Line_Items`

The core table. One record per scope line per project.

| Field | Type | Lane | Notes |
|---|---|---|---|
| `Sync Key` | Single line text | key | **Primary field.** Format: `{Project Number}\|{Cost Code}`, e.g. `2026-041\|09250-01`. See Section 5. |
| `Project` | Link to `Projects` | key | Single record |
| `Cost Code` | Single line text | key | Padded, e.g. `09250-01`. **Text, not number.** |
| `Bid Div` | Single line text | read-only | Unpadded, e.g. `9250` |
| `Division Name` | Single line text | read-only | e.g. `DRYWALL` |
| `Division Sort` | Number | read-only | Integer for ordering division groups |
| `Scope Item` | Single line text | read-only | e.g. `Slab-to-Slab Partition` |
| `Unit` | Single select | read-only | `EA`, `LF`, `SF`, `SY`, `CY`, `HRS`, `LS`, `ALLOW` |
| `Bluebeam Subject` | Single line text | read-only | The markup tool name this line is measured with |
| `Quantity` | Number, 2 decimals | **synced** | From Bluebeam via Excel |
| `Base Rate` | Currency, 2 decimals | **synced** | From the Excel rate library |
| `Modifier` | Number, 3 decimals | **synced** | Job size / jurisdiction multiplier. Default 1.000 |
| `Preliminary Cost` | Currency | **synced** | Computed in Excel. Do **not** compute this in Airtable or in the app. |
| `Prelim Check` | Formula | derived | `ROUND(Quantity * Base Rate * Modifier, 2)` |
| `Prelim Mismatch` | Formula | derived | `IF(ABS(Preliminary Cost - Prelim Check) > 0.01, "MISMATCH", "")` |
| `Sub Quote Total` | Rollup | derived | `SUM` of `Amount` from linked `Sub_Quotes` where `Is Selected` is true |
| `Final Cost` | Currency | **editable** | The estimator's decision |
| `Variance` | Formula | derived | `Final Cost - Preliminary Cost` |
| `Variance %` | Formula | derived | Guard the denominator: `IF(Preliminary Cost = 0, BLANK(), (Final Cost - Preliminary Cost) / Preliminary Cost)` |
| `State` | Single select | **editable** | `PRICED`, `BY OTHERS`, `EXCLUDED`, `N-A`. **No default value.** |
| `Responsible Party` | Single line text | **editable** | Required when State is `BY OTHERS` |
| `Exclusion Reason` | Long text | **editable** | Required when State is `EXCLUDED` |
| `Notes / Basis` | Long text | **editable** | |
| `Source` | Single select | read-only | `JOB`, `NPB`, `ADD` |
| `Sub_Quotes` | Link to `Sub_Quotes` | — | Multiple records |
| `Comments` | Link to `Comments` | — | Multiple records |
| `Last Synced` | Date with time | — | |

**Lane meanings, enforced in the application layer:**

- `key` — set once at creation by the sync, never editable
- `read-only` — written by sync only, rendered as plain text in the UI with no input control
- `synced` — written by sync only, rendered with a subtle "from Excel" affordance so users understand why they cannot change it
- `editable` — the only fields the dashboard may write
- `derived` — Airtable formulas, never written by anything

### 3.3 `Sub_Quotes`

| Field | Type | Notes |
|---|---|---|
| `Quote ID` | Autonumber or formula | Primary field |
| `Line Item` | Link to `Line_Items` | Single record |
| `Subcontractor` | Single line text | |
| `Trade` | Single select | `Self`, `Sub`, `VOR`, `Others`, `LL` |
| `Amount` | Currency | |
| `Date Received` | Date | |
| `Is Selected` | Checkbox | Only one per line item should be checked; enforce in the UI |
| `Scope Included` | Long text | |
| `Scope Excluded` | Long text | The high-value field. A sub exclusion nobody else picked up is a hole in the bid. |
| `PDF` | Attachment | The quote itself |
| `Uploaded By` | Single line text | |

### 3.4 `Comments`

Do not rely on Airtable's native record comments; use an owned table so the API surface is predictable.

| Field | Type |
|---|---|
| `Comment ID` | Autonumber (primary) |
| `Line Item` | Link to `Line_Items` |
| `Author` | Single line text |
| `Body` | Long text |
| `Created` | Created time |
| `Resolved` | Checkbox |

### 3.5 `Rate_Library`

Reference only. Displayed in the line item detail panel so a reviewer can see where a base rate came from without opening Excel.

| Field | Type |
|---|---|
| `Cost Code` | Single line text (primary) |
| `Unit` | Single select |
| `Rate — Small` | Currency |
| `Rate — Mid` | Currency |
| `Rate — Big` | Currency |
| `Effective Date` | Date |
| `Source` | Single line text |
| `Assembly Note` | Long text |

---

## 4. Application

### 4.1 Stack

- **Next.js (App Router), TypeScript, Tailwind.**
- All Airtable calls go through server-side Route Handlers under `/app/api/`. **The Airtable personal access token must never reach the browser.** No `NEXT_PUBLIC_` prefix on any Airtable credential. If you find yourself needing the token client-side, you have made an architectural error; add a route handler instead.
- Environment variables: `AIRTABLE_PAT`, `AIRTABLE_BASE_ID`, `APP_PASSCODE`, `SESSION_SECRET`.
- Include a `.env.example` with these keys and no values.

### 4.2 Authentication

This is confidential pricing data. Keep the mechanism proportionate but real:

- A single shared passcode from `APP_PASSCODE`, exchanged for a signed, HTTP-only session cookie (30 day expiry).
- Middleware protects every route except `/login` and static assets.
- No user accounts. Capture the viewer's name once at login and store it in the session; use it to stamp `Uploaded By` and comment `Author`.

If the hosting platform offers its own deployment-level password protection, note that in the README as an additional layer, but still implement the above so the app is portable.

### 4.3 Screens

**`/` — Project list.** Table of projects. Each row shows project number, name, jurisdiction, job size, status, bid due date, total final cost, and **the blank-state counter**. Counter renders red and bold when greater than zero, green when zero. Sort by bid due date ascending.

**`/project/[projectNumber]` — Estimate view.** The main screen.

- A header band that is always visible on scroll, containing:
  - Project name, jurisdiction, job size, USF and RSF
  - **THE COUNTER**, rendered as the largest element in the band: `14 LINES UNRESOLVED` in red, or `ALL LINES RESOLVED` in green. Clicking it filters the grid to blank-state lines.
  - Totals: Preliminary, Final, Variance, and $/USF
- A grid of line items, **grouped by division**, ordered by `Division Sort` then `Cost Code`. Each division group shows a collapsible header with the division name, unpadded bid code, and division subtotals for Preliminary and Final.
- Grid columns: Cost Code · Scope Item · Unit · Quantity · Base Rate · Modifier · Preliminary · Sub Quote · **Final** · Variance · **State** · a paperclip icon with attachment count · a speech bubble icon with unresolved comment count.
- Rows with a blank State get a left border in red and a subtle red background tint. They must be visible at a glance while scrolling.
- Rows where `Prelim Mismatch` is non-empty get an amber warning icon with a tooltip explaining that the Excel value and the recomputed check disagree.
- Filters: division, state (including a "blank" option), and a text search across cost code and scope item.
- `State` and `Final Cost` are editable inline. Everything else is plain text.

**`/project/[projectNumber]/line/[costCode]` — Line item detail.** A slide-over panel rather than a full page navigation, so the estimator does not lose their place in the grid.

- Full read-only breakdown: quantity, unit, base rate, modifier, preliminary cost, shown as an explicit equation so the arithmetic is legible: `1,240 LF × $75.00 × 1.000 = $93,000.00`
- The matching `Rate_Library` row, so the reviewer can see the assembly note behind the rate
- Editable: State, Responsible Party, Exclusion Reason, Final Cost, Notes / Basis
- Sub quotes: a list, each with subcontractor, amount, date, selected radio, scope included, scope excluded, and the PDF. An upload control accepting PDF only, 25 MB max.
- Comments thread with an add box and a resolve toggle.

**`/project/[projectNumber]/audit` — Audit view.** Four sections, in this order, each collapsible and each showing a count:

1. **Blank line report.** Every line with no State. This section is first and cannot be reordered. A blank line is the only unambiguous failure in the system, so it gets top billing.
2. **State without substance.** Lines marked `PRICED` with a Final Cost of zero or empty. Lines marked `BY OTHERS` with no Responsible Party. Lines marked `EXCLUDED` with no Exclusion Reason.
3. **Sub quote gaps.** Lines marked `PRICED` with no attached sub quote, and lines with more than one `Is Selected` quote checked.
4. **Prelim mismatches.** Lines where `Prelim Mismatch` is flagged.

Each section supports "export to CSV".

**`/project/[projectNumber]/exclusions` — Exclusions and clarifications.** A clean, printable list of every line where State is `EXCLUDED` or `BY OTHERS`, showing scope item, cost code, and the reason or responsible party. This text becomes the Exclusions & Clarifications section of the bid letter, so it must be copyable as clean text. Include a "copy all" button. No decorative styling; this output goes to a client.

### 4.4 The two permitted calculations

The dashboard may compute exactly two things, both of which are aggregations of values it was given, never re-derivations of them:

1. **Subtotals and totals.** Sums of `Preliminary Cost` and `Final Cost` by division and overall.
2. **The counter.** A count of records where `State` is empty.

`Variance`, `Variance %`, `Prelim Check`, `Prelim Mismatch`, and `Sub Quote Total` are Airtable formula and rollup fields. Read them. Do not reimplement them in TypeScript.

### 4.5 Write rules

The write API must reject, with a 400 and a clear message, any attempt to modify a field outside the editable lane. Enforce this with an explicit server-side allowlist constant, not by trusting the client payload shape:

```ts
const EDITABLE_FIELDS = [
  'Final Cost',
  'State',
  'Responsible Party',
  'Exclusion Reason',
  'Notes / Basis',
] as const;
```

Validation on write:
- `State` must be one of the four values, or empty. Reject anything else.
- Setting `State` to `BY OTHERS` with an empty `Responsible Party` is rejected.
- Setting `State` to `EXCLUDED` with an empty `Exclusion Reason` is rejected.
- Clearing a State back to empty is **permitted**. An estimator who realises a line was resolved wrongly must be able to reopen it. Log it, do not block it.

---

## 5. Sync from Excel

One-directional, manual, and deliberately simple for version one.

The estimator exports the `04_Estimate` worksheet to CSV. That CSV is the contract between the two systems.

**Required CSV headers, in this order, spelled exactly:**

```
Sync Key,Project Number,Cost Code,Bid Div,Division Name,Division Sort,Scope Item,Unit,Bluebeam Subject,Quantity,Base Rate,Modifier,Preliminary Cost,Source
```

Build a `/sync` page, protected by the same auth, that accepts this CSV upload and performs an **upsert keyed on `Sync Key`**.

- Existing record → update the `key`, `read-only`, and `synced` fields only. **Never touch the editable lane.** A re-sync after an addendum must not erase an estimator's exclusion reason.
- No matching record → create it, with `State` left empty.
- Record present in Airtable but absent from the CSV → do not delete. Flag it in the sync report as `ORPHANED` and let a human decide.
- Stamp `Last Synced` on every touched record.

After the upload, render a **sync report** before committing: counts of created, updated, orphaned, and rejected rows, with the rejection reason for each. Require an explicit confirm click. Do not write anything to Airtable until that click.

Reject the whole file if any `Cost Code` fails the pattern `^\d{5}-\d{2}$`. A malformed cost code means the join key is broken, and a partial import with a broken key is worse than no import.

Parse the CSV with a real parser that handles quoted fields containing commas. Scope item text contains commas.

Write the header contract into `README.md` so the estimator can verify their Excel export matches.

---

## 6. Visual design

Utilitarian and dense. This is a working instrument that gets read on a laptop next to a set of drawings, not a marketing page.

- Tabular numerals throughout. Currency right-aligned, two decimals, thousands separators, `$1,240.00`. Zero renders as `—`. Negative variance in parentheses and red.
- Quantities right-aligned with the unit in a muted color immediately after: `1,240 LF`
- Cost codes in a monospace face so the padding is visually obvious.
- Compact row height. An estimator should see 25 or more rows without scrolling on a 1440px display.
- Color carries exactly three meanings and nothing else: red for unresolved, amber for mismatch, green for resolved. Do not use color decoratively anywhere.
- Division group headers should be visually heavier than rows but lighter than the page header.

---

## 7. Seed data

Create `seed/sample-estimate.csv` with roughly 40 rows spanning at least six divisions, using real JOB cost codes so the sort order can be verified. Include deliberately:

- At least 5 rows with blank State
- At least 1 row where `Preliminary Cost` disagrees with `Quantity × Base Rate × Modifier`, to exercise the mismatch flag
- At least 1 row marked `PRICED` with a Final Cost of zero
- Divisions `01000`, `02051`, `09250`, `09500`, `15500`, `16001`

Divisions to draw codes from: `01000` General Conditions, `01743` Final Cleaning, `02050` Demolition, `02051` Interior Demolition, `03001` Concrete/Slab, `06400` Millwork, `07200` Insulation, `08200` Doors Frames & Hardware, `09250` Drywall, `09500` Acoustical, `09650` Resilient Flooring, `09695` Flooring/Carpet, `09900` Wall Finishes, `15300` Fire Sprinkler, `15400` Plumbing, `15500` HVAC, `16001` Electrical, `16600` Fire Life Safety.

---

## 8. Out of scope for this build

Do not build these, and do not leave stubs for them:

- Any editing of quantities, base rates, or modifiers
- Any rate calculation, job-size logic, or jurisdiction adder logic
- Direct Bluebeam integration
- Write-back to Excel
- Multi-user accounts, roles, or permissions
- Email notifications
- Mobile-optimized layouts (desktop-first; it should not be broken on tablet, but do not design for phones)
- Any AI or LLM feature

---

## 9. Acceptance criteria

Each of these needs a browser screenshot artifact.

1. Logging in with the wrong passcode is rejected; the correct passcode reaches the project list.
2. Uploading `seed/sample-estimate.csv` on `/sync` shows a report with correct created and rejected counts, and writes nothing until confirmed.
3. Uploading the same CSV a second time updates rather than duplicates, and the record count is unchanged.
4. Setting a State and a Note on a line, then re-uploading the same CSV, leaves that State and Note intact.
5. The project header counter shows the exact number of blank-State lines and turns green at zero.
6. The grid sorts `09250-01` after `02051-03` and before `16001-01`, proving lexicographic ordering on the padded string.
7. Attempting `PATCH` to `/api/line-items/{id}` with a `Quantity` field returns 400.
8. Setting State to `EXCLUDED` with no reason is rejected with a visible message; adding a reason succeeds.
9. Uploading a PDF to a line item attaches it, and the paperclip count in the grid increments.
10. The audit view lists blank lines first, and its blank count matches the header counter exactly.
11. The exclusions page renders every `EXCLUDED` and `BY OTHERS` line with its reason, and "copy all" produces clean plain text.
12. A row with a deliberate mismatch shows the amber flag; a matching row does not.

---

## 10. Deliverables

- Working Next.js application, deployable to a standard Node host
- `README.md`: setup, environment variables, Airtable base creation steps, the CSV header contract, and a short operating note explaining the one-directional data rule and why it exists
- `scripts/create-airtable-base.ts`: creates the five tables and all fields via the Airtable Meta API, so the base can be rebuilt from scratch
- `seed/sample-estimate.csv`
- `QUESTIONS.md` if anything in this spec was ambiguous
