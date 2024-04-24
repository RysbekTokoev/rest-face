from django.contrib import admin

from .models import Face, Emotion, Recognition

admin.site.register(Face)
admin.site.register(Emotion)
admin.site.register(Recognition)
