from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, PractitionerViewSet, TreatmentPlanViewSet,
    AppointmentViewSet, NotificationViewSet, FeedbackViewSet, ChatBotAPIView
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
]