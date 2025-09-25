from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import google.generativeai as genai
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback
from .serializers import (
    PatientSerializer, PractitionerSerializer, TreatmentPlanSerializer,
    AppointmentSerializer, NotificationSerializer, FeedbackSerializer
)

# Configure the Gemini API client
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Patient.objects.all()
        elif user.is_doctor:
            return Patient.objects.filter(treatment_plans__practitioner__user=user).distinct()
        else:
            return Patient.objects.filter(user=user)

class PractitionerViewSet(viewsets.ModelViewSet):
    queryset = Practitioner.objects.all()
    serializer_class = PractitionerSerializer
    permission_classes = [permissions.IsAuthenticated]

class TreatmentPlanViewSet(viewsets.ModelViewSet):
    serializer_class = TreatmentPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return TreatmentPlan.objects.all()
        elif user.is_doctor:
            return TreatmentPlan.objects.filter(practitioner__user=user)
        else:
            return TreatmentPlan.objects.filter(patient__user=user)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Appointment.objects.all()
        elif user.is_doctor:
            return Appointment.objects.filter(practitioner__user=user)
        else:
            return Appointment.objects.filter(patient__user=user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Notification.objects.all()
        elif user.is_doctor:
            return Notification.objects.filter(practitioner__user=user)
        else:
            return Notification.objects.filter(patient__user=user)

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Feedback.objects.all()
        elif user.is_doctor:
            return Feedback.objects.filter(practitioner__user=user)
        else:
            return Feedback.objects.filter(patient__user=user)

class ChatBotAPIView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            response = chat.send_message(user_message)
            return Response({"role": "model", "parts": [{"text": response.text}]})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)