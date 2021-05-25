from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from main.views import tester

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('main.urls')),
    path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('tester', tester)
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
