from rest_framework import serializers
from .models import Department, Job
from accounts.serializers import UserSerializer


class DepartmentSerializer(serializers.ModelSerializer):
    manager_details = UserSerializer(source='manager', read_only=True)
    
    class Meta:
        model = Department
        fields = [
            'id', 'organization', 'name', 'description', 'manager',
            'manager_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)
    hiring_manager_details = UserSerializer(source='hiring_manager', read_only=True)
    recruiters_details = UserSerializer(source='recruiters', many=True, read_only=True)
    days_open = serializers.IntegerField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    # Statistics
    applications_count = serializers.SerializerMethodField()
    candidates_by_stage = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'organization', 'title', 'slug', 'department', 'department_details',
            'description', 'requirements', 'responsibilities', 'job_type',
            'experience_level', 'location', 'work_type', 'is_remote', 'salary_min', 'salary_max',
            'salary_currency', 'show_salary', 'required_skills', 'preferred_skills',
            'status', 'urgency', 'openings', 'target_hire_date', 'sla_days',
            'hiring_manager', 'hiring_manager_details', 'recruiters', 'recruiters_details',
            'posted_date', 'closed_date', 'created_by', 'created_at', 'updated_at',
            'auto_reject_after_days', 'application_form', 'screening_questions',
            'feedback_template', 'publish_internal', 'publish_external', 'publish_company_website',
            'days_open', 'is_overdue', 'applications_count', 'candidates_by_stage'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_candidates_by_stage(self, obj):
        from candidates.models import JobApplication
        stages = {}
        for stage, _ in JobApplication.STAGE_CHOICES:
            stages[stage] = obj.applications.filter(stage=stage).count()
        return stages


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'department', 'description', 'requirements', 'responsibilities',
            'job_type', 'experience_level', 'location', 'work_type', 'is_remote', 'salary_min',
            'salary_max', 'salary_currency', 'show_salary', 'required_skills',
            'preferred_skills', 'urgency', 'openings', 'target_hire_date',
            'sla_days', 'hiring_manager', 'recruiters', 'auto_reject_after_days',
            'application_form', 'screening_questions', 'feedback_template',
            'publish_internal', 'publish_external', 'publish_company_website'
        ]
    
    def create(self, validated_data):
        recruiters = validated_data.pop('recruiters', [])
        job = Job.objects.create(**validated_data)
        job.recruiters.set(recruiters)
        return job


class JobListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    applications_count = serializers.SerializerMethodField()
    days_open = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'department_name', 'location', 'job_type',
            'status', 'urgency', 'openings', 'posted_date', 'days_open',
            'applications_count', 'created_at'
        ]
    
    def get_applications_count(self, obj):
        return obj.applications.count()