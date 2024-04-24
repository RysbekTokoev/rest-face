from django.urls import include, path
from .routers import *

app_name = 'portal'
urlpatterns = [
    path('portal/', include(router.urls)),
]
