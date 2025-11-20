import gsap from "gsap";
import { inner, isTouchDevice } from "./variables";

export const mouse = {
    x: inner.w / 2,
    y: inner.h / 2,

    xPerc: 50,
    yPerc: 50,

    xFromCen: 0,
    yFromCen: 0,

    xPerFromCen: 0,
    yPerFromCen: 0,

    movementX: 0,
    movementY: 0,
};

function mouseMove(e: MouseEvent) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    mouse.xPerc = (mouse.x / inner.h) * 100;
    mouse.yPerc = (mouse.y / inner.h) * 100;

    mouse.xFromCen = mouse.x - inner.w / 2;
    mouse.yFromCen = mouse.y - inner.h / 2;

    mouse.xPerFromCen = (mouse.xFromCen / inner.w) * 100;
    mouse.yPerFromCen = (mouse.yFromCen / inner.h) * 100;

    mouse.movementX = e.movementX;
    mouse.movementY = e.movementY;

    gsap.set(":root", { "--mouse-x": mouse.x + "px", "--mouse-y": mouse.y + "px" });
}

export function initMouse() {
    if (!isTouchDevice) window.addEventListener("mousemove", mouseMove);
}
