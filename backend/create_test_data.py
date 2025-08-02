import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Organization
from jobs.models import Department, Job
from django.utils.text import slugify

User = get_user_model()

# Create test organization
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
print(f"Organization {'created' if created else 'already exists'}: {org.name}")

# Create platform admin user
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
    print(f"Admin user created: {admin_user.email}")
else:
    print(f"Admin user already exists: {admin_user.email}")

# Create regular user
user, created = User.objects.get_or_create(
    email='recruiter@demo.com',
    defaults={
        'username': 'recruiter',
        'first_name': 'John',
        'last_name': 'Doe',
        'role': 'recruiter',
        'organization': org,
        'is_verified': True
    }
)
if created:
    user.set_password('recruiter123')
    user.save()
    print(f"Recruiter user created: {user.email}")
else:
    print(f"Recruiter user already exists: {user.email}")

# Create departments
engineering_dept, _ = Department.objects.get_or_create(
    organization=org,
    name='Engineering',
    defaults={'description': 'Software Engineering Department'}
)

product_dept, _ = Department.objects.get_or_create(
    organization=org,
    name='Product',
    defaults={'description': 'Product Management Department'}
)

design_dept, _ = Department.objects.get_or_create(
    organization=org,
    name='Design',
    defaults={'description': 'Design and UX Department'}
)

print("Departments created")

# Create sample jobs
jobs_data = [
    {
        'title': 'Senior Frontend Developer',
        'department': engineering_dept,
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
        'department': product_dept,
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
        'department': design_dept,
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

for job_data in jobs_data:
    job, created = Job.objects.get_or_create(
        organization=org,
        title=job_data['title'],
        defaults={**job_data, 'created_by': admin_user}
    )
    if created:
        print(f"Job created: {job.title}")

print("\nTest data created successfully!")
print("\nLogin credentials:")
print("Admin: admin@demo.com / admin123")
print("Recruiter: recruiter@demo.com / recruiter123")