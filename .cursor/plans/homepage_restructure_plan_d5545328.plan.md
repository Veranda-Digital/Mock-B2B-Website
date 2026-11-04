---
name: Homepage restructure plan
overview: Restructure the homepage into Hero, What and Who, Why (two audience lanes), Platform, Case Study, Partnering. Move Hardware and Software to a new Technology page. Write the result up as a new planning doc, planning/ph2-homepage-restructure.md.
todos:
  - id: doc
    content: Write planning/ph2-homepage-restructure.md with the spec
    status: completed
  - id: copy
    content: Draft copy for What and Who and Why sections for review
    status: completed
  - id: tech-page
    content: Create /technology/ page; move hardware and software sections, data and CSS
    status: completed
  - id: what-who
    content: Build What and Who section with 3A1I, sectors and embodiment image
    status: completed
  - id: why
    content: Build two-lane Why section with attributed stats and lane CTAs
    status: completed
  - id: platform
    content: Revise Platform section with hardware/software highlights and Technology button
    status: completed
  - id: nav
    content: Update navigation, hero anchor, index.njk section list; retire old sections and CSS
    status: completed
  - id: qa
    content: Check mobile layout, anchors and build
    status: completed
isProject: false
---

# Homepage Restructure and Technology Page

Deliverable for this step: a new planning doc at `planning/ph2-homepage-restructure.md` containing the spec below. It supersedes the section order in `planning/ph1.md` and the ordering proposals in `planning/structure-and-flow-improvements.md`. No site code is changed until this is approved.

## New homepage order

1. Hero (unchanged)
2. **What and Who** (new, merges `value` and the sector content from `applications`)
3. **Why** (new, two audience lanes, merges `delivering` and the outcomes from `applications`)
4. **Platform** (revised, pulls the best hardware and software messaging)
5. Case Study (unchanged)
6. Partnering (unchanged)
7. Final CTA banner (see assumption below)

The sections `value`, `applications`, `delivering`, `hardware` and `software` leave the homepage.

## Section 2: What and Who

Purpose: a visitor knows what Veranda is, who it serves and why it matters within one screen of scrolling.

- One-sentence definition, written for a business reader but accurate for a technical one: Veranda is an embedded access, monitoring and automation platform (hardware, software, wireless) that you deploy as a solution or integrate into your own product.
- The 3A1I capabilities (Authorization, Auditability, Automation, Integration), each with one concrete example line. Source: `value.json` capabilities.
- Sector strip: the four sectors, each with a short outcome line. Source: `applications.json` lead market, plus a one-line "beyond delivery" mention (lockboxes, waste receptacles, restricted rooms, shared assets).
- Image of the lock box, captioned and labelled as an example embodiment of the platform, not the product. Candidate captions: "Example embodiment: the Dream Box" or "One way to deploy the platform". Link the caption to the case study.
- No statistics here. Keep it scannable.

## Section 3: Why (two lanes)

Purpose: give each audience its reason to act, side by side.

- Lane A, "For business leaders": the cost of blind handoffs and what changes with Veranda. Use 2 or 3 attributed metrics from `delivering.json` (dwell time, failed deliveries, redelivery), then 4 outcomes selected from `applications.json` outcomes (fewer failed handoffs, reduced loss and spoilage, better access and condition records, delivery and field-service efficiency). Keep the existing "outcomes depend on configuration" note and cite each statistic with a source and date.
- Lane B, "For operators and technology teams": what makes the system distinct and how it connects. Cover modular hardware (boards you can swap), connectivity (BLE and LoRaWAN, no Wi-Fi or power required), the API, SDK and webhooks, and fit with existing dispatch, ordering, property-management and operations systems.
- Each lane ends with its own action. Lane A links to the Evaluation Kit, and Lane B links to the Technology page.
- On mobile the lanes stack, with Lane A first.

Rejected: a single combined section (too dense for the 'what, who, why quickly' test), and a toggle (hides one audience's content on first view).

## Section 4: Platform

- Keep the existing physical and digital diagram and the `platform.json` content.
- Add the strongest hardware messages: modular board stack, optional and swappable boards, sensors, BLE and LoRaWAN. Source: `hardware.json` `note` and step summaries.
- Add the strongest software messages: who, when and why access control; scheduling; monitoring; activity logs; alerts; Dashboard app as one interface; REST API and SDK. Source: `software.json` responsibilities and showcase.
- Keep it summary-level: no scroll-driven board stack and no full responsibility list.
- Button at the bottom: "See how the technology works" linking to `/technology/`.

## New Technology page

- New route `/technology/` built from the existing partials, following the pattern in `src/work-with-us.njk`.
- Sections: short intro, Hardware (the existing scroll board-stack, unchanged), Software (Dashboard app, SDK and API, six responsibilities), closing CTA with Evaluation Kit and Work With Us.
- Move `hardware.njk` and `software.njk`, and their data and CSS, with no content rewrite.
- Add it to `navigation.json` primary links: Technology, Work With Us, plus the Evaluation Kit button.
- Add a page title and description for SEO.

## Navigation and links

- Rebuild the in-page nav (`src/_data/navigation.json` `home`) from the new order: What and Who, Why, Platform, Case Study, Partnering. Remove the "Impact" grouping.
- Change the hero "Explore the Platform" button from `#value` to the new What and Who anchor, or rename it to match its destination.
- Update `sections` in `src/index.njk`.

## Files affected

- `src/index.njk`: new section list.
- New: `src/_includes/sections/home/what-who.njk`, `why.njk`, and matching data in `src/_data/home/`.
- Revise: `src/_includes/sections/home/platform.njk` and `platform.json`, plus the related CSS.
- Remove from home and retire: `value`, `applications`, `delivering`, and the old CSS (`value.css`, `delivering.css`, `app-benefits.css`, `benefits.css`, `opportunity.css`, `solution.css` if confirmed unused).
- New: `src/technology.njk` with hardware and software includes and data moved.
- Update: `navigation.json`, `src/assets/css/main.css` imports.

## Assumptions to confirm

- **Final CTA banner**: you did not mention it. The plan keeps it as the last element after Partnering so the Evaluation Kit stays the primary call to action. Say so if you want it removed or folded into Partnering.
- **Why lane copy** will be drafted for your review before building, since this is the hardest messaging to get right.

## Out of scope for this step (tracked separately)

The Evaluation Kit page rewrite and `/investors/` rename, and the Work With Us alignment, remain in `planning/structure-and-flow-improvements.md`. They should follow once the homepage is settled.

## Suggested build order

1. Write the planning doc and the draft copy for sections 2 and 3, and review.
2. Create the Technology page by moving the hardware and software sections.
3. Build What and Who, then Why.
4. Revise the Platform section and its Technology button.
5. Update navigation and anchors, remove retired sections, check mobile.