from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from products.models import Product
from products.serializers import ProductSerializer
from rest_framework.filters import SearchFilter, OrderingFilter

class ProductListPagination(PageNumberPagination):
    page_size = 20 
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductListAPIView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['item', 'product_name', 'proveedor']
    proveedor = ['proveedor']
    ordering_fields = ['product_price', 'product_name', 'fecha_actualizacion']

    pagination_class = ProductListPagination


    def get_queryset(self):
        """
        This method is overridden to allow searching, sorting, and pagination to be applied correctly in the query.
        """
        queryset = Product.objects.all()
        
        search_query = self.request.query_params.get('search', '').strip()
        proveedor = self.request.query_params.get('proveedor', '').strip()
        order_by = self.request.query_params.get('order_by', 'product_name')
        
        if search_query:
            queryset = queryset.filter(product_name__istartswith=search_query) | queryset.filter(item__icontains=search_query)

        
        if proveedor:
                queryset = queryset.filter(proveedor__icontains=proveedor)
        
        queryset = queryset.order_by(order_by)
        return queryset
    
    def list(self, request, *args, **kwargs):
        # Override the `list` method to add unique providers
        response = super().list(request, *args, **kwargs)

        proveedores = Product.objects.values_list('proveedor', flat=True).distinct().order_by('proveedor')
        
        response.data['proveedores'] = proveedores
        return Response(response.data)
