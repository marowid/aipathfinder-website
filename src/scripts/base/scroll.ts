import Lenis from "lenis";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { varGutter, prefersReducedMotion } from "../utils/variables";

export let lenis: Lenis;

export function initScroller() {
    lenis = new Lenis({
        duration: prefersReducedMotion ? 0 : 1,
        easing: prefersReducedMotion ? t => t : t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !prefersReducedMotion,
        wheelMultiplier: 1,
        infinite: false,
        prevent: node => {
            if (node.nodeName === "VERCEL-LIVE-FEEDBACK") return true;
            return false;
        },
    });

    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(9999);
    }

    let prevScrollDirection = 0;
    lenis.on("scroll", e => {
        ScrollTrigger.update();
        if (e.direction !== 0 && e.direction !== prevScrollDirection) {
            gsap.set(":root", { "--scroll-direction": Math.max(e.direction, 0) });
            prevScrollDirection = e.direction;
        }
    });
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));

    initJumpLinksScrollTo();
    checkInitialHash();
    initScrollNextBtns();
}

function initJumpLinksScrollTo() {
    const jumpLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    jumpLinks.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            if (location.pathname.replace(/^\//, "") === anchor.pathname.replace(/^\//, "") && location.hostname === anchor.hostname) {
                const targetId = anchor.hash;
                const target = document.querySelector(targetId) as HTMLElement;

                if (target) {
                    lenis.scrollTo(target, {
                        duration: 0.7,
                        offset: -varGutter,
                    });
                    history.pushState(null, "", targetId);
                }
            }
        });
    });
}

function checkInitialHash() {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector<HTMLElement>(hash);
        if (target) {
            lenis.scrollTo(target, {
                offset: -varGutter,
            });
        }
    }
}

function initScrollNextBtns() {
    const scrollNextBtns = document.querySelectorAll<HTMLElement>(".scroll-next");

    scrollNextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const currentSection = btn.closest<HTMLElement>("section, .section");
            if (!currentSection) return;

            const nextSection = currentSection.nextElementSibling as HTMLElement;
            if (nextSection) {
                lenis.scrollTo(nextSection, {
                    duration: 0.7,
                    offset: -varGutter,
                });
            }
        });
    });
}
