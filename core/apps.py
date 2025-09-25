from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'AyurSutra Core'
    
    def ready(self):
        """
        This method is called when Django starts.
        You can use it to register signals or perform other initialization.
        """
        pass