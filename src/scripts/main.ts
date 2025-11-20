import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    ease: "ease",
    duration: 1,
});

gsap.config({
    nullTargetWarn: true,
    autoSleep: 60,
    force3D: false,
});

import { runDefault, runLayoutDefault, runComponentDefault, runModuleDefault } from "./utils/runner-functions";

import { initVariables, prefersReducedMotion } from "./utils/variables";
import { initLinkPrefetch } from "./utils/link-prefetch";
import { initScroller } from "./base/scroll";
import { initMouseOrb } from "./base/mouse-orb";
import { initLoader } from "./base/loader";

function init() {
    initGlobalScripts();
    initLayoutScripts();
    initComponentScripts();
    initModuleScripts();
}

function initGlobalScripts() {
    initVariables();
    initLoader();
    initScroller();
    initLinkPrefetch();
    runDefault("grid");

    if (!prefersReducedMotion) {
        initMouseOrb();
    }
}

function initLayoutScripts() {
    runLayoutDefault("mbl-nav");
}

function initComponentScripts() {
    runComponentDefault("marquee", ".marquee");
    runComponentDefault("btn-hover", ".btn-hover");
    runComponentDefault("section-anim", "section");
    runComponentDefault("title-anim", "h1, h2, h3");
}

function initModuleScripts() {
    runModuleDefault("hero", ".hero");
    runModuleDefault("region", ".region");
}

function safeInit() {
    requestAnimationFrame(() => setTimeout(init, 1));
}

if (!(document.readyState === "loading")) safeInit();
else document.addEventListener("DOMContentLoaded", safeInit);
