// Partnership scale: a draggable pin runs along a rail, and the model nearest
// the pin grows to take focus. The first time the scale scrolls into view the
// pin glides in from the far left and settles on [data-start].
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

  function render(next) {
    pos = clamp(next);
    pin.style.setProperty("--at", pos / last);
    models.forEach((model, i) => {
      model.style.setProperty("--focus", Math.max(0, 1 - Math.abs(pos - i)).toFixed(3));
    });

    const nearest = Math.round(pos);
    if (nearest === active) return;
    active = nearest;
    models.forEach((model, i) => model.classList.toggle("is-active", i === nearest));
    ticks.forEach((tick, i) => tick.classList.toggle("is-active", i === nearest));
    pin.setAttribute("aria-valuenow", String(nearest));
    pin.setAttribute("aria-valuetext", models[nearest].querySelector(".partner-scale__title")?.textContent.trim() || "");
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
    if (event.button !== 0) return;
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
    model.addEventListener("click", () => {
      takeOver();
      animateTo(i, 600);
    });
  });

  pin.addEventListener("keydown", (event) => {
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

  if (reducedMotion || !("IntersectionObserver" in window)) {
    render(start);
    return;
  }

  render(0);
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || introPlayed) return;
      observer.disconnect();
      playIntro();
    },
    { threshold: 0.6 }
  );
  observer.observe(root);
}
