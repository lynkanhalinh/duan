// Registration system
document.addEventListener('DOMContentLoaded', function() {
    // Handle register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Handle social registration buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', handleSocialRegister);
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleSocialRegister);
    }

    // Real-time password confirmation validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordMatch);
    }
});

function handleRegister(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const userType = document.getElementById('userType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate input
    if (!validateRegistrationForm(fullName, email, password, confirmPassword, agreeTerms)) {
        return;
    }
    
    // Check if email already exists (simulate checking against existing users)
    if (isEmailAlreadyRegistered(email)) {
        showMessage('Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.', 'error');
        return;
    }
    
    // Create new user data
    const newUser = {
        fullName: fullName,
        email: email,
        password: password, // In real app, this should be hashed
        userType: userType,
        registrationDate: new Date().toISOString(),
        isActive: true
    };
    
    // Save user to localStorage (simulate database)
    saveNewUser(newUser);
    
    // Show success message
    const userTypeText = userType === 'instructor' ? 'giảng viên' : 'học viên';
    showMessage(`Đăng ký ${userTypeText} thành công! Đang chuyển hướng đến trang đăng nhập...`, 'success');
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function validateRegistrationForm(fullName, email, password, confirmPassword, agreeTerms) {
    // Check if all fields are filled
    if (!fullName || !email || !password || !confirmPassword) {
        showMessage('Vui lòng điền đầy đủ tất cả các trường!', 'error');
        return false;
    }
    
    // Validate full name (at least 2 words)
    if (fullName.split(' ').length < 2) {
        showMessage('Vui lòng nhập họ và tên đầy đủ!', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Vui lòng nhập địa chỉ email hợp lệ!', 'error');
        return false;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showMessage('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return false;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showMessage('Mật khẩu xác nhận không khớp!', 'error');
        return false;
    }
    
    // Check terms agreement
    if (!agreeTerms) {
        showMessage('Vui lòng đồng ý với điều khoản dịch vụ và chính sách bảo mật!', 'error');
        return false;
    }
    
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = '#f44336';
        confirmPasswordInput.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
    } else if (confirmPassword) {
        confirmPasswordInput.style.borderColor = '#4CAF50';
        confirmPasswordInput.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
    } else {
        confirmPasswordInput.style.borderColor = '#e0e0e0';
        confirmPasswordInput.style.boxShadow = 'none';
    }
}

function isEmailAlreadyRegistered(email) {
    // Check against hardcoded user from auth.js
    if (email === 'nguyenvana@gmail.com') {
        return true;
    }
    
    // Check against registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers.some(user => user.email === email);
}

function saveNewUser(user) {
    // Get existing users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Add new user
    registeredUsers.push(user);
    
    // Save back to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    console.log('New user registered:', user);
}

function handleSocialRegister(e) {
    e.preventDefault();
    
    const platform = e.currentTarget.textContent.trim();
    showMessage(`Đăng ký bằng ${platform} sẽ được triển khai trong phiên bản tiếp theo.`, 'info');
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
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else if (type === 'info') {
        messageDiv.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    messageDiv.textContent = message;
    
    // Add animation styles if not already added
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
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
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Utility function to get all registered users
function getAllRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
}

// Export functions for use in other scripts
window.registerSystem = {
    getAllRegisteredUsers,
    isEmailAlreadyRegistered,
    saveNewUser
};
