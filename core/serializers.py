from rest_framework import serializers
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback

class PatientSerializer(serializers.ModelSerializer):
    """Serializer for Patient model"""
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate_phone(self, value):
        """Ensure phone number is unique"""
        if self.instance and self.instance.phone == value:
            return value
        if Patient.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A patient with this phone number already exists.")
        return value

    def validate_email(self, value):
        """Ensure email is unique if provided"""
        if not value:
            return value
        if self.instance and self.instance.email == value:
            return value
        if Patient.objects.filter(email=value).exists():
            raise serializers.ValidationError("A patient with this email already exists.")
        return value

class PractitionerSerializer(serializers.ModelSerializer):
    """Serializer for Practitioner model"""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Practitioner
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_full_name(self, obj):
        return f"Dr. {obj.first_name} {obj.last_name}"

    def validate_phone(self, value):
        """Ensure phone number is unique"""
        if self.instance and self.instance.phone == value:
            return value
        if Practitioner.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A practitioner with this phone number already exists.")
        return value

    def validate_email(self, value):
        """Ensure email is unique"""
        if self.instance and self.instance.email == value:
            return value
        if Practitioner.objects.filter(email=value).exists():
            raise serializers.ValidationError("A practitioner with this email already exists.")
        return value

    def validate_license_number(self, value):
        """Ensure license number is unique"""
        if self.instance and self.instance.license_number == value:
            return value
        if Practitioner.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("A practitioner with this license number already exists.")
        return value

class TreatmentPlanSerializer(serializers.ModelSerializer):
    """Serializer for TreatmentPlan model"""
    
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()
    remaining_amount = serializers.ReadOnlyField()
    
    class Meta:
        model = TreatmentPlan
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'remaining_amount')

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_practitioner_name(self, obj):
        return f"Dr. {obj.practitioner.first_name} {obj.practitioner.last_name}"

    def validate(self, data):
        """Validate treatment plan dates"""
        if 'start_date' in data and 'end_date' in data:
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError("Start date cannot be after end date.")
        
        if 'total_sessions' in data and 'completed_sessions' in data:
            if data['completed_sessions'] > data['total_sessions']:
                raise serializers.ValidationError("Completed sessions cannot exceed total sessions.")
        
        if 'total_cost' in data and 'paid_amount' in data:
            if data['paid_amount'] > data['total_cost']:
                raise serializers.ValidationError("Paid amount cannot exceed total cost.")
        
        return data

class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model"""
    
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_practitioner_name(self, obj):
        return f"Dr. {obj.practitioner.first_name} {obj.practitioner.last_name}"

    def validate(self, data):
        """Validate appointment data"""
        # Check if appointment slot is already taken
        if 'appointment_date' in data and 'appointment_time' in data and 'practitioner' in data:
            existing_appointment = Appointment.objects.filter(
                appointment_date=data['appointment_date'],
                appointment_time=data['appointment_time'],
                practitioner=data['practitioner']
            )
            
            # Exclude current instance if updating
            if self.instance:
                existing_appointment = existing_appointment.exclude(pk=self.instance.pk)
            
            if existing_appointment.exists():
                raise serializers.ValidationError(
                    "This time slot is already booked for the selected practitioner."
                )
        
        return data

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return None

    def get_practitioner_name(self, obj):
        if obj.practitioner:
            return f"Dr. {obj.practitioner.first_name} {obj.practitioner.last_name}"
        return None

class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Feedback model"""
    
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_patient_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_practitioner_name(self, obj):
        return f"Dr. {obj.practitioner.first_name} {obj.practitioner.last_name}"

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value