from rest_framework import viewsets, permissions

from portal.models import Portal, PortalUser
from portal.serializers import PortalSerializer, PortalUserSerializer


class PortalViewSet(viewsets.ModelViewSet):
    queryset = Portal.objects.all()
    serializer_class = PortalSerializer
    permission_classes = (permissions.IsAuthenticated,)


class PortalUserViewSet(viewsets.ModelViewSet):
    queryset = PortalUser.objects.all()
    serializer_class = PortalUserSerializer
    permission_classes = (permissions.IsAuthenticated,)




