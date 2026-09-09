-- ==============================================================================
-- SceneScout Supabase Database Schema
-- Production Persistence: User Profiles, Filmmaker Personas, Saved Locations & Sessions
-- ==============================================================================

-- 1. Profiles Table (Stores user identity, role / filmmaker persona)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  filmmaker_type text check (filmmaker_type in ('indie', 'commercial', 'line_producer', 'student', 'documentary')),
  production_house text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Saved Locations Table (Stores user bookmarks & candidate dossiers)
create table if not exists public.saved_locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  location_id text not null,
  candidate_data jsonb not null,
  notes text,
  created_at timestamptz default now() not null,
  constraint unique_user_location unique (user_id, location_id)
);

-- 3. Scout Sessions Table (Stores historical autonomous briefs & candidate results)
create table if not exists public.scout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_brief text not null,
  criteria jsonb default '{}'::jsonb,
  candidates jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.saved_locations enable row level security;
alter table public.scout_sessions enable row level security;

-- Profiles Policies:
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (including filmmaker persona)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Saved Locations Policies:
-- Users can read only their saved locations
create policy "Users can read own saved locations"
  on public.saved_locations for select
  using (auth.uid() = user_id);

-- Users can insert their saved locations
create policy "Users can insert own saved locations"
  on public.saved_locations for insert
  with check (auth.uid() = user_id);

-- Users can delete their saved locations
create policy "Users can delete own saved locations"
  on public.saved_locations for delete
  using (auth.uid() = user_id);

-- Scout Sessions Policies:
-- Users can read only their own scout sessions
create policy "Users can read own scout sessions"
  on public.scout_sessions for select
  using (auth.uid() = user_id);

-- Users can insert their own scout sessions
create policy "Users can insert own scout sessions"
  on public.scout_sessions for insert
  with check (auth.uid() = user_id);

-- Users can delete their own scout sessions
create policy "Users can delete own scout sessions"
  on public.scout_sessions for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- Automatic Profile Creation Trigger on Sign Up
-- Handles both Google OAuth and Email/Password sign ups seamlessly
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, filmmaker_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    coalesce(new.raw_user_meta_data->>'filmmaker_type', null)
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    filmmaker_type = coalesce(excluded.filmmaker_type, profiles.filmmaker_type),
    updated_at = now();
  return new;
end;
$$;

-- Trigger execution after auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
