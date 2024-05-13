from rest_framework import serializers
from main.models import Recognition, Face, Emotion
from portal.models import Camera


class RecognitionSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)
    face = serializers.SlugRelatedField(slug_field='username', queryset=Face.objects.all())
    camera = serializers.SlugRelatedField(slug_field='name', queryset=Camera.objects.all())
    emotion = serializers.SlugRelatedField(slug_field='emotion', queryset=Emotion.objects.all())
    portal = serializers.SlugRelatedField(slug_field='face__portal', read_only=True)

    class Meta:
        model = Recognition
        fields = '__all__'
