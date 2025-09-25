from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from authentication.models import CustomUser

@login_required
def admin_dashboard(request):
    """Admin dashboard with full system access"""
    if not (request.user.is_admin or request.user.is_superuser):
        messages.error(request, 'Access denied. Admin privileges required.')
        return redirect('login')
    
    context = {
        'user': request.user,
        'dashboard_type': 'admin',
        'page_title': 'Admin Dashboard - AyurSutra'
    }
    return render(request, 'dashboards/admin_dashboard.html', context)

@login_required
def doctor_dashboard(request):
    """Doctor dashboard with patient management features"""
    if not request.user.is_doctor:
        messages.error(request, 'Access denied. Doctor privileges required.')
        return redirect('login')
    
    context = {
        'user': request.user,
        'dashboard_type': 'doctor',
        'page_title': 'Doctor Dashboard - AyurSutra'
    }
    return render(request, 'dashboards/doctor_dashboard.html', context)

@login_required
def patient_dashboard(request):
    """Patient dashboard with personal health information"""
    if not request.user.is_patient:
        messages.error(request, 'Access denied. Patient privileges required.')
        return redirect('login')
    
    context = {
        'user': request.user,
        'dashboard_type': 'patient',
        'page_title': 'Patient Dashboard - AyurSutra'
    }
    return render(request, 'dashboards/patient_dashboard.html', context)

def logout_view(request):
    """Logout user and redirect to login page"""
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('login')

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """API endpoint to change user password"""
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not request.user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=400)
    
    request.user.set_password(new_password)
    request.user.save()
    
    return Response({'message': 'Password changed successfully'})


# core/api_views.py (Enhanced)

import json
import random
from datetime import date, datetime, timedelta
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback
from .serializers import (
    PatientSerializer, PractitionerSerializer, TreatmentPlanSerializer, 
    AppointmentSerializer, NotificationSerializer, FeedbackSerializer
)

class PatientViewSet(viewsets.ModelViewSet):
    """API endpoint for patients with role-based access"""
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Patient.objects.all().order_by('-created_at')
        elif user.is_doctor:
            # Doctors can see their patients
            return Patient.objects.filter(
                treatment_plans__practitioner__user=user
            ).distinct().order_by('-created_at')
        else:
            # Patients can only see their own data
            try:
                patient = Patient.objects.get(email=user.email)
                return Patient.objects.filter(id=patient.id)
            except Patient.DoesNotExist:
                return Patient.objects.none()
    
    @action(detail=False, methods=['get'])
    def active_patients(self, request):
        """Get all active patients"""
        active_patients = self.get_queryset().filter(status='Active')
        serializer = self.get_serializer(active_patients, many=True)
        return Response(serializer.data)

class PractitionerViewSet(viewsets.ModelViewSet):
    """API endpoint for practitioners"""
    serializer_class = PractitionerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Practitioner.objects.all().order_by('-created_at')

class TreatmentPlanViewSet(viewsets.ModelViewSet):
    """API endpoint for treatment plans with role-based access"""
    serializer_class = TreatmentPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return TreatmentPlan.objects.all().order_by('-created_at')
        elif user.is_doctor:
            return TreatmentPlan.objects.filter(
                practitioner__user=user
            ).order_by('-created_at')
        else:
            # Patients can see their own treatment plans
            try:
                patient = Patient.objects.get(email=user.email)
                return TreatmentPlan.objects.filter(patient=patient).order_by('-created_at')
            except Patient.DoesNotExist:
                return TreatmentPlan.objects.none()
    
    @action(detail=False, methods=['get'])
    def active_plans(self, request):
        """Get all active treatment plans"""
        active_plans = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_plans, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    """API endpoint for appointments with role-based access"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Appointment.objects.all().order_by('-appointment_date', '-appointment_time')
        elif user.is_doctor:
            return Appointment.objects.filter(
                practitioner__user=user
            ).order_by('-appointment_date', '-appointment_time')
        else:
            # Patients can see their own appointments
            try:
                patient = Patient.objects.get(email=user.email)
                return Appointment.objects.filter(patient=patient).order_by('-appointment_date', '-appointment_time')
            except Patient.DoesNotExist:
                return Appointment.objects.none()
    
    @action(detail=False, methods=['get'])
    def todays_appointments(self, request):
        """Get today's appointments"""
        today = date.today()
        todays_appointments = self.get_queryset().filter(appointment_date=today)
        serializer = self.get_serializer(todays_appointments, many=True)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    """API endpoint for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Notification.objects.all().order_by('-created_at')
        elif user.is_doctor:
            return Notification.objects.filter(
                practitioner__user=user
            ).order_by('-created_at')
        else:
            # Patients see their own notifications
            try:
                patient = Patient.objects.get(email=user.email)
                return Notification.objects.filter(patient=patient).order_by('-created_at')
            except Patient.DoesNotExist:
                return Notification.objects.none()
    
    @action(detail=False, methods=['get'])
    def unread_notifications(self, request):
        """Get all unread notifications"""
        unread_notifications = self.get_queryset().filter(status='unread')
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

class FeedbackViewSet(viewsets.ModelViewSet):
    """API endpoint for feedback"""
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Feedback.objects.all().order_by('-created_at')
        elif user.is_doctor:
            return Feedback.objects.filter(
                practitioner__user=user
            ).order_by('-created_at')
        else:
            # Patients see their own feedback
            try:
                patient = Patient.objects.get(email=user.email)
                return Feedback.objects.filter(patient=patient).order_by('-created_at')
            except Patient.DoesNotExist:
                return Feedback.objects.none()

class DashboardStatsAPIView(APIView):
    """API endpoint for dashboard statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        today = date.today()
        
        if user.is_admin:
            stats = {
                'total_patients': Patient.objects.count(),
                'active_patients': Patient.objects.filter(status='Active').count(),
                'total_doctors': Practitioner.objects.filter(status='Active').count(),
                'todays_appointments': Appointment.objects.filter(appointment_date=today).count(),
                'pending_appointments': Appointment.objects.filter(status='scheduled').count(),
                'active_treatment_plans': TreatmentPlan.objects.filter(status='active').count(),
                'unread_notifications': Notification.objects.filter(status='unread').count(),
                'recent_feedback': Feedback.objects.count(),
            }
        elif user.is_doctor:
            try:
                practitioner = Practitioner.objects.get(user=user)
                stats = {
                    'my_patients': Patient.objects.filter(treatment_plans__practitioner=practitioner).distinct().count(),
                    'todays_appointments': Appointment.objects.filter(practitioner=practitioner, appointment_date=today).count(),
                    'pending_appointments': Appointment.objects.filter(practitioner=practitioner, status='scheduled').count(),
                    'active_treatment_plans': TreatmentPlan.objects.filter(practitioner=practitioner, status='active').count(),
                    'unread_notifications': Notification.objects.filter(practitioner=practitioner, status='unread').count(),
                    'recent_feedback': Feedback.objects.filter(practitioner=practitioner).count(),
                }
            except Practitioner.DoesNotExist:
                stats = {}
        else:
            # Patient stats
            try:
                patient = Patient.objects.get(email=user.email)
                stats = {
                    'my_appointments': Appointment.objects.filter(patient=patient).count(),
                    'upcoming_appointments': Appointment.objects.filter(
                        patient=patient, 
                        appointment_date__gte=today,
                        status__in=['scheduled', 'confirmed']
                    ).count(),
                    'active_treatment_plans': TreatmentPlan.objects.filter(patient=patient, status='active').count(),
                    'completed_sessions': sum([plan.completed_sessions for plan in TreatmentPlan.objects.filter(patient=patient)]),
                    'unread_notifications': Notification.objects.filter(patient=patient, status='unread').count(),
                }
            except Patient.DoesNotExist:
                stats = {}
        
        return Response(stats)

class ChatBotAPIView(APIView):
    """AI Chatbot API endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message', '')
        chat_history = request.data.get('chat_history', [])
        
        if not message:
            return Response({'error': 'Message is required'}, status=400)
        
        try:
            # Mock AI response (replace with actual AI integration)
            response = self.get_ai_response(message, chat_history, request.user)
            
            return Response({
                'response': response,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    def get_ai_response(self, message, chat_history, user):
        """Generate AI response based on message and context"""
        
        # Mock responses based on keywords and user type
        message_lower = message.lower()
        
        # Ayurveda-specific responses
        if 'panchakarma' in message_lower:
            return ("Panchakarma is a set of five therapeutic procedures in Ayurveda designed to cleanse and detoxify the body. "
                   "These include Vamana (therapeutic vomiting), Virechana (purgation), Basti (medicated enemas), "
                   "Nasya (nasal administration), and Raktamokshana (bloodletting). Would you like to know more about any specific procedure?")
        
        elif 'appointment' in message_lower:
            if user.is_patient:
                return ("I can help you with appointment-related queries. To schedule a new appointment, please visit the 'Schedule' section "
                       "in your dashboard. You can view your upcoming appointments and their details there. "
                       "Is there a specific appointment you'd like to inquire about?")
            else:
                return ("You can manage appointments from your dashboard. Today's appointments are displayed in the schedule section. "
                       "You can view, modify, or add notes to appointments as needed.")
        
        elif 'treatment' in message_lower or 'plan' in message_lower:
            return ("Treatment plans in Ayurveda are personalized based on your Prakriti (constitution) and Vikriti (current imbalance). "
                   "They typically include dietary guidelines, lifestyle recommendations, herbal medicines, and therapeutic procedures. "
                   "You can view your current treatment plans in the 'Treatment Plans' section of your dashboard.")
        
        elif 'dosha' in message_lower or 'vata' in message_lower or 'pitta' in message_lower or 'kapha' in message_lower:
            return ("The three doshas - Vata, Pitta, and Kapha - are fundamental energies in Ayurveda that govern our physical and mental processes. "
                   "Vata controls movement and circulation, Pitta governs metabolism and digestion, and Kapha provides structure and immunity. "
                   "Understanding your dominant dosha helps in creating personalized treatment approaches.")
        
        elif 'diet' in message_lower or 'food' in message_lower:
            return ("Ayurvedic nutrition emphasizes eating according to your constitution and current health state. "
                   "Generally, favor warm, cooked foods over cold and raw ones. Include all six tastes (sweet, sour, salty, pungent, bitter, astringent) "
                   "in your meals. Eat mindfully and at regular times. Your specific dietary recommendations are available in your treatment plan.")
        
        elif 'medication' in message_lower or 'medicine' in message_lower:
            return ("Ayurvedic medicines are typically herbal formulations designed to balance your doshas and treat specific conditions. "
                   "Always take medications as prescribed by your practitioner. If you have questions about your current medications, "
                   "please consult with your doctor or check your treatment plan for details.")
        
        elif 'yoga' in message_lower or 'exercise' in message_lower:
            return ("Yoga and appropriate exercise are important components of Ayurvedic treatment. The type and intensity should match your constitution. "
                   "Vata types benefit from gentle, grounding practices; Pitta types need moderate, cooling activities; "
                   "Kapha types require more vigorous, energizing exercises. Check your lifestyle recommendations for specific guidance.")
        
        elif 'meditation' in message_lower or 'stress' in message_lower:
            return ("Stress management through meditation, pranayama (breathing exercises), and mindfulness practices are essential in Ayurveda. "
                   "Regular meditation helps balance the nervous system and supports healing. Even 10-15 minutes daily can be beneficial. "
                   "Consider practices like alternate nostril breathing or simple mindfulness meditation.")
        
        elif 'sleep' in message_lower:
            return ("Good sleep is crucial for healing in Ayurveda. Aim for 7-8 hours of sleep, going to bed before 10 PM when possible. "
                   "Create a calming bedtime routine, avoid screens before sleep, and ensure your sleeping environment is comfortable. "
                   "Different constitutions may have varying sleep needs and patterns.")
        
        elif 'side effects' in message_lower or 'reaction' in message_lower:
            return ("If you're experiencing any unexpected symptoms or reactions, please contact your healthcare provider immediately. "
                   "While Ayurvedic treatments are generally safe, individual responses can vary. "
                   "Keep a record of any changes you notice and discuss them during your next consultation.")
        
        # Dashboard navigation help
        elif 'help' in message_lower or 'how to' in message_lower:
            if user.is_admin:
                return ("As an admin, you have access to all system features. You can manage patients, doctors, appointments, and treatment plans. "
                       "Use the navigation menu to access different sections. The dashboard shows overall system statistics and recent activities.")
            elif user.is_doctor:
                return ("Your doctor dashboard allows you to manage your patients, appointments, and treatment plans. "
                       "You can view today's schedule, update patient records, create treatment plans, and communicate with patients through notifications.")
            else:
                return ("Your patient dashboard shows your appointments, treatment plans, and health information. "
                       "You can view upcoming appointments, track treatment progress, and access educational resources about your care.")
        
        # General greetings and conversational responses
        elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
            return f"Hello! I'm your AyurSutra AI assistant. I'm here to help you with questions about Ayurveda, your treatments, and using the dashboard. How can I assist you today?"
        
        elif any(word in message_lower for word in ['thank', 'thanks']):
            return "You're welcome! I'm here whenever you need assistance with your Ayurvedic health journey. Feel free to ask me anything about treatments, lifestyle, or using the platform."
        
        elif 'prakriti' in message_lower or 'constitution' in message_lower:
            return ("Prakriti is your unique Ayurvedic constitution determined at conception. It represents your natural state and doesn't change throughout life. "
                   "Understanding your Prakriti helps in choosing appropriate foods, lifestyle practices, and treatments. "
                   "Your practitioner can help determine your constitution through detailed consultation and examination.")
        
        else:
            # Default response with helpful suggestions
            return ("I'm here to help with your Ayurvedic health journey! I can answer questions about:\n\n"
                   "🌿 Ayurvedic concepts (doshas, prakriti, treatments)\n"
                   "📅 Appointments and scheduling\n"
                   "💊 Treatment plans and medications\n"
                   "🧘 Lifestyle recommendations\n"
                   "🍽️ Dietary guidelines\n"
                   "📱 Using your dashboard\n\n"
                   "What would you like to know more about?")

# Additional utility functions for the chatbot
def get_user_context_info(user):
    """Get relevant user context for personalized responses"""
    context = {
        'user_type': user.user_type,
        'is_new_user': user.date_joined > datetime.now() - timedelta(days=7)
    }
    
    if user.is_patient:
        try:
            patient = Patient.objects.get(email=user.email)
            context.update({
                'has_active_treatment': TreatmentPlan.objects.filter(patient=patient, status='active').exists(),
                'upcoming_appointments': Appointment.objects.filter(
                    patient=patient, 
                    appointment_date__gte=date.today(),
                    status__in=['scheduled', 'confirmed']
                ).count()
            })
        except Patient.DoesNotExist:
            pass
    
    return context