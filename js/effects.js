// effects.js
(function () {
  // ---------- Utils ----------
  const qs   = (sel, root = document) => root.querySelector(sel);
  const qsa  = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const raf  = (fn) => requestAnimationFrame(fn);

  const applyStaggerIndex = (nodeList) => {
    nodeList.forEach((el, i) => el.style.setProperty('--i', i));
  };

  const isInViewport = (el, vh = window.innerHeight) => {
    const r = el.getBoundingClientRect();
    return r.top < vh * 0.9 && r.bottom > 0;
  };

  const prefersReduced = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Observer (singleton) ----------
  let ioReveal = null;
  function ensureObserver() {
    if (ioReveal) return ioReveal;

    ioReveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }

      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    return ioReveal;
  }

  // ---------- Markup bootstrap (adds .reveal to targets) ----------
  function bootstrapRevealClasses() {
    if (prefersReduced()) return; 


    const heroContent = qs('.hero .container > div');
    if (heroContent) {
      const heroKids = qsa(' .caption, h1, p, .contact-btn, .hero-cta, .hero-media', heroContent);
      heroKids.forEach((el) => {
        el.classList.add('reveal', 'reveal-up');
        el.setAttribute('data-stagger', '');
      });
      applyStaggerIndex(heroKids);
    }

    qsa('.box-container .key-announcement, .content-text p, .about-text p, .team-member, footer .footer-grid > *')
      .forEach((el) => el.classList.add('reveal', 'reveal-up'));

    applyStaggerIndex(qsa('.box-container .box'));
    applyStaggerIndex(qsa('.team-grid .team-member'));
    applyStaggerIndex(qsa('footer .footer-grid > *'));

    qsa('.reveal').forEach((el) => el.style.willChange = 'transform, opacity');
  }

  // ---------- Observe / Refresh ----------
  function observeReveals(scope = document) {
    if (prefersReduced()) return;
    const io = ensureObserver();
    qsa('.reveal', scope).forEach((el) => {
      io.observe(el);
      if (isInViewport(el)) el.classList.add('in');
    });
  }

  function refreshReveals(scope = document) {
    if (prefersReduced()) return;
    const io = ensureObserver();
    const els = qsa('.reveal', scope);

    els.forEach((el) => {
      io.unobserve(el);
    
      if (!isInViewport(el)) el.classList.remove('in');
      io.observe(el);
    });

    raf(() => {
      els.forEach((el) => {
        if (isInViewport(el)) el.classList.add('in');
      });
    });
  }

  // ---------- Preloader handling ----------
  function handlePreloaderThen(fn) {
    const preloader = qs('#preloader');

    if (!preloader) return fn();

    const isGone = preloader.style.display === 'none' || preloader.hidden ||
                   getComputedStyle(preloader).display === 'none';
    if (isGone) return fn();

    document.addEventListener('preloader:hidden', fn, { once: true });
  }

  // ---------- Hooks para SPA / cambios de sección ----------
  function setupSectionChangeHooks() {
    // A) Hash-based navigation
    window.addEventListener('hashchange', () => {
      raf(() => {
        const active = qs('.section.active');
        if (active) refreshReveals(active);
      });
    });

    // B) Custom event desde navbar.js
    document.addEventListener('section:changed', () => {
      raf(() => {
        const active = qs('.section.active');
        if (active) refreshReveals(active);
      });
    });

    // C) Clicks en nav links
    qsa('.nav-link').forEach((a) => {
      a.addEventListener('click', () => {
        setTimeout(() => {
          const active = qs('.section.active');
          if (active) refreshReveals(active);
        }, 60);
      });
    });
  }


  function init() {
    bootstrapRevealClasses();

    handlePreloaderThen(() => {
      observeReveals(document);   
      setupSectionChangeHooks();  
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
