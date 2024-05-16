from django.shortcuts import render
from django.utils import timezone
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from main.models import Face, Recognition, Emotion, Notification
from main.serializers import FaceSerializer
from main.utils.image_utils import recognize_face
from portal.models import Camera


def tester(request):
    return render(request, 'index.html')

message = "Внимание, камера {camera} заметила {face} в {time}"


def get_response(face, settings, camera, emotion):
    if settings.detect_unknown or face:
        recognition = Recognition.objects.create(
            face=face if face else None,
            emotion=emotion,
            camera=camera
        )
        if face:
            response = {
                'face': recognition.face.id,
                'name': recognition.face.username,
                'time': recognition.created_at,
            }
            response.update({'emotion': recognition.emotion.emotion}) if recognition.emotion else None

            if face.to_notify:
                notification = Notification.objects.create(
                    face=face,
                    camera=camera,
                    message=message.format(face.username, camera.name, recognition.created_at)
                )
        else:
            response = {
                'face': None,
                'name': 'unknown',
                'time': recognition.created_at,
            }
    else:
        response = {
            'face': None,
            'name': 'unknown',
            'time': timezone.now(),
        }
    return response


class FaceViewSet(viewsets.ModelViewSet):
    queryset = Face.objects.all()
    serializer_class = FaceSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], name='recognize', url_path='recognize')
    def recognize(self, request):
        user = request.user

        if request.data.get('url', None):
            face = recognize_face(url=request.data.get('url', None))
        elif request.FILES.get('file'):
            face = recognize_face(stream=request.FILES.get('file'))
        elif request.data.get('encoding'):
            face = recognize_face(encoding=request.data['encoding'])
        elif request.data.get('id'):
            face = Face.objects.get(id=request.data['id'])
        else:
            return Response("No data provided")

        emotion = None
        if request.data.get('emotion', None):
            emotion = Emotion.objects.get_or_create(emotion=request.data['emotion'])[0]

        settings = user.portaluser.portal.settings
        camera = Camera.objects.get(id=request.data.get('camera', None))

        response = get_response(face, settings, camera, emotion)
        return Response(response)

    def create(self, request, *args, **kwargs):
        user = request.user
        portal = user.portaluser.portal
        request.data._mutable = True
        request.data['portal'] = portal.id
        if request.data.get('image', None):
            image = request.data.pop('image')
        return super().create(request, *args, **kwargs)
