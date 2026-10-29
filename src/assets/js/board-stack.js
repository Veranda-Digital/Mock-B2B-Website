// Pinned "board stack": the full stack shows first; as the section scrolls,
// step copy swaps and the top board lifts away to expose the next one.
// Optional [data-step-dot],
// [data-step-count], and [data-link] elements track progress.
export function initBoardStack(section) {
  const steps = [...section.querySelectorAll("[data-step]")];
  const boards = [...section.querySelectorAll("[data-board]")];
  const links = [...section.querySelectorAll("[data-link]")];
  const dots = [...section.querySelectorAll("[data-step-dot]")];
  const count = section.querySelector("[data-step-count]");
  let current = -1;

  function update() {
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    if (index === current) return;
    // Going back up, the photo underneath swaps once the returning board has landed.
    section.style.setProperty("--frame-delay", index < current ? "0.45s" : "0s");
    current = index;

    steps.forEach((step) => step.classList.toggle("is-active", Number(step.dataset.step) === index));
    boards.forEach((board) => {
      const n = Number(board.dataset.board);
      board.classList.toggle("is-visible", n >= index);
      board.classList.toggle("is-current", n === index);
    });
    links.forEach((link) => link.classList.toggle("is-active", Number(link.dataset.link) === index));
    dots.forEach((dot) => {
      const n = Number(dot.dataset.stepDot);
      dot.classList.toggle("is-active", n === index);
      dot.classList.toggle("is-done", n < index);
    });
    if (count) count.textContent = String(index + 1).padStart(2, "0");
  }

  window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  update();
}
