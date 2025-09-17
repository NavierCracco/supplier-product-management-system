def validate_provider_config(config_data):
    if not isinstance(config_data, dict):
        raise ValueError("La configuración debe ser un objeto JSON con claves para cada proveedor.")

    for provider, config in config_data.items():
        if not isinstance(config, dict):
            raise ValueError(f"La configuración para el proveedor '{provider}' debe ser un objeto.")

        # Validar extract_config
        if "extract_config" not in config:
            raise ValueError(f"Falta 'extract_config' en la configuración del proveedor '{provider}'.")
        
        extract_config = config["extract_config"]
        if not isinstance(extract_config, dict):
            raise ValueError(f"'extract_config' para el proveedor '{provider}' debe ser un objeto.")
        
        if "skiprows" not in extract_config:
            raise ValueError(f"Falta 'skiprows' en 'extract_config' para el proveedor '{provider}'.")
        
        if not isinstance(extract_config["skiprows"], int) or extract_config["skiprows"] < 0:
            raise ValueError(f"'skiprows' para el proveedor '{provider}' debe ser un entero no negativo.")
        
        if "usecols" not in extract_config:
            raise ValueError(f"Falta 'usecols' en 'extract_config' para el proveedor '{provider}'.")
        
        if extract_config["usecols"] is not None and not isinstance(extract_config["usecols"], str):
            raise ValueError(f"'usecols' para el proveedor '{provider}' debe ser una cadena o nulo.")

        # Validar transform_config
        if "transform_config" not in config:
            raise ValueError(f"Falta 'transform_config' en la configuración del proveedor '{provider}'.")
        
        transform_config = config["transform_config"]
        if not isinstance(transform_config, dict):
            raise ValueError(f"'transform_config' para el proveedor '{provider}' debe ser un objeto.")
        
        if "column_mappings" not in transform_config:
            raise ValueError(f"Falta 'column_mappings' en 'transform_config' para el proveedor '{provider}'.")
        
        column_mappings = transform_config["column_mappings"]
        if not isinstance(column_mappings, dict):
            raise ValueError(f"'column_mappings' para el proveedor '{provider}' debe ser un objeto.")

        # Validar que en los valores se incluyan los mapeos obligatorios
        required_internal_fields = ["item", "product_name", "product_price"]
        for field in required_internal_fields:
            if field not in column_mappings.values():
                raise ValueError(
                    f"El mapeo en 'column_mappings' para el proveedor '{provider}' debe incluir '{field}' en los valores."
                )

    return True