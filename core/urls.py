from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, PractitionerViewSet, TreatmentPlanViewSet,
    AppointmentViewSet, NotificationViewSet, FeedbackViewSet, ChatBotAPIView,
    admin_dashboard, doctor_dashboard, patient_dashboard
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'practitioners', PractitionerViewSet, basename='practitioner')
router.register(r'treatment-plans', TreatmentPlanViewSet, basename='treatmentplan')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', ChatBotAPIView.as_view(), name='chatbot'),
    
    # Dashboard URL patterns
    path('admin-dashboard/', admin_dashboard, name='admin_dashboard'),
    path('doctor-dashboard/', doctor_dashboard, name='doctor_dashboard'),
    path('patient-dashboard/', patient_dashboard, name='patient_dashboard'),
]