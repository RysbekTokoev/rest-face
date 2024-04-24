from main.models import Face
from rest_framework import serializers
from main.utils.image_utils import get_encoding
from django.conf import settings


class FaceSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Face
        exclude = ('encoding',)

    def create(self, validated_data):
        instance = super().create(validated_data)

        BASE_DIR = settings.BASE_DIR

        fullpath = BASE_DIR + instance.image.url

        instance.encoding = get_encoding(fullpath)
        instance.save()
        return instance


