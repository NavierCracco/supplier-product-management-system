"""
FILE MANAGEMENT API - Multi-Supplier Excel File Operations

Handles dynamic supplier file management replacing manual Excel file juggling.
Enables adding/removing suppliers without code changes through file operations.
"""

import os
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from products.utils.file_utils import get_providers_path
from products.models import Product
from products.services.config_service import remove_provider_config, rename_provider_config

logger = logging.getLogger(__name__)

def file_list(request):
    # Returns list of supplier Excel files for processing
    files = []
    providers_path = get_providers_path()
    for filename in os.listdir(providers_path):
        file_path = os.path.join(providers_path, filename)
        if os.path.isfile(file_path):
            file_info = {
                "id": filename,
                "name": filename,
            }
            files.append(file_info)
    return JsonResponse({"files": files})

@csrf_exempt
def file_upload(request):
    """
    Handles supplier file renaming with automatic config updates.
    Maintains data consistency across file operations.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            new_name = data.get("name")
            old_name = data.get("id")

            if not new_name:
                return JsonResponse({"error": "El nombre no puede estar vacío."}, status=400)

            providers_path = get_providers_path()
            old_file_path = os.path.join(providers_path, old_name)
            new_file_path = os.path.join(providers_path, new_name)

            if os.path.exists(old_file_path):
                os.rename(old_file_path, new_file_path)

                # Update provider configuration to maintain ETL pipeline consistency
                rename_success = rename_provider_config(old_name, new_name)
                if not rename_success:
                    return JsonResponse({"error": "Error al renombrar la configuración."}, status=500)

                return JsonResponse({"message": f"Archivo renombrado a {new_name} exitosamente."})
            else:
                return JsonResponse({"error": "Archivo no encontrado."}, status=404)
            

        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud inválida. Se esperaba JSON."}, status=400)
        except Exception as e:
            logger.exception("Error interno al renombrar archivo")
            return JsonResponse({"error": f"Error interno: {str(e)}"}, status=500)

    return JsonResponse({"error": "Método no permitido."}, status=405)

@csrf_exempt
def file_delete(request, filename):
    """
    Removes supplier file and cleans associated data.
    Maintains database integrity by removing orphaned products.
    """
    if request.method == "DELETE":
        providers_path = get_providers_path()
        file_path = os.path.join(providers_path, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Archivo eliminado: {file_path}")

            # Clean up associated configuration and products
            remove_provider_config(filename)
            provider_name = filename.split('.')[0].split('_')[0].lower()
            deleted, _ = Product.objects.filter(proveedor=provider_name).delete()
            logger.info(f"Se eliminaron {deleted} productos asociados al proveedor '{provider_name}'.")
            return JsonResponse({
                "message": f"Archivo {filename} eliminado y {deleted} productos asociados borrados."
            })
        else:
            return JsonResponse({"error": "Archivo no encontrado."}, status=404)
    return JsonResponse({"error": "Método no permitido."}, status=405)


@csrf_exempt
def file_add(request):
    # Handles new supplier Excel file uploads for ETL processing.
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]
        providers_path = get_providers_path()
        file_path = os.path.join(providers_path, uploaded_file.name)

        try:
            # Stream upload for memory efficiency with large Excel files
            with open(file_path, "wb+") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            return JsonResponse({"message": f"Archivo {uploaded_file.name} subido exitosamente."})
        except Exception as e:
            logger.exception("Error al subir archivo")
            return JsonResponse({"error": f"Error al subir el archivo: {str(e)}"}, status=500)

    return JsonResponse({"error": "Método no permitido o archivo no encontrado."}, status=400)
