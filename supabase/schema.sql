create extension if not exists pgcrypto;

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  day_number int unique not null,
  title text not null,
  description text,
  unlock_date date not null,
  video_url text,
  personal_note text,
  created_at timestamp with time zone default now()
);

create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  hanzi text not null,
  pinyin text not null,
  english text not null,
  part_of_speech text,
  example_hanzi text,
  example_pinyin text,
  example_english text,
  notes text
);

create table if not exists lesson_words (
  lesson_id uuid references lessons(id) on delete cascade,
  word_id uuid references words(id) on delete cascade,
  primary key (lesson_id, word_id)
);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id uuid references lessons(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  score int default 100,
  unique(user_id, lesson_id)
);

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

create index if not exists lessons_unlock_date_idx
  on lessons(unlock_date);

create index if not exists user_progress_user_id_completed_at_idx
  on user_progress(user_id, completed_at desc);

alter table public.lessons enable row level security;
alter table public.words enable row level security;
alter table public.lesson_words enable row level security;
alter table public.user_progress enable row level security;
alter table public.app_settings enable row level security;

revoke insert, update, delete
on table public.lessons, public.words, public.lesson_words, public.app_settings
from anon, authenticated;

revoke all
on table public.user_progress
from anon, authenticated;

grant select
on table public.lessons, public.words, public.lesson_words, public.app_settings
to anon, authenticated;

drop policy if exists "public lessons read" on public.lessons;
create policy "public lessons read"
on public.lessons for select
to anon, authenticated
using (true);

drop policy if exists "public words read" on public.words;
create policy "public words read"
on public.words for select
to anon, authenticated
using (true);

drop policy if exists "public lesson words read" on public.lesson_words;
create policy "public lesson words read"
on public.lesson_words for select
to anon, authenticated
using (true);

drop policy if exists "public app settings read" on public.app_settings;
create policy "public app settings read"
on public.app_settings for select
to anon, authenticated
using (true);
