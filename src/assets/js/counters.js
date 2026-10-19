// Counts [data-counter] values up from zero the first time they are seen.
export function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const format = (el, n) => `${el.dataset.prefix || ""}${n}${el.dataset.suffix || ""}`;

  function run(el) {
    const target = Number(el.dataset.target) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = format(el, Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => {
    el.textContent = format(el, 0);
    observer.observe(el);
  });
}
