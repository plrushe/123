# TeachBoard Project Plan (MVP)

## User Roles
- **Guest**: discovers jobs, learns about TeachBoard, creates an account.
- **Candidate**: manages profile, applies to ESL jobs, tracks applications.
- **Recruiter**: manages company profile, posts jobs, reviews applicants.
- **Admin**: oversees platform operations, users, and moderation.

## Initial MVP Features
- Public landing page and jobs browsing.
- Candidate area with profile + applications placeholders.
- Recruiter area with company, jobs, and applicants placeholders.
- Admin area placeholder for future controls.
- Authentication and database integration planned next (Supabase).

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
- **Backend/Auth/DB (next step)**: Supabase
