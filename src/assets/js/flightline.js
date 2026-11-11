// A dot runs a closed delivery route around a section, stopping at each
// drop-off to pop into a rotating verified seal before carrying on.
//
// The route is inset from the canvas edges by a fixed number of pixels, and
// the canvas sits behind the content, so the path always runs in the outer
// margin and never crosses the type.
//
// Ported from the Framer code component built during design.

const DEFAULTS = {
  inset: 18, // px from the canvas edge to the route
  roundness: 0, // 0 = rectangle on the edges, 100 = ellipse
  curvature: 100, // 0 = straight cuts between drops, 100 = full arc
  start: 50, // % around the route for the first drop (50 = left middle)
  stops: 6,
  overlap: 25, // % into the badge sequence that the next leg launches
  speed: 220, // px per second
  trailLength: 200,
  trailGap: 34, // px travelled before the trail appears
  dotSize: 6,
  glow: 60,
  badgeSize: 30,
  lobes: 10,
  scallop: 7,
  rotation: 22, // degrees per second
  popDur: 0.1,
  growDur: 0.35,
  checkDur: 0.55,
  holdDur: 0.35,
  exitDur: 0.3,
  gapDur: 0.2,
};

const ORDER = ["travel", "pop", "grow", "check", "hold", "exit", "gap"];
const MAX_RUNS = 10;
const LUT_N = 1440;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const easeOutBack = (t) => {
  const c = 1.25;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

// Near-constant speed for the first 72% of a leg, decelerating into the drop.
const K = 0.72;
const HEAD = 0.9;
const travelPos = (t) => {
  if (t < K) return (t / K) * HEAD;
  const l = (t - K) / (1 - K);
  return HEAD + (1 - HEAD) * easeOutCubic(l);
};
const travelVel = (t) => {
  if (t < K) return 1;
  const l = (t - K) / (1 - K);
  return Math.pow(1 - l, 2);
};

function readColor(el) {
  let raw = getComputedStyle(el).getPropertyValue("--flightline-color").trim();
  if (!raw || raw.startsWith("var(")) {
    raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-green-500")
      .trim();
  }
  const value = raw || "#33D16B";
  const m = value.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((n) => parseFloat(n));
    if (parts.length >= 3) return parts.slice(0, 3);
  }
  let hex = value.replace("#", "");
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (/^[0-9a-f]{6,8}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return [51, 209, 107];
}

export function initFlightline(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const opts = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const attr = canvas.dataset[key];
    if (attr !== undefined && attr !== "") opts[key] = parseFloat(attr);
  }

  let RGB = readColor(canvas);
  const rgba = (a) => `rgba(${RGB[0]},${RGB[1]},${RGB[2]},${a})`;

  let W = 0;
  let H = 0;
  let LUT = [];
  let routeLen = 1;
  let segLen = 1;
  let stopD = [];
  let stopP = [];
  let runs = [];
  let uiScale = 1;
  let lastTs = 0;
  let raf = 0;
  let visible = false;

  const wrapD = (d) => {
    let v = d % routeLen;
    if (v < 0) v += routeLen;
    return v;
  };

  const curveAt = (d) => {
    const dd = wrapD(d);
    let lo = 0;
    let hi = LUT.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (LUT[mid].d <= dd) lo = mid;
      else hi = mid;
    }
    const a = LUT[lo];
    const b = LUT[hi];
    const span = b.d - a.d;
    const u = span > 0 ? (dd - a.d) / span : 0;
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
  };

  const posAt = (d) => {
    const c = opts.curvature / 100;
    const p = curveAt(d);
    if (c >= 0.999 || !stopD.length) return p;
    const n = stopD.length;
    const rel = wrapD(d - stopD[0]);
    let k = Math.floor(rel / segLen);
    if (k >= n) k = n - 1;
    const local = (rel - k * segLen) / segLen;
    const p0 = stopP[k % n];
    const p1 = stopP[(k + 1) % n];
    const cx = p0.x + (p1.x - p0.x) * local;
    const cy = p0.y + (p1.y - p0.y) * local;
    return { x: cx + (p.x - cx) * c, y: cy + (p.y - cy) * c };
  };

  const makeRun = (k) => ({
    k,
    phase: "travel",
    pt: 0,
    rot: 0,
    post: 0,
    spawned: false,
    done: false,
  });

  function buildRoute() {
    // Narrow canvases get a smaller dot and seal so the route keeps its
    // proportions and stays clear of the type.
    uiScale = Math.max(0.6, Math.min(1, W / 880));
    const inset = opts.inset * uiScale;
    const a = Math.max(20, W / 2 - inset);
    const b = Math.max(20, H / 2 - inset);
    const cx = W / 2;
    const cy = H / 2;
    const n = 2 + Math.pow(1 - opts.roundness / 100, 1.5) * 10;
    const e = 2 / n;

    LUT = [];
    let total = 0;
    let px = 0;
    let py = 0;
    for (let i = 0; i <= LUT_N; i++) {
      const th = -2 * Math.PI * (i / LUT_N); // counter-clockwise on screen
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const x = cx + a * (ct < 0 ? -1 : 1) * Math.pow(Math.abs(ct), e);
      const y = cy + b * (st < 0 ? -1 : 1) * Math.pow(Math.abs(st), e);
      if (i > 0) total += Math.hypot(x - px, y - py);
      LUT.push({ x, y, d: total });
      px = x;
      py = y;
    }
    routeLen = Math.max(1, total);

    const count = Math.max(1, Math.round(opts.stops));
    segLen = routeLen / count;
    const offset = routeLen * (opts.start / 100);
    stopD = [];
    stopP = [];
    for (let i = 0; i < count; i++) {
      const d = offset + i * segLen;
      stopD.push(d);
      stopP.push(curveAt(d));
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildRoute();
    runs = runs.filter((r) => r.k < stopD.length);
    if (!runs.length) runs = [makeRun(0)];
  }

  const phaseDur = (p) => {
    if (p === "travel") return Math.max(0.05, segLen / Math.max(20, opts.speed));
    if (p === "pop") return opts.popDur;
    if (p === "grow") return opts.growDur;
    if (p === "check") return opts.checkDur;
    if (p === "hold") return opts.holdDur;
    if (p === "exit") return opts.exitDur;
    return opts.gapDur;
  };

  const postTotal = () =>
    opts.popDur + opts.growDur + opts.checkDur + opts.holdDur + opts.exitDur + opts.gapDur;

  function updateRun(r, dt) {
    r.pt += dt;
    let guard = 0;
    while (guard++ < 30) {
      const d = phaseDur(r.phase);
      if (r.pt < d) break;
      r.pt -= d;
      const i = ORDER.indexOf(r.phase);
      if (i === ORDER.length - 1) {
        r.done = true;
        return;
      }
      r.phase = ORDER[i + 1];
    }
    if (r.phase !== "travel") r.post += dt;
    if (r.phase === "check" || r.phase === "hold" || r.phase === "exit") {
      r.rot += dt * ((opts.rotation * Math.PI) / 180);
    }
  }

  function spawnCheck() {
    const o = opts.overlap / 100;
    const pending = [];
    for (const r of runs) {
      if (r.spawned || r.done) continue;
      if (r.phase !== "travel" && r.post >= postTotal() * (1 - o)) {
        r.spawned = true;
        pending.push((r.k + 1) % stopD.length);
      }
    }
    for (const k of pending) {
      if (runs.length < MAX_RUNS) runs.push(makeRun(k));
    }
  }

  function drawTrail(dHead, len, dotR) {
    if (len < 2) return;
    const N = 44;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      pts.push({ p: posAt(dHead - len * (1 - u)), u });
    }
    const left = [];
    const right = [];
    for (let j = 0; j <= N; j++) {
      const a = pts[Math.max(0, j - 1)].p;
      const b = pts[Math.min(N, j + 1)].p;
      const tx = b.x - a.x;
      const ty = b.y - a.y;
      const m = Math.hypot(tx, ty) || 1;
      const nx = -ty / m;
      const ny = tx / m;
      const hw = dotR * 0.92 * Math.pow(pts[j].u, 0.6);
      left.push({ x: pts[j].p.x + nx * hw, y: pts[j].p.y + ny * hw });
      right.push({ x: pts[j].p.x - nx * hw, y: pts[j].p.y - ny * hw });
    }
    const tail = pts[0].p;
    const head = pts[N].p;
    const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    g.addColorStop(0, rgba(0));
    g.addColorStop(0.55, rgba(0.28));
    g.addColorStop(1, rgba(0.92));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i <= N; i++) ctx.lineTo(left[i].x, left[i].y);
    for (let i = N; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
    ctx.closePath();
    ctx.fill();
  }

  function drawDot(x, y, r, alpha) {
    ctx.save();
    if (opts.glow > 0) {
      ctx.shadowColor = rgba(0.55 * (opts.glow / 100) * alpha);
      ctx.shadowBlur = 6 + (opts.glow / 100) * 16;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgba(1);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function sealPath(cx, cy, R, amp, lobes, rot) {
    const steps = 220;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rr = R * (1 + amp * Math.cos(lobes * (a - rot)));
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawCheck(cx, cy, R, prog) {
    if (prog <= 0) return;
    const p0 = [cx - 0.4 * R, cy + 0.02 * R];
    const p1 = [cx - 0.11 * R, cy + 0.3 * R];
    const p2 = [cx + 0.42 * R, cy - 0.3 * R];
    const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const d = (l1 + l2) * Math.min(1, prog);
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    if (d <= l1) {
      const u = d / l1;
      ctx.lineTo(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u);
    } else {
      ctx.lineTo(p1[0], p1[1]);
      const v = (d - l1) / l2;
      ctx.lineTo(p1[0] + (p2[0] - p1[0]) * v, p1[1] + (p2[1] - p1[1]) * v);
    }
    ctx.lineWidth = Math.max(1.4, R * 0.17);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgba(1);
    ctx.stroke();
  }

  function drawBadge(cx, cy, R, amp, checkProg, alpha, rot) {
    ctx.save();
    ctx.globalAlpha = alpha;
    if (opts.glow > 0) {
      ctx.shadowColor = rgba(0.4 * (opts.glow / 100) * alpha);
      ctx.shadowBlur = 4 + (opts.glow / 100) * 12;
    }
    ctx.lineWidth = Math.max(1.3, R * 0.14);
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgba(1);
    sealPath(cx, cy, R, amp, Math.round(opts.lobes), rot);
    ctx.stroke();
    ctx.shadowBlur = 0;
    drawCheck(cx, cy, R, checkProg);
    ctx.restore();
  }

  function renderRun(r) {
    const dotR = (opts.dotSize * uiScale) / 2;
    const badgeR = (opts.badgeSize * uiScale) / 2;
    const ampMax = opts.scallop / 100;
    const dur = phaseDur(r.phase);
    const p = dur > 0 ? Math.min(1, r.pt / dur) : 1;
    const dEnd = stopD[r.k];
    if (dEnd === undefined) return;

    if (r.phase === "travel") {
      const travelled = segLen * travelPos(p);
      const d = dEnd - segLen + travelled;
      const pos = posAt(d);
      const maxLen = Math.max(0, travelled - opts.trailGap * uiScale);
      drawTrail(d, Math.min(opts.trailLength * uiScale * travelVel(p), maxLen), dotR);
      drawDot(pos.x, pos.y, dotR, 1);
      return;
    }

    const s = stopP[r.k];
    if (!s) return;

    if (r.phase === "pop") {
      const e = easeOutCubic(p);
      drawDot(s.x, s.y, dotR * (1 + 0.75 * e), 1 - e);
    } else if (r.phase === "grow") {
      const rr = badgeR * easeOutBack(p);
      drawBadge(s.x, s.y, Math.max(0.5, rr), 0, 0, Math.min(1, p * 3), r.rot);
    } else if (r.phase === "check") {
      const wob = 1 + 0.11 * Math.exp(-6 * r.pt) * Math.sin(17 * r.pt);
      const amp = ampMax * easeOutCubic(Math.min(1, p / 0.45));
      const cp = easeOutCubic(Math.min(1, p / 0.8));
      drawBadge(s.x, s.y, badgeR * wob, amp, cp, 1, r.rot);
    } else if (r.phase === "hold") {
      const amp = ampMax * (1 + 0.14 * Math.sin(r.pt * 5.2));
      drawBadge(s.x, s.y, badgeR, amp, 1, 1, r.rot);
    } else if (r.phase === "exit") {
      const e = easeInCubic(p);
      drawBadge(s.x, s.y, badgeR * (1 + 0.2 * e), ampMax, 1, 1 - e, r.rot);
    }
  }

  function frame(ts) {
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
    lastTs = ts;

    for (const r of runs) updateRun(r, dt);
    spawnCheck();
    runs = runs.filter((r) => !r.done);
    if (!runs.length) runs = [makeRun(0)];

    ctx.clearRect(0, 0, W, H);
    for (const r of runs) renderRun(r);

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || reduced.matches) return;
    lastTs = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
    ctx.clearRect(0, 0, W, H);
  }

  resize();

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => {
      resize();
      RGB = readColor(canvas);
    }).observe(canvas);
  } else {
    window.addEventListener("resize", resize);
  }

  // Only animate while the section is on screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" }
    ).observe(canvas);
  } else {
    visible = true;
    start();
  }

  reduced.addEventListener?.("change", () => {
    if (reduced.matches) stop();
    else if (visible) start();
  });
}
