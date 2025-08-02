from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Candidate, JobApplication, ApplicationActivity, CandidateNote
from .serializers import (
    CandidateSerializer, CandidateListSerializer, JobApplicationSerializer,
    JobApplicationCreateSerializer, JobApplicationListSerializer, ApplicationActivitySerializer,
    CandidateNoteSerializer
)


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['source', 'years_of_experience']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CandidateListSerializer
        return CandidateSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = Candidate.objects.all()
        else:
            queryset = Candidate.objects.filter(organization=user.organization)
        
        # Filter by search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(current_title__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stage', 'status', 'job']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return JobApplicationCreateSerializer
        elif self.action == 'list':
            return JobApplicationListSerializer
        return JobApplicationSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = JobApplication.objects.all()
        else:
            queryset = JobApplication.objects.filter(job__organization=user.organization)
        
        # Filter by search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(candidate__first_name__icontains=search) |
                models.Q(candidate__last_name__icontains=search) |
                models.Q(job__title__icontains=search)
            )
        
        return queryset.select_related('candidate', 'job').order_by('-applied_at')
    
    @action(detail=True, methods=['post'])
    def advance_stage(self, request, pk=None):
        application = self.get_object()
        
        stage_progression = {
            'applied': 'screening',
            'screening': 'phone_screen',
            'phone_screen': 'technical',
            'technical': 'onsite',
            'onsite': 'final',
            'final': 'offer',
        }
        
        if application.stage in stage_progression:
            new_stage = stage_progression[application.stage]
            application.stage = new_stage
            application.save()
            
            # Create activity log
            ApplicationActivity.objects.create(
                application=application,
                user=request.user,
                activity_type='stage_change',
                description=f'Advanced to {new_stage} stage'
            )
            
            return Response({'detail': f'Application advanced to {new_stage} stage'})
        
        return Response(
            {'detail': 'Cannot advance from current stage'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        reason = request.data.get('reason', '')
        
        application.status = 'rejected'
        application.rejection_reason = reason
        application.save()
        
        # Create activity log
        ApplicationActivity.objects.create(
            application=application,
            user=request.user,
            activity_type='stage_change',
            description=f'Application rejected: {reason}'
        )
        
        return Response({'detail': 'Application rejected'})


class ApplicationActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ApplicationActivity.objects.all()
    serializer_class = ApplicationActivitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activity_type', 'application']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            return ApplicationActivity.objects.all()
        return ApplicationActivity.objects.filter(
            application__job__organization=user.organization
        ).order_by('-created_at')


class CandidateNoteViewSet(viewsets.ModelViewSet):
    queryset = CandidateNote.objects.all()
    serializer_class = CandidateNoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['candidate', 'application', 'note_type', 'is_private']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = CandidateNote.objects.all()
        else:
            queryset = CandidateNote.objects.filter(
                candidate__organization=user.organization
            )
        
        # Filter by candidate if specified
        candidate_id = self.request.query_params.get('candidate')
        if candidate_id:
            queryset = queryset.filter(candidate_id=candidate_id)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)