# AyurSutra - Panchakarma Patient Management System

[![Django](https://img.shields.io/badge/Django-5.0.6-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SIH 2024](https://img.shields.io/badge/SIH-2024-orange.svg)](https://www.sih.gov.in/)

> **⚠️ IMPORTANT NOTE:** This project is currently under development and submitted for **Smart India Hackathon (SIH) 2025**. Due to time constraints during the hackathon period, some features are incomplete and will be enhanced in future iterations.

---

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Status](#project-status)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Team](#team)
- [Acknowledgments](#acknowledgments)

---

## 🌿 About the Project

**AyurSutra** is a comprehensive digital platform designed to modernize and streamline Panchakarma therapy management in Ayurvedic healthcare centers. The system provides an integrated solution for patient management, appointment scheduling, treatment planning, and AI-assisted consultations.

### Key Objectives:
- 🏥 Digitize traditional Ayurvedic treatment records
- 💬 Improve patient-practitioner communication
- 📅 Automate appointment scheduling and reminders
- 🤖 Provide AI-powered Ayurvedic knowledge assistance
- 📊 Enable data-driven insights for treatment effectiveness

---

## 🎯 Problem Statement

**SIH 2025 Problem Statement:** Developing a comprehensive patient management system for Panchakarma therapy centers that addresses:
- Manual record-keeping inefficiencies
- Lack of centralized patient data management
- Difficulty in tracking treatment progress
- Limited accessibility to Ayurvedic knowledge
- Appointment scheduling conflicts

**Current Reality:** This is a proof-of-concept with foundational architecture in place but limited working functionality.
---

## ✨ Features

#### 1. **User Management**
- Multi-role authentication (Admin, Doctor, Patient)
- Custom user model with role-based access control
- Secure login/logout with token authentication

#### 2. **Patient Management**
- Comprehensive patient profiles (Prakriti, Vikriti, medical history)
- Patient registration and record management
- Emergency contact information
- Medical history tracking

#### 3. **Practitioner Management**
- Doctor profiles with specializations
- License verification
- Consultation fee management
- Availability scheduling

#### 4. **Appointment System**
- Appointment scheduling
- Status tracking (Scheduled, Confirmed, Completed, Cancelled)
- Multiple appointment types (Consultation, Treatment, Follow-up)

#### 5. **Treatment Plans**
- Detailed treatment plan creation
- Session tracking (total vs completed)
- Medication and dietary instructions
- Lifestyle recommendations
- Payment tracking

#### 6. **Notifications**
- Appointment reminders
- Treatment updates
- Payment due alerts
- System notifications

#### 7. **Feedback System**
- Patient feedback collection
- Multi-criteria ratings (treatment effectiveness, practitioner care, facility)
- Anonymous feedback option

#### 8. **AI Chatbot**
- Gemini AI integration
- Ayurvedic knowledge assistance
- Context-aware responses
- Treatment guidance

#### 9. **Admin Dashboard**
- System overview with key metrics
- User management
- Comprehensive reporting
- System settings

### ⚠️ Partially Implemented
- Doctor dashboard (UI complete, some API integrations pending)
- Patient dashboard (basic structure in place)
- Advanced analytics and reporting
- PDF report generation

### 🔮 Planned Features
- Mobile application (React Native)
- SMS/Email notifications
- Video consultation integration
- Prescription management
- Inventory management for medicines
- Multi-language support (Hindi, Sanskrit, Regional languages)
- Payment gateway integration

---

## 📊 Current Implementation Status

### Overall Progress: ~35% Complete

| Component | Design | Backend | Frontend | Integration | Status |
|-----------|--------|---------|----------|-------------|--------|
| **Database Models** | ✅ 100% | ✅ 100% | N/A | N/A | ✅ Complete |
| **Admin Panel** | ✅ 100% | ✅ 95% | ✅ 100% | ✅ 90% | ✅ Working |
| **Authentication** | ✅ 100% | ✅ 90% | ✅ 80% | ❌ 30% | ⚠️ Partial |
| **API Endpoints** | ✅ 100% | ✅ 85% | N/A | ❌ 0% | ⚠️ Untested |
| **Patient Management** | ✅ 100% | ✅ 80% | ✅ 60% | ❌ 20% | ❌ Not Working |
| **Appointment System** | ✅ 100% | ✅ 80% | ✅ 50% | ❌ 10% | ❌ Not Working |
| **Treatment Plans** | ✅ 100% | ✅ 80% | ✅ 40% | ❌ 0% | ❌ Not Working |
| **Doctor Dashboard** | ✅ 90% | ✅ 70% | ✅ 60% | ❌ 0% | ❌ Not Working |
| **Patient Dashboard** | ✅ 80% | ✅ 60% | ✅ 40% | ❌ 0% | ❌ Not Working |
| **Admin Dashboard** | ✅ 100% | ✅ 75% | ✅ 70% | ❌ 25% | ⚠️ Partially Working |
| **AI Chatbot** | ✅ 100% | ✅ 90% | ✅ 80% | ❌ 40% | ⚠️ Basic Function |
| **Notifications** | ✅ 100% | ✅ 70% | ✅ 50% | ❌ 0% | ❌ Not Working |
| **Feedback System** | ✅ 100% | ✅ 75% | ✅ 40% | ❌ 0% | ❌ Not Working |
| **Reports/Analytics** | ✅ 60% | ❌ 20% | ❌ 10% | ❌ 0% | ❌ Not Implemented |
| **Testing** | N/A | ❌ 5% | ❌ 5% | ❌ 0% | ❌ Minimal |
| **Documentation** | N/A | ⚠️ 40% | ⚠️ 30% | N/A | ⚠️ Incomplete |

---

## 🔧 Django Implementation Details

### Django Project Structure

| Component | Status | Description |
|-----------|--------|-------------|
| **Project Setup** | ✅ Complete | Django 5.0.6 project initialized |
| **Settings Configuration** | ✅ Complete | DEBUG, DATABASES, INSTALLED_APPS configured |
| **URL Routing** | ✅ Complete | Main URLs and app URLs configured |
| **Static Files** | ✅ Complete | CSS, JS files organized |
| **Media Files** | ✅ Complete | Upload directory configured |
| **Environment Variables** | ✅ Complete | .env file setup with .env |

### Django Apps Implementation

#### 1. Authentication App

| Feature | Status | Details |
|---------|--------|---------|
| **CustomUser Model** | ✅ Complete | Extended AbstractUser with user_type, phone, DOB, etc. |
| **User Registration** | ⚠️ Partial | API endpoint created, frontend exists, **integration broken** |
| **User Login** | ⚠️ Partial | API endpoint created, frontend exists, **token auth not fully working** |
| **User Logout** | ⚠️ Partial | API endpoint created, **frontend integration incomplete** |
| **Token Authentication** | ⚠️ Partial | DRF Token configured, **not properly tested** |
| **Profile Management** | ❌ Incomplete | API exists, **frontend not connected** |
| **Password Reset** | ❌ Not Implemented | Planned but not started |
| **Email Verification** | ❌ Not Implemented | Not started |

### Team Members

| S.No | Name | Email | LinkedIn |
|------|------|-------|----------|
| 1 | Piyush Sharma | piyush3183.beai25@chitkara.edu.in | [LinkedIn](https://www.linkedin.com/in/piyushcodes7) |
| 2 | Govind Jindal | govind3091.beai25@chitkara.edu.in | [LinkedIn](https://www.linkedin.com/in/govind-jindal-62925b361) |
| 3 | Bhavishya Grover | bhavishya3095.beai25@chitkara.edu.in | [LinkedIn](https://www.linkedin.com/in/bhavishya-grover-39051b382)|

**Code Status:**
```python

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.0.6
- **API:** Django REST Framework 3.14.0
- **Database:** SQLite3 (Development) / PostgreSQL (Planned for Production)
- **Authentication:** Token-based authentication

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Tailwind CSS** for styling
- **Vanilla JS** (Framework-agnostic approach)

### AI/ML
- **Google Gemini AI** for chatbot
- **Natural Language Processing** for Ayurvedic knowledge queries

### Additional Libraries
```python
Django==5.0.6
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-dotenv==1.0.0
google-generativeai==0.3.2
Pillow==10.2.0
