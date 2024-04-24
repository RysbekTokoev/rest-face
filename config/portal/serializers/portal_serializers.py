from rest_framework import serializers

from portal.models import Portal, PortalUser


class PortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portal
        fields = "__all__"


class PortalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalUser
        fields = "__all__"
