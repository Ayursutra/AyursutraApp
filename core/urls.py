from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .api_views import PatientViewSet, PractitionerViewSet, TreatmentPlanViewSet, NotificationViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'practitioners', PractitionerViewSet)
router.register(r'treatment-plans', TreatmentPlanViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    # This maps the root URL of the app to the 'dashboard' view
    path('', views.dashboard, name='dashboard'),
    path('api/', include(router.urls)),
]