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
- Candidate profile page with editable profile details, CV upload, and live applications tracking page.
- Recruiter company placeholder and live applicants review page.
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
- Recruiter-side candidate search and candidate profile viewing.
- Recruiter job editing and closing workflow.
- Basic jobs filtering/search.
