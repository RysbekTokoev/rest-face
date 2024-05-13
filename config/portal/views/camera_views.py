from rest_framework import viewsets, status
from rest_framework.response import Response

from portal.models import Camera, PortalUser
from portal.serializers.camera_serializers import CameraSerializer


class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

    def get_queryset(self):
        queryset = Camera.objects.all()
        user = self.request.user
        if user.is_superuser:
            return queryset
        return queryset.filter(portal=user.portal)

    def update(self, request, *args, **kwargs):
        user = request.user
        user = PortalUser.objects.get(user__id=user.id)
        instance = self.get_object()
        if instance.portal != user.portal:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super(CameraViewSet, self).update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super(CameraViewSet, self).destroy(request, *args, **kwargs)
