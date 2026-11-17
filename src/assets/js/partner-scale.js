// Partnership scale. On wide screens a draggable pin runs along a rail, and the
// model nearest the pin grows to take focus; the first time the scale scrolls
// into view the pin glides in from the far left and settles on [data-start].
// On phones and tablets the models stack as a plain accordion instead: no rail,
// the first model starts open, and each one slides open or closed on tap.
export function initPartnerScale(root) {
  const models = [...root.querySelectorAll("[data-model]")];
  const rail = root.querySelector("[data-rail]");
  const stops = root.querySelector("[data-stops]") || rail;
  const pin = root.querySelector("[data-pin]");
  const ticks = [...root.querySelectorAll("[data-tick]")];
  if (!models.length || !rail || !pin) return;

  const last = models.length - 1;
  const start = Math.min(last, Math.max(0, Number(root.dataset.start) || 0));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (n) => Math.min(last, Math.max(0, n));
  const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

  let pos = start;
  let active = -1;
  let frame = 0;
  let introPlayed = false;

  // Below this width the cards stack as an accordion (see partners.css).
  const accordion = window.matchMedia("(max-width: 1023px)");

  const titleOf = (model) => model.querySelector(".partner-scale__title")?.textContent.trim() || "";
  const toggleOf = (model) => model.querySelector(".partner-scale__toggle");

  function setOpen(model, open) {
    model.classList.toggle("is-active", open);
    model.style.setProperty("--focus", open ? "1" : "0");
    toggleOf(model)?.setAttribute("aria-expanded", String(open));
  }

  function render(next) {
    pos = clamp(next);
    pin.style.setProperty("--at", pos / last);
    models.forEach((model, i) => {
      model.style.setProperty("--focus", Math.max(0, 1 - Math.abs(pos - i)).toFixed(3));
    });

    const nearest = Math.round(pos);
    if (nearest === active) return;
    active = nearest;
    models.forEach((model, i) => toggleOf(model)?.setAttribute("aria-expanded", String(i === nearest)));
    models.forEach((model, i) => model.classList.toggle("is-active", i === nearest));
    ticks.forEach((tick, i) => tick.classList.toggle("is-active", i === nearest));
    pin.setAttribute("aria-valuenow", String(nearest));
    pin.setAttribute("aria-valuetext", titleOf(models[nearest]));
  }

  // Each animation gets a run id; starting another (or stopping) bumps it,
  // which resolves the superseded promise with false.
  let run = 0;
  const pending = new Map();

  function stop() {
    cancelAnimationFrame(frame);
    pending.forEach((resolve) => resolve(false));
    pending.clear();
    run += 1;
  }

  function animateTo(target, duration) {
    stop();
    const id = run;
    const from = pos;
    const to = clamp(target);
    if (reducedMotion || duration <= 0 || from === to) {
      render(to);
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      pending.set(id, resolve);
      const begin = performance.now();
      const step = (now) => {
        if (id !== run) return;
        const t = Math.min(1, (now - begin) / duration);
        render(from + (to - from) * ease(t));
        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        pending.delete(id);
        resolve(true);
      };
      frame = requestAnimationFrame(step);
    });
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let interrupted = false;
  async function playIntro() {
    introPlayed = true;
    await wait(400);
    if (!interrupted) animateTo(start, 1500);
  }

  function takeOver() {
    interrupted = true;
    stop();
  }

  // Pointer dragging anywhere on the rail.
  const posFromPointer = (event) => {
    const rect = stops.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * last;
  };

  let dragging = false;
  rail.addEventListener("pointerdown", (event) => {
    if (accordion.matches || event.button !== 0) return;
    takeOver();
    dragging = true;
    root.classList.add("is-dragging");
    rail.setPointerCapture(event.pointerId);
    render(posFromPointer(event));
    pin.focus({ preventScroll: true });
    event.preventDefault();
  });

  rail.addEventListener("pointermove", (event) => {
    if (dragging) render(posFromPointer(event));
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    animateTo(Math.round(pos), 320);
  };
  rail.addEventListener("pointerup", release);
  rail.addEventListener("pointercancel", release);

  models.forEach((model, i) => {
    model.addEventListener("click", (event) => {
      if (accordion.matches) {
        // Accordion: tapping the header toggles that one model; the open
        // details are plain content and don't react to taps.
        if (event.target.closest(".partner-scale__detail")) return;
        setOpen(model, !model.classList.contains("is-active"));
        return;
      }
      takeOver();
      animateTo(i, 600);
    });
  });

  pin.addEventListener("keydown", (event) => {
    if (accordion.matches) return;
    const current = Math.round(pos);
    const keys = {
      ArrowLeft: current - 1,
      ArrowDown: current - 1,
      ArrowRight: current + 1,
      ArrowUp: current + 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    takeOver();
    animateTo(keys[event.key], 400);
  });

  let observer = null;

  function applyMode() {
    if (accordion.matches) {
      // Accordion: first model open, the rest closed.
      takeOver();
      observer?.disconnect();
      models.forEach((model, i) => setOpen(model, i === 0));
      return;
    }
    // Slider: rest on the starting model, or glide in from the left the first
    // time the scale comes into view.
    interrupted = false;
    active = -1;
    observer?.disconnect();
    const glide = !introPlayed && !reducedMotion && "IntersectionObserver" in window;
    render(glide ? 0 : start);
    if (!glide) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || introPlayed) return;
        observer.disconnect();
        playIntro();
      },
      { threshold: 0.6 }
    );
    observer.observe(root);
  }

  applyMode();
  accordion.addEventListener("change", applyMode);
  // Transitions stay off until the initial state is in place, so the first
  // model doesn't visibly slide open on load.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-ready")));
}
