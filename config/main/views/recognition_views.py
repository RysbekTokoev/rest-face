from datetime import timedelta

import django_filters
from django.db.models import Count
from django.db.models.expressions import ExpressionWrapper
from django.db.models.fields import IntegerField
from django.db.models.functions import ExtractHour, ExtractMinute, Round, TruncDate
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from main.models import Recognition
from main.serializers import RecognitionSerializer


from django_filters import DateRangeFilter,DateFilter


class RecognitionsFilter(django_filters.FilterSet):
    start_date = DateFilter(field_name='created_at', lookup_expr=('gt'),)
    end_date = DateFilter(field_name='created_at', lookup_expr=('lt'))
    date_range = DateRangeFilter(field_name='created_at')

    class Meta:
        model = Recognition
        fields = ['face', 'emotion', 'created_at']


class RecognitionViewSet(viewsets.ModelViewSet):
    queryset = Recognition.objects.all()
    serializer_class = RecognitionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = RecognitionsFilter
    ordering_fields = ['created_at']

    def filter_queryset(self, queryset):
        user = self.request.user
        portal = user.portaluser.portal

        queryset = queryset.filter(face__portal=portal)
        queryset = queryset.order_by('-created_at')
        return super().filter_queryset(queryset)

    @action(detail=False, methods=['get'])
    def chart(self, request):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        recognitions = (
            queryset
            .annotate(
                date=TruncDate('created_at'),  # Extract the date
                hour=ExtractHour('created_at'),
                minute=ExpressionWrapper(
                    Round(ExtractMinute('created_at') / 15) * 15,
                    output_field=IntegerField()
                )
            )
            .values('date', 'hour', 'minute')  # Include the date in the values
            .annotate(count=Count('id'))
            .order_by('date', 'hour', 'minute')  # Order by date as well
        )

        # Format the date, hour and minute into strings
        recognitions = [
            {
                "time": recognition['date'].isoformat() + " "+ f"{recognition['hour']:02d}:{recognition['minute']:02d}",
                "count": recognition['count']
            }
            for recognition in recognitions
        ]

        return Response(recognitions)

    @property
    def paginator(self):
        self._paginator = super(RecognitionViewSet, self).paginator
        if self.action == 'all':
            self._paginator = None
        return self._paginator

    @action(detail=False, methods=['get'])
    def all(self, request):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def circle_emotion(self, request):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        recognitions = (
            queryset
            .values('emotion__emotion')
        )
        counter = {}
        for recognition in recognitions:
            if recognition['emotion__emotion'] in counter:
                counter[recognition['emotion__emotion']] += 1
            else:
                counter[recognition['emotion__emotion']] = 1

        recognitions = [
            {
                "emotion": emotion,
                "count": count
            }
            for emotion, count in counter.items()
        ]
        return Response(recognitions)
