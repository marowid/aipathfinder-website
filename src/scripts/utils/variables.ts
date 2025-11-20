import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import imagesLoaded from "imagesloaded";

import { debounce } from "./functions";

export const bp = {
    xsm: 425,
    sm: 600,
    md: 768,
    lg: 1024,
    xlg: 1232,
};

export const isTouchDevice = "ontouchstart" in document.documentElement;
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const inner = {
    w: window.innerWidth,
    h: window.innerHeight,
};

const header = document.querySelector<HTMLElement>(".header");

export let varGutter: number = 0;
export let varGap: number = 0;
export let headerHeight: number = header ? header.offsetHeight : 0;

export function calcResize(triggerScrollRefresh: boolean = true) {
    inner.w = window.innerWidth;
    inner.h = window.innerHeight;

    varGutter = convertMaxProp("--gutter");
    varGap = convertMaxProp("--gap");

    calcHeaderHeight();

    if (triggerScrollRefresh) ScrollTrigger.refresh();
}

export function calcHeaderHeight() {
    if (header) {
        headerHeight = header.offsetHeight;
        gsap.set(":root", { "--header-height": headerHeight + "px" });

        return headerHeight;
    }
}

function convertMaxProp(maxProp: string) {
    const variable = getComputedStyle(document.documentElement).getPropertyValue(maxProp);

    const [remValue, vwValue] = variable.match(/([\d.]+rem)|([\d.]+vw)/g) ?? ["0rem", "0vw"];

    const remToPixels = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const vwToPixels = (vw: number) => (vw * window.innerWidth) / 100;

    const remInPixels = remToPixels(parseFloat(remValue));
    const vwInPixels = vwToPixels(parseFloat(vwValue));

    return Math.max(remInPixels, vwInPixels);
}

function resize() {
    if (isTouchDevice) {
        const isSignificantResize = window.innerHeight > inner.h + inner.h * 0.3 || window.innerHeight < inner.h - inner.h * 0.3;
        if (isSignificantResize) calcResize();
    } else calcResize(true);
}

export function initVariables() {
    calcResize(false);
    const debouncedResize = debounce(resize, 300);
    window.addEventListener("resize", debouncedResize);

    imagesLoaded(document.body).on("always", () => ScrollTrigger.refresh());
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
}
