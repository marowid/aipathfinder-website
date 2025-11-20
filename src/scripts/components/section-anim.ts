import gsap from "gsap";
import { bp } from "../utils/variables";

export default function initScrollAnim() {
    const main = document.querySelector<HTMLElement>("main.main");
    if (!main) return;

    gsap.matchMedia().add(`(min-width: ${bp.lg}px) and (prefers-reduced-motion: no-preference)`, function () {
        initSectionAnim(main);
        initBgAnim(main);

        initCardAnim(main);
        initListAnim(main);
    });
}

function checkIfPastEl(element: HTMLElement): boolean {
    return element.getBoundingClientRect().bottom <= 0;
}

function initSectionAnim(main: HTMLElement) {
    const sections = main.querySelectorAll<HTMLElement>("section:not(.asset)");

    sections.forEach(section => {
        if (checkIfPastEl(section)) return;

        gsap.fromTo(
            section,
            {
                opacity: 0.001,
            },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top+=100 95%",
                    end: "bottom top",
                    once: true,
                },
                ease: "power1.out",
                duration: 0.9,
            }
        );
    });
}

function initBgAnim(main: HTMLElement) {
    const bgs = main.querySelectorAll<HTMLElement>(".bg");

    bgs.forEach(bg => {
        gsap.fromTo(
            bg,
            {
                "--bg-scale": 0.9,
            },
            {
                "--bg-scale": 1,
                scrollTrigger: {
                    trigger: bg,
                    start: "top 95%",
                    end: "bottom top",
                    once: true,
                },
                ease: "power1.out",
                duration: 0.9,
            }
        );
    });
}

function initCardAnim(main: HTMLElement) {
    const wrappers = main.querySelectorAll<HTMLElement>(".cards .row");

    wrappers.forEach(wrapper => {
        if (checkIfPastEl(wrapper)) return;

        const items = wrapper.querySelectorAll<HTMLElement>(".card");
        gsap.fromTo(
            items,
            {
                scale: 0.95,
            },
            {
                scale: 1,
                ease: "power1.out",
                duration: 0.8,
                stagger: 0.08,
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 95%",
                    end: "bottom top",
                    once: true,
                    scrub: false,
                },
            }
        );
    });
}

function initListAnim(main: HTMLElement) {
    const wrappers = main.querySelectorAll<HTMLElement>(".list .row");

    wrappers.forEach(wrapper => {
        if (checkIfPastEl(wrapper)) return;

        const items = wrapper.querySelectorAll<HTMLElement>("li");
        gsap.fromTo(
            items,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                ease: "power1.out",
                duration: 0.9,
                stagger: 0.07,
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 95%",
                    end: "bottom top",
                    once: true,
                    scrub: false,
                },
            }
        );
    });
}
