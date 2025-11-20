export default function initMarquee() {
    const marquees = document.querySelectorAll<HTMLElement>(".marquee");

    marquees.forEach(marquee => {
        const wrapper = marquee.querySelector(".marquee__wrapper");
        if (!wrapper) return;
        const slides = Array.from(wrapper.children);

        const marqueeWidth = marquee.offsetWidth;
        let contentWidth = wrapper.scrollWidth;

        while (contentWidth < marqueeWidth * 2) {
            slides.forEach(slide => {
                const clone = slide.cloneNode(true) as Element;
                wrapper.appendChild(clone);
            });
            contentWidth = wrapper.scrollWidth;
        }
    });
}
