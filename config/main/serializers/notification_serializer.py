from rest_framework import serializers

from main.models import Notification, Face


class NotificationSerializer(serializers.ModelSerializer):
    face = serializers.SlugRelatedField(slug_field='username', queryset=Face.objects.all())

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'created_at']