import gsap from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

import { bp } from "../utils/variables";

export default function initTextAnim() {
    const main = document.querySelector<HTMLElement>("main.main");
    if (!main) return;

    gsap.matchMedia().add(`(min-width: ${bp.lg}px) and (prefers-reduced-motion: no-preference)`, function () {
        initTitleAnim(main);
    });
}

function initTitleAnim(main: HTMLElement) {
    const sections = main.querySelectorAll<HTMLElement>("section");

    sections.forEach(section => {
        const pastSection = section.getBoundingClientRect().bottom <= 0;
        if (pastSection) return;

        const titles = section.querySelectorAll<HTMLElement>("h1, .h1, h2, .h2, h3, .h3");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top+=100 95%",
                end: "bottom top",
                once: true,
                scrub: false,
            },
        });

        titles.forEach(title => {
            tl.fromTo(
                title,
                {
                    opacity: 0,
                    filter: "blur(2px)",
                },
                {
                    opacity: 1,
                    duration: 1.5,
                    filter: "blur(0px)",
                    ease: "power3.out",
                },
                "<+=.03"
            );
        });
    });
}
