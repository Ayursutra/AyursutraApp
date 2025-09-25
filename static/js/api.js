// static/js/enhanced-api.js

const BASE_URL = window.location.origin;
const API_BASE_URL = `${BASE_URL}/api`;

class APIClient {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log("Initializing API client...");
            
            // Check if user is authenticated
            if (!this.token) {
                console.log("No auth token found");
                return false;
            }

            // Verify token is valid
            const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
                headers: this.getHeaders()
            });

            if (response.ok) {
                const userData = await response.json();
                window.USER_DATA = { ...window.USER_DATA, ...userData };
                this.isInitialized = true;
                console.log("API client initialized successfully");
                return true;
            } else {
                console.log("Token verification failed");
                this.logout();
                return false;
            }
        } catch (error) {
            console.error("API initialization error:", error);
            return false;
        }
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Add CSRF token
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        // Add auth token
        if (includeAuth && this.token) {
            headers['Authorization'] = `Token ${this.token}`;
        }

        return headers;
    }

    getCSRFToken() {
        const tokenMeta = document.querySelector('meta[name=csrf-token]');
        if (tokenMeta) {
            return tokenMeta.getAttribute('content');
        }
        
        // Try to get from cookie
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    async fetchData(endpoint, options = {}) {
        try {
            const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            if (response.status === 401) {
                console.log("Authentication failed, logging out");
                this.logout();
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`API response for ${endpoint}:`, data);
            
            // Handle paginated responses
            return data.results || data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async getData(collectionName, additionalParams = '') {
        const endpoint = this.getEndpointForCollection(collectionName);
        return this.fetchData(`${endpoint}/${additionalParams}`);
    }

    async addDocument(collectionName, data) {
        const endpoint = this.getEndpointForCollection(collectionName);
        return this.fetchData(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateDocument(collectionName, docId, data) {
        const endpoint = this.getEndpointForCollection(collectionName);
        return this.fetchData(`${endpoint}/${docId}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteDocument(collectionName, docId) {
        const endpoint = this.getEndpointForCollection(collectionName);
        await this.fetchData(`${endpoint}/${docId}/`, {
            method: 'DELETE'
        });
        return true;
    }

    async getDashboardStats() {
        return this.fetchData('dashboard-stats/');
    }

    async getTodaysAppointments() {
        return this.fetchData('appointments/todays_appointments/');
    }

    async getActivePatients() {
        return this.fetchData('patients/active_patients/');
    }

    async getActivePlans() {
        return this.fetchData('treatment-plans/active_plans/');
    }

    async getUnreadNotifications() {
        return this.fetchData('notifications/unread_notifications/');
    }

    async sendChatMessage(message, chatHistory = []) {
        return this.fetchData('chatbot/', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                chat_history: chatHistory
            })
        });
    }

    async markNotificationAsRead(notificationId) {
        return this.updateDocument('notifications', notificationId, { status: 'read' });
    }

    async changePassword(currentPassword, newPassword) {
        return this.fetchData('auth/change-password/', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
    }

    getEndpointForCollection(collectionName) {
        const endpoints = {
            'patients': 'patients',
            'practitioners': 'practitioners',
            'plans': 'treatment-plans',
            'appointments': 'appointments',
            'notifications': 'notifications',
            'feedback': 'feedback',
            'users': 'auth/users' // For admin user management
        };
        return endpoints[collectionName] || collectionName;
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.token = null;
        window.location.href = '/login/';
    }
}

// AI Chatbot functionality
class ChatBot {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.chatHistory = [];
        this.isLoading = false;
        this.initializeChat();
    }

    initializeChat() {
        const chatToggle = document.getElementById('chat-toggle-btn');
        const chatWindow = document.getElementById('chat-window-widget');
        const chatClose = document.getElementById('close-chat-btn');
        const chatForm = document.getElementById('ai-chat-form-widget');
        const chatInput = document.getElementById('ai-chat-input-widget');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message && !this.isLoading) {
                    this.sendMessage(message);
                    chatInput.value = '';
                }
            });
        }

        // Auto-focus chat input when window opens
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const chatWindow = mutation.target;
                    if (!chatWindow.classList.contains('hidden')) {
                        setTimeout(() => {
                            const input = chatWindow.querySelector('#ai-chat-input-widget');
                            if (input) input.focus();
                        }, 100);
                    }
                }
            });
        });

        if (chatWindow) {
            observer.observe(chatWindow, { attributes: true });
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window-widget');
        if (chatWindow) {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                this.scrollToBottom();
            }
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window-widget');
        if (chatWindow) {
            chatWindow.classList.add('hidden');
        }
    }

    async sendMessage(message) {
        if (this.isLoading) return;

        this.isLoading = true;
        this.addMessageToUI(message, 'user');
        this.showTypingIndicator();

        try {
            const response = await this.apiClient.sendChatMessage(message, this.chatHistory);
            
            // Add to chat history
            this.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response.response }
            );

            // Keep only last 10 exchanges
            if (this.chatHistory.length > 20) {
                this.chatHistory = this.chatHistory.slice(-20);
            }

            this.hideTypingIndicator();
            this.addMessageToUI(response.response, 'assistant');
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessageToUI(
                'Sorry, I encountered an error. Please try again or contact support if the problem persists.', 
                'assistant', 
                true
            );
        } finally {
            this.isLoading = false;
        }
    }

    addMessageToUI(message, sender, isError = false) {
        const messagesContainer = document.getElementById('chat-messages-widget');
        if (!messagesContainer) return;

        // Remove welcome message if it exists
        const welcomeMsg = messagesContainer.querySelector('.text-center');
        if (welcomeMsg && messagesContainer.children.length === 1) {
            welcomeMsg.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;

        const bubble = document.createElement('div');
        bubble.className = `inline-block p-3 rounded-2xl max-w-xs break-words text-sm ${
            sender === 'user' 
                ? 'bg-brand-green text-white rounded-br-sm' 
                : isError 
                    ? 'bg-red-100 text-red-800 rounded-bl-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`;

        // Format message with basic markdown support
        bubble.innerHTML = this.formatMessage(message);

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        // Basic markdown formatting
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🌿|📅|💊|🧘|🍽️|📱/g, '<span class="text-lg">        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message && !this.isLoading) {
                    this.sendMessage(message);
                    chatInput.value = '';
                }
            });</span>');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages-widget');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'mb-4 text-left';
        
        const bubble = document.createElement('div');
        bubble.className = 'inline-block p-3 rounded-2xl rounded-bl-sm bg-gray-100 text-gray-600';
        bubble.innerHTML = `
            <div class="flex items-center space-x-1">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                </div>
                <span class="text-xs ml-2">AI is typing...</span>
            </div>
        `;

        typingDiv.appendChild(bubble);
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages-widget');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    // Add helpful quick actions
    addQuickActions() {
        const messagesContainer = document.getElementById('chat-messages-widget');
        if (!messagesContainer || messagesContainer.querySelector('.quick-actions')) return;

        const quickActionsDiv = document.createElement('div');
        quickActionsDiv.className = 'quick-actions mb-4 text-center';
        quickActionsDiv.innerHTML = `
            <div class="text-xs text-gray-500 mb-2">Quick questions:</div>
            <div class="flex flex-wrap gap-2 justify-center">
                <button class="quick-action-btn text-xs px-3 py-1 bg-brand-green-light text-brand-green rounded-full hover:bg-brand-green hover:text-white transition-colors" data-message="What is Panchakarma?">
                    What is Panchakarma?
                </button>
                <button class="quick-action-btn text-xs px-3 py-1 bg-brand-green-light text-brand-green rounded-full hover:bg-brand-green hover:text-white transition-colors" data-message="Help with appointments">
                    Book appointment
                </button>
                <button class="quick-action-btn text-xs px-3 py-1 bg-brand-green-light text-brand-green rounded-full hover:bg-brand-green hover:text-white transition-colors" data-message="Dietary guidelines">
                    Diet advice
                </button>
            </div>
        `;

        // Add click handlers for quick actions
        quickActionsDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const message = e.target.dataset.message;
                if (message && !this.isLoading) {
                    this.sendMessage(message);
                    quickActionsDiv.remove(); // Remove quick actions after use
                }
            }
        });

        messagesContainer.appendChild(quickActionsDiv);
    }
}

// Notification system
class NotificationManager {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.unreadCount = 0;
        this.init();
    }

    async init() {
        await this.updateNotificationBadge();
        // Update every 30 seconds
        setInterval(() => this.updateNotificationBadge(), 30000);
    }

    async updateNotificationBadge() {
        try {
            const unreadNotifications = await this.apiClient.getUnreadNotifications();
            this.unreadCount = unreadNotifications.length;
            
            const badge = document.getElementById('notification-badge');
            if (badge) {
                if (this.unreadCount > 0) {
                    badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Error updating notification badge:', error);
        }
    }

    showToast(message, type = 'success', duration = 4000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-y-2 opacity-0 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;

        const icon = type === 'success' ? 
            '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
            type === 'error' ?
            '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>' :
            '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

        toast.innerHTML = `${icon}<span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        }, 100);

        // Remove toast after duration
        setTimeout(() => {
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Export instances
window.apiClient = new APIClient();
window.chatBot = null;
window.notificationManager = null;

// Logout function
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: window.apiClient.getHeaders()
        }).finally(() => {
            window.apiClient.logout();
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await window.apiClient.init();
    
    if (isAuthenticated) {
        window.chatBot = new ChatBot(window.apiClient);
        window.notificationManager = new NotificationManager(window.apiClient);
        console.log('All systems initialized successfully');
    } else {
        console.log('Authentication failed, redirecting to login');
        window.location.href = '/login/';
    }
});