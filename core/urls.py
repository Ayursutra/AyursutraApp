from django.urls import path
from . import views

urlpatterns = [
    # This maps the root URL of the app to the 'dashboard' view
    path('', views.dashboard, name='dashboard'),
]