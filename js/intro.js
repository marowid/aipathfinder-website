const INTRO_MS = 3200;                   
const THRESHOLD_MS = 60 * 60 * 1000;     
const LS_KEY = "lastVisitAt";
const FADE_MS = 600;                  

const now = () => Date.now();
const visitedRecently = () => {
  try {
    const t = Number(localStorage.getItem(LS_KEY) || 0);
    return t && (now() - t) < THRESHOLD_MS;
  } catch { return false; }
};
const saveVisit = () => { try { localStorage.setItem(LS_KEY, String(now())); } catch {} };

document.addEventListener("DOMContentLoaded", () => {
  const pre = document.getElementById("preloader");
  const page = document.getElementById("page") || document.querySelector(".page");
  if (!pre || !page) return;


const hidePreloader = () => {
  pre.style.opacity = "0";
  pre.style.pointerEvents = "none";
  setTimeout(() => {
    pre.style.display = "none";
    saveVisit();
    document.dispatchEvent(new CustomEvent('preloader:hidden'));
  }, FADE_MS);
};


  if (visitedRecently()) {
    hidePreloader();
  } else {
    setTimeout(hidePreloader, INTRO_MS);
  }
});
