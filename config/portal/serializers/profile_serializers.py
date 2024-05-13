from portal.models import PortalUser, ProfileStatus
from rest_framework import serializers


class PortalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalUser
        fields = "__all__"


class ProfileStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileStatus
        fields = "__all__"
