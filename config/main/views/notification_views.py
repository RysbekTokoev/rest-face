from rest_framework import permissions, viewsets

from main.models import Notification
from main.serializers.notification_serializer import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]
