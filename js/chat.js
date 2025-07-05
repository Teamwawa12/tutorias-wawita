// Chat functionality
class ChatSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.botResponses = [
            "¡Hola! ¿En qué puedo ayudarte hoy?",
            "Puedo ayudarte con información sobre nuestros cursos.",
            "¿Te interesa conocer más sobre nuestros tutores?",
            "¿Necesitas ayuda con el proceso de inscripción?",
            "Estoy aquí para resolver tus dudas sobre Wawita.",
            "¿Quieres saber más sobre nuestros planes de estudio?",
            "Puedo guiarte en el proceso de registro.",
            "¿Tienes alguna pregunta específica sobre nuestros servicios?"
        ];
        this.init();
    }

    init() {
        this.setupChatButton();
        this.setupChatModal();
        this.setupChatInput();
        this.loadChatHistory();
    }

    setupChatButton() {
        const chatButton = document.getElementById('chatButton');
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                this.toggleChat();
            });
        }
    }

    setupChatModal() {
        const chatModal = document.getElementById('chatModal');
        const closeBtn = document.getElementById('closeChatBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChat();
            });
        }

        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) {
                    this.closeChat();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    setupChatInput() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Auto-resize input
            messageInput.addEventListener('input', () => {
                this.autoResizeInput(messageInput);
            });
        }
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatModal = document.getElementById('chatModal');
        if (chatModal) {
            chatModal.classList.add('active');
            this.isOpen = true;
            
            // Focus on input
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                setTimeout(() => messageInput.focus(), 100);
            }

            // Add welcome message if no messages
            if (this.messages.length === 0) {
                this.addBotMessage("¡Hola! Soy el asistente virtual de Wawita. ¿En qué puedo ayudarte hoy?");
            }
        }
    }

    closeChat() {
        const chatModal = document.getElementById('chatModal');
        if (chatModal) {
            chatModal.classList.remove('active');
            this.isOpen = false;
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;

        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addUserMessage(message);
        messageInput.value = '';

        // Simulate typing indicator
        this.showTypingIndicator();

        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateBotResponse(message);
            this.addBotMessage(response);
        }, 1000 + Math.random() * 2000);
    }

    addUserMessage(message) {
        const messageObj = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messageObj = {
            type: 'bot',
            content: message,
            timestamp: new Date()
        };

        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    renderMessage(messageObj) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageObj.type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = messageObj.content;
        
        messageElement.appendChild(messageContent);
        chatMessages.appendChild(messageElement);
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple keyword-based responses
        if (message.includes('curso') || message.includes('clase')) {
            return "Tenemos una amplia variedad de cursos disponibles. Puedes explorar nuestra galería de cursos para ver todas las opciones disponibles.";
        }
        
        if (message.includes('tutor') || message.includes('profesor')) {
            return "Nuestros tutores son expertos certificados en sus áreas. Puedes ver sus perfiles y especialidades en la sección de tutores.";
        }
        
        if (message.includes('precio') || message.includes('costo') || message.includes('pago')) {
            return "Ofrecemos diferentes planes de estudio adaptados a tus necesidades. Visita nuestra sección de planes para conocer los precios.";
        }
        
        if (message.includes('inscrib') || message.includes('registr')) {
            return "El proceso de inscripción es muy sencillo. Puedes registrarte como estudiante desde nuestra página principal.";
        }
        
        if (message.includes('ayuda') || message.includes('soporte')) {
            return "Estoy aquí para ayudarte. También puedes contactar a nuestro equipo de soporte o reportar cualquier problema.";
        }
        
        if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
            return "¡Hola! Es un placer ayudarte. ¿Qué te gustaría saber sobre Wawita?";
        }
        
        if (message.includes('gracias')) {
            return "¡De nada! Estoy aquí para ayudarte en lo que necesites. ¿Hay algo más en lo que pueda asistirte?";
        }

        // Default responses
        const randomResponse = this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
        return randomResponse;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    }

    saveChatHistory() {
        try {
            localStorage.setItem('wawita_chat_history', JSON.stringify(this.messages));
        } catch (e) {
            console.warn('Could not save chat history:', e);
        }
    }

    loadChatHistory() {
        try {
            const history = localStorage.getItem('wawita_chat_history');
            if (history) {
                this.messages = JSON.parse(history);
                this.renderChatHistory();
            }
        } catch (e) {
            console.warn('Could not load chat history:', e);
            this.messages = [];
        }
    }

    renderChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Clear existing messages except welcome message
        chatMessages.innerHTML = '';

        // Render all messages
        this.messages.forEach(message => {
            this.renderMessage(message);
        });

        this.scrollToBottom();
    }

    clearChatHistory() {
        this.messages = [];
        localStorage.removeItem('wawita_chat_history');
        
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }

        // Add welcome message
        this.addBotMessage("¡Hola! Soy el asistente virtual de Wawita. ¿En qué puedo ayudarte hoy?");
    }
}

// Initialize chat system
document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new ChatSystem();
});

// Add CSS for typing indicator
const chatStyle = document.createElement('style');
chatStyle.textContent = `
    .typing-indicator .message-content {
        background-color: var(--gray-200) !important;
        padding: 12px 16px !important;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        background-color: var(--gray-500);
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(chatStyle);