function e(){document.querySelectorAll(".marquee").forEach(e=>{const r=e.querySelector(".marquee__wrapper");if(!r)return;const o=Array.from(r.children),t=e.offsetWidth;let c=r.scrollWidth;for(;c<2*t;)o.forEach(e=>{const o=e.cloneNode(!0);r.appendChild(o)}),c=r.scrollWidth})}export{e as default};
//# sourceMappingURL=marquee-C1huFThi.js.map
