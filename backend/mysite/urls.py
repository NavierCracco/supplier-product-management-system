from django.contrib import admin
from django.urls import path
from products.api.products_api import ProductListAPIView
from products.views.file_views import file_list, file_upload, file_delete, file_add
from products.views.etl_views import run_etl, get_etl_status, last_etl_update
from products.views.provider_views import provider_config, get_file_config

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', ProductListAPIView.as_view(), name='product-list'),
    path('files/', file_list, name='file-list'),
    path('files/upload/', file_upload, name='file-upload'),
    path('files/delete/<str:filename>', file_delete, name='file-delete'),
    path('files/add/', file_add, name='file-add'),
    path('files/etl/', run_etl, name='run-etl'),
    path('files/etl/status/', get_etl_status, name='get-etl-status'),
    path('files/etl/last-update/', last_etl_update, name='last-etl-update'),
    path('files/config/file/', provider_config, name='provider-config'),
    path('files/config/id/<str:file_identifier>/', get_file_config, name='get-file-config'),
]
