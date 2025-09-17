class ETLError(Exception):
    def __init__(self, message="Error en el proceso ETL"):
        super().__init__(message)

class ExtractionError(ETLError):
    def __init__(self, message="Error durante la extracción de datos"):
        super().__init__(message)

class TransformationError(ETLError):
    def __init__(self, message="Error durante la transformación de datos"):
        super().__init__(message)

class LoadError(ETLError):
    def __init__(self, message="Error durante la carga de datos"):
        super().__init__(message)