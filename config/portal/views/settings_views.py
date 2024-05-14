from rest_framework.decorators import action
from rest_framework.response import Response

from portal.models import Settings
from portal.serializers import SettingsSerializer
from rest_framework import viewsets, permissions


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        user = request.user
        settings = Settings.objects.get(portal=user.portaluser.portal)
        return Response(SettingsSerializer(settings).data)
