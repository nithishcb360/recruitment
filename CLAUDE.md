# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development (Full Stack):**
```bash
./run-dev.sh    # Start both frontend and backend servers
```

**Frontend Development:**
```bash
cd frontend
pnpm dev        # Start Next.js dev server on localhost:3000
pnpm build      # Build for production
pnpm start      # Run production build
pnpm lint       # Run Next.js linter
```

**Backend Development:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver       # Start Django dev server on localhost:8000
python manage.py makemigrations  # Create database migrations
python manage.py migrate         # Apply migrations
python manage.py test            # Run tests
```

**API Documentation:** http://localhost:8000/api/docs/
**Django Admin:** http://localhost:8000/admin/

**Test Credentials:**
- Admin: admin@demo.com / admin123
- Recruiter: recruiter@demo.com / recruiter123
- HR Manager: hr@demo.com / hr123
- Interviewer: interviewer@demo.com / interviewer123

## Architecture

This is a full-stack recruitment SaaS platform.

### Frontend (Next.js 15.2.4, React 19, TypeScript)
- **Authentication:** JWT-based auth with context provider (`contexts/auth-context.tsx`)
- **API Client:** Centralized API client with auth handling (`lib/api/`)
- **Components:** Feature-specific components in `app/components/`
- **UI Library:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS with responsive design

### Backend (Django 5.0.2, Django REST Framework)
- **Apps:**
  - `accounts`: User management, organizations, authentication
  - `jobs`: Job postings, departments
  - `candidates`: Candidate profiles, applications
  - `interviews`: Interview scheduling, feedback
  - `analytics`: Recruitment metrics, reporting
- **Authentication:** JWT with djangorestframework-simplejwt
- **API:** RESTful API with DRF viewsets
- **Database:** SQLite (development), supports PostgreSQL
- **CORS:** Configured for frontend access

**Key Features:**
- Multi-tenant SaaS with organization isolation
- Role-based access control (platform admin, org admin, recruiter, etc.)
- Complete recruitment pipeline management
- Real-time metrics and analytics

**Path Aliases:**
- Frontend: `@/*` maps to the frontend root directory