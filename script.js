function showSection(sectionId, linkElement) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (linkElement) {
        linkElement.classList.add('active');
    }
    
    // Initialize map if contact section is shown
    if (sectionId === 'contact' && !window.mapInitialized) {
        initMap();
        window.mapInitialized = true;
    }
}

function initMap() {
    const map = L.map('map').setView([51.51134955219304, -0.07990677737372326], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    const customIcon = L.divIcon({
        html: '<div style="background: linear-gradient(135deg, #00B4D8, #0077B6); width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        className: 'custom-marker'
    });
    
    L.marker([51.51134955219304, -0.07990677737372326], {icon: customIcon})
        .addTo(map)
        .bindPopup('<strong>AI Pathfinder HQ</strong><br>70 Mark Lane<br>London, EC3R 7NB, UK')
        .openPopup();
}

// Handle initial page load
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash.substring(1); // Remove the '#'
    const initialSection = hash || 'home';
    const initialNavLink = document.querySelector(`a[href="#${initialSection}"], a[href="index.html#${initialSection}"]`);
    showSection(initialSection, initialNavLink);

    // Add event listeners for navigation links
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior
            const sectionId = this.getAttribute('href').split('#')[1];
            showSection(sectionId, this);
            history.pushState(null, '', `#${sectionId}`); // Update URL hash
        });
    });
});

// Ensure initial section is displayed on load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    const initialSection = hash || 'home';
    const initialNavLink = document.querySelector(`a[href="#${initialSection}"], a[href="index.html#${initialSection}"]`);
    showSection(initialSection, initialNavLink);
});

