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
  home1.njk                     Previous homepage, archived at /home1/
  work-with-us.njk              Work With Us page (/work-with-us/)
  investors.njk                 Evaluation Kit page (/investors/)
  _data/
    site.json                   Site name, SEO, shared links, form action
    navigation.json             Header links + floating section-nav items per page (home, home1)
    home/<section>.json         Copy + images for each homepage section
    home1/<section>.json        Copy for the archived homepage
    workWithUs.json             Copy for the Work With Us page
    evaluation.json             Copy for the Evaluation Kit page
  _includes/
    layouts/base.njk            HTML shell
    partials/                   head, header, footer, section-nav
    sections/home/<section>.njk One file per homepage section
    sections/home1/             Archived homepage sections
    sections/work-with-us/      One file per Work With Us section
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

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys the site on every push to `main`
(or manually via **Actions → Deploy to GitHub Pages → Run workflow**).

In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

The workflow passes the Pages base path (`/Mock-B2B-Website/`) to Eleventy as
`ELEVENTY_PATH_PREFIX`; `HtmlBasePlugin` then prefixes every root-relative `href`/`src`.
Keep writing paths as `/assets/...` — for URLs outside those attributes (e.g. inline
`style`), use the `url` filter: `{{ "/assets/images/foo.jpg" | url }}`.
To preview the prefixed build locally:

```bash
ELEVENTY_PATH_PREFIX=/Mock-B2B-Website/ npx @11ty/eleventy --serve
```
