import { initReveal } from "./reveal.js";
import { initHeader } from "./header.js";
import { initSectionNav } from "./section-nav.js";
import { initHeroVideo } from "./hero-video.js";
import { initBoardStack } from "./board-stack.js";
import { initCounters } from "./counters.js";
import { initPartnerScale } from "./partner-scale.js";

const header = document.querySelector("[data-site-header]");
if (header) initHeader(header);

const nav = document.querySelector("[data-section-nav]");
if (nav) initSectionNav(nav);

document.querySelectorAll("[data-hero-video]").forEach(initHeroVideo);
document.querySelectorAll("[data-board-stack]").forEach(initBoardStack);
document.querySelectorAll("[data-partner-scale]").forEach(initPartnerScale);

initCounters();
initReveal();
