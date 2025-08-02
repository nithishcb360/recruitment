from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'plan', 'is_active', 'user_count', 'job_count', 'created_at']
    list_filter = ['plan', 'is_active', 'industry', 'created_at']
    search_fields = ['name', 'slug', 'website', 'contact_email']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'logo', 'website', 'industry', 'size', 'description')
        }),
        ('Subscription', {
            'fields': ('plan', 'subscription_start', 'subscription_end', 'is_active')
        }),
        ('Limits & Features', {
            'fields': ('max_users', 'max_jobs', 'features')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'address')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_count(self, obj):
        count = obj.users.count()
        return f"{count}/{obj.max_users}"
    user_count.short_description = 'Users'
    
    def job_count(self, obj):
        count = obj.jobs.count()
        return f"{count}/{obj.max_jobs}"
    job_count.short_description = 'Jobs'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'organization', 'is_verified', 'is_active', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active', 'is_staff', 'organization']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'organization__name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'username', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone', 'avatar')
        }),
        ('Organization & Role', {
            'fields': ('organization', 'role')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone')
        }),
        ('Organization & Role', {
            'fields': ('organization', 'role')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'date_joined', 'last_login']
    
    def full_name(self, obj):
        return obj.get_full_name()
    full_name.short_description = 'Full Name'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Organization admins can only see their organization's users
        if hasattr(request.user, 'organization'):
            return qs.filter(organization=request.user.organization)
        return qs.none()