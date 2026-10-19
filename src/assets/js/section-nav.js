// Floating section nav: appears after the hero and slides its green
// indicator to whichever section is currently in view.
export function initSectionNav(nav) {
  const links = [...nav.querySelectorAll(".section-nav__link")];
  const indicator = nav.querySelector(".section-nav__indicator");
  const hero = document.getElementById("hero");

  const targets = links.map((link) => ({
    link,
    sections: link.dataset.watch
      .split(",")
      .map((id) => document.getElementById(id.trim()))
      .filter(Boolean),
  }));

  let active = null;

  function moveIndicator(link) {
    if (!link) {
      nav.classList.remove("has-active");
      return;
    }
    nav.classList.add("has-active");
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }

  function setActive(link) {
    if (link === active) return;
    links.forEach((l) => l.classList.toggle("is-active", l === link));
    if (link) link.setAttribute("aria-current", "true");
    links.filter((l) => l !== link).forEach((l) => l.removeAttribute("aria-current"));
    active = link;
    moveIndicator(link);
  }

  function update() {
    const probe = window.innerHeight * 0.45;
    const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.6 : true;
    nav.classList.toggle("is-visible", pastHero);

    let current = null;
    for (const { link, sections } of targets) {
      if (sections.some((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      })) {
        current = link;
      }
    }
    // Past the last watched section (footer) keep the final item lit.
    if (!current && pastHero) {
      const lastSection = targets.at(-1).sections.at(-1);
      if (lastSection && lastSection.getBoundingClientRect().bottom <= probe) current = targets.at(-1).link;
    }
    setActive(current);
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", () => moveIndicator(active));
  document.fonts?.ready.then(() => moveIndicator(active));
  update();
}
