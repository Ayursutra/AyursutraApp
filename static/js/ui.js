// --- UI Components & Templates ---

// This function returns the HTML content for each page.
export const getPageTemplate = (pageName, state) => {
    const templates = {
        dashboard: `
            <div class="p-6 md:p-8">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-brand-green-dark">Welcome to AyurSutra</h1>
                    <p class="text-brand-text-light mt-1">Panchakarma Patient Management Dashboard</p>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-2xl shadow-sm"><p class="text-sm font-medium text-brand-text-light">Active Patients</p><p id="stat-patients" class="text-3xl font-bold text-brand-green-dark mt-1">0</p></div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm"><p class="text-sm font-medium text-brand-text-light">Today's Appointments</p><p id="stat-appointments" class="text-3xl font-bold text-brand-green-dark mt-1">0</p></div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm"><p class="text-sm font-medium text-brand-text-light">Treatment Plans</p><p id="stat-plans" class="text-3xl font-bold text-brand-green-dark mt-1">0</p></div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-brand-green-dark mb-4">Today's Schedule</h3>
                            <div id="dashboard-schedule" class="text-center py-10 border-2 border-dashed border-brand-border rounded-lg"></div>
                        </div>
                    </div>
                    <div class="lg:col-span-1">
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-brand-green-dark mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                <button onclick="window.app.showModal('addPatient')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">New Patient</button>
                                <button onclick="window.app.showModal('addAppointment')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">Schedule Appointment</button>
                                <button onclick="window.app.showModal('addPlan')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">Create Treatment Plan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        patients: `
            <div class="p-6 md:p-8">
                <header class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-brand-green-dark">Patients</h1>
                    <button onclick="window.app.showModal('addPatient')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold">Add Patient</button>
                </header>
                <div class="bg-white p-6 rounded-2xl shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-brand-text-light uppercase bg-brand-bg">
                                <tr>
                                    <th class="px-6 py-3 rounded-l-lg">Name</th><th class="px-6 py-3">Contact</th><th class="px-6 py-3 rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="patients-table-body">
                                ${state.patients.length === 0 ? '<tr><td colspan="3" class="text-center py-8 text-brand-text-light">No patients found.</td></tr>' :
                                state.patients.map(p => `
                                    <tr class="border-b border-brand-border">
                                        <td class="px-6 py-4 font-medium">${p.name}</td>
                                        <td class="px-6 py-4">${p.phone}</td>
                                        <td class="px-6 py-4"><button onclick="window.app.deleteDocument('patients', '${p.id}')" class="text-red-500 hover:text-red-700">Delete</button></td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`,
        schedule: `<div class="p-6 md:p-8"><h1 class="text-3xl font-bold text-brand-green-dark">Schedule</h1><p class="text-center py-20 text-brand-text-light">Schedule page content goes here.</p></div>`,
        plans: `<div class="p-6 md:p-8"><h1 class="text-3xl font-bold text-brand-green-dark">Treatment Plans</h1><p class="text-center py-20 text-brand-text-light">Treatment Plans page content goes here.</p></div>`,
        practitioners: `<div class="p-6 md:p-8"><h1 class="text-3xl font-bold text-brand-green-dark">Practitioners</h1><p class="text-center py-20 text-brand-text-light">Practitioners page content goes here.</p></div>`,
        notifications: `<div class="p-6 md:p-8"><h1 class="text-3xl font-bold text-brand-green-dark">Notifications</h1><p class="text-center py-20 text-brand-text-light">Notifications page content goes here.</p></div>`,
        feedback: `<div class="p-6 md:p-8"><h1 class="text-3xl font-bold text-brand-green-dark">Feedback</h1><p class="text-center py-20 text-brand-text-light">Feedback page content goes here.</p></div>`,
    };
    return templates[pageName] || `<div>Page not found: ${pageName}</div>`;
};


// This function returns the HTML for different modals
export const getModalTemplate = (modalName, state, ...args) => {
    const modals = {
        addPatient: `
            <div id="addPatient-modal" class="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
                <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md m-4">
                    <h2 class="text-2xl font-bold text-brand-green-dark mb-6">Register New Patient</h2>
                    <form id="addPatient-form">
                        <div class="mb-4"><label for="patient-name" class="block text-sm font-medium text-brand-text mb-1">Full Name</label><input type="text" id="patient-name" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"></div>
                        <div class="mb-6"><label for="patient-phone" class="block text-sm font-medium text-brand-text mb-1">Phone Number</label><input type="tel" id="patient-phone" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"></div>
                        <div class="flex justify-end gap-4">
                            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-brand-text">Cancel</button>
                            <button type="submit" class="px-4 py-2 rounded-lg bg-brand-green text-white font-semibold">Save Patient</button>
                        </div>
                    </form>
                </div>
            </div>`,
        confirmDelete: (coll, id) => `
            <div id="confirmDelete-modal" class="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
                <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm m-4 text-center">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
                    <p class="text-brand-text-light mb-6">Are you sure you want to delete this? This action cannot be undone.</p>
                    <div class="flex justify-center gap-4">
                        <button type="button" onclick="window.app.closeModal()" class="px-6 py-2 rounded-lg text-brand-text bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="button" onclick="window.app.executeDelete('${coll}', '${id}')" class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>`
        // ... (Add other modal templates here)
    };
    const templateFn = modals[modalName];
    return typeof templateFn === 'function' ? templateFn(...args) : templateFn;
};


// --- DOM Manipulation Functions ---

export function renderPage(pageName, state) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = getPageTemplate(pageName, state);
    if (pageName === 'dashboard') {
        updateDashboard(state);
    }
}

export function renderNav(currentPage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-brand-green', 'text-white', 'font-semibold');
        link.classList.add('hover:bg-brand-green-light', 'text-brand-text', 'font-medium');
        if (link.dataset.page === currentPage) {
            link.classList.add('bg-brand-green', 'text-white', 'font-semibold');
            link.classList.remove('hover:bg-brand-green-light', 'text-brand-text', 'font-medium');
        }
    });
}

export function updateDashboard(state) {
    document.getElementById('stat-patients').textContent = state.patients.length;
    const todaysAppointments = state.appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString());
    document.getElementById('stat-appointments').textContent = todaysAppointments.length;
    document.getElementById('stat-plans').textContent = state.plans.length;

    // ... rest of the dashboard update logic from your original file
}

export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const bgColor = type === 'success' ? 'bg-brand-green' : 'bg-red-500';
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg text-white ${bgColor} shadow-lg animate-fade-in-up`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}