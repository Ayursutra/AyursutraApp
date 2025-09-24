from rest_framework import viewsets
from .models import Patient, Practitioner, TreatmentPlan, Notification
from .serializers import PatientSerializer, PractitionerSerializer, TreatmentPlanSerializer, NotificationSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class PractitionerViewSet(viewsets.ModelViewSet):
    queryset = Practitioner.objects.all()
    serializer_class = PractitionerSerializer

class TreatmentPlanViewSet(viewsets.ModelViewSet):
    queryset = TreatmentPlan.objects.all()
    serializer_class = TreatmentPlanSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer