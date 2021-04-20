from .models import Face
from rest_framework import serializers
from .image_utils import get_encoding
import os


class FaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Face
        fields = "__all__"

    def create(self, validated_data):
        instance = super().create(validated_data)

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        fullpath = BASE_DIR + instance.image.url

        instance.encoding = get_encoding(fullpath)
        instance.save()
        return instance


class PostFace(serializers.Serializer):
    file = serializers.FileField(allow_empty_file=True, allow_null=True)
    url = serializers.CharField(allow_blank=True, allow_null=True)

    class Meta:
        fields = ['file_uploaded']


class PostEncoding(serializers.Serializer):
    encoding = serializers.CharField(allow_blank=True, allow_null=True)

    class Meta:
        fields = ["encoding"]
