"""
ETL TRANSFORM MODULE - Data Standardization & Validation

BUSINESS CHALLENGE:
- Each supplier uses different column names ("precio" vs "price" vs "cost")  
- Inconsistent data formatting (currency symbols, decimal separators)
- Product name variations causing duplicate detection issues
- Missing data validation causing downstream errors in manual process

TECHNICAL SOLUTION:
- Configurable column mapping per supplier via JSON config
- Standardized data cleaning (remove currency symbols, normalize strings)
- Required field validation preventing incomplete records
- Product name normalization for consistent matching

This module contains the core logic that reduced manual search errors
by systematically handling data inconsistencies that previously caused lookup mistakes.
"""

import re
import logging
import json
from products.utils.file_utils import get_config_path
from .etl_exceptions import TransformationError

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

def clean_product_name(product_name):
    """
    Product name standardization - Critical for consistent product matching
    
    BUSINESS IMPACT: Prevents inventory confusion from slight name variations
    Example: "###TORNILLO M6" → "TORNILLO M6" (removes leading special chars)
    
    This cleaning logic was essential for eliminating manual lookup errors
    caused by inconsistent product naming across supplier files.
    """
    if not isinstance(product_name, str):
        product_name = str(product_name)
    return re.sub(r'^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+', '', product_name).strip()


def transform_data(df, provider):
    """
    Core transformation logic handling multi-supplier data standardization
    
    BUSINESS PROBLEM SOLVED:
    - Different column structures across 5+ supplier Excel files
    - Manual mapping requirement causing errors and time consumption
    - Inconsistent data types and formatting across sources
    
    TECHNICAL APPROACH:
    - JSON-driven column mapping eliminates hardcoded supplier logic
    - Required field validation prevents incomplete data processing
    - Price normalization handles various currency formats
    - Graceful error handling with specific error messages for troubleshooting
    """
    try:
        config_providers = load_config()
        if provider in config_providers:
            config_data = config_providers[provider]
        else:
            base_provider = provider.split("_")[0].lower()
            if base_provider in config_providers:
                config_data = config_providers[base_provider]
            else:
                logger.error(f"No se encontró configuración para el proveedor: {provider}")
                return None

        transform_config = config_data.get("transform_config", {})
        if not transform_config:
            logger.error(f"No se encontró mapeo de columnas para el proveedor: {provider}")
            return None

        column_mappings = transform_config.get("column_mappings", {})
        if not column_mappings:
            logger.error(f"No se encontró mapeo de columnas para el proveedor: {provider}")
            return None

        # Dynamic column mapping - enables adding new suppliers without code changes
        df.rename(columns=column_mappings, inplace=True)

        required_columns = ["item", "product_name", "product_price"]
        missing_columns = []
        for internal in required_columns:
            if internal not in df.columns:
                # Search the mapping for the key that was expected to generate that internal column
                user_column = None
                for key, value in column_mappings.items():
                    if value == internal:
                        user_column = key
                        break
                if not user_column:
                    user_column = internal
                missing_columns.append(user_column)
        
        if missing_columns:
            missing_str = ", ".join(f'"{col}"' for col in missing_columns)
            raise TransformationError(
                f"Para el proveedor {provider}, las siguientes columnas no existen: {missing_str}. Por favor, revise la configuración del archivo."
            )
        # Standardized product name cleaning for consistent matching
        df["product_name"] = df["product_name"].astype(str).apply(clean_product_name)
        df["proveedor"] = provider

        # Delete rows with null values ​​in key columns
        df = df.dropna(subset=required_columns)

        # Price normalization - handles various currency formats from different suppliers
        df.loc[:, "product_price"] = (
            df["product_price"]
            .replace({r"\$": "", ",": ""}, regex=True)
            .astype(float)
        )

        return df

    except KeyError as key:
        missing_column = key.args[0] if key.args else "columna desconocida"
        raise TransformationError(
            f"Para el proveedor {provider}, la columna '{missing_column}' no existe. Por favor, revise la configuración del archivo."
        ) from key
    