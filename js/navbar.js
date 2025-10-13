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

  // ---- util: transition end robusto (solo el panel, con fallback dinámico) ----
  function transitionMs(el) {
    const cs = getComputedStyle(el);
    const dur = cs.transitionDuration.split(',')[0]?.trim() || '0s';
    const del = cs.transitionDelay.split(',')[0]?.trim() || '0s';
    const toMs = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
    return toMs(dur) + toMs(del) + 50; // pequeño buffer
  }

  function onTransitionEndOnce(el, cb) {
    let done = false;
    const handler = (e) => {
      if (e.target !== el) return; // ignora burbujas de hijos
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

    // Estado: expandido
    setExpanded(toggle, true);
    document.body.classList.add('menu-open');

    // Mostrar y forzar reflow antes de añadir la clase animable
    panel.hidden = false;
    panel.offsetHeight; // reflow
    panel.classList.add('is-open');

    onTransitionEndOnce(panel, () => {
      animating = false;
    });
  }

  function closePanel(panel, toggle) {
    if (!panel || !toggle || animating) return;
    animating = true;

    // Estado: colapsado
    setExpanded(toggle, false);

    // Quita clase de apertura (dispara transición)
    panel.classList.remove('is-open');

    onTransitionEndOnce(panel, () => {
      panel.hidden = true; // al final, no antes
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

  // Sincroniza estado inicial con DOM (evita quedar en X al recargar/hash)
  function handleInitialState() {
    const { toggle, panel } = getEls();
    if (toggle && panel) {
      setExpanded(toggle, false);
      panel.hidden = true;
      panel.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }

    // Navegación por hash inicial
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
        e.stopPropagation(); // evita que el click caiga en el "outside close"
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

    // Clic en enlaces dentro del panel (solo hashes) -> cerrar en mobile
    if (panel) {
      panel.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        if (isMobile()) closeMobileNavIfOpen();
      });
    }

    // Enlaces hash globales -> usar showSection y pushState
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

    // Back/forward
    window.addEventListener('popstate', () => {
      const id = (location.hash || '#home').slice(1);
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (typeof window.showSection === 'function') {
        window.showSection(id, link || null);
      }
    });

    // Cambio de breakpoint -> forzar cierre limpio
    window.matchMedia(MQ).addEventListener('change', () => {
      closeMobileNavIfOpen();
    });

    // Clic fuera para cerrar (solo si está abierto y en mobile)
    document.addEventListener('click', (e) => {
      if (animating) return; // evita cierres fantasma durante animación
      const { toggle, panel } = getEls();
      if (!toggle || !panel) return;
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (!open || !isMobile()) return;

      const clickedOutside = !panel.contains(e.target) && !toggle.contains(e.target);
      if (clickedOutside) closePanel(panel, toggle);
    });

    // Seguridad extra: si por CSS el panel pierde la transición (p.ej., reduce-motion),
    // resetea el flag de animación en el próximo frame tras abrir/cerrar.
    document.addEventListener('preloader:hidden', () => { animating = false; }, { once: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    decorateShowSectionToCloseMenu();
    handleInitialState();
    initEventListeners();
  });
})();
