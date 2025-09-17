"""
PROVIDER CONFIGURATION API - Dynamic ETL Configuration Management

Enables adding new suppliers without code changes through JSON configuration.
Handles column mapping and extraction parameters for diverse Excel formats.
"""

import os
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from products.utils.file_utils import get_config_path
from products.utils.validators import validate_provider_config

logger = logging.getLogger(__name__)

@csrf_exempt
def provider_config(request):
    """
    Manages dynamic supplier configuration for ETL pipeline scalability.
    
    BUSINESS FLEXIBILITY: Enables adding new suppliers without code deployment.
    Handles column mapping variations across different Excel formats.
    """
    config_path = get_config_path()
    
    if request.method == "GET":
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)
            return JsonResponse(config_data, safe=False)
        except Exception as e:
            logger.exception("Error al leer la configuración")
            return JsonResponse({"error": f"Error al leer la configuración: {str(e)}"}, status=500)
    
    elif request.method == "PUT":
        try:
            new_config = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud inválida. Se esperaba JSON."}, status=400)
        
        # Transform simplified config format to internal ETL format
        if "file_name" in new_config:
            file_name = new_config.get("file_name")
            if not file_name:
                return JsonResponse({"error": "El campo 'file_name' no puede estar vacío."}, status=400)
            file_without_extension = file_name.split('.')[0].lower()
            provider_key = file_without_extension.split('_')[0].lower()
            start_row = new_config.get("start_row", 0) - 1
            column_range = new_config.get("column_range", {})
            start_col = column_range.get("start", "")
            end_col = column_range.get("end", "")
            usecols = f"{start_col}:{end_col}" if start_col and end_col else None

            columns = new_config.get("columns", {})
            if not all(k in columns for k in ["item", "product_name", "price"]):
                return JsonResponse({"error": "El objeto 'columns' debe incluir 'item', 'product_name' y 'price'."}, status=400)
            
            # Column mapping configuration for ETL transformation
            transformed_config = {
                provider_key: {
                    "extract_config": {
                        "skiprows": start_row,
                        "usecols": usecols
                    },
                    "transform_config": {
                        "column_mappings": {
                            columns["item"]: "item",
                            columns["product_name"]: "product_name",
                            columns["price"]: "product_price"
                        }
                    }
                }
            }
            new_config = transformed_config

        # Load existing configuration and merge
        existing_config = {}
        if os.path.exists(config_path):
            try:
                with open(config_path, "r", encoding="utf-8") as f:
                    existing_config = json.load(f)
            except Exception as e:
                logger.error("Error al leer la configuración existente. Se procederá a crear una nueva configuración.")
                existing_config = {}

        merged_config = {**existing_config, **new_config}

        try:
            validate_provider_config(merged_config)
        except ValueError as ve:
            logger.error(f"Error de validación: {str(ve)}")
            return JsonResponse({"error": f"Error de validación: {str(ve)}"}, status=400)

        try:
            with open(config_path, "w", encoding="utf-8") as f:
                json.dump(merged_config, f, indent=2, ensure_ascii=False)
            return JsonResponse({"message": "Configuración actualizada correctamente."})
        except Exception as e:
            logger.exception("Error al actualizar la configuración")
            return JsonResponse({"error": f"Error al actualizar la configuración: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Método no permitido."}, status=405)

@csrf_exempt
def get_file_config(request, file_identifier):
    """
    Returns specific configuration for supplier file processing.
    Supports dynamic column mapping lookup for ETL operations.
    """
    file_without_extension = file_identifier.split('.')[0].lower()
    provider_name = file_without_extension.split('_')[0]
    config_path = get_config_path()
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config_data = json.load(f)
            logger.info(f"Configuración cargada: {config_data}")
    except json.JSONDecodeError as e:
        logger.error(f"Error al decodificar el JSON de configuración: {str(e)}")
        config_data = {}

    key = provider_name.lower()
    config_for_file = config_data.get(key)

    if config_for_file is None:
        return JsonResponse({"config": None, "message": f"No se encontró configuración para el archivo '{provider_name}'."}, status=404)
    if "transform_config" in config_for_file and "column_mappings" in config_for_file["transform_config"]:
        column_mappings = config_for_file["transform_config"]["column_mappings"]
        
        # Invert mapping for frontend display
        inverted_column_mappings = {v: k for k, v in column_mappings.items()}
        config_for_file["transform_config"]["column_mappings"] = inverted_column_mappings

    return JsonResponse({"config": config_for_file})