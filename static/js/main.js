import { renderPage, renderNav, getModalTemplate, showToast } from './ui.js';
import * as api from './api.js';

// --- App State ---
const state = {
    currentPage: 'dashboard',
    patients: [],
    appointments: [],
    plans: [],
    practitioners: [],
    notifications: [],
    feedback: [],
    chatHistory: [],
    isAILoading: false,
};

// --- DOM Elements ---
const navLinksContainer = document.getElementById('nav-links');
const modalContainer = document.getElementById('modal-container');
const chatWindow = document.getElementById('chat-window-widget');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatMessagesContainer = document.getElementById('chat-messages-widget');
const chatForm = document.getElementById('ai-chat-form-widget');
const chatInput = document.getElementById('ai-chat-input-widget');
// --- Navigation ---
function navigate(page) {
    state.currentPage = page;
    window.location.hash = page;
    renderNav(page);
    renderPage(page, state);
}

// --- Modals ---
function showModal(modalName, ...args) {
    modalContainer.innerHTML = getModalTemplate(modalName, state, ...args);
    const form = modalContainer.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function closeModal() {
    modalContainer.innerHTML = '';
}

// --- Event Handlers ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const formId = e.target.id;

    if (formId === 'addPatient-form') {
        const name = document.getElementById('patient-name').value;
        const phone = document.getElementById('patient-phone').value;
        
        // Use the mock API
        await api.addDocument('patients', { name, phone });
        
        // For frontend-only demo, we manually update state
        state.patients.push({ id: Date.now(), name, phone });
        
        showToast('Patient added successfully! (Mock)');
        closeModal();
        renderPage(state.currentPage, state); // Re-render the page to show the new data
    }
    // Add handlers for other forms here...
}

async function handleDelete(collection, id) {
     await api.deleteDocument(collection, id);
     
     // For frontend-only demo, manually update state
     state[collection] = state[collection].filter(item => item.id !== id);
     
     showToast('Item deleted successfully! (Mock)');
     closeModal();
     renderPage(state.currentPage, state);
}

// --- App Initialization ---
async function init() {
    console.log("App Initializing...");

    // Make key functions globally accessible for inline onclick handlers
    window.app = {
        showModal,
        closeModal,
        deleteDocument: (coll, id) => showModal('confirmDelete', coll, id),
        executeDelete: handleDelete
    };

    // Setup navigation
    navLinksContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link && link.dataset.page) {
            e.preventDefault();
            navigate(link.dataset.page);
        }
    });
    
    // Handle initial page load from hash
    const initialPage = window.location.hash.substring(1) || 'dashboard';
    navigate(initialPage);
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add user message to state and UI
    state.chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
    chatMessagesContainer.innerHTML += `<div class="mb-3 p-3 bg-brand-green-light rounded-lg text-right"><b>You:</b> ${userMessage}</div>`;
    chatInput.value = '';
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom

    // Add a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'mb-3 p-3 bg-gray-200 rounded-lg animate-pulse';
    loadingIndicator.textContent = 'Ayur AI is thinking...';
    chatMessagesContainer.appendChild(loadingIndicator);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Get AI response
    const aiResponse = await api.getAIResponse(state.chatHistory);
    state.chatHistory.push(aiResponse);

    // Remove loading indicator and show AI response
    loadingIndicator.remove();
    chatMessagesContainer.innerHTML += `<div class="mb-3 p-3 bg-gray-100 rounded-lg"><b>Ayur AI:</b> ${aiResponse.parts[0].text}</div>`;
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// --- App Initialization ---
async function init() {
    // ... (keep existing init code)

    // Handle initial page load from hash
    const initialPage = window.location.hash.substring(1) || 'dashboard';
    navigate(initialPage);
    
    // Setup chat listeners
    chatToggleBtn.addEventListener('click', () => chatWindow.classList.toggle('hidden'));
    closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
    chatForm.addEventListener('submit', handleChatSubmit);
}

// Start the application
init();