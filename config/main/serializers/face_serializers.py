from urllib.parse import unquote

import numpy as np
from django.conf import settings
from rest_framework import serializers

from main.models import Face
from main.utils.image_utils import get_encoding


class FaceSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    encoding_obj = serializers.SerializerMethodField()

    def get_encoding_obj(self, obj):
        enc = np.frombuffer(obj.encoding)
        return enc

    class Meta:
        model = Face
        fields = '__all__'
        # exclude = ('encoding',)

    def create(self, validated_data):
        instance = super().create(validated_data)

        # BASE_DIR = settings.BASE_DIR

        # fullpath = BASE_DIR + unquote(instance.image.url)

        # instance.encoding = get_encoding(fullpath)
        # instance.save()
        return instance


