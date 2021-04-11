from django.db import models
from django.dispatch import receiver
from django_resized import ResizedImageField
import os


def _user_directory_path(instance, filename):
    return 'known/{0}/{1}'.format(instance.username, filename)


class Face(models.Model):
    username = models.CharField(default="unknown", max_length=25)
    image = ResizedImageField(size=[720, 720], upload_to=_user_directory_path, blank=True, null=True, quality=90)
    encoding = models.BinaryField(null=True, blank=True)


@receiver(models.signals.post_delete, sender=Face, weak=False)
def delete_related_image(sender, instance, **kwargs):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    try:
        os.remove(BASE_DIR + instance.image.url)
        os.rmdir(BASE_DIR + '/known/' + instance.username)
    except:
        pass
