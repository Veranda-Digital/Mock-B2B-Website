# Phase 2: Homepage Restructure and Technology Page

Supersedes the homepage section order in `ph1.md` and the ordering proposals in `structure-and-flow-improvements.md`. Tone guidance comes from `tone-and-strategy-review.md`.

## Goal

Within one screen of scrolling past the hero, a visitor knows WHAT Veranda is, WHO it serves, and WHY they should care. The page must serve two audiences:

- **Business leaders** who want to deploy a platform as a solution and see the value.
- **Operators and technology companies** who want to know what makes the system unique, what it can do, and how it integrates with existing platforms, products and systems.

The lock box is an **example embodiment** of the platform, never presented as the product.

## Homepage order

1. Hero (unchanged)
2. **Overview** (`what-who`): definition and embodiment image, sectors with benefits, 3A1I capabilities
3. **Value** (`value`): two matching lanes, one per audience
4. **Platform** (`platform`): revised summary, with a link to the Technology page
5. Case Study (`case-study`, unchanged)
6. Partnering (`partners`, unchanged)
7. Final CTA banner (`get-started`, kept as the closing element so the Evaluation Kit remains the primary call to action)

Retired from the homepage: `value`, `applications`, `delivering`, `hardware`, `software`.

## Section 2: Overview (`what-who`)

Answers WHAT Veranda is and WHO it serves, in that order, with as few words as possible. No statistics.

1. **Intro row.** Headline and one-sentence definition on the left. The Dream Box render on the right, tagged "Example embodiment", with a link to the Dream Box site (`https://getveranda.com/`, opens in a new tab).
2. **Who it serves.** One row, two groups, so the delivery versus beyond-delivery distinction costs no extra height.
   - **Delivery** (three solid cards with the old Applications illustrations): last-mile delivery, healthcare and cold chain, field service and industrial. Each has three short benefits.
   - **Beyond delivery** (two cards): a solid white "Facilities & entry control" card (scheduled, timed entry; no keys or codes to share; every entry logged) with the special-access illustration, then a dashed, open-ended card: "Access-restricted products, spaces & assets", an icon cluster (lock, box, door, and an open "+" slot), and three benefits that apply to any use (timed, controlled access; every use on record; built into your product). The dashed card avoids naming specific products so it invites uses beyond delivery and door access.
   - The row is five equal-width cards with one consistent gap: three delivery, then two beyond delivery.
   - Group labels ("Who it serves: Delivery" and "Beyond delivery") replace the single "Who it serves" label, each with a rule showing its span.
3. **What it does.** Four dark cards, one per capability. Each has an icon, a name, one line, and a small preview of the system doing it (an access rule, an audit log, a schedule and alert, an API call and webhook).

### Copy

- Eyebrow: `Overview`
- Title: `One platform for every unattended handoff.`
- Body: `Veranda is the hardware, software, and connectivity that let a box, locker, or door open for the right person, and record what happened.`
- Embodiment caption: `The Dream Box is one product built on Veranda.` + `Visit the Dream Box site`
- Delivery sectors and benefits:
  - Last-mile delivery: First-attempt delivery / No one needs to be home / Proof of every drop-off
  - Healthcare & cold chain: Monitored conditions / Logged chain of custody / Less spoilage
  - Field service & industrial: Parts ready before the shift / Overnight drop-offs / Fewer trips to the shop
- Beyond delivery:
  - Facilities & entry control: Scheduled, timed entry / No keys or codes to share / Every entry logged
  - Access-restricted products, spaces & assets: Timed, controlled access / Every use on record / Built into your product
- Capabilities and previews (two rows each):
  - Authorization: Give access to only those who need it and only when they need it. (Carrier, One-time; Manager, Always)
  - Auditability: Record everything, from access logs to temperature, air quality, battery levels, and more. (2:14 PM Opened, Carrier; Conditions, 38°F, 45% RH)
  - Automation: Build schedules, triggers, and alerts that keep things running on their own. (9 AM-5 PM, Unlocked; Night, Alarm mode)
  - Integration: Plug into the apps, systems, and physical products you already use. (POST /unlock, 200 OK; Dispatch system, Synced)

## Section 3: Value (`value`)

Answers WHY each audience should care, framed as outcomes rather than "why us". It bridges the Overview (what the platform does) and the Platform section (how it works): each proof ties a capability to a result. Both lanes share one structure so they read as a pair: audience label, one promise, one supporting line, and three proof tiles. No buttons; the page CTAs carry the next step. Business tiles pair a sourced market statistic with the Veranda value proposition that addresses it. Technical tiles name the kind of value (integrate, modular, extend) instead of listing component counts.

### Copy

- Eyebrow: `The value` (navigation label: `Value`)
- Title: `Savings you can count. Work you can skip.`
- Lane A, `For business leaders`
  - Promise: `Stop paying for the last few feet.`
  - Line: `Missed handoffs, waiting drivers, and damaged goods drain margin and customer loyalty. Veranda removes all three, and plugs into the routing software you already run.`
  - `15%` of US deliveries are re-delivered. Complete the first attempt: a verified carrier opens the box even when no one is home.
  - `850M` hours a year lost to B2B detention and dwell time. Drivers drop and go: no keys, codes, or apps; hands-free or remote opening means shorter stops and overnight routes.
  - `85%` of consumers say they won't shop again after a poor delivery. Goods arrive intact: locked, monitored boxes protect orders from theft, weather, and spoilage, with a record to prove it.
- Lane B, `For operators & technology teams`
  - Promise: `Add secure access without building it.`
  - Line: `Hardware, wireless, and cloud are already built and proven in the field, so your team can focus on what makes your product or operation different.`
  - Integrate: Fits the stack you already run (REST API, SDKs, webhooks to dispatch, ordering, or property systems).
  - Modular: Take only what you need (five swappable boards and standalone cloud services).
  - Extend: Upgrade what you sell or run (timed access and condition monitoring for a product, locker, or door; up to a year on battery).
- Footnote: `Figures describe the US market, not projected Veranda results. Source:` McKinsey & Company (2024), "Digitizing mid- and last-mile logistics handovers to reduce waste", which includes the consumer survey it cites. The earlier "1 in 6 first-attempt failures" figure was removed because the source does not state it.

## Section 4: Platform

Keep the physical and digital diagram. Add a row of highlights drawn from the hardware and software sections (modular board stack, sensors and wireless, access rules and scheduling, activity and alerts, app plus API and SDK). Summary level only. Closing button: `See how the technology works` to `/technology/`.

## New Technology page (`/technology/`)

Intro, then the existing Hardware (scroll-driven board stack) and Software sections moved without content changes, then a closing CTA with Evaluation Kit and Work With Us. Added to the primary navigation and footer.

## Navigation

- Primary: Technology, Work With Us, Evaluation Kit button.
- In-page nav on the home page: Overview (What and Who), Value, Platform, Case Study, Partnering.
- Hero button "Explore the Platform" goes to `#what-who`.

## Cleanup

Remove the retired home sections and CSS that no longer has a matching section (`value`, `delivering`, `opportunity`, `app-benefits`, `benefits`, `solution`), keeping any shared classes still in use.

## Out of scope here

Evaluation Kit page rewrite and `/investors/` rename, and aligning the Work With Us and Partnering lists. Both remain in `structure-and-flow-improvements.md`.
