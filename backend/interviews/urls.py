from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterviewViewSet, InterviewFeedbackViewSet, FeedbackTemplateViewSet

router = DefaultRouter()
router.register(r'interviews', InterviewViewSet)
router.register(r'interview-feedback', InterviewFeedbackViewSet)
router.register(r'feedback-templates', FeedbackTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]