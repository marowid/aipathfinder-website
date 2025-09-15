// intro.js
// ============================================================
// Entrance reveal + per-section refresh (SPA friendly)
// ============================================================
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

  // ---------- Observer (singleton) ----------
  let ioReveal = null;
  function ensureObserver() {
    if (ioReveal) return ioReveal;
    ioReveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
    return ioReveal;
  }

  // ---------- Markup bootstrap (adds .reveal to targets) ----------
  function bootstrapRevealClasses() {
    // HERO: mark children for stagger
    const heroContent = qs('.hero .container > div');
    if (heroContent) {
      const heroKids = qsa(' .caption, h1, p, .contact-btn, .hero-cta, .hero-media', heroContent);
      heroKids.forEach((el) => {
        el.classList.add('reveal', 'reveal-up');
        el.setAttribute('data-stagger', '');
      });
      applyStaggerIndex(heroKids);
    }

    // MISSION, ABOUT, TEAM, FOOTER
    qsa('.box, .key-announcement, .content-text p, .about-text p, .team-member, footer .footer-grid > *')
      .forEach((el) => el.classList.add('reveal', 'reveal-up'));

    // Extra stagger per groups
    applyStaggerIndex(qsa('.box-container .box'));
    applyStaggerIndex(qsa('.team-grid .team-member'));
    applyStaggerIndex(qsa('footer .footer-grid > *'));
  }

  // ---------- Observe / Refresh ----------
  function observeReveals(scope = document) {
    const io = ensureObserver();
    qsa('.reveal', scope).forEach((el) => {
      io.observe(el);
      if (isInViewport(el)) el.classList.add('in');
    });
  }

  function refreshReveals(scope = document) {
    const io = ensureObserver();
    const els = qsa('.reveal', scope);
    els.forEach((el) => {
      io.unobserve(el);
      el.classList.remove('in');   // remove to re-animate on each visit
      io.observe(el);
    });
    raf(() => { els.forEach((el) => { if (isInViewport(el)) el.classList.add('in'); }); });
  }

  // ---------- Preloader handling ----------
  function handlePreloaderThen(fn) {
    const preloader = qs('#preloader');
    if (!preloader) return fn();

    const finish = () => {
      preloader.style.opacity = '0';
      setTimeout(() => { preloader.style.display = 'none'; fn(); }, 150);
    };
    setTimeout(finish, 900);
  }

  // ---------- Hooks for SPA / section changes ----------
  function setupSectionChangeHooks() {
    // A) Hash-based navigation
    window.addEventListener('hashchange', () => {
      raf(() => {
        const active = qs('.section.active');
        if (active) refreshReveals(active);
      });
    });

    // B) Custom event from navbar.js
    document.addEventListener('section:changed', () => {
      raf(() => {
        const active = qs('.section.active');
        if (active) refreshReveals(active);
      });
    });

    // C) Nav link clicks
    qsa('.nav-link').forEach((a) => {
      a.addEventListener('click', () => {
        setTimeout(() => {
          const active = qs('.section.active');
          if (active) refreshReveals(active);
        }, 60);
      });
    });

    // D) Debounced refresh after programmatic scrollTop
    let t;
    window.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const active = qs('.section.active');
        if (active) refreshReveals(active);
      }, 120);
    }, { passive: true });
  }

  // ---------- Init ----------
  function init() {
    bootstrapRevealClasses();

    handlePreloaderThen(() => {
      observeReveals(document);   // start observing
      setupSectionChangeHooks();  // refresh on page/section change
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
