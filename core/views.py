from django.shortcuts import render

# Create your views here.
def dashboard(request):
    """
    This view just renders the main dashboard.html template.
    All the dynamic content is handled by the frontend JavaScript.
    """
    return render(request, 'dashboard.html')