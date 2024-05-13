from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination

from portal.models import PortalUser, ProfileStatus
from portal.serializers.profile_serializers import PortalUserSerializer, ProfileStatusSerializer


class PortalUserViewSet(viewsets.ModelViewSet):
    queryset = PortalUser.objects.all()
    serializer_class = PortalUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"
    search_fields = "__all__"
    ordering_fields = "__all__"
    ordering = ["id"]
    pagination_class = PageNumberPagination
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ProfileStatusViewSet(viewsets.ModelViewSet):
    queryset = ProfileStatus.objects.all()
    serializer_class = ProfileStatusSerializer
    permission_classes = [permissions.IsAuthenticated]
