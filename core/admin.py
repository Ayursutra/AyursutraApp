from django.contrib import admin
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email', 'status', 'created_at')
    list_filter = ('status', 'gender', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Practitioner)
class PractitionerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'specialization', 'phone', 'email', 'status', 'created_at')
    list_filter = ('status', 'specialization', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone', 'email', 'license_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TreatmentPlan)
class TreatmentPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'practitioner', 'status', 'start_date', 'end_date', 'total_cost')
    list_filter = ('status', 'treatment_type', 'start_date', 'created_at')
    search_fields = ('title', 'patient__first_name', 'patient__last_name', 'practitioner__first_name', 'practitioner__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'remaining_amount')
    date_hierarchy = 'start_date'

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'practitioner', 'appointment_date', 'appointment_time', 'status', 'appointment_type')
    list_filter = ('status', 'appointment_type', 'appointment_date', 'created_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'practitioner__first_name', 'practitioner__last_name')
    ordering = ('-appointment_date', '-appointment_time')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'appointment_date'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'patient', 'practitioner', 'status', 'created_at')
    list_filter = ('notification_type', 'status', 'created_at')
    search_fields = ('title', 'message', 'patient__first_name', 'patient__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'practitioner', 'rating', 'overall_satisfaction', 'would_recommend', 'created_at')
    list_filter = ('rating', 'overall_satisfaction', 'would_recommend', 'is_public', 'created_at')
    search_fields = ('title', 'comment', 'patient__first_name', 'patient__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')