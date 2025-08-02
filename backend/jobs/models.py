from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Department(models.Model):
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        unique_together = ['organization', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class Job(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('on_hold', 'On Hold'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    ]
    
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]
    
    WORK_TYPE_CHOICES = [
        ('remote', 'Remote'),
        ('onsite', 'On-site'),
        ('hybrid', 'Hybrid'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('lead', 'Lead'),
        ('executive', 'Executive'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='jobs')
    
    # Job Details
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField(blank=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full_time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='mid')
    
    # Location and Work Type
    location = models.CharField(max_length=255)
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES, default='onsite')
    is_remote = models.BooleanField(default=False)
    
    # Compensation
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, default='USD')
    show_salary = models.BooleanField(default=False)
    
    # Skills
    required_skills = models.JSONField(default=list, blank=True)
    preferred_skills = models.JSONField(default=list, blank=True)
    
    # Status and Timeline
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    openings = models.IntegerField(default=1)
    target_hire_date = models.DateField(null=True, blank=True)
    sla_days = models.IntegerField(default=21)  # Service Level Agreement in days
    
    # Team
    hiring_manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='jobs_as_hiring_manager')
    recruiters = models.ManyToManyField(User, related_name='assigned_jobs', blank=True)
    
    # Tracking
    posted_date = models.DateTimeField(null=True, blank=True)
    closed_date = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_jobs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Settings
    auto_reject_after_days = models.IntegerField(null=True, blank=True)
    application_form = models.JSONField(default=dict, blank=True)
    screening_questions = models.JSONField(default=list, blank=True)
    feedback_template = models.ForeignKey('interviews.FeedbackTemplate', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Publishing options
    publish_internal = models.BooleanField(default=True)
    publish_external = models.BooleanField(default=False)
    publish_company_website = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.organization.name}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.organization.name}")
        super().save(*args, **kwargs)
    
    @property
    def days_open(self):
        if self.posted_date:
            from django.utils import timezone
            return (timezone.now() - self.posted_date).days
        return 0
    
    @property
    def is_overdue(self):
        return self.days_open > self.sla_days