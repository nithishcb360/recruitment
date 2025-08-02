from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group


class RecruitmentAdminSite(AdminSite):
    site_header = 'Recruitment Management System'
    site_title = 'Recruitment Admin'
    index_title = 'Welcome to Recruitment Administration'
    
    def index(self, request, extra_context=None):
        """
        Display the main admin index page with custom context.
        """
        extra_context = extra_context or {}
        
        if hasattr(request.user, 'organization') and request.user.organization:
            org = request.user.organization
            
            # Basic stats for the organization
            stats = {
                'total_users': org.users.count(),
                'active_jobs': org.jobs.filter(status='open').count(),
                'total_candidates': org.candidates.count(),
                'total_applications': sum([job.applications.count() for job in org.jobs.all()]),
                'organization_name': org.name,
                'plan': org.get_plan_display(),
            }
            
            extra_context['organization_stats'] = stats
        
        return super().index(request, extra_context)


# Create custom admin site
admin_site = RecruitmentAdminSite(name='recruitment_admin')

# Register the Group model with the custom admin site
admin_site.register(Group, GroupAdmin)

# Customize the default admin site
admin.site.site_header = 'Recruitment Management System'
admin.site.site_title = 'Recruitment Admin'
admin.site.index_title = 'Welcome to Recruitment Administration'

# Add custom CSS
admin.site.enable_nav_sidebar = True