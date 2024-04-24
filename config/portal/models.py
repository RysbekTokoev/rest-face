from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Settings(models.Model):
    id = models.AutoField(primary_key=True)
    detect_emotions = models.BooleanField(default=True)
    detect_unkown = models.BooleanField(default=True)
    portal = models.OneToOneField("Portal", on_delete=models.CASCADE)

    def __str__(self):
        return "Setting: " + self.portal.name


class Portal(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    sub_url = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Portal, self).save(*args, **kwargs)
        Settings.objects.create(portal=self)


class ProfileStatus(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.status


class PortalUser(models.Model):
    id = models.AutoField(primary_key=True)
    portal = models.ForeignKey(Portal, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.ForeignKey(ProfileStatus, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.portal.name} - {self.user.username}"

    class Meta:
        unique_together = [['portal', 'user']]
