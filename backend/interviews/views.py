from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Interview, InterviewFeedback, FeedbackTemplate
from .serializers import (
    InterviewSerializer, InterviewCreateSerializer, InterviewListSerializer,
    InterviewFeedbackSerializer, FeedbackTemplateSerializer
)


class FeedbackTemplateViewSet(viewsets.ModelViewSet):
    queryset = FeedbackTemplate.objects.all()
    serializer_class = FeedbackTemplateSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'is_active', 'is_default']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            return FeedbackTemplate.objects.all()
        return FeedbackTemplate.objects.filter(organization=user.organization)
    
    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        template = self.get_object()
        if template.status != 'draft':
            return Response(
                {'detail': 'Only draft templates can be published'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        template.status = 'published'
        template.save()
        
        return Response({'detail': 'Template published successfully'})
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        template = self.get_object()
        if template.status != 'published':
            return Response(
                {'detail': 'Only published templates can be unpublished'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        template.status = 'draft'
        template.save()
        
        return Response({'detail': 'Template unpublished successfully'})


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'interview_type', 'application__job']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InterviewCreateSerializer
        elif self.action == 'list':
            return InterviewListSerializer
        return InterviewSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = Interview.objects.all()
        else:
            # Filter by organization through application->job->organization
            queryset = Interview.objects.filter(
                application__job__organization=user.organization
            )
        
        # Filter by interviewer if specified
        if self.request.query_params.get('my_interviews'):
            queryset = queryset.filter(interviewers=user)
        
        return queryset.select_related(
            'application__candidate', 'application__job', 'lead_interviewer'
        ).prefetch_related('interviewers')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'scheduled':
            return Response(
                {'detail': 'Only scheduled interviews can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        interview.status = 'confirmed'
        interview.confirmed_at = timezone.now()
        interview.save()
        
        return Response({'detail': 'Interview confirmed successfully'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        interview = self.get_object()
        if interview.status in ['completed', 'cancelled']:
            return Response(
                {'detail': 'Interview cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reason = request.data.get('reason', '')
        interview.status = 'cancelled'
        interview.cancelled_at = timezone.now()
        interview.cancellation_reason = reason
        interview.save()
        
        return Response({'detail': 'Interview cancelled successfully'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        interview = self.get_object()
        if interview.status not in ['confirmed', 'in_progress']:
            return Response(
                {'detail': 'Only confirmed or in-progress interviews can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        interview.status = 'completed'
        interview.completed_at = timezone.now()
        interview.save()
        
        return Response({'detail': 'Interview completed successfully'})


class InterviewFeedbackViewSet(viewsets.ModelViewSet):
    queryset = InterviewFeedback.objects.all()
    serializer_class = InterviewFeedbackSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['interview', 'interviewer', 'recommendation', 'is_submitted']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = InterviewFeedback.objects.all()
        else:
            # Filter by organization through interview->application->job->organization
            queryset = InterviewFeedback.objects.filter(
                interview__application__job__organization=user.organization
            )
        
        # Filter by interviewer if specified
        if self.request.query_params.get('my_feedback'):
            queryset = queryset.filter(interviewer=user)
        
        return queryset.select_related('interview', 'interviewer')
    
    def perform_create(self, serializer):
        serializer.save(interviewer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        feedback = self.get_object()
        if feedback.is_submitted:
            return Response(
                {'detail': 'Feedback already submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        feedback.is_submitted = True
        feedback.save()
        
        return Response({'detail': 'Feedback submitted successfully'})