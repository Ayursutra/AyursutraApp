# AyurSutra Django Project

This project is a Django-based backend for the AyurSutra Panchakarma Patient Management Dashboard.

## Project Structure

- `ayursutra/`: The main Django project folder.
- `ayursutra/settings.py`: Main project settings, configured to use the `core` app and serve static files.
- `ayursutra/urls.py`: Main URL router, which includes the `core` app's URLs.
- `core/`: The primary Django application.
- `core/urls.py`: URL patterns for the `core` app.
- `core/views.py`: Views that render the main template.
- `static/`: CSS, JS, and image assets served as static files.
- `templates/`: HTML files served by Django.
- `requirements.txt`: Python dependencies for the project.

## Getting Started

1.  Clone this repository.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment.
4.  Install dependencies: `pip install -r requirements.txt`
5.  Run the development server: `python manage.py runserver`

The application will be available at `http://127.0.0.1:8000/`.