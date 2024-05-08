from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import render
from main.models import Face, Recognition
from main.serializers import FaceSerializer
from main.utils.image_utils import recognize_face


def tester(request):
    return render(request, 'index.html')


class FaceViewSet(viewsets.ModelViewSet):
    queryset = Face.objects.all()
    serializer_class = FaceSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], name='recognize', url_path='recognize')
    def recognize(self, request):
        portal = request.data.get('portal', None)

        if portal is None:
            return Response("No portal provided")

        if request.data.get('url', None):
            face = recognize_face(url=request.data.get('url', None))
        elif request.FILES.get('file'):
            face = recognize_face(stream=request.FILES.get('file'))
        elif request.data.get('encoding'):
            face = recognize_face(encoding=request.data['encoding'])
        else:
            return Response("No data provided")

        recognition = Recognition.objects.create(
            face=face if face else None,
            emotion=request.data.get('emotion', None),
            camera=request.data.get('camera', None)
        )

        if face:
            response = {
                'face': recognition.face.id,
                'name': recognition.face.username,
                'time': recognition.created_at,
                }
            response.update({'emotion': recognition.emotion}) if recognition.emotion else None
        else:
            response = {
                'face': None,
                'name': 'unknown',
                'time': recognition.created_at,
            }

        return Response(response)
