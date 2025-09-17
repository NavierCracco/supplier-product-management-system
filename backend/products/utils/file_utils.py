import os
from django.conf import settings

def get_providers_path():
    """Get the path to the providers directory"""
    return os.path.join(settings.BASE_DIR, "providers")

def get_config_path():
    """Get the path to the config-proveedores.json file"""
    return os.path.join(settings.BASE_DIR, "config", "config_proveedores.json")