# Structure & Flow Improvements

Findings from a review of the current site (source in `src/`), measured against `planning/ph1.md` and the buyer-journey structure in `planning/tone-and-strategy-review.md`.

Priority: **P1** = fix first (hurts clarity or credibility), **P2** = meaningful improvement, **P3** = polish.

## Current homepage order

Hero → Value → Platform → Software → Hardware → Applications → Partners → Case Study → Delivering (impact) → Get Started

## Target journey (from the strategy review)

1. Understand the offer → 2. Recognize the value → 3. Understand the platform → 4. Find a partnership fit → 5. Begin a conversation

---

## 1. Homepage flow

### P1. Business problem and value come too late
`delivering` (cost of blind handoffs, McKinsey stats) sits near the bottom, after the platform, hardware, and partnership sections. The buyer meets technical detail before being shown why it matters. The review's step 2 ("Recognize the value") is split between `value` (early, abstract) and `delivering` + `applications` (late).

**Proposal:** Move `delivering` directly after `hero`/`value`, or merge `value` and `delivering` into one "Why it matters" section. Follow with the case study as proof, then the platform deep dive.

### P1. Case study is separated from the value story it proves
The Dream Box case study comes after Partners, and the review wants delivery to act as "an established foundation" for the platform story. Today the proof arrives after the buyer has already moved on to engagement models.

**Proposal:** Place the case study immediately after the value/impact section, and reuse it as the bridge into the platform sections ("here is what runs underneath").

### P2. Suggested new order

| # | Section | Journey step |
|---|---------|--------------|
| 1 | Hero | Offer |
| 2 | Value (audiences + four capabilities) | Offer |
| 3 | Delivering / cost of blind handoffs | Value |
| 4 | Case study (Dream Box) | Value |
| 5 | Applications & benefits | Value |
| 6 | Platform (physical + digital diagram) | Platform |
| 7 | Hardware | Platform |
| 8 | Software (+ SDK/API) | Platform |
| 9 | Partners | Partnership fit |
| 10 | Get Started (CTA) | Conversation |

Open question: Applications could also sit after the platform sections. Test both. Putting it before the platform keeps the "what can I use this for" question ahead of "how does it work".

### P2. Platform, Software, and Hardware are split by an unrelated section
Today `platform` → `software` → `hardware` are followed by Applications. The platform diagram lists hardware and software layers, then the page covers software before hardware, which reverses the diagram's physical-then-digital order.

**Proposal:** Order them as Platform overview → Hardware → Software, matching the diagram (Physical, link, Digital) and the plan doc (Hardware is section 3, Software is 4).

### P2. Hero anchor skips the platform section
"Explore the Platform" links to `#value`, not `#platform`. Visitors land on a generic value statement rather than the platform explanation the button promises.

**Proposal:** Point the button at whichever section becomes the platform overview, or rename the button to match its destination.

### P3. Secondary CTA placement
The only mid-page conversion point is the final banner, and the header button. Add a light, contextual CTA after the case study ("See how this could work in your program") and at the end of the platform sections ("Evaluate it hands-on").

---

## 2. Navigation

### P1. In-page nav labels don't match section names or the new order
`navigation.json` labels `#value` as "Platform" and groups `delivering` + `get-started` under "Impact". There is no entry for the real `platform` section as its own item. The final CTA is filed under "Impact", which is misleading.

**Proposal:** Rebuild the section nav from the new order, for example: Why Veranda · Case Study · Platform · Hardware · Software · Partnering. Remove "Impact" as a catch-all.

### P2. Primary nav is a single link
The header has only "Work With Us" plus the CTA. The review's decision process means a buyer should be able to jump to the platform story and to the evaluation page.

**Proposal:** Consider primary links: Platform (anchor on home), Work With Us, and the Evaluation Kit button. Keep Team and News as Phase 2.

### P2. Header CTA on the evaluation page points back home
The evaluation page header shows "Learn More" linking to `/`. That is a weak next step on the page where the buyer is mid-conversion. Consider "Work With Us" or remove the header CTA there.

---

## 3. Evaluation Kit page (currently `/investors/`)

### P1. Page reads as an investor pitch, not a buyer evaluation page
Evidence in the source:
- URL and file are `investors.njk` / `/investors/`, while the plan names it "Request Evaluation Kit".
- Form label: "Company/Firm / Fund"; textarea: "Stage, check size, and what would help you decide".
- Platform section: "A platform business..." with recurring platform fees and per-handoff fees "sold to carriers, retailers, and distributors". This is revenue-model language aimed at investors, and it exposes pricing logic to prospective customers.
- Report section: "accounts for 50% of all supply chain costs" and "$12 billion has gone into visibility platforms" are broad claims that need attribution and precision (see Tone).

This conflicts with the plan (evaluation purpose, who it's for, what to evaluate, process, form, next steps) and with the "partner-oriented, practical" tone.

**Proposal:**
- Rename the route to `/evaluation-kit/` and redirect `/investors/`. Update `site.json`, `navigation`, hero and CTA links.
- Rewrite per `ph1.md`: Introduction → Purpose of the kit → Who it's for → Evaluation process → Request form → Next steps.
- Replace the form fields with: name, work email, organization, role, use case, physical product/access point, operational problem, evaluation goals, timing. Drop "fund" and "check size".
- Recast the "platform" section as "What you can evaluate" (hardware fit, access workflows, connectivity, sensors, software, user interaction, integration). Move any revenue-model content out of the buyer-facing page.

### P2. Form is placed before the explanation
The form follows directly after the hero, so a visitor is asked to commit before learning what the kit contains or what happens next.

**Proposal:** Put the kit contents and process above the form, and add a short "what happens after you submit" block beside or below it. Keep the form reachable from a hero button.

### P2. Form has no action
`site.json` has `evaluationForm.action: ""`. Confirm the submission target and add success/error states before launch.

---

## 4. Work With Us page

### P2. Home "Partners" and Work With Us repeat each other with different lists
Home lists five models (complete, white label, custom, licensing, component); Work With Us lists seven (adds hardware integration and software integration separately, plus strategic relationships) and uses different names and order. A buyer comparing the two will wonder if they are different offers.

**Proposal:** Use one source of truth for model names and order. Home shows a short version of the same list and links across.

### P2. Page opens with the process before a buyer self-identifies
The review calls for helping "product builders and operators recognize the engagement approach relevant to them". The page presents seven equal-weight cards.

**Proposal:** Add a short "Which fits you?" grouping, such as *Building a product* (hardware/software integration, licensing, white-label, custom), *Running operations* (complete solution), and *Long-term* (strategic). Add one concrete example per group.

### P2. Considerations are bare labels
The seven items have titles only. They are where buyers look for integration effort, reliability, and responsibilities.

**Proposal:** Add one line of substance for each, especially support responsibilities and commercial structure.

### P3. CTA section reuses the home partial
The page ends with "Start with an evaluation", while the plan also calls for a path to a preliminary partnership discussion. Add a clear second action (talk to the team) with distinct copy.

---

## 5. Section-level structure on the homepage

### P2. Hero carries too many ideas
Eyebrow, title, and accent line list four use cases ("last-mile delivery, unattended exchanges, access to facilities, and more"), over four videos. The review asks for a clear statement of what Veranda provides, who it serves, and how it fits into existing products.

**Proposal:** One-sentence definition for a business buyer in the headline area (what it is, who it's for, how it integrates). Move the use-case list into the video labels or the value section.

### P2. Value section is abstract and the "Built for" list overlaps Applications
`value` lists four audiences and four capabilities; `applications` then lists markets again. Healthcare, logistics, property, and facilities appear in both.

**Proposal:** Keep `value` to the four capabilities with a concrete example each. Keep the audience detail in `applications`.

### P2. Applications section is dense
It has a lead market with three cards, a "beyond delivery" block, and eight outcomes. The outcomes list partly repeats card outcomes and the `delivering` metrics (failed handoffs, efficiency).

**Proposal:** Group the eight outcomes into three or four themes (Efficiency, Security & records, Community, Access beyond delivery). Cut repeats of what `delivering` already covers. Keep the existing note that outcomes depend on configuration.

### P2. Software section mixes two audiences
The Dashboard app and the SDK/API are in one section, plus six responsibilities. The plan says to show the app as one interface into the broader platform, which it does, but technical buyers will want the API earlier and a clear route to documentation.

**Proposal:** Lead with the six responsibilities (the plan's list), then show the app and SDK/API as two interfaces. Add a "View API documentation" link if public docs exist.

### P3. Case study copy and links
- Eyebrow "Case Study : Dion's Chicago Dream" has a stray space before the colon.
- Button "More about the Dream Box" goes to the site root (`getveranda.com`), which is the site you are already on. Point to a real Dream Box page or remove it.
- The plan asks for the distinction between the partner's product and Veranda's platform. Add an explicit line on who did what (Dion's: program and operations; Veranda: technology) and the intended value for households.

---

## 6. Evidence, claims, and credibility (ties to tone review)

### P1. Attribute and qualify statistics
`delivering` and the evaluation `report` section use figures (850M hours, 1 in 6 failures, 15% redelivery, "50% of all supply chain costs", "$12 billion", "80% of US carriers"). Each needs a visible source and date, and the wording must not read as a Veranda result. The McKinsey link exists in `site.json`; surface it next to each stat.

### P2. Separate demonstrated from possible
Show a clear "Demonstrated in the Dream Box" label for capabilities proven in the field (battery-powered, no Wi-Fi, access logging, condition monitoring) versus "Available through customization" for the rest. This is the review's main credibility point.

### P2. Qualify broad language
Phrases such as "more intelligent access", "intelligent access platform", and "ending the blind handoff" lean on slogans. Pair each with the concrete mechanism in the next sentence. Prefer outcome statements with a condition ("when the access point opens for a verified carrier...").

---

## 7. Visual and media

- **P2.** Visuals should link real applications to the technology underneath. The platform diagram (physical to digital) is strong; add the Dream Box photo or product image to it as the worked example, so the case study and platform sections visually connect.
- **P3.** The hardware scroll presentation should have a quick overview state, such as a static summary of all five boards, for visitors who skip the scroll.
- **P3.** Check mobile behavior of the section nav and scroll-driven hardware stack, and confirm autoplaying hero videos respect reduced-motion settings.
- **P3.** Confirm every image has descriptive alt text (some use generic text like "The Dream Box" for the evaluation kit image).

---

## 8. Housekeeping

- Rename `investors.njk`, `.evaluation` page class, and `/investors/` references (see 3).
- Update the Evaluation page `title` and `description` (it has none set); homepage has a `title` but check meta descriptions on all pages.
- Remove the legacy CSS files that no longer have matching sections (`app-benefits.css`, `benefits.css`, `opportunity.css`, `solution.css`) if confirmed unused.
- Keep `planning/ph1.md` in sync once the new order and evaluation-page structure are agreed.

---

## Suggested implementation order

1. Evaluation page: rename route, rewrite copy and form fields, remove revenue-model content (P1).
2. Reorder homepage sections and rebuild in-page nav labels (P1).
3. Attribute statistics and add demonstrated-vs-possible labels (P1).
4. Align partner model lists between Home and Work With Us (P2).
5. Tighten the hero, value, applications, and software sections (P2).
6. Visual connections and polish (P2/P3).

## Decisions needed

- Should Applications sit before or after the platform deep dive?
- Is the evaluation route rename approved (`/evaluation-kit/`), with a redirect from `/investors/`?
- Is the investor-oriented content on the evaluation page needed anywhere else (a separate investor page), or should it be removed?
- What should the Dream Box button link to?
- Do public API docs exist to link from the Software section?
