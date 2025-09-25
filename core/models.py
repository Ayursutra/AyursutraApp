from django.db import models
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    # ... (the rest of your Patient model fields)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    address = models.TextField(blank=True)
    prakriti = models.CharField(max_length=100, blank=True)
    vikriti = models.CharField(max_length=100, blank=True)
    medical_history = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=50, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['-created_at']


class Practitioner(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='practitioner_profile')
    # ... (the rest of your Practitioner model fields)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=200)
    qualification = models.CharField(max_length=200)
    experience_years = models.IntegerField(default=0)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    address = models.TextField(blank=True)
    license_number = models.CharField(max_length=100, unique=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_days = models.CharField(max_length=100, default='Monday to Saturday')
    consultation_hours = models.CharField(max_length=100, default='9:00 AM - 5:00 PM')
    status = models.CharField(max_length=50, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

    class Meta:
        ordering = ['-created_at']

# ... (rest of your models: TreatmentPlan, Appointment, Notification, Feedback)
class TreatmentPlan(models.Model):
    """
    Represents a treatment plan for a patient.
    """
    PLAN_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatment_plans')
    practitioner = models.ForeignKey(Practitioner, on_delete=models.CASCADE, related_name='treatment_plans')

    title = models.CharField(max_length=200)
    description = models.TextField()
    primary_diagnosis = models.CharField(max_length=200)
    secondary_diagnosis = models.CharField(max_length=200, blank=True)
    treatment_type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    total_sessions = models.IntegerField(default=1)
    completed_sessions = models.IntegerField(default=0)
    medications = models.TextField(blank=True)
    dietary_instructions = models.TextField(blank=True)
    lifestyle_recommendations = models.TextField(blank=True)
    follow_up_instructions = models.TextField(blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=PLAN_STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.patient.first_name} {self.patient.last_name}"

    @property
    def remaining_amount(self):
        return self.total_cost - self.paid_amount

    class Meta:
        ordering = ['-created_at']


class Appointment(models.Model):
    """
    Represents an appointment between a patient and practitioner.
    """
    APPOINTMENT_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    practitioner = models.ForeignKey(Practitioner, on_delete=models.CASCADE, related_name='appointments')
    treatment_plan = models.ForeignKey(TreatmentPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)
    appointment_type = models.CharField(max_length=100, default='Consultation')
    chief_complaint = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=APPOINTMENT_STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.appointment_date} {self.appointment_time}"

    class Meta:
        ordering = ['-appointment_date', '-appointment_time']


class Notification(models.Model):
    """
    Represents notifications for users.
    """
    NOTIFICATION_TYPES = [
        ('appointment_reminder', 'Appointment Reminder'),
        ('treatment_update', 'Treatment Update'),
        ('payment_due', 'Payment Due'),
        ('general', 'General'),
        ('system', 'System'),
    ]

    NOTIFICATION_STATUS = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='general')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    practitioner = models.ForeignKey(Practitioner, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    treatment_plan = models.ForeignKey(TreatmentPlan, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    status = models.CharField(max_length=20, choices=NOTIFICATION_STATUS, default='unread')
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.notification_type}"

    class Meta:
        ordering = ['-created_at']


class Feedback(models.Model):
    """
    Represents feedback from patients about their treatment.
    """
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='feedback')
    practitioner = models.ForeignKey(Practitioner, on_delete=models.CASCADE, related_name='feedback')
    treatment_plan = models.ForeignKey(TreatmentPlan, on_delete=models.CASCADE, null=True, blank=True, related_name='feedback')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True, related_name='feedback')
    rating = models.IntegerField(choices=RATING_CHOICES)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    treatment_effectiveness = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    practitioner_care = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    facility_cleanliness = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    overall_satisfaction = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    would_recommend = models.BooleanField(default=True)
    suggestions = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.rating} stars by {self.patient}"

    class Meta:
        ordering = ['-created_at']