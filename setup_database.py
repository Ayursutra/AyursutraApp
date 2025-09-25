#!/usr/bin/env python
"""
Database setup script for AyurSutra project.
This script will create the database tables and populate them with sample data.
"""

import os
import sys
import django

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
    
    # Clear existing data (optional - remove if you want to keep existing data)
    print("Clearing existing data...")
    Feedback.objects.all().delete()
    Notification.objects.all().delete()
    Appointment.objects.all().delete()
    TreatmentPlan.objects.all().delete()
    Patient.objects.all().delete()
    Practitioner.objects.all().delete()
    
    # Create sample practitioners
    practitioners_data = [
        {
            'first_name': 'Raj', 'last_name': 'Sharma',
            'specialization': 'Panchakarma Specialist',
            'qualification': 'BAMS, MD (Ayurveda)',
            'experience_years': 15,
            'phone': '+91-9876543210',
            'email': 'raj.sharma@ayursutra.com',
            'license_number': 'AYU001',
            'consultation_fee': 1500.00,
            'address': 'Sector 17, Chandigarh',
            'available_days': 'Monday to Saturday',
            'consultation_hours': '9:00 AM - 6:00 PM'
        },
        {
            'first_name': 'Priya', 'last_name': 'Verma',
            'specialization': 'Rejuvenation Therapy',
            'qualification': 'BAMS, PhD (Ayurveda)',
            'experience_years': 12,
            'phone': '+91-9876543211',
            'email': 'priya.verma@ayursutra.com',
            'license_number': 'AYU002',
            'consultation_fee': 1200.00,
            'address': 'Model Town, Ludhiana',
            'available_days': 'Tuesday to Sunday',
            'consultation_hours': '10:00 AM - 5:00 PM'
        },
        {
            'first_name': 'Amit', 'last_name': 'Kumar',
            'specialization': 'Herbal Medicine',
            'qualification': 'BAMS, MSc (Medicinal Plants)',
            'experience_years': 8,
            'phone': '+91-9876543212',
            'email': 'amit.kumar@ayursutra.com',
            'license_number': 'AYU003',
            'consultation_fee': 1000.00,
            'address': 'Civil Lines, Patiala',
            'available_days': 'Monday to Friday',
            'consultation_hours': '9:00 AM - 4:00 PM'
        }
    ]
    
    practitioners = []
    for data in practitioners_data:
        practitioner = Practitioner.objects.create(**data)
        practitioners.append(practitioner)
        print(f"Created practitioner: Dr. {practitioner.first_name} {practitioner.last_name}")
    
    # Create sample patients
    patients_data = [
        {
            'first_name': 'Arjun', 'last_name': 'Singh',
            'date_of_birth': date(1985, 5, 15),
            'gender': 'Male',
            'phone': '+91-8765432109',
            'email': 'arjun.singh@email.com',
            'address': 'Rajpura, Punjab',
            'prakriti': 'Vata-Pitta',
            'medical_history': 'Chronic back pain, stress-related issues',
            'current_medications': 'Ashwagandha, Triphala',
            'emergency_contact_name': 'Sunita Singh',
            'emergency_contact_phone': '+91-8765432199'
        },
        {
            'first_name': 'Meera', 'last_name': 'Patel',
            'date_of_birth': date(1990, 8, 22),
            'gender': 'Female',
            'phone': '+91-8765432108',
            'email': 'meera.patel@email.com',
            'address': 'Chandigarh, Punjab',
            'prakriti': 'Kapha-Pitta',
            'medical_history': 'Digestive issues, insomnia',
            'current_medications': 'Hingvastak Churna',
            'allergies': 'Lactose intolerance',
            'emergency_contact_name': 'Rajesh Patel',
            'emergency_contact_phone': '+91-8765432198'
        },
        {
            'first_name': 'Ravi', 'last_name': 'Gupta',
            'date_of_birth': date(1978, 12, 10),
            'gender': 'Male',
            'phone': '+91-8765432107',
            'email': 'ravi.gupta@email.com',
            'address': 'Patiala, Punjab',
            'prakriti': 'Vata',
            'medical_history': 'Arthritis, anxiety',
            'current_medications': 'Yograj Guggulu',
            'emergency_contact_name': 'Kavita Gupta',
            'emergency_contact_phone': '+91-8765432197'
        },
        {
            'first_name': 'Sunita', 'last_name': 'Rani',
            'date_of_birth': date(1982, 3, 8),
            'gender': 'Female',
            'phone': '+91-8765432106',
            'email': 'sunita.rani@email.com',
            'address': 'Ludhiana, Punjab',
            'prakriti': 'Pitta-Kapha',
            'medical_history': 'Skin allergies, migraine',
            'allergies': 'Peanuts, Dust',
            'emergency_contact_name': 'Manish Rani',
            'emergency_contact_phone': '+91-8765432196'
        },
        {
            'first_name': 'Vikram', 'last_name': 'Joshi',
            'date_of_birth': date(1995, 7, 18),
            'gender': 'Male',
            'phone': '+91-8765432105',
            'email': 'vikram.joshi@email.com',
            'address': 'Amritsar, Punjab',
            'prakriti': 'Kapha',
            'medical_history': 'Weight management, low energy',
            'emergency_contact_name': 'Seema Joshi',
            'emergency_contact_phone': '+91-8765432195'
        }
    ]
    
    patients = []
    for data in patients_data:
        patient = Patient.objects.create(**data)
        patients.append(patient)
        print(f"Created patient: {patient.first_name} {patient.last_name}")
    
    # Create sample treatment plans
    if patients and practitioners:
        treatment_plans_data = [
            {
                'patient': patients[0],
                'practitioner': practitioners[0],
                'title': 'Panchakarma Detox Program',
                'description': 'Complete detoxification and rejuvenation program including Abhyanga, Swedana, and Virechana',
                'primary_diagnosis': 'Chronic stress and toxin accumulation',
                'treatment_type': 'Panchakarma',
                'start_date': date.today() - timedelta(days=10),
                'end_date': date.today() + timedelta(days=20),
                'total_sessions': 21,
                'completed_sessions': 10,
                'total_cost': 50000.00,
                'paid_amount': 25000.00,
                'medications': 'Triphala, Ashwagandha tablets',
                'dietary_instructions': 'Light vegetarian diet, avoid spicy food, drink warm water',
                'lifestyle_recommendations': 'Regular yoga, meditation, early sleep at 10 PM',
                'status': 'active'
            },
            {
                'patient': patients[1],
                'practitioner': practitioners[1],
                'title': 'Digestive Health Program',
                'description': 'Specialized treatment for digestive disorders and sleep improvement',
                'primary_diagnosis': 'Agni mandya (weak digestion)',
                'treatment_type': 'Shamana',
                'start_date': date.today() - timedelta(days=5),
                'end_date': date.today() + timedelta(days=25),
                'total_sessions': 15,
                'completed_sessions': 3,
                'total_cost': 30000.00,
                'paid_amount': 15000.00,
                'medications': 'Hingvastak Churna, Saraswatarishta',
                'dietary_instructions': 'Eat warm, cooked food. Avoid cold drinks and raw vegetables',
                'lifestyle_recommendations': 'Regular meal times, gentle walk after meals',
                'status': 'active'
            },
            {
                'patient': patients[2],
                'practitioner': practitioners[2],
                'title': 'Arthritis Management',
                'description': 'Ayurvedic treatment for joint pain and anxiety management',
                'primary_diagnosis': 'Amavata (Rheumatoid arthritis)',
                'treatment_type': 'Shodhana',
                'start_date': date.today() + timedelta(days=2),
                'end_date': date.today() + timedelta(days=32),
                'total_sessions': 20,
                'completed_sessions': 0,
                'total_cost': 40000.00,
                'paid_amount': 10000.00,
                'medications': 'Yograj Guggulu, Dashmool Kwath',
                'dietary_instructions': 'Avoid sour and cold foods, include ginger and turmeric',
                'lifestyle_recommendations': 'Gentle yoga, oil massage, stress management',
                'status': 'draft'
            }
        ]
        
        treatment_plans = []
        for data in treatment_plans_data:
            plan = TreatmentPlan.objects.create(**data)
            treatment_plans.append(plan)
            print(f"Created treatment plan: {plan.title}")
    
    # Create sample appointments
    appointments_data = [
        {
            'patient': patients[0],
            'practitioner': practitioners[0],
            'treatment_plan': treatment_plans[0] if 'treatment_plans' in locals() else None,
            'appointment_date': date.today(),
            'appointment_time': datetime.strptime('10:00', '%H:%M').time(),
            'duration_minutes': 60,
            'appointment_type': 'Treatment Session',
            'chief_complaint': 'Follow-up for ongoing Panchakarma treatment',
            'status': 'confirmed'
        },
        {
            'patient': patients[1],
            'practitioner': practitioners[1],
            'treatment_plan': treatment_plans[1] if 'treatment_plans' in locals() else None,
            'appointment_date': date.today(),
            'appointment_time': datetime.strptime('14:00', '%H:%M').time(),
            'duration_minutes': 45,
            'appointment_type': 'Consultation',
            'chief_complaint': 'Digestive issues and sleep problems',
            'status': 'scheduled'
        },
        {
            'patient': patients[2],
            'practitioner': practitioners[2],
            'appointment_date': date.today() + timedelta(days=1),
            'appointment_time': datetime.strptime('11:00', '%H:%M').time(),
            'duration_minutes': 60,
            'appointment_type': 'Initial Consultation',
            'chief_complaint': 'Joint pain and stiffness',
            'status': 'scheduled'
        },
        {
            'patient': patients[3],
            'practitioner': practitioners[0],
            'appointment_date': date.today() + timedelta(days=2),
            'appointment_time': datetime.strptime('15:30', '%H:%M').time(),
            'duration_minutes': 45,
            'appointment_type': 'Consultation',
            'chief_complaint': 'Skin allergies and frequent headaches',
            'status': 'scheduled'
        }
    ]
    
    for data in appointments_data:
        appointment = Appointment.objects.create(**data)
        print(f"Created appointment for {appointment.patient.first_name} on {appointment.appointment_date}")
    
    # Create sample notifications
    notifications_data = [
        {
            'title': 'Appointment Reminder',
            'message': f'You have an appointment tomorrow at 10:00 AM with Dr. {practitioners[0].first_name} {practitioners[0].last_name}',
            'notification_type': 'appointment_reminder',
            'patient': patients[0],
            'status': 'unread'
        },
        {
            'title': 'Treatment Progress Update',
            'message': 'Your Panchakarma treatment is progressing well. Please continue with the prescribed medications.',
            'notification_type': 'treatment_update',
            'patient': patients[0],
            'practitioner': practitioners[0],
            'status': 'unread'
        },
        {
            'title': 'Payment Due Reminder',
            'message': 'Your payment of ₹25,000 for the Digestive Health Program is due in 3 days.',
            'notification_type': 'payment_due',
            'patient': patients[1],
            'status': 'unread'
        },
        {
            'title': 'Welcome to AyurSutra',
            'message': 'Welcome to our Ayurvedic treatment center. We are committed to your health and wellness journey.',
            'notification_type': 'general',
            'patient': patients[4],
            'status': 'read'
        }
    ]
    
    for data in notifications_data:
        notification = Notification.objects.create(**data)
        print(f"Created notification: {notification.title}")
    
    # Create sample feedback
    feedback_data = [
        {
            'patient': patients[0],
            'practitioner': practitioners[0],
            'treatment_plan': treatment_plans[0] if 'treatment_plans' in locals() else None,
            'rating': 5,
            'title': 'Excellent Panchakarma Experience',
            'comment': 'Dr. Sharma provided excellent care during my Panchakarma treatment. I feel much better and more energetic.',
            'treatment_effectiveness': 5,
            'practitioner_care': 5,
            'facility_cleanliness': 4,
            'overall_satisfaction': 5,
            'would_recommend': True,
            'suggestions': 'Perhaps extend the relaxation time after treatments',
            'is_public': True
        },
        {
            'patient': patients[1],
            'practitioner': practitioners[1],
            'treatment_plan': treatment_plans[1] if 'treatment_plans' in locals() else None,
            'rating': 4,
            'title': 'Good Progress with Digestive Issues',
            'comment': 'My digestion has improved significantly. Dr. Verma is very knowledgeable and caring.',
            'treatment_effectiveness': 4,
            'practitioner_care': 5,
            'facility_cleanliness': 4,
            'overall_satisfaction': 4,
            'would_recommend': True,
            'is_public': True
        },
        {
            'patient': patients[2],
            'practitioner': practitioners[0],
            'rating': 3,
            'title': 'Mixed Experience',
            'comment': 'The treatment helped somewhat, but I was expecting better results for the joint pain.',
            'treatment_effectiveness': 3,
            'practitioner_care': 4,
            'facility_cleanliness': 5,
            'overall_satisfaction': 3,
            'would_recommend': True,
            'suggestions': 'More detailed explanation of treatment process would help',
            'is_public': False
        }
    ]
    
    for data in feedback_data:
        feedback = Feedback.objects.create(**data)
        print(f"Created feedback: {feedback.title}")
    
    print("\n" + "="*50)
    print("SAMPLE DATA CREATION COMPLETED!")
    print("="*50)
    print(f"Created {Practitioner.objects.count()} practitioners")
    print(f"Created {Patient.objects.count()} patients")
    print(f"Created {TreatmentPlan.objects.count()} treatment plans")
    print(f"Created {Appointment.objects.count()} appointments")
    print(f"Created {Notification.objects.count()} notifications")
    print(f"Created {Feedback.objects.count()} feedback entries")
    print("\nYou can now access the admin panel at /admin/")
    print("Superuser credentials: admin / admin123")
    print("="*50)

if __name__ == "__main__":
    create_sample_data()