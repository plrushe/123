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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();
