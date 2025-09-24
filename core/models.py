from django.db import models

class Patient(models.Model):
    """
    Represents a patient in the system.
    """
    # Basic Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, blank=True)
    
    # Contact Information
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    address = models.TextField(blank=True)
    
    # Medical Information
    prakriti = models.CharField(max_length=100, blank=True)
    vikriti = models.CharField(max_length=100, blank=True)
    medical_history = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    # Status and Timestamps
    status = models.CharField(max_length=50, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['-created_at']

