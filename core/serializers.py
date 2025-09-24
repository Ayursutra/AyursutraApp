from rest_framework import serializers
from .models import Patient, Practitioner, TreatmentPlan, Notification

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PractitionerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practitioner
        fields = '__all__'

class TreatmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentPlan
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'