from rest_framework import routers
from portal import views

router = routers.DefaultRouter()
router.register(r'portal', views.PortalViewSet, basename='face')
router.register(r'settings', views.SettingsViewSet, basename='settings')
router.register(r'profile-status', views.ProfileStatusViewSet, basename='profile-status')
router.register(r'portal-user', views.PortalUserViewSet, basename='portal-user')
router.register(r'camera', views.CameraViewSet, basename='camera')
