from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'fromimage', views.FromImageViewSet, basename='fromimage')
router.register(r'fromencoding', views.FromEncodingViewSet, basename='fromencoding')
router.register(r'face', views.FaceViewSet, basename='face')