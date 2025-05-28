// Component loader for header, mobile menu, and cart sidebar
document.addEventListener('DOMContentLoaded', function () {
    // Load header component
    loadComponent('includes/header.html', 'header-placeholder');

    // Load mobile menu component
    loadComponent('includes/mobile-menu.html', 'mobile-menu-placeholder');

    // Load cart sidebar component
    loadComponent('includes/cart-sidebar.html', 'cart-sidebar-placeholder');
});

function loadComponent(url, placeholderId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = html;

                // Re-initialize any JavaScript functionality after loading components
                if (placeholderId === 'header-placeholder') {
                    initializeHeaderFunctionality();
                    // Check login status after header is loaded
                    if (typeof window.authSystem !== 'undefined') {
                        window.authSystem.checkLoginStatus();
                    }
                } else if (placeholderId === 'mobile-menu-placeholder') {
                    initializeMobileMenuFunctionality();
                } else if (placeholderId === 'cart-sidebar-placeholder') {
                    initializeCartSidebarFunctionality();
                }
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
            // Fallback: hide the placeholder if component fails to load
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        });
}

function initializeHeaderFunctionality() {
    // Re-initialize header-specific JavaScript functionality
    // This includes dropdown menus, search functionality, etc.

    // Initialize sticky header
    if (typeof initStickyHeader === 'function') {
        initStickyHeader();
    }

    // Initialize search functionality
    if (typeof initSearchField === 'function') {
        initSearchField();
    }

    // Initialize cart sidebar activation
    const cartActivators = document.querySelectorAll('.rbt-cart-sidenav-activation');
    cartActivators.forEach(activator => {
        activator.addEventListener('click', function (e) {
            e.preventDefault();
            const cartSidebar = document.querySelector('.rbt-cart-side-menu');
            if (cartSidebar) {
                cartSidebar.classList.add('active');
            }
        });
    });

    // Initialize user dropdown
    const userDropdowns = document.querySelectorAll('.rbt-user-wrapper');
    userDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        userDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

function initializeMobileMenuFunctionality() {
    // Re-initialize mobile menu JavaScript functionality

    // Initialize mobile menu toggle
    const mobileMenuButtons = document.querySelectorAll('.hamberger-button');
    const mobileMenu = document.querySelector('.popup-mobile-menu');

    mobileMenuButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (mobileMenu) {
                mobileMenu.classList.add('active');
                document.body.classList.add('mobile-menu-active');
            }
        });
    });

    // Initialize mobile menu close
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-active');
            }
        });
    });

    // Close mobile menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('mobile-menu-active');
            }
        });
    }
}

function initializeCartSidebarFunctionality() {
    // Re-initialize cart sidebar JavaScript functionality

    // Initialize cart sidebar close
    const cartCloseButtons = document.querySelectorAll('.minicart-close-button, .close_side_menu');
    const cartSidebar = document.querySelector('.rbt-cart-side-menu');

    cartCloseButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
                document.body.classList.remove('cart-sidebar-active');
            }
        });
    });

    // Initialize item remove functionality
    const removeButtons = document.querySelectorAll('.minicart-item .rbt-round-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const item = this.closest('.minicart-item');
            if (item) {
                item.remove();
                updateCartTotal();
            }
        });
    });
}

function updateCartTotal() {
    // Update cart total when items are removed
    const items = document.querySelectorAll('.minicart-item');
    let total = 0;

    items.forEach(item => {
        const priceElement = item.querySelector('.price');
        if (priceElement) {
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            if (!isNaN(price)) {
                total += price;
            }
        }
    });

    const totalElement = document.querySelector('.rbt-cart-subttotal .price');
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(0);
    }
}
