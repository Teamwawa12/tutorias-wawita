// Authentication system
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('wawita_users') || '[]');
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupPasswordToggle();
        this.setupSocialLogin();
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('wawita_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
    }

    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(registerForm);
            });
        }
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('#togglePassword, #toggleConfirmPassword');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    setupSocialLogin() {
        // Google login
        const googleBtn = document.querySelector('[data-provider="google"]');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }

        // Facebook login
        const facebookBtn = document.querySelector('[data-provider="facebook"]');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialLogin('facebook');
            });
        }

        // Microsoft login
        const microsoftBtn = document.querySelector('[data-provider="microsoft"]');
        if (microsoftBtn) {
            microsoftBtn.addEventListener('click', () => {
                this.handleSocialLogin('microsoft');
            });
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Find user
            const user = this.users.find(u => u.email === email);
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (user.password !== password) {
                throw new Error('Contraseña incorrecta');
            }

            // Login successful
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'student',
                avatar: user.avatar || null,
                loginTime: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('wawita_current_user', JSON.stringify(this.currentUser));

            // Show success message
            this.showNotification('¡Bienvenido de vuelta!', 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const role = formData.get('role') || 'student';

        // Validate passwords match
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if user already exists
            if (this.users.find(u => u.email === email)) {
                throw new Error('Ya existe una cuenta con este email');
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString(),
                avatar: null
            };

            this.users.push(newUser);
            localStorage.setItem('wawita_users', JSON.stringify(this.users));

            // Auto login
            this.currentUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('wawita_current_user', JSON.stringify(this.currentUser));

            // Show success message
            this.showNotification('¡Cuenta creada exitosamente!', 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSocialLogin(provider) {
        // Show loading notification
        this.showNotification(`Conectando con ${provider}...`, 'info');

        try {
            // Simulate OAuth flow
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create mock user data
            const mockUsers = {
                google: {
                    name: 'Usuario Google',
                    email: 'usuario@gmail.com',
                    avatar: 'https://via.placeholder.com/100'
                },
                facebook: {
                    name: 'Usuario Facebook',
                    email: 'usuario@facebook.com',
                    avatar: 'https://via.placeholder.com/100'
                },
                microsoft: {
                    name: 'Usuario Microsoft',
                    email: 'usuario@outlook.com',
                    avatar: 'https://via.placeholder.com/100'
                }
            };

            const userData = mockUsers[provider];
            
            // Check if user exists
            let user = this.users.find(u => u.email === userData.email);
            
            if (!user) {
                // Create new user
                user = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    password: null, // Social login users don't have passwords
                    role: 'student',
                    provider: provider,
                    avatar: userData.avatar,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(user);
                localStorage.setItem('wawita_users', JSON.stringify(this.users));
            }

            // Login user
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                provider: provider,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('wawita_current_user', JSON.stringify(this.currentUser));

            this.showNotification(`¡Conectado con ${provider} exitosamente!`, 'success');

            // Redirect
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);

        } catch (error) {
            this.showNotification(`Error al conectar con ${provider}`, 'error');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('wawita_current_user');
        this.showNotification('Sesión cerrada exitosamente', 'success');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

    updateUIForLoggedInUser() {
        // Update navigation
        const loginLinks = document.querySelectorAll('.btn-login');
        loginLinks.forEach(link => {
            link.innerHTML = `
                <i class="fas fa-user"></i>
                ${this.currentUser.name}
            `;
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUserMenu(e.target);
            });
        });
    }

    showUserMenu(element) {
        // Create user menu dropdown
        const existingMenu = document.querySelector('.user-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            padding: 10px 0;
            min-width: 200px;
            z-index: 1000;
            border: 1px solid var(--gray-200);
        `;

        menu.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid var(--gray-200);">
                <div style="font-weight: 600; color: var(--gray-900);">${this.currentUser.name}</div>
                <div style="font-size: 14px; color: var(--gray-600);">${this.currentUser.email}</div>
            </div>
            <a href="#" class="menu-item" data-action="profile">
                <i class="fas fa-user"></i> Mi Perfil
            </a>
            <a href="#" class="menu-item" data-action="courses">
                <i class="fas fa-book"></i> Mis Cursos
            </a>
            <a href="#" class="menu-item" data-action="settings">
                <i class="fas fa-cog"></i> Configuración
            </a>
            <hr style="margin: 10px 0; border: none; border-top: 1px solid var(--gray-200);">
            <a href="#" class="menu-item" data-action="logout">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a>
        `;

        // Position menu
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(menu);

        // Add menu item styles
        const style = document.createElement('style');
        style.textContent = `
            .menu-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                color: var(--gray-700);
                text-decoration: none;
                transition: background-color 0.2s;
            }
            .menu-item:hover {
                background-color: var(--gray-50);
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);

        // Handle menu actions
        menu.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.target.closest('.menu-item')?.dataset.action;
            
            switch (action) {
                case 'logout':
                    this.logout();
                    break;
                case 'profile':
                    this.showNotification('Función de perfil próximamente', 'info');
                    break;
                case 'courses':
                    window.location.href = 'galeria.html';
                    break;
                case 'settings':
                    this.showNotification('Función de configuración próximamente', 'info');
                    break;
            }
            
            menu.remove();
        });

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !element.contains(e.target)) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);
    }

    showNotification(message, type = 'info') {
        if (window.wawitaApp) {
            window.wawitaApp.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Utility methods
    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});