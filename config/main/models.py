from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django_resized import ResizedImageField
import os


def _user_directory_path(instance, filename):
    return f'{instance.user.portal.sub_url}/known/{instance.username}/{filename}'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    portal = models.ForeignKey('Portal', on_delete=models.CASCADE)


class Emotion(models.Model):
    id = models.AutoField(primary_key=True)
    emotion = models.CharField(max_length=25)


class Face(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=True)
    username = models.CharField(default="unknown", max_length=25)
    image = ResizedImageField(size=[720, 720], upload_to=_user_directory_path, blank=True, null=True, quality=90)
    encoding = models.BinaryField(null=True, blank=True)


class Recognition(models.Model):
    id = models.AutoField(primary_key=True)
    face = models.ForeignKey(Face, on_delete=models.CASCADE)
    emotion = models.ForeignKey(Emotion, on_delete=models.SET_NULL, null=True, blank=True)
    time = models.DateTimeField(auto_now_add=True)


class Settings(models.Model):
    id = models.AutoField(primary_key=True)
    detect_emotions = models.BooleanField(default=True)
    detect_unkown = models.BooleanField(default=True)


class Portal(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    settings = models.ForeignKey(Settings, on_delete=models.CASCADE)
    sub_url = models.CharField(max_length=30)

    def __str__(self):
        return self.name


@receiver(models.signals.post_delete, sender=Face, weak=False)
def delete_related_image(sender, instance, **kwargs):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    try:
        os.remove(BASE_DIR + instance.image.url)
        os.rmdir(BASE_DIR + '/known/' + instance.username)
    except:
        pass
