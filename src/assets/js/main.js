import { initReveal } from "./reveal.js";
import { initHeader } from "./header.js";
import { initSectionNav } from "./section-nav.js";
import { initHeroRoute } from "./hero-route.js";
import { initBoardStack } from "./board-stack.js";
import { initWordReveal } from "./word-reveal.js";
import { initCounters } from "./counters.js";

const header = document.querySelector("[data-site-header]");
if (header) initHeader(header);

const nav = document.querySelector("[data-section-nav]");
if (nav) initSectionNav(nav);

document.querySelectorAll("[data-hero-route]").forEach(initHeroRoute);
document.querySelectorAll("[data-board-stack]").forEach(initBoardStack);
document.querySelectorAll("[data-word-reveal]").forEach(initWordReveal);

initCounters();
initReveal();
