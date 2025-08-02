from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Avg, Sum
from .models import RecruitmentMetrics, SourcePerformance


@admin.register(RecruitmentMetrics)
class RecruitmentMetricsAdmin(admin.ModelAdmin):
    list_display = ['organization', 'date', 'active_jobs', 'total_applications', 'hires_completed', 'avg_time_to_fill_display', 'offer_acceptance_rate_display']
    list_filter = ['organization', 'date']
    search_fields = ['organization__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('organization', 'date')
        }),
        ('Job Metrics', {
            'fields': ('active_jobs', 'new_jobs', 'closed_jobs')
        }),
        ('Application Metrics', {
            'fields': ('total_applications', 'new_applications', 'applications_in_review')
        }),
        ('Interview Metrics', {
            'fields': ('interviews_scheduled', 'interviews_completed', 'interviews_cancelled')
        }),
        ('Hiring Metrics', {
            'fields': ('offers_extended', 'offers_accepted', 'offers_rejected', 'hires_completed')
        }),
        ('Performance Metrics', {
            'fields': ('avg_time_to_fill', 'avg_time_to_hire', 'offer_acceptance_rate')
        }),
        ('Cost Metrics', {
            'fields': ('cost_per_hire',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def avg_time_to_fill_display(self, obj):
        if obj.avg_time_to_fill:
            days = int(obj.avg_time_to_fill)
            if days > 30:
                return format_html('<span style="color: red;">{} days</span>', days)
            elif days > 21:
                return format_html('<span style="color: orange;">{} days</span>', days)
            return f'{days} days'
        return '—'
    avg_time_to_fill_display.short_description = 'Avg Time to Fill'
    avg_time_to_fill_display.admin_order_field = 'avg_time_to_fill'
    
    def offer_acceptance_rate_display(self, obj):
        if obj.offer_acceptance_rate:
            rate = obj.offer_acceptance_rate
            if rate < 70:
                return format_html('<span style="color: red;">{:.1f}%</span>', rate)
            elif rate < 85:
                return format_html('<span style="color: orange;">{:.1f}%</span>', rate)
            return format_html('<span style="color: green;">{:.1f}%</span>', rate)
        return '—'
    offer_acceptance_rate_display.short_description = 'Offer Acceptance Rate'
    offer_acceptance_rate_display.admin_order_field = 'offer_acceptance_rate'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if hasattr(request.user, 'organization'):
            return qs.filter(organization=request.user.organization)
        return qs.none()
    
    def changelist_view(self, request, extra_context=None):
        # Add summary statistics to the changelist
        response = super().changelist_view(request, extra_context)
        
        try:
            qs = response.context_data['cl'].queryset
            summary = qs.aggregate(
                total_applications=Sum('total_applications'),
                total_hires=Sum('hires_completed'),
                avg_time_to_fill=Avg('avg_time_to_fill'),
                avg_offer_rate=Avg('offer_acceptance_rate')
            )
            
            response.context_data['summary'] = summary
        except (AttributeError, KeyError):
            pass
            
        return response


@admin.register(SourcePerformance)
class SourcePerformanceAdmin(admin.ModelAdmin):
    list_display = ['source_name', 'organization', 'period_display', 'total_applications', 'hires_made', 'conversion_rate_display', 'cost_per_hire_display']
    list_filter = ['organization', 'source_name', 'period_start', 'period_end']
    search_fields = ['source_name', 'organization__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'period_end'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('organization', 'source_name', 'period_start', 'period_end')
        }),
        ('Volume Metrics', {
            'fields': ('total_applications', 'qualified_candidates', 'interviews_scheduled', 'offers_extended', 'hires_made')
        }),
        ('Quality Metrics', {
            'fields': ('qualification_rate', 'interview_to_offer_rate', 'offer_to_hire_rate')
        }),
        ('Cost Metrics', {
            'fields': ('total_cost', 'cost_per_application', 'cost_per_hire')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def period_display(self, obj):
        return f"{obj.period_start} to {obj.period_end}"
    period_display.short_description = 'Period'
    
    def conversion_rate_display(self, obj):
        if obj.total_applications > 0:
            rate = (obj.hires_made / obj.total_applications) * 100
            if rate < 2:
                return format_html('<span style="color: red;">{:.1f}%</span>', rate)
            elif rate < 5:
                return format_html('<span style="color: orange;">{:.1f}%</span>', rate)
            return format_html('<span style="color: green;">{:.1f}%</span>', rate)
        return '0%'
    conversion_rate_display.short_description = 'Conversion Rate'
    
    def cost_per_hire_display(self, obj):
        if obj.cost_per_hire:
            cost = float(obj.cost_per_hire)
            if cost > 5000:
                return format_html('<span style="color: red;">${:,.0f}</span>', cost)
            elif cost > 3000:
                return format_html('<span style="color: orange;">${:,.0f}</span>', cost)
            return format_html('<span style="color: green;">${:,.0f}</span>', cost)
        return '—'
    cost_per_hire_display.short_description = 'Cost per Hire'
    cost_per_hire_display.admin_order_field = 'cost_per_hire'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if hasattr(request.user, 'organization'):
            return qs.filter(organization=request.user.organization)
        return qs.none()
    
    def changelist_view(self, request, extra_context=None):
        # Add top performing sources
        response = super().changelist_view(request, extra_context)
        
        try:
            qs = response.context_data['cl'].queryset
            
            # Top sources by conversion rate
            top_sources = qs.filter(total_applications__gt=10).order_by('-offer_to_hire_rate')[:5]
            
            # Most cost-effective sources
            cost_effective = qs.filter(hires_made__gt=0).order_by('cost_per_hire')[:5]
            
            response.context_data['top_sources'] = top_sources
            response.context_data['cost_effective'] = cost_effective
        except (AttributeError, KeyError):
            pass
            
        return response