-- Run this once in the Supabase SQL Editor to enable per-user progress.
-- Lesson content remains publicly readable. Progress is available only to
-- the authenticated user who owns each row.

alter table public.user_progress enable row level security;

revoke all
on table public.user_progress
from anon, authenticated;

grant select, insert, update, delete
on table public.user_progress
to authenticated;

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
