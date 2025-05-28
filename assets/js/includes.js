/**
 * Include HTML files functionality
 * This script loads header, mobile menu, and cart sidebar components
 */

// Function to load HTML content
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
        });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    loadHTML('header-placeholder', 'includes/header.html');
    
    // Load mobile menu
    loadHTML('mobile-menu-placeholder', 'includes/mobile-menu.html');
    
    // Load cart sidebar
    loadHTML('cart-sidebar-placeholder', 'includes/cart-sidebar.html');
});

// Alternative method using jQuery (if jQuery is available)
if (typeof jQuery !== 'undefined') {
    $(document).ready(function() {
        // Load header
        $('#header-placeholder').load('includes/header.html');
        
        // Load mobile menu
        $('#mobile-menu-placeholder').load('includes/mobile-menu.html');
        
        // Load cart sidebar
        $('#cart-sidebar-placeholder').load('includes/cart-sidebar.html');
    });
}
