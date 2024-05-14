from datetime import timedelta

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


class RecognitionViewSet(viewsets.ModelViewSet):
    queryset = Recognition.objects.all()
    serializer_class = RecognitionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_fields = ['face', 'emotion', 'created_at']
    ordering_fields = ['created_at']

    def filter_queryset(self, queryset):
        user = self.request.user
        portal = user.portaluser.portal

        queryset = queryset.filter(face__portal=portal)
        queryset = queryset.order_by('-created_at')
        return super().filter_queryset(queryset)

    @action(detail=False, methods=['get'])
    def chart(self, request):
        # only recognitions created today
        yesterday = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(hours=-6)
        queryset = Recognition.objects.filter(
            created_at__gte=yesterday
        )

        queryset = self.filter_queryset(queryset)

        recognitions = (
            queryset
            .annotate(
                hour=ExtractHour('created_at'),
                minute=ExpressionWrapper(
                    Round(ExtractMinute('created_at') / 15) * 15,
                    output_field=IntegerField()
                )
            )
            .values('hour', 'minute')
            .annotate(count=Count('id'))
            .order_by('hour', 'minute')
        )

        # Format the hour and minute into a string in the format HH:MM
        recognitions = [
            {
                "time": f"{recognition['hour']:02d}:{recognition['minute']:02d}",
                "count": recognition['count']
            }
            for recognition in recognitions
        ]

        return Response(recognitions)

        # # Convert recognitions to a dictionary for easier lookup
        # recognitions_dict = {
        #     f"{recognition['hour']:02d}:{recognition['minute']:02d}": recognition['count']
        #     for recognition in recognitions
        # }
        #
        # # Generate all 15-minute intervals in a day
        # intervals = [
        #     f"{hour:02d}:{minute:02d}"
        #     for hour in range(24) for minute in range(0, 60, 15)
        # ]
        #
        # # Merge the intervals with the recognitions data
        # recognitions = [
        #     {
        #         "time": interval,
        #         "count": recognitions_dict.get(interval, 0)
        #     }
        #     for interval in intervals
        # ]
        #
        # return Response(recognitions)