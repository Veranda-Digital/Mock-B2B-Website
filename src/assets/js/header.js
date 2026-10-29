// Hides the header while scrolling down, brings it back when scrolling up.
export function initHeader(header) {
  let lastY = window.scrollY;
  let ticking = false;

  // Mobile hamburger menu.
  const toggle = header.querySelector("[data-menu-toggle]");
  const menu = header.querySelector("[data-menu]");
  const mobile = window.matchMedia("(max-width: 809px)");
  let open = false;

  function setMenu(next) {
    open = next;
    header.classList.toggle("is-menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    if (menu) menu.hidden = !open;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!open));
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && open) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (open && !header.contains(event.target)) setMenu(false);
    });
    mobile.addEventListener("change", () => setMenu(false));
  }

  function update() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    // Stay put while the menu is open.
    header.classList.toggle("is-hidden", !open && y > 160 && y > lastY);
    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}
