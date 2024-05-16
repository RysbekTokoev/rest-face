import os
import random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
import django
django.setup()
from django.contrib.auth.models import User
from faker import Faker

from main.models import Emotion, Face, Notification, Recognition
from portal.models import Settings, Portal, ProfileStatus, PortalUser, Camera

django.setup()

fake = Faker()


from portal.models import ProfileStatus

status = ProfileStatus.objects.create(status='Active')
face = Face.objects.get(id=1)

# Create Emotions
def create_emotions():
    emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral']
    for emotion in emotions:
        Emotion.objects.create(emotion=emotion)

# Create Recognitions
def create_recognitions(n):
    for _ in range(n):
        camera = random.choice(Camera.objects.all())
        emotion = random.choice(Emotion.objects.all())
        Recognition.objects.create(face=face, camera=camera, emotion=emotion, created_at=fake.date_time_this_month())


# Call the functions
create_emotions()
create_recognitions(400)
