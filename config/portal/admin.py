from django.contrib import admin

from .models import Profile, Settings, Portal, ProfileStatus

admin.site.register(Profile)
admin.site.register(Settings)
admin.site.register(Portal)
admin.site.register(ProfileStatus)
