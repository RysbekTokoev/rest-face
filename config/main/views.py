from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import render
from .models import Face
from .serializers import FaceSerializer, PostFaceSerializer
from .image_utils import compare_faces


def tester(request):
    return render(request, 'index.html')


class FaceListViewSet(viewsets.ModelViewSet):
    queryset = Face.objects.all()
    serializer_class = FaceSerializer
    permission_classes = [permissions.AllowAny]


class FaceViewSet(viewsets.ViewSet):
    serializer_class = PostFaceSerializer

    def list(self, request):
        return Response({})

    def create(self, request):
        url = request.data['url']
        if url:
            response = compare_faces(url=url)
        elif request.FILES.get('file'):
            response = compare_faces(stream=request.FILES.get('file'))
        else:
            response = "No image uploaded"
        return Response(response)
