from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'getface', views.FaceViewSet, basename='getface')
router.register(r'face', views.FaceListViewSet, basename='face')