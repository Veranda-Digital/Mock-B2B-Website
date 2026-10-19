// Splits text into words and lights them up one by one as the element
// travels up the viewport.
export function initWordReveal(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
  const spans = [...el.querySelectorAll(".word")];

  function update() {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the element's top hits 85% of the viewport, 1 when it reaches 35%.
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.5)));
    const lit = Math.round(progress * spans.length);
    spans.forEach((span, i) => span.classList.toggle("is-lit", i < lit));
  }

  window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
}
