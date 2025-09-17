import json
import logging
from products.utils.file_utils import get_config_path
from products.models import Product

logger = logging.getLogger(__name__)

def remove_provider_config(filename):
    """
    Removes the entry associated with the provider from the configuration, based on the filename
    """
    config_path = get_config_path()
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config_providers = json.load(f)
    except json.JSONDecodeError:
        config_providers = {}
        logger.error("Error al decodificar el JSON de configuración.")

    file_without_extension = filename.split('.')[0].strip().lower()
    provider_name = file_without_extension.split('_')[0]
    if provider_name in config_providers:
        del config_providers[provider_name]
        logger.info(f"Proveedor {provider_name} eliminado de la configuración.")
    try:
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config_providers, f, indent=2, ensure_ascii=False)
        logger.info("Archivo de configuración actualizado correctamente.")
    except Exception as e:
        logger.exception("Error al actualizar la configuración tras eliminar el archivo.")
        raise e
    

def rename_provider_config(old_name, new_name):
    """
    Rename the entry in the provider settings
    """
    config_path = get_config_path()
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config_data = json.load(f)
    except json.JSONDecodeError as e:
        logger.error("Error al cargar la configuración para renombrar: %s", e)
        config_data = {}

    # Derive the keys (based on the name before “_” and in lowercase)
    old_key = old_name.split('.')[0].split('_')[0].lower()
    new_key = new_name.split('.')[0].split('_')[0].lower()

    if old_key in config_data:
        # Update the configuration: move the old entry to the new key
        config_data[new_key] = config_data.pop(old_key)
        logger.info("Renombrada configuración de '%s' a '%s'", old_key, new_key)
    else:
        logger.warning("No se encontró configuración para la clave antigua '%s'", old_key)

    # Save updated settings
    try:
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config_data, f, indent=2, ensure_ascii=False)
        logger.info("Archivo de configuración actualizado correctamente.")
    except Exception as e:
        logger.exception("Error al guardar la configuración renombrada")
        return False

    # Update the database: change the 'provider' field in the associated products
    try:
        updated = Product.objects.filter(proveedor=old_key).update(proveedor=new_key)
        logger.info("Se actualizaron %s productos de '%s' a '%s'", updated, old_key, new_key)
    except Exception as e:
        logger.exception("Error al actualizar los productos en la base de datos: %s", e)
        return False

    return True