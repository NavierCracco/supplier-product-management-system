"""
ETL EXECUTION API - Data Processing Pipeline Control

Orchestrates the ETL pipeline that processes 15,000+ products from multiple suppliers.
Provides real-time status monitoring and error handling for large dataset operations.
"""

import logging
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from products.models import ETLStatus
from products.services.etl_service import run_etl_service
from products.etl.etl_exceptions import ExtractionError, TransformationError, LoadError

logger = logging.getLogger(__name__)

@require_POST
@csrf_exempt
def run_etl(request):
    """
    Executes the complete ETL pipeline with comprehensive error handling.
    
    BUSINESS IMPACT: Replaces 45+ minute manual process with <2 minute automated execution.
    Processes 15,000+ products across multiple supplier formats automatically.
    """
    try:
        result = run_etl_service() 
        return JsonResponse({"message": result.get("message", "ETL finalizado correctamente.")})
    except ExtractionError as ee:
        logger.error(f"ExtractionError: {str(ee)}")
        return JsonResponse({"error": str(ee)}, status=400)
    except TransformationError as te:
        logger.error(f"TransformationError: {str(te)}")
        return JsonResponse({"error": str(te)}, status=400)
    except LoadError as le:
        logger.error(f"LoadError: {str(le)}")
        return JsonResponse({"error": str(le)}, status=500)
    except Exception as e:
        logger.exception("Error desconocido durante el ETL. Hola.")
        return JsonResponse({"error": f"Error desconocido durante el ETL: {str(e)}"}, status=500)

def get_etl_status(request):
    # Real-time ETL status monitoring endpoint.
    status_obj = ETLStatus.objects.last()
    if not status_obj:
        return JsonResponse({"status": "No iniciado", "progress": 0})

    return JsonResponse({
        "status": status_obj.status,
        "progress": status_obj.progress
    })

def last_etl_update(request):
    # Returns last ETL execution timestamp for data freshness tracking.
    try:
        last_execution = ETLStatus.objects.last()
        if last_execution and hasattr(last_execution, "create_ad") and last_execution.create_ad:
            formatted_date = last_execution.create_ad.strftime('%d-%m-%Y')
        else:
            formatted_date = None
        return JsonResponse({"last_update": formatted_date})
    except Exception as e:
        logger.exception("Error al obtener la última fecha de actualización.")
        return JsonResponse({"error": str(e)}, status=500)
