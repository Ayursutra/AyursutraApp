#!/usr/bin/env python
"""
Database setup script for AyurSutra project.
This script will create the database tables and populate them with sample data.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback
from datetime import date, datetime, timedelta
import random

def create_sample_data():
    """Create sample data for the application"""
    
    print("Creating sample data...")
    
    # Create superuser if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@ayursutra.com', 'admin123')
        print("Created superuser: admin/admin123")
    
    # Create sample practitioners
    practitioners = []
    practitioner_data = [
        {
            'first_name': 'Raj', 'last_name': 'Sharma',
            'specialization': 'Panchakarma Specialist',
            'qualification': 'BAMS, MD (Ayurveda)',
            'experience_years': 15,
            'phone': '+91-9876543210',
            'email': 'raj.sharma@ayursutra.com',
            'license_number': 'AYU001',
            'consultation_fee': 1500.00
        },
        {
            'first_name': 'Priya', 'last_name': 'Verma',
            'specialization': 'Rejuvenation Therapy',
            'qualification': 'BAMS, PhD (Ayurveda)',
            'experience_years': 12,
            'phone': '+91-9876543211',
            'email': 'priya.verma@ayursutra.com',
            'license_number': 'AYU002',
            'consultation_fee': 1200.00
        },
        {
            'first_name': 'Amit', 'last_name': 'Kumar',
            'specialization': 'Herbal Medicine',
            'qualification': 'BAMS, MSc (Medicinal Plants)',
            'experience_years': 8,
            'phone': '+91-9876543212',
            'email': 'amit.kumar@ayursutra.com',
            'license_number': 'AYU003',
            'consultation_fee': 1000.00
        }
    ]
    
    for data in practitioner_data:
        if not Practitioner.objects.filter(email=data['email']).exists():
            practitioner = Practitioner.objects.create(**data)
            practitioners.append(practitioner)
            print(f"Created practitioner: Dr. {practitioner.first_name} {practitioner.last_name}")
    
    # Get existing practitioners if any
    if not practitioners:
        practitioners = list(Practitioner.objects.all())
    
    # Create sample patients
    patients = []
    patient_data = [
        {
            'first_name': 'Arjun', 'last_name': 'Singh',
            'date_of_birth': date(1985, 5, 15),
            'gender': 'Male',
            'phone': '+91-8765432109',
            'email': 'arjun.singh@email.com',
            'address': 'Rajpura, Punjab',
            'prakriti': 'Vata-Pitta',
            'medical_history': 'Chronic back pain, stress-related issues'
        },
        {
            'first_name': 'Meera', 'last_name': 'Patel',
            'date_of_birth': date(1990, 8, 22),
            'gender': 'Female',
            'phone': '+91-8765432108',
            'email': 'meera.patel@email.com',
            'address': 'Chandigarh, Punjab',
            'prakriti': 'Kapha-Pitta',
            'medical_history': 'Digestive issues, insomnia'
        },
        {
            'first_name': 'Ravi', 'last_name': 'Gupta',
            'date_of_birth': date(1978, 12, 10),
            'gender': 'Male',
            'phone': '+91-8765432107',
            'email': 'ravi.gupta@email.com',
            'address': 'Patiala, Punjab',
            'prakriti': 'Vata',
            'medical_history': 'Arthritis, anxiety'
        },
        {
            'first_name': 'Sunita', 'last_name': 'Rani',
            'date_of_birth': date(1982, 3, 8),
            'gender': 'Female',
            'phone': '+91-8765432106',
            'email': 'sunita.rani@email.com',
            'address': 'Ludhiana, Punjab',
            'prakriti': 'Pitta-Kapha',
            'medical_history': 'Skin allergies, migraine'
        },
        {
            'first_name': 'Vikram', 'last_name': 'Joshi',
            'date_of_birth': date(1995, 7, 18),
            'gender': 'Male',
            'phone': '+91-8765432105',
            'email': 'vikram.joshi@email.com',
            'address': 'Amritsar, Punjab',
            'prakriti': 'Kapha',
            'medical_history': 'Weight management, low energy'
        }
    ]
    
    for data in patient_data:
        if not Patient.objects.filter(email=data['email']).exists():
            patient = Patient.objects.create(**data)
            patients.append(patient)
            print(f"Created patient: {patient.first_name} {patient.last_name}")
    
    # Get existing patients if any
    if not patients:
        patients = list(Patient.objects.all())
    
    # Create sample treatment plans
    if patients and practitioners:
        treatment_plans = []
        plan_data = [
            {
                'title': 'Panchakarma Detox Program',
                'description': 'Complete detoxification and rejuvenation program',
                'primary_diagnosis': 'Chronic stress and toxin accumulation',
                'treatment_type': 'Panchakarma',
                'start_date': date.today() - timedelta(days=10),
                'end_date': date.today() + timedelta(days=20),
                'total_sessions': 21,
                'completed_sessions': 10,
                'total_cost': 50000.00,
                'paid_amount': 25000.00,
                'medications': 'Triphala, Ashwagandha tablets',
                'dietary_instructions': 'Light vegetarian diet, avoid spicy food',
                'lifestyle_recommendations': 'Regular yoga, meditation, early sleep'
            },
            {
                'title