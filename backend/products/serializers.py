from rest_framework import serializers
from babel.numbers import format_currency
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    # Custom field methods for enhanced user experience
    fecha_actualizacion = serializers.SerializerMethodField()
    formatted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "item", "product_name", "product_price", "formatted_price", "proveedor", "fecha_actualizacion"]

    def get_fecha_actualizacion(self, obj):
        # Localized date format for Argentina market (dd-mm-yyyy)
        return obj.fecha_actualizacion.strftime('%d-%m-%Y') if obj.fecha_actualizacion else None

    def get_formatted_price(self, obj):
        # Currency formatting with Argentina locale - fallback to raw price if formatting fails
        try:
            return format_currency(obj.product_price, 'ARS', locale='es_AR')
        except Exception:
            return obj.product_price
