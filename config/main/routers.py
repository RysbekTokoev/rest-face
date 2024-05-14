from rest_framework import routers
from main import views

router = routers.DefaultRouter()
router.register(r'faces', views.FaceViewSet, basename='face')
router.register(r'recognitions', views.RecognitionViewSet, basename='recognition')
router.register(r'notifications', views.NotificationViewSet, basename='notification')