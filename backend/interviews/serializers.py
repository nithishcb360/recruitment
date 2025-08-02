from rest_framework import serializers
from .models import Interview, InterviewFeedback, FeedbackTemplate
from candidates.serializers import JobApplicationListSerializer
from accounts.serializers import UserSerializer


class InterviewSerializer(serializers.ModelSerializer):
    application_details = JobApplicationListSerializer(source='application', read_only=True)
    interviewers_details = UserSerializer(source='interviewers', many=True, read_only=True)
    lead_interviewer_details = UserSerializer(source='lead_interviewer', read_only=True)
    
    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'application_details', 'interview_type',
            'round_number', 'scheduled_at', 'duration_minutes', 'location',
            'meeting_link', 'interviewers', 'interviewers_details',
            'lead_interviewer', 'lead_interviewer_details', 'status',
            'instructions', 'internal_notes', 'preparation_materials',
            'send_calendar_invite', 'send_confirmation_email',
            'confirmed_at', 'completed_at', 'cancelled_at', 'cancellation_reason',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InterviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            'application', 'interview_type', 'round_number', 'scheduled_at',
            'duration_minutes', 'location', 'meeting_link', 'interviewers',
            'lead_interviewer', 'instructions', 'internal_notes', 'preparation_materials',
            'send_calendar_invite', 'send_confirmation_email'
        ]
    
    def create(self, validated_data):
        interviewers = validated_data.pop('interviewers', [])
        interview = Interview.objects.create(**validated_data)
        interview.interviewers.set(interviewers)
        return interview


class InterviewFeedbackSerializer(serializers.ModelSerializer):
    interviewer_details = UserSerializer(source='interviewer', read_only=True)
    interview_details = InterviewSerializer(source='interview', read_only=True)
    
    class Meta:
        model = InterviewFeedback
        fields = [
            'id', 'interview', 'interview_details', 'interviewer',
            'interviewer_details', 'recommendation', 'overall_rating',
            'technical_rating', 'communication_rating', 'problem_solving_rating',
            'cultural_fit_rating', 'strengths', 'areas_for_improvement',
            'questions_asked', 'detailed_notes', 'red_flags', 'submitted_at',
            'updated_at', 'is_submitted'
        ]
        read_only_fields = ['id', 'submitted_at', 'updated_at']


class FeedbackTemplateSerializer(serializers.ModelSerializer):
    created_by_details = UserSerializer(source='created_by', read_only=True)
    
    class Meta:
        model = FeedbackTemplate
        fields = [
            'id', 'organization', 'name', 'description', 'questions',
            'sections', 'rating_criteria', 'status', 'is_active', 'is_default',
            'created_by', 'created_by_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InterviewListSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='application.candidate.full_name', read_only=True)
    job_title = serializers.CharField(source='application.job.title', read_only=True)
    lead_interviewer_name = serializers.CharField(source='lead_interviewer.get_full_name', read_only=True)
    
    class Meta:
        model = Interview
        fields = [
            'id', 'candidate_name', 'job_title', 'interview_type', 'scheduled_at',
            'duration_minutes', 'status', 'lead_interviewer_name', 'meeting_link'
        ]