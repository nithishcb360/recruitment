from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Interview(models.Model):
    INTERVIEW_TYPE_CHOICES = [
        ('phone-screen', 'Phone Screen'),
        ('technical', 'Technical Interview'),
        ('behavioral', 'Behavioral Interview'),
        ('final-round', 'Final Round Interview'),
        ('cultural-fit', 'Cultural Fit Interview'),
        ('panel', 'Panel Interview'),
        ('onsite', 'Onsite Interview'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    application = models.ForeignKey('candidates.JobApplication', on_delete=models.CASCADE, related_name='interviews')
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES)
    round_number = models.IntegerField(default=1)
    
    # Schedule
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    location = models.CharField(max_length=255, blank=True)
    meeting_link = models.URLField(blank=True)
    
    # Interviewers
    interviewers = models.ManyToManyField(User, related_name='interviews_as_interviewer')
    lead_interviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='led_interviews')
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Instructions and Notes
    instructions = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    preparation_materials = models.JSONField(default=list, blank=True)
    
    # Email and Calendar Settings
    send_calendar_invite = models.BooleanField(default=True)
    send_confirmation_email = models.BooleanField(default=True)
    
    # Tracking
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_interviews')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'interviews'
        ordering = ['scheduled_at']
    
    def __str__(self):
        return f"{self.interview_type} - {self.application.candidate.full_name} - {self.scheduled_at}"


class InterviewFeedback(models.Model):
    RECOMMENDATION_CHOICES = [
        ('strong_hire', 'Strong Hire'),
        ('hire', 'Hire'),
        ('maybe', 'Maybe'),
        ('no_hire', 'No Hire'),
        ('strong_no_hire', 'Strong No Hire'),
    ]
    
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='feedbacks')
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interview_feedbacks')
    
    # Overall Assessment
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES)
    overall_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Competency Ratings
    technical_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    communication_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    problem_solving_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    cultural_fit_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Detailed Feedback
    strengths = models.TextField(blank=True)
    areas_for_improvement = models.TextField(blank=True)
    questions_asked = models.JSONField(default=list, blank=True)
    detailed_notes = models.TextField(blank=True)
    
    # Red Flags
    red_flags = models.JSONField(default=list, blank=True)
    
    # Tracking
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_submitted = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'interview_feedbacks'
        unique_together = ['interview', 'interviewer']
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Feedback by {self.interviewer.get_full_name()} for {self.interview}"


class FeedbackTemplate(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='feedback_templates')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Questions structure for dynamic form builder
    questions = models.JSONField(default=list, help_text="List of question objects with id, text, type, options, required")
    
    # Template Structure (legacy - keeping for compatibility)
    sections = models.JSONField(default=list)
    rating_criteria = models.JSONField(default=list)
    
    # Settings
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'feedback_templates'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"