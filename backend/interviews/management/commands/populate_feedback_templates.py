from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Organization
from interviews.models import FeedbackTemplate

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate feedback templates for all organizations'

    def handle(self, *args, **options):
        feedback_templates_data = [
            {
                'name': 'Technical Interview Feedback',
                'description': 'Standard feedback form for technical interviews.',
                'questions': [
                    {
                        'id': 1,
                        'text': 'Overall technical ability (1-5)',
                        'type': 'rating',
                        'required': True
                    },
                    {
                        'id': 2,
                        'text': 'Problem-solving skills',
                        'type': 'textarea',
                        'required': False
                    },
                    {
                        'id': 3,
                        'text': 'Code quality and maintainability',
                        'type': 'textarea',
                        'required': False
                    },
                    {
                        'id': 4,
                        'text': 'Familiarity with React/Next.js',
                        'type': 'rating',
                        'required': True
                    },
                    {
                        'id': 5,
                        'text': 'Recommendation',
                        'type': 'multiple-choice',
                        'options': ['Strong Hire', 'Hire', 'Lean Hire', 'No Hire'],
                        'required': True
                    }
                ],
                'status': 'published'
            },
            {
                'name': 'Cultural Fit Assessment',
                'description': 'Assess candidate\'s alignment with company values.',
                'questions': [
                    {
                        'id': 1,
                        'text': 'Teamwork and collaboration (1-5)',
                        'type': 'rating',
                        'required': True
                    },
                    {
                        'id': 2,
                        'text': 'Communication style',
                        'type': 'textarea',
                        'required': False
                    },
                    {
                        'id': 3,
                        'text': 'Adaptability to change',
                        'type': 'yes/no',
                        'required': True
                    }
                ],
                'status': 'draft'
            },
            {
                'name': 'AI/HR Screening Feedback',
                'description': 'Automated screening assessment form.',
                'questions': [
                    {
                        'id': 1,
                        'text': 'Overall screening score (1-5)',
                        'type': 'rating',
                        'required': True
                    },
                    {
                        'id': 2,
                        'text': 'Key strengths identified',
                        'type': 'textarea',
                        'required': False
                    },
                    {
                        'id': 3,
                        'text': 'Areas of concern',
                        'type': 'textarea',
                        'required': False
                    },
                    {
                        'id': 4,
                        'text': 'Proceed to next round?',
                        'type': 'yes/no',
                        'required': True
                    }
                ],
                'status': 'published'
            }
        ]

        organizations = Organization.objects.all()
        
        for organization in organizations:
            self.stdout.write(f"Creating feedback templates for {organization.name}...")
            
            for template_data in feedback_templates_data:
                template, created = FeedbackTemplate.objects.get_or_create(
                    organization=organization,
                    name=template_data['name'],
                    defaults={
                        'description': template_data['description'],
                        'questions': template_data['questions'],
                        'status': template_data['status']
                    }
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"  Created template: {template.name}")
                    )
                else:
                    self.stdout.write(f"  Template already exists: {template.name}")
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated feedback templates!')
        )