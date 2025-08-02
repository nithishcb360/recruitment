from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Department, Job
from .serializers import (
    DepartmentSerializer, JobSerializer, JobCreateSerializer, JobListSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['organization']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            return Department.objects.all()
        return Department.objects.filter(organization=user.organization)
    
    def perform_create(self, serializer):
        if not self.request.user.is_platform_admin:
            serializer.save(organization=self.request.user.organization)
        else:
            serializer.save()


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'department', 'job_type', 'experience_level', 'urgency']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return JobCreateSerializer
        elif self.action == 'list':
            return JobListSerializer
        return JobSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin:
            queryset = Job.objects.all()
        else:
            queryset = Job.objects.filter(organization=user.organization)
        
        # Filter by search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        return queryset
    
    def perform_create(self, serializer):
        job = serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user
        )
        if job.status == 'open' and not job.posted_date:
            job.posted_date = timezone.now()
            job.save()
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        job = self.get_object()
        if job.status != 'draft':
            return Response(
                {'detail': 'Only draft jobs can be published'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job.status = 'open'
        job.posted_date = timezone.now()
        job.save()
        
        return Response({'detail': 'Job published successfully'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        job = self.get_object()
        if job.status not in ['open', 'on_hold']:
            return Response(
                {'detail': 'Only open or on hold jobs can be closed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job.status = 'closed'
        job.closed_date = timezone.now()
        job.save()
        
        return Response({'detail': 'Job closed successfully'})
    
    @action(detail=True, methods=['get'])
    def candidates(self, request, pk=None):
        job = self.get_object()
        applications = job.applications.select_related('candidate').all()
        
        # Group by stage
        candidates_by_stage = {}
        for app in applications:
            if app.stage not in candidates_by_stage:
                candidates_by_stage[app.stage] = []
            
            candidates_by_stage[app.stage].append({
                'id': app.candidate.id,
                'application_id': app.id,
                'name': app.candidate.full_name,
                'email': app.candidate.email,
                'rating': app.overall_rating,
                'applied_at': app.applied_at,
                'stage_updated_at': app.stage_updated_at
            })
        
        return Response(candidates_by_stage)
    
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        job = self.get_object()
        applications = job.applications.all()
        
        # Calculate metrics
        total_applications = applications.count()
        stages_count = {}
        for stage, _ in applications.model.STAGE_CHOICES:
            stages_count[stage] = applications.filter(stage=stage).count()
        
        # Time metrics
        hired_apps = applications.filter(stage='hired')
        if hired_apps.exists():
            time_to_hire = sum([
                (app.stage_updated_at - app.applied_at).days
                for app in hired_apps
            ]) / hired_apps.count()
        else:
            time_to_hire = 0
        
        analytics = {
            'total_applications': total_applications,
            'stages_count': stages_count,
            'conversion_rate': (hired_apps.count() / total_applications * 100) if total_applications > 0 else 0,
            'time_to_hire': time_to_hire,
            'days_open': job.days_open,
            'is_overdue': job.is_overdue
        }
        
        return Response(analytics)