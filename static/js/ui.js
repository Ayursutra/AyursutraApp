// static/js/enhanced-ui.js

class UIManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.state = {
            patients: [],
            practitioners: [],
            appointments: [],
            plans: [],
            notifications: [],
            feedback: [],
            users: [],
            dashboardStats: {}
        };
    }

    async loadData(forceRefresh = false) {
        if (!window.apiClient.isInitialized) return;

        try {
            // Load dashboard stats first
            this.state.dashboardStats = await window.apiClient.getDashboardStats();
            
            // Load other data based on user type
            const userType = window.USER_DATA.userType;
            
            if (userType === 'admin') {
                await this.loadAllData();
            } else if (userType === 'doctor') {
                await this.loadDoctorData();
            } else {
                await this.loadPatientData();
            }

            this.updateSidebarStats();
        } catch (error) {
            console.error('Error loading data:', error);
            window.notificationManager?.showToast('Error loading data', 'error');
        }
    }

    async loadAllData() {
        const [patients, practitioners, appointments, plans, notifications, feedback] = await Promise.all([
            window.apiClient.getData('patients'),
            window.apiClient.getData('practitioners'),
            window.apiClient.getData('appointments'),
            window.apiClient.getData('plans'),
            window.apiClient.getData('notifications'),
            window.apiClient.getData('feedback')
        ]);

        this.state = {
            ...this.state,
            patients,
            practitioners,
            appointments,
            plans,
            notifications,
            feedback
        };
    }

    async loadDoctorData() {
        const [patients, appointments, plans, notifications, feedback] = await Promise.all([
            window.apiClient.getData('patients'),
            window.apiClient.getData('appointments'),
            window.apiClient.getData('plans'),
            window.apiClient.getData('notifications'),
            window.apiClient.getData('feedback')
        ]);

        this.state = {
            ...this.state,
            patients,
            appointments,
            plans,
            notifications,
            feedback
        };
    }

    async loadPatientData() {
        const [appointments, plans, notifications, feedback] = await Promise.all([
            window.apiClient.getData('appointments'),
            window.apiClient.getData('plans'),
            window.apiClient.getData('notifications'),
            window.apiClient.getData('feedback')
        ]);

        this.state = {
            ...this.state,
            appointments,
            plans,
            notifications,
            feedback
        };
    }

    updateSidebarStats() {
        const stats = this.state.dashboardStats;
        
        // Update overview stats in sidebar
        const overviewAppointments = document.getElementById('overview-appointments');
        const overviewPatients = document.getElementById('overview-patients');

        if (overviewAppointments) {
            overviewAppointments.textContent = stats.todays_appointments || 0;
        }
        
        if (overviewPatients) {
            if (window.USER_DATA.userType === 'admin') {
                overviewPatients.textContent = stats.active_patients || 0;
            } else if (window.USER_DATA.userType === 'doctor') {
                overviewPatients.textContent = stats.my_patients || 0;
            } else {
                overviewPatients.textContent = stats.upcoming_appointments || 0;
                // Change label for patients
                const label = overviewPatients.parentElement?.querySelector('span');
                if (label) label.textContent = 'Upcoming';
            }
        }
    }

    renderPage(pageName) {
        this.currentPage = pageName;
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        const template = this.getPageTemplate(pageName);
        mainContent.innerHTML = template;

        // Add event listeners for page-specific functionality
        this.addPageEventListeners(pageName);
    }

    getPageTemplate(pageName) {
        const userType = window.USER_DATA.userType;
        const templates = this.getTemplatesForUserType(userType);
        return templates[pageName] || this.getNotFoundTemplate(pageName);
    }

    getTemplatesForUserType(userType) {
        if (userType === 'admin') {
            return this.getAdminTemplates();
        } else if (userType === 'doctor') {
            return this.getDoctorTemplates();
        } else {
            return this.getPatientTemplates();
        }
    }

    getAdminTemplates() {
        return {
            dashboard: this.getAdminDashboardTemplate(),
            users: this.getUserManagementTemplate(),
            patients: this.getPatientsTemplate(),
            practitioners: this.getPractitionersTemplate(),
            schedule: this.getScheduleTemplate(),
            plans: this.getTreatmentPlansTemplate(),
            notifications: this.getNotificationsTemplate(),
            feedback: this.getFeedbackTemplate(),
            settings: this.getSystemSettingsTemplate()
        };
    }

    getDoctorTemplates() {
        return {
            dashboard: this.getDoctorDashboardTemplate(),
            patients: this.getMyPatientsTemplate(),
            schedule: this.getMyScheduleTemplate(),
            plans: this.getMyTreatmentPlansTemplate(),
            notifications: this.getMyNotificationsTemplate(),
            feedback: this.getMyFeedbackTemplate(),
            profile: this.getProfileTemplate()
        };
    }

    getPatientsTemplate() {
        return `
            <div class="p-6 md:p-8">
                <header class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-brand-green-dark">Patients Management</h1>
                        <p class="text-brand-text-light mt-1">Manage patient records and information</p>
                    </div>
                    <button onclick="window.uiManager.showModal('addPatient')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                        <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add Patient
                    </button>
                </header>

                <!-- Search and Filters -->
                <div class="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" id="patientSearch" placeholder="Search patients..." 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green">
                        </div>
                        <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green">
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <button onclick="window.uiManager.exportPatients()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Export CSV
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prakriti</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="patients-table-body">
                                ${this.state.patients.length === 0 ? 
                                    '<tr><td colspan="6" class="text-center py-8 text-gray-500">No patients found.</td></tr>' :
                                    this.state.patients.map(patient => `
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 rounded-full bg-brand-green flex items-center justify-center text-white font-semibold">
                                                        ${patient.first_name ? patient.first_name.charAt(0).toUpperCase() : 'P'}
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-gray-900">${patient.first_name} ${patient.last_name}</div>
                                                        <div class="text-sm text-gray-500">ID: ${patient.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm text-gray-900">${patient.phone || 'N/A'}</div>
                                                <div class="text-sm text-gray-500">${patient.email || 'No email'}</div>
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-900">
                                                ${patient.date_of_birth ? this.calculateAge(patient.date_of_birth) : 'N/A'}
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-900">${patient.prakriti || 'Not assessed'}</td>
                                            <td class="px-6 py-4">
                                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    ${patient.status || 'Active'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 text-sm font-medium">
                                                <div class="flex space-x-2">
                                                    <button onclick="window.uiManager.showModal('editPatient', ${patient.id})" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    <button onclick="window.uiManager.showModal('viewPatient', ${patient.id})" class="text-green-600 hover:text-green-900">View</button>
                                                    <button onclick="window.uiManager.confirmDelete('patients', ${patient.id})" class="text-red-600 hover:text-red-900">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getScheduleTemplate() {
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = this.state.appointments.filter(apt => apt.appointment_date === today);

        return `
            <div class="p-6 md:p-8">
                <header class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-brand-green-dark">Appointments Schedule</h1>
                        <p class="text-brand-text-light mt-1">Manage all appointments and scheduling</p>
                    </div>
                    <button onclick="window.uiManager.showModal('addAppointment')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                        <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        New Appointment
                    </button>
                </header>

                <!-- Today's Appointments -->
                <div class="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Appointments (${todaysAppointments.length})</h3>
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        ${todaysAppointments.length === 0 ? 
                            '<div class="col-span-full text-center py-8 text-gray-500">No appointments today</div>' :
                            todaysAppointments.map(apt => `
                                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="font-medium text-gray-900">${apt.patient_name || 'Patient'}</div>
                                        <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(apt.status)}">
                                            ${apt.status || 'scheduled'}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-600 mb-2">
                                        <div>⏰ ${apt.appointment_time || 'TBD'}</div>
                                        <div>👨‍⚕️ ${apt.practitioner_name || 'Dr. Practitioner'}</div>
                                        <div>📋 ${apt.appointment_type || 'Consultation'}</div>
                                    </div>
                                    <div class="flex space-x-2 text-xs">
                                        <button onclick="window.uiManager.updateAppointmentStatus(${apt.id}, 'confirmed')" class="px-2 py-1 bg-green-100 text-green-800 rounded">Confirm</button>
                                        <button onclick="window.uiManager.showModal('editAppointment', ${apt.id})" class="px-2 py-1 bg-blue-100 text-blue-800 rounded">Edit</button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>

                <!-- All Appointments Table -->
                <div class="bg-white rounded-2xl shadow-sm">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <input type="date" id="dateFilter" class="px-4 py-2 border border-gray-300 rounded-lg">
                            <select id="statusFilterAppointment" class="px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="">All Statuses</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button onclick="window.uiManager.refreshAppointments()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Practitioner</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${this.state.appointments.length === 0 ? 
                                    '<tr><td colspan="6" class="text-center py-8 text-gray-500">No appointments found.</td></tr>' :
                                    this.state.appointments.map(apt => `
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center text-white text-sm font-semibold">
                                                        ${apt.patient_name ? apt.patient_name.charAt(0).toUpperCase() : 'P'}
                                                    </div>
                                                    <span class="ml-3 font-medium text-gray-900">${apt.patient_name || 'Patient'}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm text-gray-900">${this.formatDate(apt.appointment_date)}</div>
                                                <div class="text-sm text-gray-500">${apt.appointment_time || 'TBD'}</div>
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-900">${apt.practitioner_name || 'Dr. Practitioner'}</td>
                                            <td class="px-6 py-4 text-sm text-gray-900">${apt.appointment_type || 'Consultation'}</td>
                                            <td class="px-6 py-4">
                                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusColor(apt.status)}">
                                                    ${apt.status || 'scheduled'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 text-sm font-medium">
                                                <div class="flex space-x-2">
                                                    <button onclick="window.uiManager.showModal('editAppointment', ${apt.id})" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    <button onclick="window.uiManager.confirmDelete('appointments', ${apt.id})" class="text-red-600 hover:text-red-900">Cancel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getNotFoundTemplate(pageName) {
        return `
            <div class="p-6 md:p-8">
                <div class="text-center py-16">
                    <div class="mx-auto h-24 w-24 text-gray-400">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">Page Under Development</h3>
                    <p class="mt-2 text-sm text-gray-500">The ${pageName} page is currently being developed.</p>
                    <button onclick="window.uiManager.navigate('dashboard')" class="mt-4 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        `;
    }

    // Navigation and Event Handling
    navigate(page) {
        this.currentPage = page;
        this.updateNavigation(page);
        this.renderPage(page);
    }

    updateNavigation(currentPage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-brand-green', 'text-white', 'font-semibold');
            link.classList.add('hover:bg-brand-green-light', 'text-brand-text', 'font-medium');
            
            if (link.dataset.page === currentPage) {
                link.classList.add('bg-brand-green', 'text-white', 'font-semibold');
                link.classList.remove('hover:bg-brand-green-light', 'text-brand-text', 'font-medium');
            }
        });
    }

    addPageEventListeners(pageName) {
        // Add search functionality
        const searchInput = document.getElementById(`${pageName}Search`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e, pageName));
        }

        // Add filter functionality
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleFilter(e, pageName));
        }
    }

    handleSearch(event, pageName) {
        const query = event.target.value.toLowerCase();
        const tableBody = document.getElementById(`${pageName}-table-body`);
        if (!tableBody) return;

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    }

    handleFilter(event, pageName) {
        const filterValue = event.target.value;
        const tableBody = document.getElementById(`${pageName}-table-body`);
        if (!tableBody) return;

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            if (!filterValue) {
                row.style.display = '';
            } else {
                const statusCell = row.querySelector('.inline-flex');
                const status = statusCell ? statusCell.textContent.trim() : '';
                row.style.display = status === filterValue ? '' : 'none';
            }
        });
    }

    // Utility Functions
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    calculateAge(dateOfBirth) {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    getStatusColor(status) {
        const colors = {
            'scheduled': 'bg-blue-100 text-blue-800',
            'confirmed': 'bg-green-100 text-green-800',
            'in_progress': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'no_show': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    // Modal and Action Methods (to be implemented)
    showModal(modalName, ...args) {
        console.log('Show modal:', modalName, args);
        window.notificationManager?.showToast('Modal functionality coming soon!', 'info');
    }

    confirmDelete(collection, id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.deleteItem(collection, id);
        }
    }

    async deleteItem(collection, id) {
        try {
            await window.apiClient.deleteDocument(collection, id);
            window.notificationManager?.showToast('Item deleted successfully!', 'success');
            await this.loadData(true); // Reload data
            this.renderPage(this.currentPage); // Re-render current page
        } catch (error) {
            console.error('Delete error:', error);
            window.notificationManager?.showToast('Error deleting item', 'error');
        }
    }

    async updateAppointmentStatus(appointmentId, newStatus) {
        try {
            await window.apiClient.updateDocument('appointments', appointmentId, { status: newStatus });
            window.notificationManager?.showToast(`Appointment ${newStatus} successfully!`, 'success');
            await this.loadData(true);
            this.renderPage(this.currentPage);
        } catch (error) {
            console.error('Update error:', error);
            window.notificationManager?.showToast('Error updating appointment', 'error');
        }
    }
}

// Initialize UI Manager
window.uiManager = new UIManager();entTemplates() {
        return {
            dashboard: this.getPatientDashboardTemplate(),
            appointments: this.getMyAppointmentsTemplate(),
            plans: this.getMyPlansTemplate(),
            notifications: this.getMyNotificationsTemplate(),
            feedback: this.getMyFeedbackTemplate(),
            profile: this.getProfileTemplate(),
            health: this.getHealthRecordsTemplate()
        };
    }

    getAdminDashboardTemplate() {
        const stats = this.state.dashboardStats;
        return `
            <div class="p-6 md:p-8">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-brand-green-dark">System Dashboard</h1>
                    <p class="text-brand-text-light mt-1">Complete system overview and management</p>
                </header>

                <!-- Key Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Patients</p>
                                <p class="text-3xl font-bold text-gray-900">${stats.total_patients || 0}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Active Doctors</p>
                                <p class="text-3xl font-bold text-gray-900">${stats.total_doctors || 0}</p>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Today's Appointments</p>
                                <p class="text-3xl font-bold text-gray-900">${stats.todays_appointments || 0}</p>
                            </div>
                            <div class="p-3 bg-yellow-100 rounded-full">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Active Plans</p>
                                <p class="text-3xl font-bold text-gray-900">${stats.active_treatment_plans || 0}</p>
                            </div>
                            <div class="p-3 bg-purple-100 rounded-full">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity and Quick Actions -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                            <div class="space-y-3">
                                ${this.state.appointments.slice(0, 5).map(apt => `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-semibold">
                                                ${apt.patient_name ? apt.patient_name.charAt(0).toUpperCase() : 'P'}
                                            </div>
                                            <div class="ml-3">
                                                <p class="font-medium text-gray-900">${apt.patient_name || 'Patient'}</p>
                                                <p class="text-sm text-gray-500">${apt.appointment_type || 'Consultation'}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium text-gray-900">${this.formatDate(apt.appointment_date)} ${apt.appointment_time || ''}</p>
                                            <p class="text-sm text-gray-500">${apt.practitioner_name || 'Dr. Practitioner'}</p>
                                        </div>
                                    </div>
                                `).join('') || '<p class="text-center py-8 text-gray-500">No recent appointments</p>'}
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div class="bg-white p-6 rounded-2xl shadow-sm mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                <button onclick="window.uiManager.showModal('addPatient')" class="w-full flex items-center text-left p-3 rounded-lg bg-brand-green-light hover:bg-brand-green hover:text-white transition-colors">
                                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Add New Patient
                                </button>
                                <button onclick="window.uiManager.showModal('addPractitioner')" class="w-full flex items-center text-left p-3 rounded-lg bg-brand-green-light hover:bg-brand-green hover:text-white transition-colors">
                                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Add Doctor
                                </button>
                                <button onclick="window.uiManager.showModal('addAppointment')" class="w-full flex items-center text-left p-3 rounded-lg bg-brand-green-light hover:bg-brand-green hover:text-white transition-colors">
                                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Schedule Appointment
                                </button>
                            </div>
                        </div>

                        <!-- System Status -->
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Database</span>
                                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">AI Assistant</span>
                                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Notifications</span>
                                    <span class="px-2 py-1 bg-${stats.unread_notifications > 0 ? 'yellow' : 'green'}-100 text-${stats.unread_notifications > 0 ? 'yellow' : 'green'}-800 text-xs rounded-full">
                                        ${stats.unread_notifications || 0} unread
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPati