# Veranda Digital — Eleventy site

Static rebuild of the Veranda Digital Framer site using [Eleventy](https://www.11ty.dev/).

```bash
npm install
npm start        # dev server with live reload at http://localhost:8080
npm run build    # production output in _site/
```

## Where things live

```
src/
  index.njk                     Homepage — lists its sections in order (front matter)
  investors.njk                 Evaluation Kit page (/investors/)
  _data/
    site.json                   Site name, SEO, shared links, form action
    navigation.json             Floating section-nav items
    home/<section>.json         Copy + images for each homepage section
    evaluation.json             Copy for the Evaluation Kit page
  _includes/
    layouts/base.njk            HTML shell
    partials/                   head, header, footer, section-nav
    sections/home/<section>.njk One file per homepage section
    sections/evaluation/        One file per Evaluation Kit section
    components/                 Reusable Nunjucks macros (button, icon, cards, badge, accordion, …)
  assets/
    css/theme/tokens.css        Colours, fonts, type scale, radii, shadows
    css/theme/typography.css    Heading / eyebrow presets
    css/components/*.css        One stylesheet per component
    css/sections/*.css          One stylesheet per section
    js/                         Small vanilla modules (hero animation, nav, reveals, counters…)
    images/, illustrations/     Site imagery
```

## Common edits

- **Change copy or images:** edit the matching file in `src/_data/home/`.
- **Reorder / remove a homepage section:** edit the `sections` list in `src/index.njk`.
- **Re-theme:** change values in `src/assets/css/theme/tokens.css`.
- **Add an icon:** add a path to the `paths` map in `src/_includes/components/icon.njk`.
- **Hook up the Evaluation Kit form:** set `evaluationForm.action` in `src/_data/site.json`
  (e.g. a Formspree, Netlify Forms, or your own endpoint).
