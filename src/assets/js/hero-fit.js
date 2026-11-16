// Sizes the video hero to the visible viewport so the scene labels at the
// bottom stay on screen. Page zoom makes viewport units and the rendered box
// disagree, so this measures the rendered box and corrects it. The hero only
// grows past the viewport when the copy itself is taller.
export function initHeroFit(hero) {
  let frame = 0;

  const fit = () => {
    const viewport = window.visualViewport?.height ?? window.innerHeight;
    const zoom = hero.offsetHeight > 0
      ? hero.getBoundingClientRect().height / hero.offsetHeight
      : 1;

    hero.style.minHeight = "0px";
    hero.style.height = "auto";
    const needed = hero.getBoundingClientRect().height;
    const visual = Math.max(needed, viewport);

    hero.style.height = `${visual / zoom}px`;

    const box = hero.getBoundingClientRect().height;
    if (needed <= viewport && box > viewport) {
      hero.style.height = `${(visual - (box - viewport)) / zoom}px`;
    }
  };

  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  };

  schedule();
  window.addEventListener("resize", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
}
