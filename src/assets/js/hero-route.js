// A green "courier" dot loops a rounded route around the hero, dropping a
// verified-checkmark badge at each stop. Settings come from data-* attributes
// on the canvas (see src/_data/home/hero.json → animation).

const BADGE_TIMING = { pop: 0.1, grow: 0.35, check: 0.55, hold: 0.35, exit: 0.3 };
const BADGE_TOTAL = Object.values(BADGE_TIMING).reduce((a, b) => a + b, 0);
const OVERLAP = 0.25;
const LOBES = 10;
const SCALLOP = 0.07;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

export function initHeroRoute(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const d = canvas.dataset;
  const opts = {
    rgb: hexToRgb(d.color || "#33D16B"),
    stops: Number(d.stops) || 6,
    speed: Number(d.speed) || 220,
    inset: (Number(d.inset) || 14) / 100,
    trail: Number(d.trail) || 200,
    trailGap: Number(d.trailGap) || 34,
    dot: Number(d.dot) || 6,
    badge: Number(d.badge) || 30,
  };
  const rgba = (a) => `rgba(${opts.rgb[0]}, ${opts.rgb[1]}, ${opts.rgb[2]}, ${a})`;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let route = [];
  let length = 1;
  let stopDistances = [];

  let leg = 0;
  let legElapsed = 0;
  let waiting = 0;
  let badges = [];
  let last = 0;
  let frame = 0;
  let running = false;

  // Superellipse route: squarer than an ellipse, softer than a rectangle.
  function buildRoute() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = width / 2;
    const cy = height / 2;
    const rx = cx * (1 - opts.inset);
    const ry = cy * (1 - opts.inset);
    const exponent = 2 / 4;
    const samples = 1440;

    route = [];
    let total = 0;
    for (let i = 0; i <= samples; i++) {
      // Start on the left edge and travel counter-clockwise.
      const a = Math.PI - (i / samples) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const x = cx + rx * Math.sign(c) * Math.abs(c) ** exponent;
      const y = cy - ry * Math.sign(s) * Math.abs(s) ** exponent;
      if (i > 0) total += Math.hypot(x - route[i - 1].x, y - route[i - 1].y);
      route.push({ x, y, d: total });
    }
    length = total;
    stopDistances = Array.from({ length: opts.stops }, (_, i) => (i * length) / opts.stops);
  }

  function pointAt(distance) {
    let t = distance % length;
    if (t < 0) t += length;
    let lo = 0;
    let hi = route.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (route[mid].d <= t) lo = mid;
      else hi = mid;
    }
    const a = route[lo];
    const b = route[hi];
    const span = b.d - a.d || 1;
    const k = (t - a.d) / span;
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  }

  const legLength = () => length / opts.stops;
  const legDuration = () => legLength() / opts.speed;

  function drawTrail(start, head) {
    const tail = Math.max(start + opts.trailGap, head - opts.trail);
    if (head - tail < 2) return;
    const step = 3;
    let prev = pointAt(tail);
    for (let dist = tail + step; dist <= head; dist += step) {
      const p = pointAt(dist);
      const k = (dist - tail) / (head - tail);
      ctx.strokeStyle = rgba(k * 0.9);
      ctx.lineWidth = 0.5 + k * (opts.dot * 0.45);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      prev = p;
    }
  }

  function drawDot(p, alpha = 1) {
    ctx.save();
    ctx.shadowColor = rgba(0.8 * alpha);
    ctx.shadowBlur = opts.dot * 2.5;
    ctx.fillStyle = rgba(alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, opts.dot / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function scallopPath(x, y, r, rotation) {
    ctx.beginPath();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rr = r * (1 + SCALLOP * Math.cos(a * LOBES));
      const px = x + rr * Math.cos(a + rotation);
      const py = y + rr * Math.sin(a + rotation);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawBadge(badge) {
    const t = badge.age;
    const { pop, grow, check, hold, exit } = BADGE_TIMING;
    const { x, y } = badge;
    const r = opts.badge / 2;

    if (t < pop) {
      const k = t / pop;
      ctx.strokeStyle = rgba(1 - k);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, opts.dot / 2 + k * r * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    const growK = clamp01((t - pop) / grow);
    const checkK = clamp01((t - pop - grow) / check);
    const exitK = clamp01((t - pop - grow - check - hold) / exit);
    const scale = easeOutBack(growK) * (1 - 0.35 * exitK);
    const alpha = 1 - exitK;
    const rotation = (Math.PI / 4) * (1 - growK) + Math.PI / 4;

    ctx.save();
    ctx.globalAlpha = alpha;
    scallopPath(x, y, r * scale, rotation);
    ctx.fillStyle = rgba(0.08);
    ctx.fill();
    ctx.strokeStyle = rgba(1);
    ctx.lineWidth = 1.75;
    ctx.stroke();

    if (checkK > 0) {
      const s = r * scale;
      const pts = [
        { x: x - s * 0.36, y: y + s * 0.02 },
        { x: x - s * 0.1, y: y + s * 0.28 },
        { x: x + s * 0.38, y: y - s * 0.24 },
      ];
      const first = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const second = Math.hypot(pts[2].x - pts[1].x, pts[2].y - pts[1].y);
      const drawn = easeInOut(checkK) * (first + second);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (drawn <= first) {
        const k = drawn / first;
        ctx.lineTo(pts[0].x + (pts[1].x - pts[0].x) * k, pts[0].y + (pts[1].y - pts[0].y) * k);
      } else {
        const k = (drawn - first) / second;
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[1].x + (pts[2].x - pts[1].x) * k, pts[1].y + (pts[2].y - pts[1].y) * k);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function render(dt) {
    ctx.clearRect(0, 0, width, height);

    badges.forEach((b) => (b.age += dt));
    badges = badges.filter((b) => b.age < BADGE_TOTAL);
    badges.forEach(drawBadge);

    const start = stopDistances[leg % opts.stops];

    if (waiting > 0) {
      waiting -= dt;
      return;
    }

    legElapsed += dt;
    const k = clamp01(legElapsed / legDuration());
    const head = start + easeInOut(k) * legLength();
    drawTrail(start, head);
    drawDot(pointAt(head));

    if (k >= 1) {
      const p = pointAt(start + legLength());
      badges.push({ x: p.x, y: p.y, age: 0 });
      leg = (leg + 1) % opts.stops;
      legElapsed = 0;
      waiting = BADGE_TOTAL * (1 - OVERLAP);
    }
  }

  function tick(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    render(dt);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  buildRoute();
  new ResizeObserver(() => buildRoute()).observe(canvas);

  if (reducedMotion) {
    stopDistances.forEach((dist) => {
      const p = pointAt(dist);
      drawBadge({ x: p.x, y: p.y, age: BADGE_TIMING.pop + BADGE_TIMING.grow + BADGE_TIMING.check });
    });
    return;
  }

  // Only animate while the hero is on screen.
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(canvas);
}
