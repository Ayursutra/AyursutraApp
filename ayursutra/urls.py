from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api_views import (
    PatientViewSet, PractitionerViewSet, TreatmentPlanViewSet, 
    AppointmentViewSet, NotificationViewSet, FeedbackViewSet,
    ChatBotAPIView, DashboardStatsAPIView
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'practitioners', PractitionerViewSet)
router.register(r'treatment-plans', TreatmentPlanViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    # Dashboard views
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('doctor-dashboard/', views.doctor_dashboard, name='doctor_dashboard'),
    path('patient-dashboard/', views.patient_dashboard, name='patient_dashboard'),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/chatbot/', ChatBotAPIView.as_view(), name='chatbot'),
    path('api/dashboard-stats/', DashboardStatsAPIView.as_view(), name='dashboard_stats'),
]