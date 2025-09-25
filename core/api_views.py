from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, datetime
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback
from .serializers import (
    PatientSerializer, PractitionerSerializer, TreatmentPlanSerializer, 
    AppointmentSerializer, NotificationSerializer, FeedbackSerializer
)
import json
import google.generativeai as genai
from django.conf import settings

# ... (keep existing ViewSet classes)

# Configure the Gemini API client
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@csrf_exempt
def get_gemini_response(request):
    """
    Handles chat requests and gets a response from the Gemini API.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message")

            if not user_message:
                return JsonResponse({"error": "Message is required."}, status=400)

            # Send the message to Gemini
            response = chat.send_message(user_message)
            
            # Return the response text
            return JsonResponse({"role": "model", "parts": [{"text": response.text}]})
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)

def dashboard(request):
    """
    Main dashboard view that serves the single-page application
    """
    return render(request, 'dashboard.html')

class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for patients with additional custom actions
    """
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer
    
    @action(detail=False, methods=['get'])
    def active_patients(self, request):
        """Get all active patients"""
        active_patients = self.queryset.filter(status='Active')
        serializer = self.get_serializer(active_patients, many=True)
        return Response(serializer.data)

class PractitionerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for practitioners
    """
    queryset = Practitioner.objects.all().order_by('-created_at')
    serializer_class = PractitionerSerializer

class TreatmentPlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint for treatment plans with additional custom actions
    """
    queryset = TreatmentPlan.objects.all().order_by('-created_at')
    serializer_class = TreatmentPlanSerializer
    
    @action(detail=False, methods=['get'])
    def active_plans(self, request):
        """Get all active treatment plans"""
        active_plans = self.queryset.filter(status='active')
        serializer = self.get_serializer(active_plans, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for appointments with additional custom actions
    """
    queryset = Appointment.objects.all().order_by('-appointment_date', '-appointment_time')
    serializer_class = AppointmentSerializer
    
    @action(detail=False, methods=['get'])
    def todays_appointments(self, request):
        """Get today's appointments"""
        today = date.today()
        todays_appointments = self.queryset.filter(appointment_date=today)
        serializer = self.get_serializer(todays_appointments, many=True)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notifications with additional custom actions
    """
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    
    @action(detail=False, methods=['get'])
    def unread_notifications(self, request):
        """Get all unread notifications"""
        unread_notifications = self.queryset.filter(status='unread')
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

class FeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint for feedback
    """
    queryset = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer