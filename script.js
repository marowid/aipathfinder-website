function showSection(sectionId, linkElement) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    linkElement.classList.add('active');
    
    // Initialize map if contact section is shown
    if (sectionId === 'contact' && !window.mapInitialized) {
        initMap();
        window.mapInitialized = true;
    }
}

function initMap() {
    const map = L.map('map').setView([51.511646645555196, -0.14734593322649123], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    const customIcon = L.divIcon({
        html: '<div style="background: linear-gradient(135deg, #00B4D8, #0077B6); width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        className: 'custom-marker'
    });
    
    L.marker([51.511646645555196, -0.14734593322649123], {icon: customIcon})
        .addTo(map)
        .bindPopup('<strong>AI Pathfinder HQ</strong><br>123 Technology Street<br>London, WC2N 5DU')
        .openPopup();
}

// Handle initial page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we should show a specific section
    const sectionToShow = sessionStorage.getItem('showSection');
    if (sectionToShow) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));

        // Show the requested section
        const targetSection = document.getElementById(sectionToShow);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        const targetNavLink = document.querySelector(`a[href="#${sectionToShow}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }

        // Clear the session storage
        sessionStorage.removeItem('showSection');
    }

    // Smooth scroll behavior for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });
});