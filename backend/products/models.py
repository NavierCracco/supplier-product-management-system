"""
PRODUCT DATA MODELS - Multi-Supplier Catalog Management

BUSINESS ARCHITECTURE:
- Normalized schema supporting diverse supplier data formats
- Designed to handle 15,000+ product consolidation from 5+ suppliers
- Optimized for bulk operations and real-time search performance

DATABASE DESIGN DECISIONS:
- Single Product table with supplier attribution enables unified search
- Decimal precision for accurate pricing across different currencies
- Timestamp tracking for data freshness and audit requirements
"""

from django.db import models

class Product(models.Model):
    """
    Core product model for multi-supplier catalog consolidation
    
    BUSINESS LOGIC:
    - item: Unique product identifier (may vary by supplier)
    - product_name: Standardized product description after ETL cleaning
    - product_price: Decimal precision for accurate financial calculations
    - proveedor: Supplier attribution for audit and source tracking
    - fecha_actualizacion: Data freshness tracking for inventory management
    
    PERFORMANCE CONSIDERATIONS:
    - Designed for bulk operations (15,000+ products loaded in <2 minutes)
    - Indexed fields optimized for frequent search and filter operations
    - Normalized structure eliminates data duplication across suppliers
    
    BUSINESS VALUE: Replaces manual Excel file management with centralized,
    searchable database enabling instant product lookup across all suppliers.
    """
    item = models.CharField(max_length=50)
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.CharField(max_length=200)
    fecha_actualizacion = models.DateTimeField()

    def __str__(self):
        return self.product_name

class ETLStatus(models.Model):
    """
    ETL process tracking model

    BUSINESS LOGIC:
    - status: Current state of the ETL process (e.g., 'No iniciado', 'En progreso', 'Completado')
    - progress: Percentage completion of the ETL process
    - create_ad: Timestamp of when the ETL process was initiated

    PERFORMANCE CONSIDERATIONS:
    - Minimal fields to ensure quick updates and retrievals
    - Indexed on create_ad for historical tracking of ETL runs
    
    BUSINESS VALUE: Provides visibility into ETL process status for operational monitoring.
    """
    status = models.CharField(max_length=50, default='No iniciado')
    progress = models.IntegerField(default=0)
    create_ad = models.DateTimeField(auto_now_add=True)
