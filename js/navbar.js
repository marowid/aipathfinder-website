/* navbar-logic.js */
(function () {
  const SELECTORS = {
    toggle: '.nav-toggle',
    panelId: 'primary-menu',
    navLinks: '.nav-link',
  };

  const MQ = '(max-width: 767px)';
  const isMobile = () => window.matchMedia(MQ).matches;

  let animating = false;

  function getEls() {
    return {
      toggle: document.querySelector(SELECTORS.toggle),
      panel: document.getElementById(SELECTORS.panelId),
    };
  }

  function setExpanded(el, expanded) {
    el.setAttribute('aria-expanded', String(expanded));
  }

  function transitionMs(el) {
    const cs = getComputedStyle(el);
    const dur = cs.transitionDuration.split(',')[0]?.trim() || '0s';
    const del = cs.transitionDelay.split(',')[0]?.trim() || '0s';
    const toMs = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
    return toMs(dur) + toMs(del) + 50; 
  }

  function onTransitionEndOnce(el, cb) {
    let done = false;
    const handler = (e) => {
      if (e.target !== el) return; 
      cleanup();
      if (!done) { done = true; cb(); }
    };
    const cleanup = () => el.removeEventListener('transitionend', handler);
    el.addEventListener('transitionend', handler, { passive: true });
    const t = setTimeout(() => {
      cleanup();
      if (!done) { done = true; cb(); }
    }, transitionMs(el));
  }

  // ---- open/close ----
  function openPanel(panel, toggle) {
    if (!panel || !toggle || animating) return;
    animating = true;

    
    setExpanded(toggle, true);
    document.body.classList.add('menu-open');

   
    panel.hidden = false;
    panel.offsetHeight;
    panel.classList.add('is-open');

    onTransitionEndOnce(panel, () => {
      animating = false;
    });
  }

  function closePanel(panel, toggle) {
    if (!panel || !toggle || animating) return;
    animating = true;

    
    setExpanded(toggle, false);

   
    panel.classList.remove('is-open');

    onTransitionEndOnce(panel, () => {
      panel.hidden = true; 
      document.body.classList.remove('menu-open');
      animating = false;
    });
  }

  function togglePanel() {
    const { toggle, panel } = getEls();
    if (!toggle || !panel) return;
    if (animating) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closePanel(panel, toggle) : openPanel(panel, toggle);
  }

  function closeMobileNavIfOpen() {
    const { toggle, panel } = getEls();
    if (!toggle || !panel) return;
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closePanel(panel, toggle);
    }
  }

  function decorateShowSectionToCloseMenu() {
    if (typeof window.showSection === 'function' && !window.showSection.__wrappedForNav) {
      const original = window.showSection;
      window.showSection = function (...args) {
        const result = original.apply(this, args);
        if (isMobile()) closeMobileNavIfOpen();
        return result;
      };
      window.showSection.__wrappedForNav = true;
    }
  }


  function handleInitialState() {
    const { toggle, panel } = getEls();
    if (toggle && panel) {
      setExpanded(toggle, false);
      panel.hidden = true;
      panel.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }

   
    if (location.hash) {
      const id = location.hash.slice(1);
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (typeof window.showSection === 'function') {
        window.showSection(id, link || null);
      }
    }
  }

  function initEventListeners() {
    const { toggle, panel } = getEls();

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        togglePanel();
      });
    }

    // Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMobile()) {
        closeMobileNavIfOpen();
        const { toggle } = getEls();
        if (toggle) toggle.focus();
      }
    });

   
    if (panel) {
      panel.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        if (isMobile()) closeMobileNavIfOpen();
      });
    }


    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href').slice(1);
        if (typeof window.showSection === 'function') {
          e.preventDefault();
          window.showSection(id, this);
          history.pushState(null, '', `#${id}`);
        }
      });
    });


    window.addEventListener('popstate', () => {
      const id = (location.hash || '#home').slice(1);
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (typeof window.showSection === 'function') {
        window.showSection(id, link || null);
      }
    });


    window.matchMedia(MQ).addEventListener('change', () => {
      closeMobileNavIfOpen();
    });

   
    document.addEventListener('click', (e) => {
      if (animating) return; 
      const { toggle, panel } = getEls();
      if (!toggle || !panel) return;
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (!open || !isMobile()) return;

      const clickedOutside = !panel.contains(e.target) && !toggle.contains(e.target);
      if (clickedOutside) closePanel(panel, toggle);
    });

    
    document.addEventListener('preloader:hidden', () => { animating = false; }, { once: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    decorateShowSectionToCloseMenu();
    handleInitialState();
    initEventListeners();
  });
})();
