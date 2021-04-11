from django.urls import include, path
from .routers import *

app_name = 'main'
urlpatterns = [
    path('', include(router.urls)),
]
