import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Organization
from jobs.models import Department, Job
from candidates.models import Candidate, JobApplication, ApplicationActivity
from interviews.models import Interview, InterviewFeedback, FeedbackTemplate
from analytics.models import RecruitmentMetrics, SourcePerformance
from django.utils import timezone

User = get_user_model()

print("Creating additional test data for admin interface...")

# Get existing organization and users
org = Organization.objects.get(slug='demo-company')
admin_user = User.objects.get(email='admin@demo.com')
recruiter_user = User.objects.get(email='recruiter@demo.com')

# Create more users with different roles
hr_manager, created = User.objects.get_or_create(
    email='hr@demo.com',
    defaults={
        'username': 'hr_manager',
        'first_name': 'Jane',
        'last_name': 'Smith',
        'role': 'hr_manager',
        'organization': org,
        'is_verified': True
    }
)
if created:
    hr_manager.set_password('hr123')
    hr_manager.save()
    print(f"HR Manager created: {hr_manager.email}")

interviewer, created = User.objects.get_or_create(
    email='interviewer@demo.com',
    defaults={
        'username': 'interviewer',
        'first_name': 'Mike',
        'last_name': 'Johnson',
        'role': 'interviewer',
        'organization': org,
        'is_verified': True
    }
)
if created:
    interviewer.set_password('interviewer123')
    interviewer.save()
    print(f"Interviewer created: {interviewer.email}")

# Create sample candidates
candidates_data = [
    {
        'first_name': 'Alice',
        'last_name': 'Cooper',
        'email': 'alice@example.com',
        'phone': '+1-555-0101',
        'current_title': 'Senior React Developer',
        'current_company': 'TechCorp',
        'years_of_experience': 5,
        'location': 'San Francisco, CA',
        'source': 'LinkedIn',
        'skills': ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        'expected_salary': Decimal('140000')
    },
    {
        'first_name': 'Bob',
        'last_name': 'Williams',
        'email': 'bob@example.com',
        'phone': '+1-555-0102',
        'current_title': 'Product Manager',
        'current_company': 'StartupXYZ',
        'years_of_experience': 3,
        'location': 'New York, NY',
        'source': 'Indeed',
        'skills': ['Product Management', 'Agile', 'User Research'],
        'expected_salary': Decimal('120000')
    },
    {
        'first_name': 'Carol',
        'last_name': 'Davis',
        'email': 'carol@example.com',
        'phone': '+1-555-0103',
        'current_title': 'UX Designer',
        'current_company': 'DesignStudio',
        'years_of_experience': 4,
        'location': 'Remote',
        'source': 'Referral',
        'skills': ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        'expected_salary': Decimal('95000')
    },
    {
        'first_name': 'David',
        'last_name': 'Miller',
        'email': 'david@example.com',
        'phone': '+1-555-0104',
        'current_title': 'DevOps Engineer',
        'current_company': 'CloudTech',
        'years_of_experience': 6,
        'location': 'Austin, TX',
        'source': 'Company Website',
        'skills': ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        'expected_salary': Decimal('130000')
    }
]

candidates = []
for data in candidates_data:
    candidate, created = Candidate.objects.get_or_create(
        organization=org,
        email=data['email'],
        defaults=data
    )
    candidates.append(candidate)
    if created:
        print(f"Candidate created: {candidate.full_name}")

# Create job applications
jobs = Job.objects.filter(organization=org)
stages = ['applied', 'screening', 'technical', 'final', 'offer']
statuses = ['active', 'active', 'active', 'active', 'hired']

for i, candidate in enumerate(candidates):
    job = jobs[i % len(jobs)]
    stage = stages[i % len(stages)]
    status = statuses[i % len(statuses)] if stage != 'offer' else 'active'
    
    application, created = JobApplication.objects.get_or_create(
        job=job,
        candidate=candidate,
        defaults={
            'stage': stage,
            'status': status,
            'overall_rating': Decimal(str(3.5 + (i * 0.3))),
            'ai_score': 75 + (i * 5)
        }
    )
    
    if created:
        # Create activity log
        ApplicationActivity.objects.create(
            application=application,
            user=recruiter_user,
            activity_type='stage_change',
            description=f'Application submitted for {job.title}'
        )
        print(f"Application created: {candidate.full_name} -> {job.title}")

# Create interviews
applications = JobApplication.objects.filter(stage__in=['technical', 'final', 'offer'])
for i, application in enumerate(applications[:3]):
    interview_date = timezone.now() + timedelta(days=i+1, hours=10)
    
    interview, created = Interview.objects.get_or_create(
        application=application,
        interview_type=['technical', 'final', 'panel'][i % 3],
        defaults={
            'scheduled_at': interview_date,
            'duration_minutes': 60,
            'location': 'Conference Room A' if i % 2 == 0 else 'Video Call',
            'meeting_link': f'https://meet.example.com/room-{i+1}' if i % 2 == 1 else '',
            'status': 'scheduled',
            'lead_interviewer': interviewer,
            'created_by': recruiter_user
        }
    )
    
    if created:
        interview.interviewers.add(interviewer, hr_manager)
        print(f"Interview created: {application.candidate.full_name}")

# Create feedback template
template, created = FeedbackTemplate.objects.get_or_create(
    organization=org,
    name='Technical Interview Template',
    defaults={
        'description': 'Standard template for technical interviews',
        'sections': [
            {'name': 'Technical Skills', 'weight': 40},
            {'name': 'Problem Solving', 'weight': 30},
            {'name': 'Communication', 'weight': 20},
            {'name': 'Cultural Fit', 'weight': 10}
        ],
        'rating_criteria': [
            {'score': 5, 'description': 'Exceptional'},
            {'score': 4, 'description': 'Strong'},
            {'score': 3, 'description': 'Good'},
            {'score': 2, 'description': 'Needs Improvement'},
            {'score': 1, 'description': 'Poor'}
        ],
        'is_active': True,
        'is_default': True,
        'created_by': admin_user
    }
)
if created:
    print("Feedback template created")

# Create interview feedback
interviews = Interview.objects.all()
for interview in interviews:
    for interviewer in interview.interviewers.all():
        feedback, created = InterviewFeedback.objects.get_or_create(
            interview=interview,
            interviewer=interviewer,
            defaults={
                'recommendation': ['hire', 'strong_hire', 'maybe'][len(InterviewFeedback.objects.all()) % 3],
                'overall_rating': 4,
                'technical_rating': 4,
                'communication_rating': 4,
                'problem_solving_rating': 3,
                'cultural_fit_rating': 5,
                'strengths': 'Strong technical skills and good communication',
                'areas_for_improvement': 'Could improve system design knowledge',
                'detailed_notes': 'Candidate demonstrated solid understanding of core concepts.',
                'is_submitted': True
            }
        )
        if created:
            print(f"Feedback created for {interview.application.candidate.full_name}")

# Create recruitment metrics
today = timezone.now().date()
for i in range(30):
    date = today - timedelta(days=i)
    
    metrics, created = RecruitmentMetrics.objects.get_or_create(
        organization=org,
        date=date,
        defaults={
            'active_jobs': 12 + (i % 5),
            'new_jobs': 1 if i % 7 == 0 else 0,
            'closed_jobs': 1 if i % 10 == 0 else 0,
            'total_applications': 50 + (i * 2),
            'new_applications': 3 + (i % 4),
            'applications_in_review': 15 + (i % 3),
            'interviews_scheduled': 2 + (i % 3),
            'interviews_completed': 1 + (i % 2),
            'interviews_cancelled': 1 if i % 15 == 0 else 0,
            'offers_extended': 1 if i % 8 == 0 else 0,
            'offers_accepted': 1 if i % 12 == 0 else 0,
            'offers_rejected': 1 if i % 20 == 0 else 0,
            'hires_completed': 1 if i % 15 == 0 else 0,
            'avg_time_to_fill': 18.5 + (i % 8),
            'avg_time_to_hire': 25.2 + (i % 6),
            'offer_acceptance_rate': 75.0 + (i % 20),
            'cost_per_hire': Decimal(str(3200 + (i * 50)))
        }
    )

print("Recruitment metrics created")

# Create source performance data
sources = ['LinkedIn', 'Indeed', 'Referrals', 'Company Website', 'Glassdoor']
for source in sources:
    perf, created = SourcePerformance.objects.get_or_create(
        organization=org,
        source_name=source,
        period_start=today - timedelta(days=30),
        period_end=today,
        defaults={
            'total_applications': 50 + (len(source) * 3),
            'qualified_candidates': 20 + (len(source) * 2),
            'interviews_scheduled': 15 + len(source),
            'offers_extended': 5 + (len(source) // 2),
            'hires_made': 2 + (len(source) // 3),
            'qualification_rate': 40.0 + (len(source) * 2),
            'interview_to_offer_rate': 33.0 + len(source),
            'offer_to_hire_rate': 80.0 + (len(source) % 15),
            'total_cost': Decimal(str(5000 + (len(source) * 500))),
            'cost_per_application': Decimal(str(100 + (len(source) * 10))),
            'cost_per_hire': Decimal(str(2500 + (len(source) * 300)))
        }
    )
    if created:
        print(f"Source performance created: {source}")

print("\nAdmin test data created successfully!")
print("\nAdmin Login Information:")
print("URL: http://localhost:8000/admin/")
print("Superuser: admin@demo.com / admin123")
print("\nOther test users:")
print("HR Manager: hr@demo.com / hr123")
print("Interviewer: interviewer@demo.com / interviewer123")
print("Recruiter: recruiter@demo.com / recruiter123")