from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include the API URLs from the 'core' app
    path('api/', include('core.urls')),
]
