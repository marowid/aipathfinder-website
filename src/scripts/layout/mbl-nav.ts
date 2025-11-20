import { toggleScroll } from "../utils/functions";
import { inner, bp } from "../utils/variables";

export default function initMobileNav() {
    const header = document.querySelector(".header");
    if (!header) return;

    const nav = header.querySelector(".header__nav");
    const toggleBtn = header.querySelector<HTMLButtonElement>(".header__mbl-toggle");
    if (!toggleBtn || !nav) return;

    const hamburger = toggleBtn.querySelector(".hamburger");
    if (!hamburger) return;

    let navIsOpen = false;
    toggleBtn.addEventListener("click", () => {
        if (!(inner.w < bp.lg)) return;

        nav.classList.toggle("open");
        hamburger.classList.toggle("active");
        toggleScroll(navIsOpen ? "enable" : "disable");

        navIsOpen = !navIsOpen;
    });

    const navLinks = nav.querySelectorAll("a.nav-link");
    navLinks.forEach(navLink => {
        navLink.addEventListener("click", () => toggleBtn.click());
    });
}
