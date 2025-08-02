from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Organization
from jobs.models import Department, Job
from candidates.models import Candidate, JobApplication, ApplicationActivity
from interviews.models import Interview, InterviewFeedback, FeedbackTemplate
from analytics.models import RecruitmentMetrics, SourcePerformance
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Create demo data for the recruitment system'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset all data before creating demo data',
        )
    
    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Resetting data...')
            # Clear existing data
            Interview.objects.all().delete()
            JobApplication.objects.all().delete()
            Candidate.objects.all().delete()
            Job.objects.all().delete()
            Department.objects.all().delete()
            RecruitmentMetrics.objects.all().delete()
            SourcePerformance.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            
        self.stdout.write('Creating demo data...')
        
        # Create or get organization
        org, created = Organization.objects.get_or_create(
            slug='demo-company',
            defaults={
                'name': 'Demo Company',
                'plan': 'professional',
                'max_users': 50,
                'max_jobs': 100,
                'industry': 'Technology',
                'size': '51-200',
                'website': 'https://demo-company.com',
                'contact_email': 'hr@demo-company.com'
            }
        )
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            email='admin@demo.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'platform_admin',
                'is_staff': True,
                'is_superuser': True,
                'is_verified': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            
        # Create other users
        users_data = [
            {
                'email': 'recruiter@demo.com',
                'username': 'recruiter',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'recruiter',
                'password': 'recruiter123'
            },
            {
                'email': 'hr@demo.com',
                'username': 'hr_manager',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'hr_manager',
                'password': 'hr123'
            },
            {
                'email': 'interviewer@demo.com',
                'username': 'interviewer',
                'first_name': 'Mike',
                'last_name': 'Johnson',
                'role': 'interviewer',
                'password': 'interviewer123'
            }
        ]
        
        users = {}
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'role': user_data['role'],
                    'organization': org,
                    'is_verified': True
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
            users[user_data['role']] = user
            
        # Create departments
        departments_data = [
            {'name': 'Engineering', 'description': 'Software Engineering Department'},
            {'name': 'Product', 'description': 'Product Management Department'},
            {'name': 'Design', 'description': 'Design and UX Department'},
        ]
        
        departments = {}
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                organization=org,
                name=dept_data['name'],
                defaults=dept_data
            )
            departments[dept_data['name']] = dept
            
        # Create jobs
        jobs_data = [
            {
                'title': 'Senior Frontend Developer',
                'department': departments['Engineering'],
                'description': 'We are looking for an experienced Frontend Developer...',
                'requirements': '5+ years of experience with React, TypeScript, and modern web technologies',
                'job_type': 'full_time',
                'experience_level': 'senior',
                'location': 'San Francisco, CA',
                'is_remote': True,
                'salary_min': 120000,
                'salary_max': 180000,
                'status': 'open',
                'urgency': 'high'
            },
            {
                'title': 'Product Manager',
                'department': departments['Product'],
                'description': 'Join our product team to lead exciting new initiatives...',
                'requirements': '3+ years of product management experience',
                'job_type': 'full_time',
                'experience_level': 'mid',
                'location': 'New York, NY',
                'is_remote': True,
                'salary_min': 100000,
                'salary_max': 150000,
                'status': 'open',
                'urgency': 'medium'
            },
            {
                'title': 'UX Designer',
                'department': departments['Design'],
                'description': 'We need a creative UX Designer to join our team...',
                'requirements': '2+ years of UX design experience',
                'job_type': 'full_time',
                'experience_level': 'mid',
                'location': 'Remote',
                'is_remote': True,
                'salary_min': 80000,
                'salary_max': 120000,
                'status': 'open',
                'urgency': 'low'
            }
        ]
        
        jobs = []
        for job_data in jobs_data:
            job_data['organization'] = org
            job_data['created_by'] = admin_user
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                organization=org,
                defaults=job_data
            )
            jobs.append(job)
            
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created demo data!\n'
                f'Organization: {org.name}\n'
                f'Users: {len(users_data) + 1}\n'
                f'Departments: {len(departments_data)}\n'
                f'Jobs: {len(jobs_data)}\n'
                f'\nLogin credentials:\n'
                f'Admin: admin@demo.com / admin123\n'
                f'Recruiter: recruiter@demo.com / recruiter123\n'
                f'HR Manager: hr@demo.com / hr123\n'
                f'Interviewer: interviewer@demo.com / interviewer123'
            )
        )