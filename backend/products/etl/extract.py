"""
ETL EXTRACT MODULE - Multi-Supplier Product Data Consolidation

BUSINESS CHALLENGE (Real client scenario):
- Client managing 5+ supplier Excel files with 15,000+ total products
- Manual product lookup across multiple files was time-intensive and error-prone
- Two main error sources identified:
  * Manual search errors: 10% (wrong product found, data entry mistakes)
  * Processing bottlenecks: 20% (slow individual database operations)

TECHNICAL SOLUTION:
- Unified data extraction eliminating cross-file manual searches
- Configurable ETL pipeline processing all supplier formats automatically
- Dynamic provider detection with robust error handling
- Timezone-aware metadata extraction for audit trails

MEASURED RESULTS:
- Manual lookup errors: Eliminated through automated processing
- Processing time: ~45+ minutes → <2 minutes (bulk operations)
- Data validation: Pre-commit warnings allow error correction
- Scalability: System handles 15,000+ products with consistent performance
"""

import os
import json
import pandas as pd
import logging
from datetime import datetime
from pytz import timezone
from products.utils.file_utils import get_config_path, get_providers_path
from products.etl.etl_exceptions import ExtractionError

logger = logging.getLogger(__name__)

def load_config():
    """
    Loads and returns the provider configuration from the JSON file.
    """
    try:
        config_path = get_config_path()
        with open(config_path, "r", encoding="utf-8") as f:
            config_providers = json.load(f)
            logger.info(f"Configuración recargada: {config_providers}")
        return config_providers
    except json.JSONDecodeError as e:
        logger.error(f"Error al decodificar el JSON de configuración: {str(e)}")
        return {}

def determine_provider(file_name):
    """
    Dynamic supplier identification from filename patterns
    
    BUSINESS FLEXIBILITY: Supports adding new suppliers without code changes
    Examples: "ferreteria_productos.xlsx" → "ferreteria"
             "tornillos_especiales_march.xlsx" → "tornillos"
    
    This pattern matching enables the scalable architecture that allows
    the system to grow from 5 to N suppliers with only config file updates.
    """
    config_providers = load_config()
    for provider in config_providers.keys():
        if provider in file_name.lower():
            name_without_extension = os.path.splitext(file_name)[0]

            return name_without_extension.split('_')[0].lower()
        
    return file_name.split('_')[0].lower()

def extract_creation_date(file_path, tz_name="America/Argentina/Buenos_Aires"):
    """
    Extracts the file's creation date from the metadata.
    Returns the date in 'YYYY-MM-DD' format.
    """
    argentina_tz = timezone(tz_name)
    try:
        timestamp_creacion = os.stat(file_path).st_birthtime
        creation_date = datetime.fromtimestamp(timestamp_creacion)
        creation_date_tz = argentina_tz.localize(creation_date)
        return creation_date_tz
    except Exception as e:
        logger.error(f"Error al extraer la fecha de creación del archivo {file_path}: {str(e)}")
        return None

def extract_data():
    """
    Multi-supplier data extraction eliminating manual file searches
    
    BUSINESS PROBLEM SOLVED:
    - Client previously searching across 5+ Excel files manually for each product
    - Manual lookup process prone to finding wrong items or missing data
    - Time-intensive process scaling poorly with growing supplier count
    
    TECHNICAL SOLUTION:
    - Automated processing of all supplier files in single operation
    - Consistent data structure regardless of source file format
    - Error handling prevents single bad file from breaking entire process
    - Configurable extraction parameters per supplier (skiprows, usecols)
    
    PERFORMANCE: Processes 15,000+ products across multiple suppliers automatically
    """
    dataframes = []
    providers_path = get_providers_path()
    config_providers = load_config()

    for file in os.listdir(providers_path):
        file_path = os.path.join(providers_path, file)

        if file_path.lower().endswith(('.xlsx', '.xls', '.XLSX', '.XLS')):
            logger.info(f"Procesando archivo: {file_path}")

            try:
                provider = determine_provider(file)
            except ValueError as e:
                logger.error(str(e))
                continue

            update_date = extract_creation_date(file_path)

            try:
                # Dynamic configuration per supplier - enables scalability without code changes
                if provider in config_providers:
                    extract_config = config_providers[provider].get("extract_config", {})
                    
                    # Validate that 'skiprows' is a non-negative integer
                    skiprows = extract_config.get("skiprows")
                    if skiprows is None or not isinstance(skiprows, int) or skiprows < 0:
                        raise ExtractionError(
                            f"El valor de 'skiprows' para el proveedor {provider} es inválido: {skiprows}. Debe ser un entero no negativo."
                        )

                    # Validate that 'usecols' is a string or None
                    usecols = extract_config.get("usecols", None)
                    if usecols is not None and not isinstance(usecols, str):
                        raise ExtractionError(
                            f"El valor de 'usecols' para el proveedor {provider} es inválido: {usecols}. Debe ser una cadena o nulo."
                        )
                    
                    df = pd.read_excel(file_path, skiprows=skiprows, usecols=usecols, header=0)
                    logger.info(f"Columnas leídas: {df.columns.tolist()}")
                    if df.empty:
                        raise ExtractionError(
                            f"El archivo {file} no contiene datos después de aplicar 'skiprows' y 'usecols'. Revise la configuración de extracción."
                        )
                else:
                    logger.warning(f"No se encontró configuración para el proveedor {provider}. Utilizando configuración predeterminada.")
                    df = pd.read_excel(file_path)
            except ExtractionError as ex:
                logger.error(f"Error en la extracción para el archivo {file}: {str(ex)}")
                continue
            except Exception as e:
                logger.error(f"Error inesperado en la extracción del archivo {file}: {str(e)}")
                continue

            # Metadata preservation for audit trails and data freshness tracking
            metadata = {'proveedor': provider, 'fecha_actualizacion': update_date}
            df["proveedor"] = provider
            df["fecha_actualizacion"] = update_date
            dataframes.append((df, metadata))
            
    return dataframes