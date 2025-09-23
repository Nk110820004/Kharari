-- Chat threads and messages
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.chat_threads on delete cascade,
  role text not null check (role in ('user','model')),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users manage own threads" on public.chat_threads;
create policy "Users manage own threads" on public.chat_threads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own chat messages" on public.chat_messages;
create policy "Users manage own chat messages" on public.chat_messages for all using (
  exists (select 1 from public.chat_threads t where t.id = thread_id and t.user_id = auth.uid())
) with check (
  exists (select 1 from public.chat_threads t where t.id = thread_id and t.user_id = auth.uid())
);
