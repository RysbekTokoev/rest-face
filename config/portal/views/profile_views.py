from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination

from portal.models import Profile
from portal.serializers.profile_serializers import ProfileSerializer, ProfileStatusSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
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
    queryset = Profile.objects.all()
    serializer_class = ProfileStatusSerializer
    permission_classes = [permissions.IsAuthenticated]
