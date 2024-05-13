from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter

from main.models import Recognition
from main.serializers import RecognitionSerializer


class RecognitionViewSet(viewsets.ModelViewSet):
    queryset = Recognition.objects.all()
    serializer_class = RecognitionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_fields = ['face', 'emotion', 'created_at']
    ordering_fields = ['created_at']

    def filter_queryset(self, queryset):
        user = self.request.user
        portal = user.portaluser.portal

        queryset = queryset.filter(face__portal=portal)
        return super().filter_queryset(queryset)
