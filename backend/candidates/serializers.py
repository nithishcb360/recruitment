from rest_framework import serializers
from .models import Candidate, JobApplication, ApplicationActivity, CandidateNote
from jobs.serializers import JobListSerializer
from accounts.serializers import UserSerializer


class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    referrer_details = UserSerializer(source='referrer', read_only=True)
    
    class Meta:
        model = Candidate
        fields = [
            'id', 'organization', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'location', 'current_title', 'current_company',
            'years_of_experience', 'linkedin_url', 'portfolio_url', 'resume',
            'cover_letter', 'expected_salary', 'notice_period_days', 'skills',
            'source', 'referrer', 'referrer_details', 'tags', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplicationActivitySerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = ApplicationActivity
        fields = [
            'id', 'application', 'user', 'user_details', 'activity_type',
            'description', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class JobApplicationSerializer(serializers.ModelSerializer):
    job_details = JobListSerializer(source='job', read_only=True)
    candidate_details = CandidateSerializer(source='candidate', read_only=True)
    activities = ApplicationActivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_details', 'candidate', 'candidate_details',
            'stage', 'status', 'overall_rating', 'ai_score', 'application_responses',
            'applied_at', 'stage_updated_at', 'rejected_at', 'rejection_reason',
            'offer_extended_at', 'offer_amount', 'offer_accepted_at', 'start_date',
            'activities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applied_at', 'stage_updated_at', 'created_at', 'updated_at']


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    candidate_data = CandidateSerializer(write_only=True, required=False)
    candidate_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = JobApplication
        fields = [
            'job', 'candidate_id', 'candidate_data', 'application_responses'
        ]
    
    def validate(self, attrs):
        if not attrs.get('candidate_id') and not attrs.get('candidate_data'):
            raise serializers.ValidationError("Either candidate_id or candidate_data is required")
        return attrs
    
    def create(self, validated_data):
        candidate_data = validated_data.pop('candidate_data', None)
        candidate_id = validated_data.pop('candidate_id', None)
        
        if candidate_data:
            candidate_data['organization'] = validated_data['job'].organization
            candidate = Candidate.objects.create(**candidate_data)
        else:
            candidate = Candidate.objects.get(id=candidate_id)
        
        validated_data['candidate'] = candidate
        application = JobApplication.objects.create(**validated_data)
        
        # Create initial activity
        ApplicationActivity.objects.create(
            application=application,
            user=self.context['request'].user,
            activity_type='stage_change',
            description=f"Application submitted for {application.job.title}"
        )
        
        return application


class JobApplicationListSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'candidate', 'candidate_name', 'stage',
            'status', 'overall_rating', 'applied_at', 'stage_updated_at'
        ]


class CandidateListSerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()
    latest_application = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'current_title',
            'location', 'source', 'created_at', 'applications_count', 'latest_application'
        ]
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_latest_application(self, obj):
        latest = obj.applications.order_by('-applied_at').first()
        if latest:
            return {
                'job_title': latest.job.title,
                'stage': latest.stage,
                'applied_at': latest.applied_at
            }
        return None


class CandidateNoteSerializer(serializers.ModelSerializer):
    created_by_details = UserSerializer(source='created_by', read_only=True)
    
    class Meta:
        model = CandidateNote
        fields = [
            'id', 'candidate', 'application', 'note_type', 'title', 'content',
            'created_by', 'created_by_details', 'created_at', 'updated_at',
            'is_private', 'visible_to_candidate'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']