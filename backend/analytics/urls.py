from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RecruitmentMetricsViewSet, SourcePerformanceViewSet,
    dashboard_metrics, source_performance, recent_activity, jobs_analytics
)

router = DefaultRouter()
router.register(r'metrics', RecruitmentMetricsViewSet)
router.register(r'source-performance', SourcePerformanceViewSet)

urlpatterns = [
    path('dashboard/', dashboard_metrics, name='dashboard_metrics'),
    path('sources/', source_performance, name='source_performance'),
    path('activity/', recent_activity, name='recent_activity'),
    path('jobs/', jobs_analytics, name='jobs_analytics'),
] + router.urls