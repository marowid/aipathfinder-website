import regionData from "../../assets/map-titles.json" with { type: "json" };

import "swiper/css";
import "swiper/css/effect-fade";

import Swiper from "swiper";
import { Navigation, EffectFade } from "swiper/modules";
import { lenis } from "../base/scroll";

import { bp, inner } from "../utils/variables";

export default function initRegions() {
    const regions = document.querySelectorAll<HTMLElement>(".region");

    regions.forEach(region => {
        const regionMap = region.querySelector<HTMLElement>(".region__map svg");
        const body = region.querySelector<HTMLElement>(".region__body");
        const navLocation = region.querySelector<HTMLElement>(".region__body__tabs__location");
        if (!regionMap || !body || !navLocation) return;

        const regionSwiper = new Swiper(body, {
            modules: [Navigation, EffectFade],
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
            speed: 700,
            slidesPerView: 1,

            on: {
                init: swiper => slideUpdateUI(swiper, regionMap, navLocation),
                slideChange: swiper => {
                    slideUpdateUI(swiper, regionMap, navLocation);
                    if (inner.w > bp.lg) {
                        lenis.scrollTo(body, {
                            duration: 0.7,
                            offset: -100,
                        });
                    }
                },
            },
        });
        initMapPathVisibility(regionMap, regionSwiper);
        initPathRegionInteractions(regionSwiper, regionMap);
    });
}

function initMapPathVisibility(regionMap: HTMLElement, regionSwiper: Swiper) {
    const pathRegions = regionMap.querySelectorAll<HTMLElement>("path");
    pathRegions.forEach(pathRegion => {
        const pathRegionName = pathRegion.getAttribute("id");
        if (!pathRegionName) return;

        const targetSlide = Array.from(regionSwiper.slides).find(slide => {
            const slideRegion = slide.getAttribute("aria-label");
            return slideRegion === pathRegionName;
        });

        if (!targetSlide) {
            pathRegion.classList.add("disabled");
        }
    });
}

function slideUpdateUI(swiper: Swiper, regionMap: HTMLElement, navLocation: HTMLElement) {
    const newSlide = swiper.slides[swiper.activeIndex];
    const swiperGroup = newSlide.getAttribute("aria-label");

    navLocation.innerHTML = regionData[swiperGroup || ""]?.title || "";

    const activePathRegion = regionMap.querySelector<HTMLElement>(".active");
    if (activePathRegion) activePathRegion.classList.remove("active");

    const newPathRegion = regionMap.querySelector<HTMLElement>(`#${swiperGroup}`);
    if (newPathRegion) newPathRegion.classList.add("active");
}

function initPathRegionInteractions(regionSwiper: Swiper, regionMap: HTMLElement) {
    const pathRegions = regionMap.querySelectorAll<HTMLElement>("path");
    pathRegions.forEach(pathRegion => {
        const pathRegionName = pathRegion.getAttribute("id");

        pathRegion.addEventListener("click", () => {
            const targetSlide = Array.from(regionSwiper.slides).find(slide => {
                const slideRegion = slide.getAttribute("aria-label");
                return slideRegion === pathRegionName;
            });

            if (!targetSlide) return;
            regionSwiper.slideTo(regionSwiper.slides.indexOf(targetSlide));
        });
    });
}
