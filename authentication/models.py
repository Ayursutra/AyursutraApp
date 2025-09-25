from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (('admin', 'Admin'), ('doctor', 'Doctor'), ('patient', 'Patient'))
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='patient')
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    @property
    def is_admin(self):
        return self.user_type == 'admin' or self.is_superuser

    @property
    def is_doctor(self):
        return self.user_type == 'doctor'

    @property
    def is_patient(self):
        return self.user_type == 'patient'

    class Meta:
        db_table = 'auth_custom_user'