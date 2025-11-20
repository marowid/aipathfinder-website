import gsap from "gsap";
import { bp } from "../utils/variables";

export default function initHeroModule() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const heroInner = hero.querySelector(".hero__inner");
    if (!heroInner) return;

    gsap.matchMedia().add(`(min-width: ${bp.md}px) and (prefers-reduced-motion: no-preference)`, function () {
        gsap.fromTo(
            heroInner,
            {
                yPercent: 0,
                opacity: 1,
            },
            {
                yPercent: 50,
                opacity: 0,
                ease: "none",
                duration: 0.01,
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );

        const heroImg = hero.querySelector(".hero__img");
        if (!heroImg) return;
        gsap.fromTo(
            heroImg,
            {
                yPercent: 0,
                opacity: 1,
            },
            {
                yPercent: 20,
                opacity: 0,
                ease: "none",
                duration: 0.01,
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );
    });
}
