from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Organization
from jobs.models import Department

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate departments for all organizations'

    def handle(self, *args, **options):
        departments_data = [
            {'name': 'Engineering', 'description': 'Software development and technical roles'},
            {'name': 'Product', 'description': 'Product management and strategy'},
            {'name': 'Design', 'description': 'UX/UI design and creative roles'},
            {'name': 'Marketing', 'description': 'Marketing and growth roles'},
            {'name': 'Sales', 'description': 'Sales and business development'},
            {'name': 'Operations', 'description': 'Operations and business support'},
            {'name': 'Human Resources', 'description': 'HR and people operations'},
            {'name': 'Finance', 'description': 'Finance and accounting'},
        ]

        organizations = Organization.objects.all()
        
        for organization in organizations:
            self.stdout.write(f"Creating departments for {organization.name}...")
            
            for dept_data in departments_data:
                department, created = Department.objects.get_or_create(
                    organization=organization,
                    name=dept_data['name'],
                    defaults={'description': dept_data['description']}
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"  Created department: {department.name}")
                    )
                else:
                    self.stdout.write(f"  Department already exists: {department.name}")
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated departments!')
        )