from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile', {'fields': ('user_type', 'phone', 'date_of_birth', 'address', 'profile_picture', 'is_verified')}),
        ('Professional Info', {'fields': ('license_number', 'specialization', 'emergency_contact')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile', {'fields': ('user_type', 'email', 'first_name', 'last_name', 'phone')}),
    )