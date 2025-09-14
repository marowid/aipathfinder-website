/* navbar-logic.js */
(function () {
  const SELECTORS = {
    toggle: '.nav-toggle',
    panelId: 'primary-menu',
    navLinks: '.nav-link',
  };

  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  function getEls() {
    return {
      toggle: document.querySelector(SELECTORS.toggle),
      panel: document.getElementById(SELECTORS.panelId),
    };
  }

  function setExpanded(el, expanded) {
    el.setAttribute('aria-expanded', String(expanded));
  }

  function openPanel(panel, toggle) {
    if (!panel || !toggle) return;
    setExpanded(toggle, true);
    panel.hidden = false;
  }

  function closePanel(panel, toggle) {
    if (!panel || !toggle) return;
    setExpanded(toggle, false);
    panel.hidden = true;
  }

  function togglePanel() {
    const { toggle, panel } = getEls();
    if (!toggle || !panel) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closePanel(panel, toggle) : openPanel(panel, toggle);
  }

  function closeMobileNavIfOpen() {
    const { toggle, panel } = getEls();
    if (!toggle || !panel) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closePanel(panel, toggle);
  }

  function decorateShowSectionToCloseMenu() {
    // Si existe showSection, lo envolvemos para cerrar menú en mobile tras cambiar de sección
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
      // Siempre inicia colapsado en mobile
      if (isMobile()) {
        closePanel(panel, toggle);
      } else {
        // En desktop, el contenedor suele comportarse con display: contents; igualmente lo dejamos cerrado por consistencia
        closePanel(panel, toggle);
      }
    }

    // Si hay hash al cargar, navega a esa sección usando showSection (si existe)
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

    // Toggle hamburguesa
    if (toggle) {
      toggle.addEventListener('click', togglePanel);
    }

    // Cerrar con ESC en mobile
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMobile()) {
        closeMobileNavIfOpen();
      }
    });

    // Cerrar al hacer click en cualquier link dentro del panel (mobile)
    if (panel) {
      panel.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        if (isMobile()) closeMobileNavIfOpen();
      });
    }

    // Interceptar anchors SPA (si tu otro script ya previene default, no pasa nada)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        // Dejamos que tu otro script haga preventDefault si quiere
        const id = this.getAttribute('href').slice(1);
        if (typeof window.showSection === 'function') {
          // Evita salto brusco y usa tu navegación SPA
          e.preventDefault();
          window.showSection(id, this);
          // Opcional: mantener URL actualizada
          history.pushState(null, '', `#${id}`);
        }
      });
    });

    // Soporta back/forward del navegador
    window.addEventListener('popstate', () => {
      const id = (location.hash || '#home').slice(1);
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (typeof window.showSection === 'function') {
        window.showSection(id, link || null);
      }
    });

    // Reacciona a cambios de viewport: si vuelves a mobile, asegúrate de tener el panel colapsado
    window.matchMedia('(max-width: 767px)').addEventListener('change', () => {
      closeMobileNavIfOpen();
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    decorateShowSectionToCloseMenu();
    handleInitialState();
    initEventListeners();
  });
})();
