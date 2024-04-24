from portal.models import Settings
from portal.serializers import SettingsSerializer
from rest_framework import viewsets, permissions


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
