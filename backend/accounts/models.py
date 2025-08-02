from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    USER_ROLE_CHOICES = [
        ('platform_admin', 'Platform Admin'),
        ('admin', 'Organization Admin'),
        ('hr_manager', 'HR Manager'),
        ('recruiter', 'Recruiter'),
        ('interviewer', 'Interviewer'),
        ('hiring_manager', 'Hiring Manager'),
    ]
    
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='recruiter')
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    @property
    def is_platform_admin(self):
        return self.role == 'platform_admin'
    
    @property
    def is_org_admin(self):
        return self.role == 'admin'


class Organization(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('starter', 'Starter'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='organizations/', blank=True, null=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    
    # Subscription
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    subscription_start = models.DateTimeField(null=True, blank=True)
    subscription_end = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Settings
    max_users = models.IntegerField(default=5)
    max_jobs = models.IntegerField(default=10)
    features = models.JSONField(default=dict, blank=True)
    
    # Contact
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organizations'
        ordering = ['name']
    
    def __str__(self):
        return self.name