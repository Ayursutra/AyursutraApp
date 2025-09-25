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
                    <div class="bg-white p-6 rounded-2xl shadow-sm">
                        <p class="text-sm font-medium text-brand-text-light">Active Patients</p>
                        <p id="stat-patients" class="text-3xl font-bold text-brand-green-dark mt-1">${state.patients.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm">
                        <p class="text-sm font-medium text-brand-text-light">Today's Appointments</p>
                        <p id="stat-appointments" class="text-3xl font-bold text-brand-green-dark mt-1">${state.appointments.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm">
                        <p class="text-sm font-medium text-brand-text-light">Treatment Plans</p>
                        <p id="stat-plans" class="text-3xl font-bold text-brand-green-dark mt-1">${state.plans.length}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-brand-green-dark mb-4">Today's Schedule</h3>
                            <div id="dashboard-schedule" class="space-y-3">
                                ${state.appointments.length === 0 ? 
                                    '<div class="text-center py-10 border-2 border-dashed border-brand-border rounded-lg"><p class="text-brand-text-light">No appointments scheduled for today</p></div>' :
                                    state.appointments.slice(0, 5).map(apt => `
                                        <div class="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                                            <div class="flex items-center">
                                                <div class="w-3 h-3 bg-brand-green rounded-full mr-3"></div>
                                                <div>
                                                    <p class="font-medium text-brand-text">${apt.patient_name || 'Patient'}</p>
                                                    <p class="text-sm text-brand-text-light">${apt.appointment_type || 'Consultation'}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-medium text-brand-text">${apt.appointment_time || '10:00 AM'}</p>
                                                <p class="text-sm text-brand-text-light">${apt.practitioner_name || 'Dr. Practitioner'}</p>
                                            </div>
                                        </div>
                                    `).join('')
                                }
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-1">
                        <div class="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 class="text-lg font-semibold text-brand-green-dark mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                <button onclick="window.app.showModal('addPatient')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">
                                    <svg class="w-5 h-5 mr-3 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    New Patient
                                </button>
                                <button onclick="window.app.showModal('addAppointment')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">
                                    <svg class="w-5 h-5 mr-3 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Schedule Appointment
                                </button>
                                <button onclick="window.app.showModal('addPlan')" class="w-full flex items-center text-left p-4 rounded-lg bg-brand-bg hover:bg-brand-green-light transition-colors">
                                    <svg class="w-5 h-5 mr-3 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Create Treatment Plan
                                </button>
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
                    <button onclick="window.app.showModal('addPatient')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                        <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Patient
                    </button>
                </header>
                <div class="bg-white p-6 rounded-2xl shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-brand-text-light uppercase bg-brand-bg">
                                <tr>
                                    <th class="px-6 py-3 rounded-l-lg">Name</th>
                                    <th class="px-6 py-3">Contact</th>
                                    <th class="px-6 py-3">Prakriti</th>
                                    <th class="px-6 py-3">Status</th>
                                    <th class="px-6 py-3 rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="patients-table-body">
                                ${state.patients.length === 0 ? 
                                    '<tr><td colspan="5" class="text-center py-8 text-brand-text-light">No patients found.</td></tr>' :
                                    state.patients.map(p => `
                                        <tr class="border-b border-brand-border hover:bg-brand-bg">
                                            <td class="px-6 py-4 font-medium">${p.first_name} ${p.last_name}</td>
                                            <td class="px-6 py-4">
                                                <div>
                                                    <div>${p.phone}</div>
                                                    <div class="text-xs text-brand-text-light">${p.email || 'No email'}</div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">${p.prakriti || 'Not assessed'}</td>
                                            <td class="px-6 py-4">
                                                <span class="px-2 py-1 rounded-full text-xs ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${p.status}</span>
                                            </td>
                                            <td class="px-6 py-4">
                                                <button onclick="window.app.deleteDocument('patients', '${p.id}')" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                            </td>
                                        </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`,
        schedule: `
            <div class="p-6 md:p-8">
                <header class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-brand-green-dark">Schedule</h1>
                    <button onclick="window.app.showModal('addAppointment')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                        <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Appointment
                    </button>
                </header>
                <div class="bg-white p-6 rounded-2xl shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-brand-text-light uppercase bg-brand-bg">
                                <tr>
                                    <th class="px-6 py-3 rounded-l-lg">Patient</th>
                                    <th class="px-6 py-3">Date & Time</th>
                                    <th class="px-6 py-3">Practitioner</th>
                                    <th class="px-6 py-3">Type</th>
                                    <th class="px-6 py-3">Status</th>
                                    <th class="px-6 py-3 rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.appointments.length === 0 ? 
                                    '<tr><td colspan="6" class="text-center py-8 text-brand-text-light">No appointments found.</td></tr>' :
                                    state.appointments.map(apt => `
                                        <tr class="border-b border-brand-border hover:bg-brand-bg">
                                            <td class="px-6 py-4 font-medium">${apt.patient_name || 'Patient'}</td>
                                            <td class="px-6 py-4">
                                                <div>${apt.appointment_date || 'TBD'}</div>
                                                <div class="text-xs text-brand-text-light">${apt.appointment_time || 'TBD'}</div>
                                            </td>
                                            <td class="px-6 py-4">${apt.practitioner_name || 'Dr. Practitioner'}</td>
                                            <td class="px-6 py-4">${apt.appointment_type || 'Consultation'}</td>
                                            <td class="px-6 py-4">
                                                <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(apt.status)}">${apt.status || 'scheduled'}</span>
                                            </td>
                                            <td class="px-6 py-4">
                                                <button onclick="window.app.deleteDocument('appointments', '${apt.id}')" class="text-red-500 hover:text-red-700 text-sm">Cancel</button>
                                            </td>
                                        </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`,
        plans: `
            <div class="p-6 md:p-8">
                <header class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-brand-green-dark">Treatment Plans</h1>
                    <button onclick="window.app.showModal('addPlan')" class="bg-brand-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors">
                        <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Create Plan
                    </button>
                </header>
                <div class="grid gap-6">
                    ${state.plans.length === 0 ? 
                        '<div class="bg-white p-8 rounded-2xl shadow-sm text-center"><p class="text-brand-text-light">No treatment plans found.</p></div>' :
                        state.plans.map(plan => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-brand-green-dark">${plan.title}</h3>
                                        <p class="text-sm text-brand-text-light">${plan.patient_name || 'Patient'} • ${plan.practitioner_name || 'Dr. Practitioner'}</p>
                                    </div>
                                    <span class="px-3 py-1 rounded-full text-sm ${getPlanStatusColor(plan.status)}">${plan.status || 'draft'}</span>
                                </div>
                                <p class="text-brand-text mb-4">${plan.description || 'No description available'}</p>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p class="text-brand-text-light">Duration</p>
                                        <p class="font-medium">${plan.start_date} - ${plan.end_date}</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Progress</p>
                                        <p class="font-medium">${plan.completed_sessions || 0}/${plan.total_sessions || 0} sessions</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Cost</p>
                                        <p class="font-medium">₹${plan.total_cost || 0}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>`,
        practitioners: `
            <div class="p-6 md:p-8">
                <h1 class="text-3xl font-bold text-brand-green-dark mb-8">Practitioners</h1>
                <div class="grid gap-6">
                    ${state.practitioners.length === 0 ? 
                        '<div class="bg-white p-8 rounded-2xl shadow-sm text-center"><p class="text-brand-text-light">No practitioners found.</p></div>' :
                        state.practitioners.map(prac => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm">
                                <div class="flex items-start justify-between">
                                    <div class="flex items-center">
                                        <img class="h-16 w-16 rounded-full object-cover bg-brand-green-light" src="https://placehold.co/64x64/6E8B67/ffffff?text=Dr" alt="Dr. ${prac.first_name}">
                                        <div class="ml-4">
                                            <h3 class="text-lg font-semibold text-brand-green-dark">Dr. ${prac.first_name} ${prac.last_name}</h3>
                                            <p class="text-brand-text">${prac.specialization}</p>
                                            <p class="text-sm text-brand-text-light">${prac.qualification} • ${prac.experience_years} years exp.</p>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 rounded-full text-sm ${prac.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${prac.status}</span>
                                </div>
                                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p class="text-brand-text-light">Contact</p>
                                        <p class="font-medium">${prac.phone}</p>
                                        <p class="text-xs text-brand-text-light">${prac.email}</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Consultation Fee</p>
                                        <p class="font-medium">₹${prac.consultation_fee || 0}</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Available</p>
                                        <p class="font-medium">${prac.available_days || 'Mon-Sat'}</p>
                                        <p class="text-xs text-brand-text-light">${prac.consultation_hours || '9 AM - 5 PM'}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>`,
        notifications: `
            <div class="p-6 md:p-8">
                <h1 class="text-3xl font-bold text-brand-green-dark mb-8">Notifications</h1>
                <div class="space-y-4">
                    ${state.notifications.length === 0 ? 
                        '<div class="bg-white p-8 rounded-2xl shadow-sm text-center"><p class="text-brand-text-light">No notifications found.</p></div>' :
                        state.notifications.map(notif => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm ${notif.status === 'unread' ? 'border-l-4 border-brand-green' : ''}">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-brand-green-dark">${notif.title}</h3>
                                        <p class="text-brand-text mt-1">${notif.message}</p>
                                        <div class="flex items-center mt-2 text-sm text-brand-text-light">
                                            <span class="px-2 py-1 rounded-full bg-brand-bg text-xs">${notif.notification_type}</span>
                                            <span class="ml-2">${formatDate(notif.created_at)}</span>
                                        </div>
                                    </div>
                                    <span class="px-2 py-1 rounded-full text-xs ${notif.status === 'unread' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-800'}">${notif.status}</span>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>`,
        feedback: `
            <div class="p-6 md:p-8">
                <h1 class="text-3xl font-bold text-brand-green-dark mb-8">Feedback</h1>
                <div class="space-y-6">
                    ${state.feedback.length === 0 ? 
                        '<div class="bg-white p-8 rounded-2xl shadow-sm text-center"><p class="text-brand-text-light">No feedback found.</p></div>' :
                        state.feedback.map(fb => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-brand-green-dark">${fb.title}</h3>
                                        <p class="text-sm text-brand-text-light">${fb.patient_name || 'Anonymous'} • ${fb.practitioner_name || 'Dr. Practitioner'}</p>
                                    </div>
                                    <div class="flex items-center">
                                        ${generateStarRating(fb.rating || 0)}
                                        <span class="ml-2 text-sm font-medium">${fb.rating || 0}/5</span>
                                    </div>
                                </div>
                                <p class="text-brand-text mb-4">${fb.comment}</p>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p class="text-brand-text-light">Treatment</p>
                                        <p class="font-medium">${fb.treatment_effectiveness || 'N/A'}/5</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Care</p>
                                        <p class="font-medium">${fb.practitioner_care || 'N/A'}/5</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Facility</p>
                                        <p class="font-medium">${fb.facility_cleanliness || 'N/A'}/5</p>
                                    </div>
                                    <div>
                                        <p class="text-brand-text-light">Overall</p>
                                        <p class="font-medium">${fb.overall_satisfaction || 'N/A'}/5</p>
                                    </div>
                                </div>
                                ${fb.would_recommend ? '<div class="mt-3 text-sm text-green-600 font-medium">✓ Would recommend to others</div>' : ''}
                            </div>
                        `).join('')}
                </div>
            </div>`,
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
                    <form id="addPatient-form" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="patient-first-name" class="block text-sm font-medium text-brand-text mb-1">First Name *</label>
                                <input type="text" id="patient-first-name" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                            <div>
                                <label for="patient-last-name" class="block text-sm font-medium text-brand-text mb-1">Last Name *</label>
                                <input type="text" id="patient-last-name" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                        </div>
                        <div>
                            <label for="patient-phone" class="block text-sm font-medium text-brand-text mb-1">Phone Number *</label>
                            <input type="tel" id="patient-phone" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                        </div>
                        <div>
                            <label for="patient-email" class="block text-sm font-medium text-brand-text mb-1">Email</label>
                            <input type="email" id="patient-email" class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                        </div>
                        <div>
                            <label for="patient-dob" class="block text-sm font-medium text-brand-text mb-1">Date of Birth *</label>
                            <input type="date" id="patient-dob" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                        </div>
                        <div>
                            <label for="patient-gender" class="block text-sm font-medium text-brand-text mb-1">Gender</label>
                            <select id="patient-gender" class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="flex justify-end gap-4 pt-4">
                            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-brand-text hover:bg-gray-100">Cancel</button>
                            <button type="submit" class="px-4 py-2 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-green-dark">Save Patient</button>
                        </div>
                    </form>
                </div>
            </div>`,
        
        addAppointment: `
            <div id="addAppointment-modal" class="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
                <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md m-4">
                    <h2 class="text-2xl font-bold text-brand-green-dark mb-6">Schedule Appointment</h2>
                    <form id="addAppointment-form" class="space-y-4">
                        <div>
                            <label for="appointment-patient" class="block text-sm font-medium text-brand-text mb-1">Patient *</label>
                            <select id="appointment-patient" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Patient</option>
                                ${state.patients.map(p => `<option value="${p.id}">${p.first_name} ${p.last_name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="appointment-practitioner" class="block text-sm font-medium text-brand-text mb-1">Practitioner *</label>
                            <select id="appointment-practitioner" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Practitioner</option>
                                ${state.practitioners.map(p => `<option value="${p.id}">Dr. ${p.first_name} ${p.last_name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="appointment-date" class="block text-sm font-medium text-brand-text mb-1">Date *</label>
                                <input type="date" id="appointment-date" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                            <div>
                                <label for="appointment-time" class="block text-sm font-medium text-brand-text mb-1">Time *</label>
                                <input type="time" id="appointment-time" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                        </div>
                        <div>
                            <label for="appointment-type" class="block text-sm font-medium text-brand-text mb-1">Type *</label>
                            <select id="appointment-type" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="Consultation">Consultation</option>
                                <option value="Treatment">Treatment</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Check-up">Check-up</option>
                            </select>
                        </div>
                        <div class="flex justify-end gap-4 pt-4">
                            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-brand-text hover:bg-gray-100">Cancel</button>
                            <button type="submit" class="px-4 py-2 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-green-dark">Schedule</button>
                        </div>
                    </form>
                </div>
            </div>`,
        
        addPlan: `
            <div id="addPlan-modal" class="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
                <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                    <h2 class="text-2xl font-bold text-brand-green-dark mb-6">Create Treatment Plan</h2>
                    <form id="addPlan-form" class="space-y-4">
                        <div>
                            <label for="plan-patient" class="block text-sm font-medium text-brand-text mb-1">Patient *</label>
                            <select id="plan-patient" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Patient</option>
                                ${state.patients.map(p => `<option value="${p.id}">${p.first_name} ${p.last_name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="plan-practitioner" class="block text-sm font-medium text-brand-text mb-1">Practitioner *</label>
                            <select id="plan-practitioner" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Practitioner</option>
                                ${state.practitioners.map(p => `<option value="${p.id}">Dr. ${p.first_name} ${p.last_name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="plan-title" class="block text-sm font-medium text-brand-text mb-1">Plan Title *</label>
                            <input type="text" id="plan-title" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green" placeholder="e.g., Panchakarma Detox Program">
                        </div>
                        <div>
                            <label for="plan-description" class="block text-sm font-medium text-brand-text mb-1">Description</label>
                            <textarea id="plan-description" rows="3" class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green" placeholder="Brief description of the treatment plan..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="plan-start-date" class="block text-sm font-medium text-brand-text mb-1">Start Date *</label>
                                <input type="date" id="plan-start-date" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                            <div>
                                <label for="plan-end-date" class="block text-sm font-medium text-brand-text mb-1">End Date *</label>
                                <input type="date" id="plan-end-date" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                            </div>
                        </div>
                        <div>
                            <label for="plan-treatment-type" class="block text-sm font-medium text-brand-text mb-1">Treatment Type *</label>
                            <select id="plan-treatment-type" required class="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green">
                                <option value="">Select Type</option>
                                <option value="Panchakarma">Panchakarma</option>
                                <option value="Rasayana Therapy">Rasayana Therapy</option>
                                <option value="Satvavajaya Chikitsa">Satvavajaya Chikitsa</option>
                                <option value="Shodhana">Shodhana</option>
                                <option value="Shamana">Shamana</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="flex justify-end gap-4 pt-4">
                            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-brand-text hover:bg-gray-100">Cancel</button>
                            <button type="submit" class="px-4 py-2 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-green-dark">Create Plan</button>
                        </div>
                    </form>
                </div>
            </div>`,
        
        confirmDelete: (coll, id) => `
            <div id="confirmDelete-modal" class="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
                <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm m-4 text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                    <p class="text-brand-text-light mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
                    <div class="flex justify-center gap-4">
                        <button type="button" onclick="window.app.closeModal()" class="px-6 py-2 rounded-lg text-brand-text bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="button" onclick="window.app.executeDelete('${coll}', '${id}')" class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>`
    };
    const templateFn = modals[modalName];
    return typeof templateFn === 'function' ? templateFn(...args) : templateFn;
};

// --- Helper Functions ---
function getStatusColor(status) {
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

function getPlanStatusColor(status) {
    const colors = {
        'draft': 'bg-gray-100 text-gray-800',
        'active': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function generateStarRating(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push('<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
        } else {
            stars.push('<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
        }
    }
    return `<div class="flex">${stars.join('')}</div>`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// --- DOM Manipulation Functions ---

export function renderPage(pageName, state) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = getPageTemplate(pageName, state);
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

export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const bgColor = type === 'success' ? 'bg-brand-green' : 'bg-red-500';
    const icon = type === 'success' ? 
        '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
        '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 rounded-lg text-white ${bgColor} shadow-lg transform transition-all duration-300 translate-y-2 opacity-0`;
    toast.innerHTML = `${icon}<span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}