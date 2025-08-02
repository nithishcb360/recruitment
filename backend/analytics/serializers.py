from rest_framework import serializers
from .models import RecruitmentMetrics, SourcePerformance


class RecruitmentMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentMetrics
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SourcePerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourcePerformance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class DashboardMetricsSerializer(serializers.Serializer):
    """Serializer for dashboard metrics summary"""
    active_jobs = serializers.IntegerField()
    time_to_fill = serializers.FloatField()
    offer_rate = serializers.FloatField()
    cost_per_hire = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    # Trends
    active_jobs_change = serializers.FloatField()
    time_to_fill_change = serializers.FloatField()
    offer_rate_change = serializers.FloatField()
    cost_per_hire_change = serializers.FloatField()
    
    # Pipeline summary
    total_candidates = serializers.IntegerField()
    candidates_by_stage = serializers.DictField()
    
    # Recent activity
    interviews_today = serializers.IntegerField()
    offers_pending = serializers.IntegerField()
    new_applications = serializers.IntegerField()