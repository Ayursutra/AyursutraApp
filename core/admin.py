from django.contrib import admin
from .models import Patient, Practitioner, TreatmentPlan, Appointment, Notification, Feedback

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email', 'status', 'created_at')
    list_filter = ('status', 'gender', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

# ... (register other models as before)