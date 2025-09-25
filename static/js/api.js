// This file handles all backend communication with Django REST API

const BASE_URL = window.location.origin;
const API_BASE_URL = `${BASE_URL}/api`;

export async function initializeApi() {
    console.log("API Initialized with Django backend");
    try {
        // Test the connection by fetching patients
        const response = await fetch(`${API_BASE_URL}/patients/`);
        if (response.ok) {
            console.log("Successfully connected to Django backend");
            return true;
        } else {
            console.error("Failed to connect to Django backend");
            return false;
        }
    } catch (error) {
        console.error("Error connecting to Django backend:", error);
        return false;
    }
}

export async function fetchData(collectionName) {
    try {
        console.log(`Fetching data for ${collectionName}`);
        const endpoint = getEndpointForCollection(collectionName);
        const response = await fetch(`${API_BASE_URL}/${endpoint}/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.results ? data.results.length : data.length} items for ${collectionName}`);
        
        // Handle paginated responses
        return data.results || data;
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
}

export async function addDocument(collectionName, data) {
    try {
        console.log(`Adding document to ${collectionName}:`, data);
        const endpoint = getEndpointForCollection(collectionName);
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        console.log(`Successfully added document to ${collectionName}:`, result);
        return result;
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
}

export async function updateDocument(collectionName, docId, data) {
    try {
        console.log(`Updating document ${docId} in ${collectionName}:`, data);
        const endpoint = getEndpointForCollection(collectionName);
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${docId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        console.log(`Successfully updated document in ${collectionName}:`, result);
        return result;
    } catch (error) {
        console.error(`Error updating document in ${collectionName}:`, error);
        throw error;
    }
}

export async function deleteDocument(collectionName, docId) {
    try {
        console.log(`Deleting document ${docId} from ${collectionName}`);
        const endpoint = getEndpointForCollection(collectionName);
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${docId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log(`Successfully deleted document ${docId} from ${collectionName}`);
        return true;
    } catch (error) {
        console.error(`Error deleting document from ${collectionName}:`, error);
        throw error;
    }
}

export async function getAIResponse(chatHistory) {
    console.log("Getting AI response (mock - AI integration needed)");
    const userMessage = chatHistory[chatHistory.length - 1].parts[0].text;
    const mockResponse = `This is a mock response to your message: "${userMessage}". The AI integration with Gemini or OpenAI can be added later.`;
    return { role: 'model', parts: [{ text: mockResponse }] };
}

// Special API endpoints
export async function getTodaysAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/todays_appointments/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        return [];
    }
}

export async function getActivePatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/active_patients/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching active patients:", error);
        return [];
    }
}

export async function getActivePlans() {
    try {
        const response = await fetch(`${API_BASE_URL}/treatment-plans/active_plans/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching active plans:", error);
        return [];
    }
}

export async function getUnreadNotifications() {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/unread_notifications/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        return [];
    }
}

// Helper functions
function getEndpointForCollection(collectionName) {
    const endpoints = {
        'patients': 'patients',
        'practitioners': 'practitioners',
        'plans': 'treatment-plans',
        'appointments': 'appointments',
        'notifications': 'notifications',
        'feedback': 'feedback'
    };
    return endpoints[collectionName] || collectionName;
}

function getCSRFToken() {
    // Get CSRF token from cookie or meta tag
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value 
        || document.querySelector('meta[name=csrf-token]')?.getAttribute('content')
        || getCookie('csrftoken');
    return csrfToken;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}