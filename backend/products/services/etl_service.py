import logging
from products.etl.extract import extract_data
from products.etl.transform import transform_data
from products.etl.load import load_to_database
from products.etl.etl_exceptions import ExtractionError, TransformationError, LoadError
from products.models import ETLStatus

logger = logging.getLogger(__name__)

def run_etl_service():
    etl_status = ETLStatus.objects.create(status="Ejecutando...", progress=0)

    try:
        # Extract
        etl_status.status = "Extrayendo datos"
        etl_status.progress = 10
        etl_status.save()
        logger.info('ETL - Extracción iniciada.')

        dataframes = extract_data()
        if not dataframes:
            raise ExtractionError("No se extrajeron datos. Verifica el archivo y la configuración.")

        # Transform
        etl_status.status = "Transformando datos"
        etl_status.progress = 50
        etl_status.save()
        logger.info('ETL - Transformación iniciada.')
        dataframes_transformed = []
        for df, metadata in dataframes:
            provider = metadata['proveedor']
            creation_date = metadata['fecha_actualizacion']

            # Perform the transformation and validate the existence of the key columns
            df_transformed = transform_data(df, provider)
            if df_transformed is None:
                raise TransformationError(f"Error en la transformación de datos para el proveedor {provider}.")

            #  list of required columns
            required_columns = ["item", "product_name", "product_price"]

            # Check for missing required columns
            missing_columns = [col for col in required_columns if col not in df_transformed.columns]
            if missing_columns:
                raise TransformationError(
                    f"Las siguientes columnas están ausentes en los datos transformados para el proveedor {provider}: {', '.join(missing_columns)}."
                )

            # Add metadata columns
            df_transformed.loc[:, 'fecha_actualizacion'] = creation_date
            dataframes_transformed.append((df_transformed, metadata))

        # Load
        etl_status.status = "Cargando datos en BD"
        etl_status.progress = 80
        etl_status.save()
        logger.info('ETL - Carga en BD iniciada.')
        try:
            load_to_database(dataframes_transformed)
        except Exception as e:
            raise LoadError(f"Error al cargar los datos: {str(e)}")
        
        etl_status.status = "Finalizado"
        etl_status.progress = 100
        etl_status.save()
        return {"message": "ETL finalizado correctamente."}
    
    except Exception as e:
        error_message = f"Error durante el ETL: {str(e)}"
        logger.error(error_message)
        etl_status.status = error_message
        etl_status.progress = 0
        etl_status.save()
        raise
