import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# ... (keep the secret key and debug settings)


# Application definition
# ADD 'core' TO YOUR INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core', # <-- ADD THIS LINE
]

# ... (keep middleware settings)


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # TELL DJANGO WHERE TO FIND YOUR TEMPLATES FOLDER
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # <-- ADD THIS LINE
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ... (keep database and password validator settings)


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# TELL DJANGO WHERE TO FIND YOUR STATIC FOLDER
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'), # <-- ADD THIS LINE
]

# ... (keep default auto field)