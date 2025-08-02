from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Candidate(models.Model):
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='candidates')
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255, blank=True)
    
    # Professional Information
    current_title = models.CharField(max_length=255, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    relevant_experience = models.IntegerField(null=True, blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    
    # Application Details
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notice_period_days = models.IntegerField(null=True, blank=True)
    
    # Skills and Assessment
    skills = models.JSONField(default=list, blank=True)
    skill_experience = models.JSONField(default=list, blank=True, help_text="List of objects with skill and years")
    
    # Tracking
    source = models.CharField(max_length=100, blank=True)
    referrer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_candidates')
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'candidates'
        unique_together = ['organization', 'email']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class JobApplication(models.Model):
    STAGE_CHOICES = [
        ('applied', 'Applied'),
        ('screening', 'AI/HR Screening'),
        ('phone_screen', 'Phone Screen'),
        ('technical', 'Technical Interview'),
        ('onsite', 'Onsite Interview'),
        ('final', 'Final Interview'),
        ('offer', 'Offer'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
        ('hired', 'Hired'),
    ]
    
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    
    # Stage and Status
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='applied')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Ratings and Scores
    overall_rating = models.DecimalField(
        max_digits=3, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    ai_score = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Custom Responses
    application_responses = models.JSONField(default=dict, blank=True)
    
    # Tracking
    applied_at = models.DateTimeField(auto_now_add=True)
    stage_updated_at = models.DateTimeField(auto_now=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Offer Details
    offer_extended_at = models.DateTimeField(null=True, blank=True)
    offer_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    offer_accepted_at = models.DateTimeField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'job_applications'
        unique_together = ['job', 'candidate']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.job.title}"


class ApplicationActivity(models.Model):
    ACTIVITY_TYPE_CHOICES = [
        ('stage_change', 'Stage Change'),
        ('note_added', 'Note Added'),
        ('email_sent', 'Email Sent'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('feedback_submitted', 'Feedback Submitted'),
        ('offer_extended', 'Offer Extended'),
        ('offer_accepted', 'Offer Accepted'),
        ('offer_rejected', 'Offer Rejected'),
    ]
    
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPE_CHOICES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'application_activities'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.activity_type} - {self.application}"


class CandidateNote(models.Model):
    NOTE_TYPE_CHOICES = [
        ('general', 'General Note'),
        ('interview', 'Interview Note'),
        ('phone_call', 'Phone Call'),
        ('email', 'Email'),
        ('feedback', 'Feedback'),
        ('reminder', 'Reminder'),
    ]
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='timeline_notes')
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, null=True, blank=True, related_name='notes')
    
    note_type = models.CharField(max_length=20, choices=NOTE_TYPE_CHOICES, default='general')
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    
    # Tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Visibility
    is_private = models.BooleanField(default=False)
    visible_to_candidate = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'candidate_notes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.candidate.full_name} - {self.note_type}"