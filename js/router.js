// --- SPA Router + sección activa + gradiente footer ---
function showSection(sectionId, linkElement) {
  // Oculta todas
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Muestra objetivo
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  // Marca link activo (navbar/footer)
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  if (linkElement) linkElement.classList.add('active');

  // Actualiza el atributo para el gradiente del footer
  document.body.setAttribute('data-page', sectionId);
}

// Navega según el hash actual
function handleRoute() {
  const hash = window.location.hash || '#home';
  const id = hash.slice(1);
  const link = document.querySelector(`a[href="${hash}"]`);
  showSection(id, link);
}

// Inicial
window.addEventListener('DOMContentLoaded', handleRoute);
// Soporta back/forward y clicks en cualquier <a href="#...">
window.addEventListener('hashchange', handleRoute);

// (Opcional) Si quieres evitar el scroll brusco del navegador:
// document.addEventListener('click', (e) => {
//   const a = e.target.closest('a[href^="#"]');
//   if (!a) return;
//   e.preventDefault();
//   const id = a.getAttribute('href').slice(1);
//   history.pushState(null, '', `#${id}`);
//   handleRoute();
// });
