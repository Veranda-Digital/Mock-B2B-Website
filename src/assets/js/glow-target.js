// In-page links can call attention to where they land. A link to a section
// that contains (or is) an element marked [data-glow] makes that element
// glow for a few seconds, so the reader can see what the link was pointing at.

const DURATION = 3000;

function resolveTarget(hash) {
  if (!hash || hash.length < 2) return null;
  let section;
  try {
    section = document.querySelector(hash);
  } catch (e) {
    return null;
  }
  if (!section) return null;
  if (section.matches("[data-glow]")) return section;
  return section.querySelector("[data-glow]");
}

export function initGlowTargets() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  let timer = 0;
  let current = null;

  const clear = () => {
    if (current) current.classList.remove("is-glowing");
    current = null;
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const target = resolveTarget(link.getAttribute("href"));
      if (!target) return;
      clear();
      // Let the removed class settle so the animation restarts when the same
      // target is clicked twice in a row.
      void target.offsetWidth;
      current = target;
      target.classList.add("is-glowing");
      // The glow sits on ::after, so the animation ends on the element itself.
      // Removing the class then changes nothing that was visible.
      target.addEventListener("animationend", clear, { once: true });
      // Reduced motion runs no animation, so keep a fallback.
      timer = window.setTimeout(clear, DURATION + 400);
    });
  });
}
