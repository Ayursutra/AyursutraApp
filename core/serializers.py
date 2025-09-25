from rest_framework import serializers
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class PractitionerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Practitioner
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_full_name(self, obj):
        return f"Dr. {obj.first_name} {obj.last_name}"

class TreatmentPlanSerializer(serializers.ModelSerializer):
    patient_name = serializers.StringRelatedField(source='patient')
    practitioner_name = serializers.StringRelatedField(source='practitioner')
    remaining_amount = serializers.ReadOnlyField()

    class Meta:
        model = TreatmentPlan
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'remaining_amount')

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.StringRelatedField(source='patient')
    practitioner_name = serializers.StringRelatedField(source='practitioner')

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class NotificationSerializer(serializers.ModelSerializer):
    patient_name = serializers.StringRelatedField(source='patient')
    practitioner_name = serializers.StringRelatedField(source='practitioner')

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class FeedbackSerializer(serializers.ModelSerializer):
    patient_name = serializers.StringRelatedField(source='patient')
    practitioner_name = serializers.StringRelatedField(source='practitioner')

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')