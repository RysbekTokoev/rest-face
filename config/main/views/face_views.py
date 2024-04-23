from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import render
from main.models import Face
from main.serializers import FaceSerializer, PostFace, PostEncoding
from main.image_utils import compare_faces


def tester(request):
    return render(request, 'index.html')


class FaceViewSet(viewsets.ModelViewSet):
    queryset = Face.objects.all()
    serializer_class = FaceSerializer
    permission_classes = [permissions.AllowAny]


class FromImageViewSet(viewsets.ViewSet):
    serializer_class = PostFace

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


class FromEncodingViewSet(viewsets.ViewSet):
    serializer_class = PostEncoding

    def list(self, request):
        return Response({})

    def create(self, request):
        encoding = request.data['encoding']
        if encoding:
            response = compare_faces(encoding=encoding)
            return Response(response)
        else:
            return Response("No data provided")