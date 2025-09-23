-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  bio text,
  language text default 'English',
  diamonds integer default 0,
  current_streak integer default 0,
  highest_streak integer default 0,
  last_activity_date date,
  mini_game_attempts integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Study groups
create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  topic text,
  members integer default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.study_groups enable row level security;
create policy "Groups readable by all" on public.study_groups for select using (true);
create policy "Authenticated can insert" on public.study_groups for insert with check (auth.role() = 'authenticated');
create policy "Creator can update" on public.study_groups for update using (auth.uid() = created_by);

-- Jobs listing (sample)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  type text,
  description text,
  created_at timestamp with time zone default now()
);

alter table public.jobs enable row level security;
create policy "Jobs readable by all" on public.jobs for select using (true);
create policy "Only service role can modify jobs" on public.jobs for all using (false) with check (false);

-- Applications
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  job_id uuid references public.jobs on delete cascade,
  applied_at timestamp with time zone default now()
);

alter table public.job_applications enable row level security;
create policy "Users can see own applications" on public.job_applications for select using (auth.uid() = user_id);
create policy "Users can insert own application" on public.job_applications for insert with check (auth.uid() = user_id);

-- Activity log
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  date date not null,
  time_spent integer default 0,
  completed boolean default false
);

alter table public.activity_logs enable row level security;
create policy "Users can manage own activity" on public.activity_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Roadmaps and tiles
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  topic text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.roadmap_tiles (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references public.roadmaps on delete cascade,
  index integer not null,
  title text not null,
  completed boolean default false
);

alter table public.roadmaps enable row level security;
alter table public.roadmap_tiles enable row level security;
create policy "Users can manage own roadmaps" on public.roadmaps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage tiles of own roadmaps" on public.roadmap_tiles for all using (exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.user_id = auth.uid()));
