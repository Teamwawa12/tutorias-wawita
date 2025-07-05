// Main JavaScript functionality
class WawitaApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupFormValidation();
        this.setupLogoSystem();
        this.setupNotifications();
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Scroll effects
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Header background opacity
            if (currentScrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }

            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Animations and interactions
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .stat-item, .about-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Counter animation for stats
        this.animateCounters();

        // Hover effects for cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Counter animation
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const suffix = counter.textContent.includes('+') ? '+' : 
                              counter.textContent.includes('%') ? '%' : '';
                counter.textContent = Math.floor(current) + suffix;
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // Form validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo es obligatorio';
            isValid = false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Ingresa un email válido';
                isValid = false;
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Ingresa un teléfono válido';
                isValid = false;
            }
        }

        // Password validation
        if (type === 'password' && value) {
            if (value.length < 6) {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                isValid = false;
            }
        }

        // Show error if validation failed
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-color)';
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Logo system
    setupLogoSystem() {
        const logo = document.getElementById('dynamicLogo');
        if (!logo) return;

        const startDate = new Date('2025-01-01');
        const currentDate = new Date();
        const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        this.updateLogo(logo, daysDiff);

        // Logo click handler
        logo.addEventListener('click', () => {
            this.showLogoInfo(daysDiff);
        });
    }

    updateLogo(logo, day) {
        let logoSrc = 'assets/img/logo.jpeg';
        let logoInfo = {
            title: 'Logo: Comienzo',
            description: 'Este logo representa el comienzo de tu nueva etapa de aprendizaje.'
        };

        if (day >= 3 && day <= 9) {
            logoSrc = 'assets/gif/logo2.gif';
            logoInfo = {
                title: 'Logo: Resiliencia Cristalina',
                description: 'Este logo simboliza tu capacidad para adaptarte y recomponerte.'
            };
        } else if (day >= 10 && day <= 29) {
            logoSrc = 'assets/gif/logo3.gif';
            logoInfo = {
                title: 'Logo: Llama del Conocimiento',
                description: 'Esta llama azul simboliza la chispa de tu curiosidad.'
            };
        } else if (day >= 30 && day <= 99) {
            logoSrc = 'assets/gif/logo4.gif';
            logoInfo = {
                title: 'Logo: Cielo Infinito',
                description: 'Este cielo representa la vastedad de tu conocimiento.'
            };
        } else if (day >= 100 && day <= 199) {
            logoSrc = 'assets/gif/logo5.gif';
            logoInfo = {
                title: 'Logo: Exploración Galáctica',
                description: 'Este logo simboliza tu exploración constante del aprendizaje.'
            };
        } else if (day >= 200) {
            logoSrc = 'assets/gif/logo6.gif';
            logoInfo = {
                title: 'Logo: Dragón de Sabiduría',
                description: 'Este dragón representa tu sabiduría y dominio del conocimiento.'
            };
        }

        logo.src = logoSrc;
        logo.dataset.info = JSON.stringify({ ...logoInfo, day });
    }

    showLogoInfo(day) {
        const logo = document.getElementById('dynamicLogo');
        const info = JSON.parse(logo.dataset.info || '{}');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">${info.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${logo.src}" alt="Logo" style="width: 120px; height: 120px; border-radius: 12px;">
                        <div>
                            <p><strong>Día:</strong> ${info.day}</p>
                            <p style="margin-top: 10px;">${info.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Notification system
    setupNotifications() {
        this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wawitaApp = new WawitaApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .nav-toggle.active .bar:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active .bar:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);