// Logo evolution system
class LogoSystem {
    constructor() {
        this.startDate = new Date('2025-01-01');
        this.logos = {
            1: {
                src: 'assets/img/logo.jpeg',
                title: 'Logo: Comienzo',
                description: 'Este logo representa el comienzo de tu nueva etapa de aprendizaje, simbolizando el nacimiento de tu viaje hacia el conocimiento.'
            },
            3: {
                src: 'assets/gif/logo2.gif',
                title: 'Logo: Resiliencia Cristalina',
                description: 'Este logo simboliza tu capacidad para adaptarte y recomponerte, representando la evolución constante de tu conocimiento.'
            },
            10: {
                src: 'assets/gif/logo3.gif',
                title: 'Logo: Llama del Conocimiento',
                description: 'Esta llama azul en tus manos simboliza la chispa de tu curiosidad y el poder del conocimiento que posees.'
            },
            30: {
                src: 'assets/gif/logo4.gif',
                title: 'Logo: Cielo Infinito',
                description: 'Este cielo en movimiento representa la vastedad de tu conocimiento y tu capacidad de elevarte y expandirte sin límites.'
            },
            100: {
                src: 'assets/gif/logo5.gif',
                title: 'Logo: Exploración Galáctica',
                description: 'Este logo simboliza tu exploración constante y tu búsqueda de nuevos horizontes en el aprendizaje.'
            },
            200: {
                src: 'assets/gif/logo6.gif',
                title: 'Logo: Dragón de Sabiduría',
                description: 'Este dragón representa tu sabiduría, tu fuerza y tu dominio de grandes conocimientos.'
            }
        };
        this.init();
    }

    init() {
        this.updateAllLogos();
        this.setupLogoClickHandlers();
        this.scheduleNextUpdate();
    }

    getCurrentDay() {
        const now = new Date();
        const diffTime = Math.abs(now - this.startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    }

    getCurrentLogo(day) {
        let currentLogo = this.logos[1]; // Default logo
        
        // Find the appropriate logo based on day
        const logoKeys = Object.keys(this.logos).map(Number).sort((a, b) => b - a);
        
        for (const threshold of logoKeys) {
            if (day >= threshold) {
                currentLogo = this.logos[threshold];
                break;
            }
        }

        return { ...currentLogo, day };
    }

    updateAllLogos() {
        const currentDay = this.getCurrentDay();
        const logoData = this.getCurrentLogo(currentDay);
        
        // Update all logo elements on the page
        const logoElements = document.querySelectorAll('.logo, .footer-logo');
        
        logoElements.forEach(logo => {
            logo.src = logoData.src;
            logo.dataset.logoInfo = JSON.stringify(logoData);
            
            // Add loading error handler
            logo.onerror = () => {
                logo.src = 'assets/img/logo.jpeg'; // Fallback to default logo
            };
        });

        // Store current logo data
        this.currentLogoData = logoData;
    }

    setupLogoClickHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logo') || e.target.classList.contains('footer-logo')) {
                this.showLogoModal(e.target);
            }
        });
    }

    showLogoModal(logoElement) {
        const logoData = JSON.parse(logoElement.dataset.logoInfo || '{}');
        
        if (!logoData.title) return;

        const modal = this.createLogoModal(logoData);
        document.body.appendChild(modal);

        // Animate modal in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.logo-modal-content').style.transform = 'scale(1)';
        });

        // Setup close handlers
        this.setupModalCloseHandlers(modal);
    }

    createLogoModal(logoData) {
        const modal = document.createElement('div');
        modal.className = 'logo-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div class="logo-modal-content" style="
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 100%;
                text-align: center;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            ">
                <button class="logo-modal-close" style="
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
                    ×
                </button>
                
                <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 20px;">
                    <img src="${logoData.src}" alt="Logo" style="
                        width: 150px;
                        height: 150px;
                        border-radius: 20px;
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                        object-fit: cover;
                    ">
                    <div style="text-align: left; flex: 1;">
                        <h2 style="
                            color: var(--primary-color);
                            margin-bottom: 10px;
                            font-size: 24px;
                            font-weight: 700;
                        ">${logoData.title}</h2>
                        <div style="
                            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                            color: white;
                            padding: 8px 16px;
                            border-radius: 20px;
                            display: inline-block;
                            font-weight: 600;
                            margin-bottom: 15px;
                        ">
                            Día ${logoData.day}
                        </div>
                    </div>
                </div>
                
                <p style="
                    color: #666;
                    line-height: 1.6;
                    font-size: 16px;
                    margin-bottom: 25px;
                ">${logoData.description}</p>
                
                <div style="
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 20px;
                    border-radius: 15px;
                    border-left: 4px solid var(--primary-color);
                ">
                    <h3 style="color: var(--primary-color); margin-bottom: 10px; font-size: 18px;">
                        🎉 ¡Felicitaciones por tu progreso!
                    </h3>
                    <p style="color: #666; margin: 0; font-size: 14px;">
                        Cada día que pasas aprendiendo con Wawita es un paso más hacia tus objetivos. 
                        ¡Sigue así y alcanza nuevos niveles de conocimiento!
                    </p>
                </div>
            </div>
        `;

        return modal;
    }

    setupModalCloseHandlers(modal) {
        const closeBtn = modal.querySelector('.logo-modal-close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.logo-modal-content').style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    scheduleNextUpdate() {
        // Update logos at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.updateAllLogos();
            // Schedule daily updates
            setInterval(() => {
                this.updateAllLogos();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);
    }

    // Method to manually trigger logo evolution (for testing)
    simulateDay(day) {
        const logoData = this.getCurrentLogo(day);
        const logoElements = document.querySelectorAll('.logo, .footer-logo');
        
        logoElements.forEach(logo => {
            logo.src = logoData.src;
            logo.dataset.logoInfo = JSON.stringify(logoData);
        });

        // Show notification
        if (window.wawitaApp) {
            window.wawitaApp.showNotification(
                `¡Logo actualizado! Ahora tienes: ${logoData.title}`,
                'success'
            );
        }
    }

    // Get next milestone information
    getNextMilestone(currentDay) {
        const logoKeys = Object.keys(this.logos).map(Number).sort((a, b) => a - b);
        
        for (const threshold of logoKeys) {
            if (currentDay < threshold) {
                return {
                    day: threshold,
                    daysRemaining: threshold - currentDay,
                    logo: this.logos[threshold]
                };
            }
        }
        
        return null; // No more milestones
    }
}

// Initialize logo system
document.addEventListener('DOMContentLoaded', () => {
    window.logoSystem = new LogoSystem();
});

// Add responsive styles for logo modal
const logoModalStyle = document.createElement('style');
logoModalStyle.textContent = `
    @media (max-width: 768px) {
        .logo-modal-content {
            margin: 20px !important;
            padding: 30px 20px !important;
        }
        
        .logo-modal-content > div:first-of-type {
            flex-direction: column !important;
            text-align: center !important;
            gap: 20px !important;
        }
        
        .logo-modal-content img {
            width: 120px !important;
            height: 120px !important;
        }
        
        .logo-modal-content h2 {
            font-size: 20px !important;
        }
        
        .logo-modal-content p {
            font-size: 14px !important;
        }
    }
    
    @media (max-width: 480px) {
        .logo-modal {
            padding: 10px !important;
        }
        
        .logo-modal-content {
            padding: 20px 15px !important;
        }
        
        .logo-modal-content img {
            width: 100px !important;
            height: 100px !important;
        }
    }
`;
document.head.appendChild(logoModalStyle);