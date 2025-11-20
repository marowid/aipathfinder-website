const INTRO_MS_MIN = 3200;
const INTRO_MS_MAX = 8000;
const THRESHOLD_MS = 15 * 60 * 1000;
const FADE_MS = 600;
const LS_KEY = "lastVisitAt";

const now = () => Date.now();
const visitedRecently = () => {
    try {
        const t = Number(localStorage.getItem(LS_KEY) || 0);
        return t && now() - t < THRESHOLD_MS;
    } catch {
        return false;
    }
};
const saveVisit = () => {
    try {
        localStorage.setItem(LS_KEY, String(now()));
    } catch {}
};

export function initLoader() {
    const pre = document.getElementById("preloader");
    const player = pre ? (pre.querySelector("lottie-player") as any) : null;
    if (!pre || !player) return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hidePreloader = () => {
        pre.style.opacity = "0";
        pre.style.pointerEvents = "none";
        setTimeout(() => {
            pre.style.display = "none";
            saveVisit();
            document.dispatchEvent(new CustomEvent("preloader:hidden"));
        }, FADE_MS);
    };

    if (visitedRecently() || prefersReduce) {
        try {
            player.stop && player.stop();
        } catch {}
        hidePreloader();
        return;
    }

    let safetyTimeoutId: number | null = null;
    let minTimeoutId: number | null = null;
    let readyFired = false;

    const clearTimers = () => {
        if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
        if (minTimeoutId) clearTimeout(minTimeoutId);
    };

    const startIntro = () => {
        try {
            player.seek && player.seek(0);
        } catch {}
        try {
            player.play && player.play();
        } catch {}

        minTimeoutId = setTimeout(() => {}, INTRO_MS_MIN);

        safetyTimeoutId = setTimeout(() => {
            hidePreloader();
        }, INTRO_MS_MAX);
    };

    const onReady = () => {
        if (readyFired) return;
        readyFired = true;
        startIntro();
    };

    const onComplete = () => {
        const elapsedEnough = ms => new Promise(res => setTimeout(res, ms));
        Promise.resolve().then(async () => {
            await elapsedEnough(Math.max(0, 100));
            clearTimers();
            hidePreloader();
        });
    };

    if (player.isReady) {
        onReady();
    } else {
        player.addEventListener("ready", onReady, { once: true });
        player.addEventListener("load", onReady, { once: true });
    }

    player.addEventListener("complete", onComplete, { once: true });

    player.addEventListener(
        "error",
        () => {
            clearTimers();
            hidePreloader();
        },
        { once: true }
    );

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) return;
        if (pre.style.display !== "none") {
            try {
                player.play && player.play();
            } catch {}
        }
    });
}
