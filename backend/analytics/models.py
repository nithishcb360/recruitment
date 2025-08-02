from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class RecruitmentMetrics(models.Model):
    """Aggregated metrics for recruitment performance"""
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='metrics')
    date = models.DateField()
    
    # Job Metrics
    active_jobs = models.IntegerField(default=0)
    new_jobs = models.IntegerField(default=0)
    closed_jobs = models.IntegerField(default=0)
    
    # Application Metrics
    total_applications = models.IntegerField(default=0)
    new_applications = models.IntegerField(default=0)
    applications_in_review = models.IntegerField(default=0)
    
    # Interview Metrics
    interviews_scheduled = models.IntegerField(default=0)
    interviews_completed = models.IntegerField(default=0)
    interviews_cancelled = models.IntegerField(default=0)
    
    # Hiring Metrics
    offers_extended = models.IntegerField(default=0)
    offers_accepted = models.IntegerField(default=0)
    offers_rejected = models.IntegerField(default=0)
    hires_completed = models.IntegerField(default=0)
    
    # Performance Metrics
    avg_time_to_fill = models.FloatField(default=0)  # in days
    avg_time_to_hire = models.FloatField(default=0)  # in days
    offer_acceptance_rate = models.FloatField(default=0)  # percentage
    
    # Cost Metrics
    cost_per_hire = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recruitment_metrics'
        unique_together = ['organization', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Metrics for {self.organization.name} - {self.date}"


class SourcePerformance(models.Model):
    """Track performance of different recruitment sources"""
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='source_performances')
    source_name = models.CharField(max_length=100)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Volume Metrics
    total_applications = models.IntegerField(default=0)
    qualified_candidates = models.IntegerField(default=0)
    interviews_scheduled = models.IntegerField(default=0)
    offers_extended = models.IntegerField(default=0)
    hires_made = models.IntegerField(default=0)
    
    # Quality Metrics
    qualification_rate = models.FloatField(default=0)  # percentage
    interview_to_offer_rate = models.FloatField(default=0)  # percentage
    offer_to_hire_rate = models.FloatField(default=0)  # percentage
    
    # Cost Metrics
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_application = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_hire = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'source_performances'
        ordering = ['-period_end']
    
    def __str__(self):
        return f"{self.source_name} - {self.period_start} to {self.period_end}"