from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Organization
from analytics.models import SourcePerformance
from datetime import date, timedelta
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate source performance data for all organizations'

    def handle(self, *args, **options):
        # Create data for the last 30 days
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        
        sources_data = [
            {
                'source_name': 'LinkedIn',
                'total_applications': 120,
                'qualified_candidates': 45,
                'interviews_scheduled': 25,
                'offers_extended': 8,
                'hires_made': 5,
                'total_cost': Decimal('2500.00')
            },
            {
                'source_name': 'Referrals',
                'total_applications': 35,
                'qualified_candidates': 28,
                'interviews_scheduled': 20,
                'offers_extended': 8,
                'hires_made': 6,
                'total_cost': Decimal('1000.00')
            },
            {
                'source_name': 'Indeed',
                'total_applications': 200,
                'qualified_candidates': 60,
                'interviews_scheduled': 35,
                'offers_extended': 12,
                'hires_made': 8,
                'total_cost': Decimal('3200.00')
            },
            {
                'source_name': 'Company Website',
                'total_applications': 80,
                'qualified_candidates': 25,
                'interviews_scheduled': 15,
                'offers_extended': 5,
                'hires_made': 3,
                'total_cost': Decimal('0.00')
            },
            {
                'source_name': 'Glassdoor',
                'total_applications': 90,
                'qualified_candidates': 22,
                'interviews_scheduled': 12,
                'offers_extended': 4,
                'hires_made': 2,
                'total_cost': Decimal('1800.00')
            }
        ]

        organizations = Organization.objects.all()
        
        for organization in organizations:
            self.stdout.write(f"Creating source performance data for {organization.name}...")
            
            for source_data in sources_data:
                # Calculate rates
                qualification_rate = (source_data['qualified_candidates'] / source_data['total_applications']) * 100 if source_data['total_applications'] > 0 else 0
                interview_to_offer_rate = (source_data['offers_extended'] / source_data['interviews_scheduled']) * 100 if source_data['interviews_scheduled'] > 0 else 0
                offer_to_hire_rate = (source_data['hires_made'] / source_data['offers_extended']) * 100 if source_data['offers_extended'] > 0 else 0
                
                cost_per_application = source_data['total_cost'] / source_data['total_applications'] if source_data['total_applications'] > 0 else 0
                cost_per_hire = source_data['total_cost'] / source_data['hires_made'] if source_data['hires_made'] > 0 else 0
                
                source_performance, created = SourcePerformance.objects.get_or_create(
                    organization=organization,
                    source_name=source_data['source_name'],
                    period_start=start_date,
                    period_end=end_date,
                    defaults={
                        'total_applications': source_data['total_applications'],
                        'qualified_candidates': source_data['qualified_candidates'],
                        'interviews_scheduled': source_data['interviews_scheduled'],
                        'offers_extended': source_data['offers_extended'],
                        'hires_made': source_data['hires_made'],
                        'qualification_rate': qualification_rate,
                        'interview_to_offer_rate': interview_to_offer_rate,
                        'offer_to_hire_rate': offer_to_hire_rate,
                        'total_cost': source_data['total_cost'],
                        'cost_per_application': cost_per_application,
                        'cost_per_hire': cost_per_hire,
                    }
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"  Created source performance: {source_performance.source_name}")
                    )
                else:
                    self.stdout.write(f"  Source performance already exists: {source_performance.source_name}")
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated source performance data!')
        )