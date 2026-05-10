# TeachBoard Project Plan (MVP)

## User Roles
- **Guest**: discovers jobs, learns about TeachBoard, creates an account.
- **Candidate**: manages profile, applies to ESL jobs, tracks applications.
- **Recruiter**: manages company profile, posts jobs, reviews applicants.
- **Admin**: oversees platform operations, users, and moderation.

## MVP Features (Current)
- Public landing page.
- Public jobs listing and job details pages backed by Supabase (`/jobs`, `/jobs/[id]`).
- Recruiter jobs management page for creating and reviewing own job posts (`/recruiter/jobs`).
- Candidate area placeholders (profile + applications).
- Recruiter company/applicants placeholders.
- Admin area placeholder for future controls.
- Authentication and profile role handling with Supabase.

## Route Structure
- `/`
- `/jobs`
- `/jobs/[id]`
- `/login`
- `/signup`
- `/candidate`
- `/candidate/profile`
- `/candidate/applications`
- `/recruiter`
- `/recruiter/company`
- `/recruiter/jobs`
- `/recruiter/applicants`
- `/admin`

## Intended Stack
- **Frontend**: Next.js App Router + TypeScript + Tailwind CSS
- **Backend/Auth/DB**: Supabase

## Next Core Milestones
- Candidate application flow (apply to jobs and track status).
- Recruiter job editing and closing workflow.
- Basic jobs filtering/search.
