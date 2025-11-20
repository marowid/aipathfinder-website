const host = window.location.host;

export function initLinkPrefetch() {
    const anchors = document.querySelectorAll("a");

    anchors.forEach(anchor => {
        const href = anchor.getAttribute("href");
        if (!href) return;
        const linkUrl = new URL(href, window.location.href);

        if (!(host === linkUrl.host)) return;
        anchor.addEventListener("mouseenter", () => prefetchLink(linkUrl), { once: true });
    });
}

function prefetchLink(linkUrl: URL) {
    const existingLink = document.querySelector(`link[rel=prefetch][href="${linkUrl.href}"]`);

    if (!existingLink) {
        const link = document.createElement("link");
        link.setAttribute("rel", "prefetch");
        link.setAttribute("href", linkUrl.href);
        document.head.appendChild(link);
    }
}
