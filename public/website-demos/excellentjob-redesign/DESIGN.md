---
name: Journey Office Builders
description: Tenant improvement general contractor site built as a printed hoarding wall on an occupied floor.
colors:
  maroon: "#7c0a2b"
  maroon-deep: "#5c0620"
  maroon-tint: "#f2c9d3"
  black: "#1b1918"
  black-tint: "#c9c3be"
  ink: "#232120"
  ink-2: "#4a4644"
  ink-soft: "#6b6662"
  wall: "#f3f4f2"
  wall-2: "#e6e8e5"
  seam: "#c8ccc8"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 5.1vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.005em"
    fontVariation: "\"wdth\" 62"
  headline:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.005em"
    fontVariation: "\"wdth\" 62"
  title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.005em"
    fontVariation: "\"wdth\" 62"
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 100"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "\"wdth\" 100"
  label:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.08em"
    fontVariation: "\"wdth\" 75"
  plate:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 800
    letterSpacing: "0.04em"
    fontVariation: "\"wdth\" 75"
rounded:
  none: "0px"
spacing:
  seam: "3px"
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(4rem, 9vw, 8rem)"
  section-tight: "clamp(3rem, 6vw, 5rem)"
  panel: "clamp(2rem, 4vw, 3.5rem)"
  max-width: "1440px"
  header: "76px"
components:
  plate-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.plate}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "52px"
  plate-white-hover:
    backgroundColor: "{colors.maroon-tint}"
  plate-maroon:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.white}"
    typography: "{typography.plate}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "52px"
  plate-maroon-hover:
    backgroundColor: "{colors.maroon-deep}"
  plate-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.plate}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "52px"
  plate-ink-hover:
    backgroundColor: "{colors.maroon}"
  plate-ghost:
    textColor: "{colors.white}"
    typography: "{typography.plate}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "52px"
  nav-plate:
    backgroundColor: "{colors.wall}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 1rem"
    height: "44px"
  nav-plate-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  nav-plate-current:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.white}"
  header-call:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    height: "76px"
  field:
    backgroundColor: "{colors.wall}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.8rem 0.9rem"
    height: "52px"
  field-focus:
    backgroundColor: "{colors.white}"
  nameplate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    padding: "1.25rem 1.4rem 1.1rem"
  fact-strip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    padding: "1.4rem clamp(1rem, 2vw, 2rem)"
---

# Design System: Journey Office Builders

## Overview

**Creative North Star: "The Hoarding Wall"**

The site is the branded partition a contractor stands up on an occupied floor: printed vinyl panels in logo maroon and skyline black, fastened to a cool primer-white wall, carrying site signage in giant condensed capitals. Every page is a run of full-bleed panels that meet at thin visible seams. Information that would be a card or a badge elsewhere is a plate screwed to the wall: a permit plate, a nameplate, a wayfinding plate for navigation, a fact strip printed across the boards. Finished work is only ever seen through a cut in the wall, either the framed viewing window or the pull-back panel that slides aside to reveal the after photo.

The density is signage density: few words, set very large, with normal-width reading text underneath at a comfortable measure. Color is committed rather than accented. Maroon and black are surfaces, not highlights, and the light wall ground exists so those panels read as panels. Corners are square everywhere; depth belongs only to the openings cut through the wall.

Motion follows a single grammar: things slide on a horizontal track with an exponential ease-out (the window track, the pull-back settle, the mobile menu drop). Reduced motion collapses all of it.

**Key Characteristics:**
- Full-bleed maroon and black panels on a cool off-white wall, separated by 3px seams in seam grey.
- Extra-condensed heavy Archivo (width 62, weight 800) in uppercase for all headings, phone numbers and facts; normal-width Archivo for reading.
- Square corners, 2px plate borders, no card shadows.
- Fastener dots at panel corners and printed 4 ft board seams across wide maroon panels.
- Photography framed by thick ink borders, as if seen through an opening in the hoarding.
- The phone number is set as display type wherever it appears.

## Colors

Two identity colors from the logo used as whole surfaces, on a quiet near-neutral wall, with a warm ink for text.

### Primary
- **Logo Maroon** (maroon): the main hoarding panel. Hero and inner page heads, the "build" step in the process run, one quote panel, current navigation plate, the pull-back post and grip, focus rings on light ground, selection, form error text, and the 6px top rule of the footer.
- **Deep Maroon** (maroon-deep): hover state of maroon plates only.
- **Maroon Tint** (maroon-tint): secondary text on maroon panels (ledes, permit plate, soft copy), hover fill of white plates, and hover color for phone numbers and text links on dark panels. Holds 7.3:1 on maroon.

### Secondary
- **Skyline Black** (black): the second hoarding panel. Hero call panel, page-head side panel, scope-of-work section, footer, and the window and pull-back backing.
- **Black Tint** (black-tint): soft text on black panels and the footer body color (10:1 on black).

### Neutral
- **Warm Ink** (ink): body text, the 3px header bottom rule, plate-ink fill, nameplates, fact strip, window bar, image frames, field bottom borders, active filter plates.
- **Ink 2** (ink-2): secondary reading text on the wall (8.5:1).
- **Ink Soft** (ink-soft): placeholders, optional-field markers, scrollbar thumb (5.1:1 on wall).
- **Primer Wall** (wall): page ground and field fill.
- **Wall 2** (wall-2): field border at rest, ghost and filter plate hover on light ground, scrollbar track.
- **Seam Grey** (seam): the grout between panels. It is the background of every panel grid whose 3px gap reveals it, plus hairlines between people and services.
- **White** (white): header band, form panel, process steps, logo board tiles, white plates, the after tag.

### Named Rules
**The Panels Not Accents Rule.** Maroon and black are applied as full panels with white type on them. Do not reduce them to thin accent lines, tinted icons or colored text on the wall, except for the single maroon year numeral and step numbers on light ground.

**The Seam Rule.** Adjacent panels never touch and never get a border. They sit in a grid with a 3px gap over a seam-grey background, so the seam is the wall showing through.

**The Tint Pairing Rule.** Secondary text on a colored panel uses that panel's own tint (maroon-tint on maroon, black-tint on black), never a translucent white.

## Typography

**Display Font:** Archivo variable, condensed to width 62 (with Arial Narrow, sans-serif)
**Body Font:** Archivo variable at width 100 (with system-ui, sans-serif)
**Label Font:** Archivo at width 75

**Character:** One self-hosted variable family stretched to two voices. Squeezed to 62 and set heavy in capitals it is site signage; at normal width it is plain, confident reading text. The middle width (75) carries plates, labels and navigation like engraved suite numbers.

### Hierarchy
- **Display** (800, clamp(2.6rem, 5.1vw, 5.25rem), 0.9): the home hero promise, one sign line per span.
- **Headline** (800, clamp(2.4rem, 5vw, 4.5rem), 0.9): section headings and inner page titles.
- **Mid sign** (800, clamp(1.9rem, 3.4vw, 3rem)): secondary section headings.
- **Title** (800, clamp(1.5rem, 2.2vw, 2rem), 0.95): project captions, scope rows (up to 2.4rem), nameplates (up to 2.6rem), service headings (up to 3.25rem).
- **Lede** (400, clamp(1.125rem, 1.4vw, 1.3rem), 1.55, max 44ch): the sentence under a headline.
- **Body** (400, 1.0625rem, 1.6, 68ch measure): reading text. Lead paragraphs in bios and services step up to 1.15rem.
- **Label** (700, 0.8125rem, 0.08em tracking, uppercase, width 75): plate headings, nameplate roles, scope group names, before and after tags, form labels (0.875rem).
- **Quote** (500, clamp(1.3rem, 2vw, 1.75rem), 1.35, max 34ch): attributed client quotes on panels.
- **Numerals**: every phone number, license number and stat uses tabular lining figures.

### Named Rules
**The Signage Rule.** Every heading, phone number, step number and fact is condensed Archivo (width 62, weight 800 or 900) in uppercase with 0.9 line height. Reading text is never condensed.

**The Phone Is Display Type Rule.** The phone number is set as a sign wherever it appears: header call band, hero call panel, page-head side panel, closing panel.

## Layout

A centered wrap of max 1440px with a fluid gutter of clamp(1rem, 4vw, 3.5rem). Full-bleed panels break out of the wrap; content inside them returns to it. The home hero is a 12-column grid: maroon panel over columns 1 to 8, black panel over 9 to 12, and the viewing window spanning columns 3 to 11 across the seam on the second row (2 to 12 below 1080px). Inner page heads repeat the split at 2fr to 1fr.

Panel runs (quotes, promises, process steps, contact) are grids with a 3px gap over seam grey. Sections pad clamp(4rem, 9vw, 8rem) vertically, tight sections clamp(3rem, 6vw, 5rem). Section heads can split headline and lede side by side at 1.1fr to 1fr, aligned to the bottom.

The sticky header is 76px (64px below 860px). Breakpoints in use: 1080px (nav tightens, process to two columns, window widens), 960px (feature pull, promises, contact and footer reflow), 860px (main mobile switch: hamburger, stacked hero, single-column grids), 760px (project grid to one column), 600px and 560px (form rows and footer to one column).

On mobile the hero stacks maroon copy, then the window, then the black call panel, and a two-plate action row (phone and quote) sits directly under the headline so both are reachable without scrolling.

## Elevation & Depth

The wall is flat. Panels, plates, nameplates and logo tiles carry no shadow; separation comes from the color of the panel, the 3px seams, and 2px or 3px rules. Depth exists only where something is cut through the wall or slides in front of it.

### Shadow Vocabulary
- **Window recess** (`box-shadow: inset 0 10px 24px rgba(0,0,0,.45), 0 18px 40px -18px rgba(0,0,0,.55)`): the framed viewing window in the home hero, with an inner rim of `inset 0 0 0 1px rgba(255,255,255,.08), inset 0 14px 22px -10px rgba(0,0,0,.6)`.
- **Pull post** (`box-shadow: -10px 0 18px -8px rgba(0,0,0,.5), 10px 0 18px -8px rgba(0,0,0,.5)`): both sides of the maroon post on the before and after reveal.
- **Pull grip** (`box-shadow: 0 10px 24px -6px rgba(0,0,0,.55)`): the drag handle on the post.

### Named Rules
**The Only Openings Cast Shadows Rule.** A shadow is allowed only on the viewing window and the pull-back post and grip. Anything fastened to the wall stays flat.

## Shapes

Square corners throughout (0px), including form fields, which explicitly reset radius. Borders are structural: 2px currentColor around plates, 3px ink under the header and above boards, 6px maroon above the footer, 10px ink framing the viewing window (6px on mobile), 8px ink framing service photos. Fastener heads are 5px dots inset 14px from each corner of a printed panel, white at 32% on dark panels and ink at 28% on the wall. Wide maroon panels carry printed board seams, a 2px dark line repeated every clamp(220px, 25%, 420px). Icons are inline stroked line SVGs at 2.25 stroke.

## Components

### Plates (buttons and action links)
Wayfinding plates screwed to the wall: square, bordered, uppercase.
- **Shape:** square (0px), 2px border in currentColor, min height 52px, padding 0.85rem 1.4rem, width-75 Archivo 800 at 1.0625rem with 0.04em tracking.
- **White:** white fill, ink text; the primary action on dark panels (Request a quote). Hover fills maroon tint.
- **Maroon:** maroon fill, white text. Hover deepens to maroon-deep.
- **Ink:** ink fill, white text; the primary action on the wall. Hover turns maroon.
- **Ghost:** transparent with a white border on dark panels; hover lays a 12% white wash, or wall-2 on light ground.
- **Arrow:** trailing arrow icon nudges 4px right on hover (220ms ease-out). Stacked plates in the call and closing panels stretch full width with the arrow pushed to the far edge.
- **Filter variant:** 44px tall, ink border on the wall, pressed state fills ink.
- **Focus:** 3px maroon outline, 3px offset; white on maroon and black panels.

### Navigation
- **Header band:** white, sticky, 3px ink bottom rule, logo left, then nav plates, then a solid ink call block showing the phone in condensed 1.6rem caps that turns maroon on hover.
- **Nav plates:** 44px tall wall-colored plates with 4px gaps, width-75 uppercase at 0.95rem; hover ink with white text; current page maroon with white text.
- **Mobile (below 860px):** the call block collapses to a 64px square phone icon, a 64px menu button sits beside it, and the nav drops as a full-width ink sheet of 1.5rem condensed links divided by faint white rules, sliding 8px down into place.

### Inputs / Fields
- **Style:** wall fill, 2px wall-2 border with an ink bottom border, square corners, min height 52px, maroon caret. Labels are width-75 uppercase at 0.875rem; optional markers drop back to normal-width ink-soft text.
- **Focus:** fill turns white and the whole border turns ink.
- **Error:** border and message in maroon on a pale pink fill.
- **Status:** submission messages print on an ink bar.

### Viewing Window (signature)
A 16:9 opening cut across the hero seam with a 10px ink frame and the window recess shadow. Finished-project photos slide along a horizontal track (1100ms ease-out, advancing every 5.2s), with an ink window bar below carrying the caption, a count and 44px square prev, pause and next buttons. Autoplay stops on focus and is off under reduced motion.

### Wall Pull-Back (signature)
A before and after reveal: the after photo sits behind, the before photo is clipped from the right, and a 22px maroon post with fastener dots and a 58 by 72px maroon grip marks the edge. An invisible full-size range input drives it, so it works by drag, tap and keyboard. On first view the home instance starts pulled to 88% and settles back over 900ms. Before and after tags are ink and white label plates in the top corners.

### Permit Plate and Nameplate
- **Permit plate:** a 2px maroon-tint outlined plate on the hero panel listing license numbers in tabular figures, one per hairline row.
- **Nameplate:** ink plate with the person's name in condensed caps and the role as a maroon-tint label; sticky beside the bio on desktop.

### Fact Strip
A full-width ink band between 3px seam rules, four equal cells of condensed uppercase facts divided by 20% white hairlines; two by two on mobile.

### Scope Board
On the black panel, service groups sit in a 1 to 3 column split under a 3px white rule. Each service is a full-row link: condensed title, black-tint description, arrow at the end. Hover floods the row maroon and nudges the arrow.

### Logo Board
White tiles with a 1px inset seam outline in an auto-fill grid under a 3px ink rule. Client logos render greyscale and return to color on hover.

## Do's and Don'ts

### Do:
- **Do** build sections as full-bleed maroon (#7c0a2b), black (#1b1918) or wall panels, and put adjacent panels in a grid with a 3px gap over seam grey.
- **Do** set headings, phone numbers and facts in Archivo at width 62, weight 800, uppercase, line height 0.9.
- **Do** use the panel's own tint for secondary text on colored panels (maroon-tint on maroon, black-tint on black).
- **Do** make actions plates: square, 2px bordered, 52px minimum height, width-75 uppercase.
- **Do** frame photography in thick ink borders (8px to 10px) so it reads as seen through the wall.
- **Do** animate only by sliding on a horizontal track with cubic-bezier(0.16, 1, 0.3, 1), and collapse it under reduced motion.
- **Do** keep the phone and quote plates in the first mobile viewport.

### Don't:
- **Don't** round any corner; the system radius is 0px.
- **Don't** add shadows to panels, plates, tiles or cards; shadows belong only to the viewing window and the pull-back.
- **Don't** condense reading text or set body copy in uppercase.
- **Don't** use maroon or black as thin accent lines or tinted icons on the wall where a full panel is meant.
- **Don't** introduce a darkened photo hero with a centered headline, counting stat animations or icon cards; finished work is shown through the window or the pull-back.
- **Don't** alter the logo or its maroon and black.
