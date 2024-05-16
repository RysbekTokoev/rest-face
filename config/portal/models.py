from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Settings(models.Model):
    id = models.AutoField(primary_key=True)
    detect_emotions = models.BooleanField(default=True)
    detect_unknown = models.BooleanField(default=True)
    enable_api = models.BooleanField(default=True)
    time_to_store = models.IntegerField(default=30)
    portal = models.OneToOneField("Portal", on_delete=models.CASCADE)
    email = models.EmailField(max_length=50, null=True, blank=True)
    # sub_url = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return "Setting: " + self.portal.name


class Portal(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Portal, self).save(*args, **kwargs)


class ProfileStatus(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.status


class PortalUser(models.Model):
    id = models.AutoField(primary_key=True)
    portal = models.ForeignKey(Portal, on_delete=models.CASCADE, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.ForeignKey(ProfileStatus, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        if self.portal:
            return f"{self.portal.name} - {self.user.username}"
        else:
            return self.user.username

    class Meta:
        unique_together = [['portal', 'user']]


class Camera(models.Model):
    id = models.AutoField(primary_key=True)
    portal = models.ForeignKey(Portal, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default="inactive")

    def __str__(self):
        return f"{self.portal.name} - {self.name}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        PortalUser.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.portaluser.save()


@receiver(post_save, sender=Portal)
def create_portal_settings(sender, instance, created, **kwargs):
    if created:
        Settings.objects.create(portal=instance)
@receiver(post_save, sender=Portal)
def save_portal_settings(sender, instance, **kwargs):
    instance.settings.save()
