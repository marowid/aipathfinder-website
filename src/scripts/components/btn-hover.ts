import { isTouchDevice } from "../utils/variables";

export default function initBtnHovers() {
    if (isTouchDevice) return;
    const btnHovers = document.querySelectorAll(".btn-hover");

    btnHovers.forEach(btnHover => {
        const btn = btnHover.querySelector(".btn");
        if (!btn) return;

        btnHover.addEventListener("mouseenter", () => {
            btn.classList.add("hover");
        });

        btnHover.addEventListener("mouseleave", () => {
            btn.classList.remove("hover");
        });
    });
}
