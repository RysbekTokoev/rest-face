from django.contrib import admin

from .models import Settings, Portal, ProfileStatus, PortalUser

admin.site.register(Settings)
admin.site.register(Portal)
admin.site.register(ProfileStatus)
admin.site.register(PortalUser)
