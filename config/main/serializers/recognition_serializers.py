from rest_framework import serializers
from main.models import Recognition


class RecognitionSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    face = serializers.SlugRelatedField(slug_field='id', read_only=True)
    portal = serializers.SlugRelatedField(slug_field='face__portal', read_only=True)

    class Meta:
        model = Recognition
        fields = '__all__'
