from rest_framework import routers
from main import views

router = routers.DefaultRouter()
router.register(r'faces', views.FaceViewSet, basename='face')
