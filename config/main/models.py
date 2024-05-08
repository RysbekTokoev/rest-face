import os

from django.db import models
from django.dispatch import receiver
from django_resized import ResizedImageField


class Emotion(models.Model):
    id = models.AutoField(primary_key=True)
    emotion = models.CharField(max_length=25)


def _user_directory_path(instance, filename):
    return f'{instance.portal.sub_url}/known/{instance.username}/{filename}'


class Face(models.Model):
    id = models.AutoField(primary_key=True)
    portal = models.ForeignKey('portal.Portal', on_delete=models.CASCADE)
    username = models.CharField(default="unknown", max_length=25)
    image = ResizedImageField(size=[720, 720], upload_to=_user_directory_path, blank=True, null=True, quality=90)
    encoding = models.BinaryField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)

    def get_absolute_url(self):
        return f"http://127.0.0.1:8000/api/main/faces/{self.id}/"


class Recognition(models.Model):
    id = models.AutoField(primary_key=True)
    face = models.ForeignKey(Face, on_delete=models.CASCADE, null=True, blank=True)
    camera = models.ForeignKey('portal.Camera', on_delete=models.CASCADE, null=True, blank=True)
    emotion = models.ForeignKey(Emotion, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_absolute_url(self):
        return f"http://127.0.0.1:8000/api/main/recognition/{self.id}/"


@receiver(models.signals.post_delete, sender=Face, weak=False)
def delete_related_image(sender, instance, **kwargs):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    try:
        os.remove(BASE_DIR + instance.image.url)
        os.rmdir(BASE_DIR + '/known/' + instance.username)
    except:
        pass
