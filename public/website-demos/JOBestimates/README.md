# JOB Estimate Review Dashboard

A private, hosted web dashboard that mirrors an Excel estimate workbook, backed by Airtable.

## Architecture

This application strictly follows a one-directional data flow:
`Excel (Calculation Engine) -> CSV -> Airtable -> Dashboard`

The dashboard is a **mirror**. Its job is to let collaborators see how a number was arrived at, attach subcontractor quote PDFs, leave comments, and record decisions (State, Final Cost).
It is explicitly forbidden from computing quantities, base rates, modifiers, or preliminary costs to prevent drift between systems.

## Getting Started

### 1. Environment Variables

Create a `.env.local` file at the root:

```
AIRTABLE_PAT=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
APP_PASSCODE=shared_passcode_for_login
SESSION_SECRET=long_random_string_for_cookie
```

### 2. Airtable Setup

You must create a new Airtable base and generate a PAT with `schema.bases:read`, `schema.bases:write`, `data.records:read`, and `data.records:write` scopes.

Run the provided script to construct the tables and fields automatically:
```bash
npx tsx scripts/create-airtable-base.ts
```

### 3. CSV Import Contract

The `/sync` route accepts an export of the `04_Estimate` worksheet.
The CSV must have the following headers, exactly in this order:

`Sync Key,Project Number,Cost Code,Bid Div,Division Name,Division Sort,Scope Item,Unit,Bluebeam Subject,Quantity,Base Rate,Modifier,Preliminary Cost,Source`

### 4. Running the application

```bash
npm install
npm run dev
```

Deployable to standard Node environments like Vercel or AWS Amplify.
