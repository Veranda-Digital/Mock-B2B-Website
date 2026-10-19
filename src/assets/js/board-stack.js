// Pinned "board stack": as the section scrolls, step copy swaps and another
// circuit board slides onto the stack.
export function initBoardStack(section) {
  const steps = [...section.querySelectorAll("[data-step]")];
  const boards = [...section.querySelectorAll("[data-board]")];
  let current = -1;

  function update() {
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    if (index === current) return;
    current = index;

    steps.forEach((step) => step.classList.toggle("is-active", Number(step.dataset.step) === index));
    boards.forEach((board) => board.classList.toggle("is-visible", Number(board.dataset.board) <= index));
  }

  window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  update();
}
