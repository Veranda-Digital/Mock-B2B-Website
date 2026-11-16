// Keeps the hero exactly one viewport tall when the content allows, so the
// scene indicators at its bottom edge are always on screen. CSS sets the
// intended min-height; this corrects it for browsers where viewport units and
// page zoom disagree. If the content is taller than the viewport, the hero
// simply grows to fit it.
export function initHeroFit(hero) {
  const fit = () => {
    hero.style.minHeight = "";
    const css = parseFloat(getComputedStyle(hero).minHeight);
    const rendered = hero.getBoundingClientRect().height;
    const target = window.innerHeight;
    // Content-driven height (taller than min-height): leave it alone.
    if (!css || rendered > css + 1 || Math.abs(rendered - target) < 1) return;
    hero.style.minHeight = `${(css * target) / rendered}px`;
  };

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
}
