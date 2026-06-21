-- Run this once in the Supabase SQL Editor after deploying the server-action
-- admin write path. Public clients may read lesson content, but only the
-- server-side Supabase secret key may write it.

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

grant select, insert, update, delete
on table public.user_progress
to authenticated;

drop policy if exists "public lessons read" on public.lessons;
create policy "public lessons read"
on public.lessons
for select
to anon, authenticated
using (true);

drop policy if exists "public words read" on public.words;
create policy "public words read"
on public.words
for select
to anon, authenticated
using (true);

drop policy if exists "public lesson words read" on public.lesson_words;
create policy "public lesson words read"
on public.lesson_words
for select
to anon, authenticated
using (true);

drop policy if exists "public app settings read" on public.app_settings;
create policy "public app settings read"
on public.app_settings
for select
to anon, authenticated
using (true);

drop policy if exists "users can read own progress" on public.user_progress;
create policy "users can read own progress"
on public.user_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can insert own progress" on public.user_progress;
create policy "users can insert own progress"
on public.user_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update own progress" on public.user_progress;
create policy "users can update own progress"
on public.user_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete own progress" on public.user_progress;
create policy "users can delete own progress"
on public.user_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);
