from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from . import views
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, PractitionerViewSet, TreatmentPlanViewSet, 
    AppointmentViewSet, NotificationViewSet, FeedbackViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'practitioners', PractitionerViewSet)
router.register(r'treatment-plans', TreatmentPlanViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'feedback', FeedbackViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    # Main dashboard view
    path('', views.dashboard, name='dashboard'),
    
    # API endpoints
    path('api/', include(router.urls)),
    
    # Additional API endpoints if needed
    # path('api/auth/', include('rest_framework.urls', namespace='rest_framework')),
]