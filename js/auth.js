// Authentication system with hardcoded user data
document.addEventListener('DOMContentLoaded', function () {
    // Hardcoded user data
    const VALID_USER = {
        email: 'nguyenvana@gmail.com',
        password: '123456',
        name: 'Nguyễn Văn A'
    };

    // Check if user is already logged in
    checkLoginStatus();

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle logout
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
});

function authenticateUser(email, password) {
    // Check against hardcoded user
    const VALID_USER = {
        email: 'nguyenvana@gmail.com',
        password: '123456',
        name: 'Nguyễn Văn A',
        userType: 'student'
    };

    if (email === VALID_USER.email && password === VALID_USER.password) {
        return VALID_USER;
    }

    // Check against registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = registeredUsers.find(user =>
        user.email === email && user.password === password && user.isActive
    );

    return foundUser || null;
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate input
    if (!email || !password) {
        showMessage('Vui lòng nhập đầy đủ email và mật khẩu!', 'error');
        return;
    }

    // Check credentials against hardcoded user and registered users
    const authenticatedUser = authenticateUser(email, password);

    if (authenticatedUser) {
        // Login successful
        const userData = {
            email: authenticatedUser.email,
            name: authenticatedUser.name || authenticatedUser.fullName,
            userType: authenticatedUser.userType || 'student',
            loginTime: new Date().toISOString()
        };

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');

        // Redirect to appropriate page based on user type
        setTimeout(() => {
            if (userData.userType === 'instructor') {
                window.location.href = 'instructor-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);

    } else {
        // Login failed
        showMessage('Email hoặc mật khẩu không đúng!', 'error');

        // Clear password field
        document.getElementById('password').value = '';
    }
}

function handleLogout(e) {
    e.preventDefault();

    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    showMessage('Đã đăng xuất thành công!', 'success');

    // Update header to show login/register button
    updateHeaderForLoggedOutUser();

    // Redirect to login page if not already there
    if (!window.location.pathname.includes('login.html')) {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');

    if (isLoggedIn === 'true' && userData) {
        const user = JSON.parse(userData);
        updateHeaderForLoggedInUser(user);
    } else {
        updateHeaderForLoggedOutUser();
    }
}

function updateHeaderForLoggedInUser(user) {
    // Wait for header to be loaded
    setTimeout(() => {
        const userMenus = document.querySelectorAll('.rbt-user-wrapper');
        const info = document.getElementById('info');
        info.style.display = 'block';
        userMenus.forEach(userMenu => {
            // Update user name in dropdown
            const nameElement = userMenu.querySelector('.name');
            if (nameElement) {
                nameElement.textContent = user.name;
            }

            // Update user link text for desktop
            const userLink = userMenu.querySelector('a');
            if (userLink && userMenu.classList.contains('d-none')) {
                // This is the desktop version
                userLink.innerHTML = `<i class="feather-user"></i>${user.name}`;
            }

            // Add logout functionality to existing logout links
            const logoutLinks = userMenu.querySelectorAll('a[href="index.html"]');
            logoutLinks.forEach(link => {
                if (link.textContent.includes('Đăng xuất') || link.textContent.includes('Logout')) {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        handleLogout(e);
                    });
                }
            });
        });

        // Update "Đăng ký" button to show user name
        const joinButtons = document.querySelectorAll('#join-btn');
        joinButtons.forEach(button => {
            button.innerHTML = `<span data-text="${user.name}">${user.name}</span>`;
            button.href = '#';
            button.addEventListener('click', function (e) {
                e.preventDefault();
                // Redirect based on user type
                if (user.userType === 'instructor') {
                    window.location.href = 'instructor-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            });
        });

    }, 500); // Wait for components to load
}

function updateHeaderForLoggedOutUser() {
    // Wait for header to be loaded
    setTimeout(() => {
        const userMenus = document.querySelectorAll('.rbt-user-wrapper');

        userMenus.forEach(userMenu => {
            // Update user link text for desktop
            const userLink = userMenu.querySelector('a');
            if (userLink && userMenu.classList.contains('d-none')) {
                // This is the desktop version
                userLink.innerHTML = '<i class="feather-user"></i>Đăng nhập';
                userLink.href = 'login.html';
            }
        });

        // Update "Đăng ký" button
        const joinButtons = document.querySelectorAll('#join-btn');
        joinButtons.forEach(button => {
            button.innerHTML = '<span data-text="Đăng ký">Đăng ký</span>';
            button.href = 'register.html';
        });

    }, 500); // Wait for components to load
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.auth-message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    `;

    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    }

    messageDiv.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(messageDiv);

    // Auto remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

// Utility function to get current user
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Utility function to check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Export functions for use in other scripts
window.authSystem = {
    getCurrentUser,
    isUserLoggedIn,
    handleLogout,
    checkLoginStatus
};
