export function initMouseOrb() {
    const ROOT = document.createElement("div");
    ROOT.className = "mouse_mobile";
    ROOT.id = "mouseRoot";
    document.body.appendChild(ROOT);

    const COLORS = ["radial-gradient(circle at 30% 30%, rgba(183,207,255,0.1) 0%, rgba(43,86,173,1) 40%, transparent 70%)", "radial-gradient(circle at 70% 40%, rgba(43,86,173,1) 0%, rgba(183,207,255,0.1) 50%, transparent 70%)", "radial-gradient(circle at 40% 70%, rgba(183,207,255,0.1) 0%, rgba(43,86,173,1) 42%, transparent 72%)"];

    const COUNT = 20;
    const BREAKPOINT = 990;

    let coords = { x: 0, y: 0 };
    let circles: { el: HTMLDivElement; x: number; y: number }[] = [];
    let rafId;
    let following = window.innerWidth > BREAKPOINT;

    const isFollowing = () => window.innerWidth > BREAKPOINT;

    const createDOM = () => {
        ROOT.innerHTML = "";

        if (isFollowing()) {
            circles = Array.from({ length: COUNT }, (_, i) => {
                const el = document.createElement("div");
                el.className = "circle";
                el.style.backgroundImage = COLORS[i % COLORS.length];
                el.style.opacity = "0.03";
                ROOT.appendChild(el);
                return { el, x: 0, y: 0 };
            });
        } else {
            const blob = document.createElement("div");
            blob.className = "circle_mobile";
            blob.style.display = "block";
            blob.style.backgroundImage = "radial-gradient(circle at 70% 40%, rgba(43,86,173,0.2) 0%, rgba(183,207,255,0.1) 50%, transparent 70%)";
            blob.style.mixBlendMode = "screen";
            ROOT.appendChild(blob);
            circles = [];
        }
    };

    const animate = () => {
        if (isFollowing() && circles.length) {
            let x = coords.x;
            let y = coords.y;

            circles.forEach((c, index) => {
                c.x = x;
                c.y = y;

                const scale = (circles.length - index) / circles.length;
                const offset = 200;
                c.el.style.transform = `translate(${c.x - offset}px, ${c.y - offset}px) scale(${scale})`;

                const next = circles[index + 1] || circles[0];
                x += (next.x - x) * 0.4;
                y += (next.y - y) * 0.4;
            });
        }

        rafId = requestAnimationFrame(animate);
    };

    const onPointerMove = e => {
        if (!isFollowing()) return;
        coords.x = e.clientX || 0;
        coords.y = e.clientY || 0;
    };

    const onResize = () => {
        const nowFollowing = isFollowing();
        if (nowFollowing !== following) {
            following = nowFollowing;
            createDOM();
        }
    };

    // Init
    createDOM();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(animate);
}
