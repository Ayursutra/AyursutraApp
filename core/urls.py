# core/urls.py

from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, 
    PractitionerViewSet, 
    TreatmentPlanViewSet, 
    AppointmentViewSet, 
    NotificationViewSet, 
    FeedbackViewSet,
    get_gemini_response # Now this import will work
)

# Define the router
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'practitioners', PractitionerViewSet)
router.register(r'treatment-plans', TreatmentPlanViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'feedback', FeedbackViewSet)

# Define the URL patterns
urlpatterns = [
    # Main dashboard view
    path('', views.dashboard, name='dashboard'),
    
    # API endpoints from the router
    path('api/', include(router.urls)),
    
    # Chatbot API endpoint
    path('api/chat/', views.get_gemini_response, name='gemini_chat'),
]