-- TeachBoard Supabase foundation schema
-- Run this SQL in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('candidate', 'recruiter', 'admin')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'candidate'),
    nullif(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    role = excluded.role,
    full_name = excluded.full_name;

  return new;
end;
$$;


create or replace function public.has_role(target_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = target_role
  );
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  company_name text not null,
  location text not null,
  salary text,
  description text not null,
  requirements text,
  employment_type text,
  visa_support boolean not null default false,
  housing_provided boolean not null default false,
  tefl_required boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_recruiter_id_idx on public.jobs (recruiter_id);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_created_at_idx on public.jobs (created_at desc);

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
before update on public.jobs
for each row
execute procedure public.set_updated_at();

alter table public.jobs enable row level security;

create policy "Anyone can read published jobs"
  on public.jobs
  for select
  using (status = 'published');

create policy "Recruiters can read own jobs"
  on public.jobs
  for select
  to authenticated
  using (auth.uid() = recruiter_id);

create policy "Recruiters can insert own jobs"
  on public.jobs
  for insert
  to authenticated
  with check (auth.uid() = recruiter_id);

create policy "Recruiters can update own jobs"
  on public.jobs
  for update
  to authenticated
  using (auth.uid() = recruiter_id)
  with check (auth.uid() = recruiter_id);

create policy "Recruiters can delete own jobs"
  on public.jobs
  for delete
  to authenticated
  using (auth.uid() = recruiter_id);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create index if not exists applications_job_id_idx on public.applications (job_id);
create index if not exists applications_candidate_id_idx on public.applications (candidate_id);
create index if not exists applications_status_idx on public.applications (status);

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
before update on public.applications
for each row
execute procedure public.set_updated_at();

alter table public.applications enable row level security;

create policy "Candidates can create own applications"
  on public.applications
  for insert
  to authenticated
  with check (
    auth.uid() = candidate_id
    and public.has_role('candidate')
  );

create policy "Candidates can read own applications"
  on public.applications
  for select
  to authenticated
  using (auth.uid() = candidate_id);

create policy "Recruiters can read applications for own jobs"
  on public.applications
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and j.recruiter_id = auth.uid()
    )
  );

create table if not exists public.candidate_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  bio text,
  country_of_origin text,
  current_location text,
  target_location text,
  years_experience integer,
  tefl_status text,
  degree_status text,
  visa_status text,
  availability text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_candidate_profiles_updated_at on public.candidate_profiles;
create trigger set_candidate_profiles_updated_at
before update on public.candidate_profiles
for each row
execute procedure public.set_updated_at();

alter table public.candidate_profiles enable row level security;

create policy "Candidates can read own profile details"
  on public.candidate_profiles
  for select
  to authenticated
  using (
    auth.uid() = id
    and public.has_role('candidate')
  );

create policy "Candidates can insert own profile details"
  on public.candidate_profiles
  for insert
  to authenticated
  with check (
    auth.uid() = id
    and public.has_role('candidate')
  );

create policy "Candidates can update own profile details"
  on public.candidate_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and public.has_role('candidate')
  );

create table if not exists public.cv_files (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

create index if not exists cv_files_candidate_id_idx on public.cv_files (candidate_id);

alter table public.cv_files enable row level security;

create policy "Candidates can read own cv metadata"
  on public.cv_files
  for select
  to authenticated
  using (
    auth.uid() = candidate_id
    and public.has_role('candidate')
  );

create policy "Candidates can insert own cv metadata"
  on public.cv_files
  for insert
  to authenticated
  with check (
    auth.uid() = candidate_id
    and public.has_role('candidate')
  );

create policy "Candidates can delete own cv metadata"
  on public.cv_files
  for delete
  to authenticated
  using (
    auth.uid() = candidate_id
    and public.has_role('candidate')
  );

-- Supabase Storage setup for CV uploads (run in SQL editor once per project)
insert into storage.buckets (id, name, public)
values ('candidate-cvs', 'candidate-cvs', false)
on conflict (id) do nothing;

create policy "Candidates can upload own cv objects"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Candidates can read own cv objects"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Candidates can delete own cv objects"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Recruiters can read candidate base profiles"
  on public.profiles
  for select
  to authenticated
  using (
    public.has_role('recruiter')
    and role = 'candidate'
  );

create policy "Recruiters can read candidate profiles"
  on public.candidate_profiles
  for select
  to authenticated
  using (
    public.has_role('recruiter')
  );

create policy "Recruiters can read candidate cv metadata"
  on public.cv_files
  for select
  to authenticated
  using (
    public.has_role('recruiter')
  );
