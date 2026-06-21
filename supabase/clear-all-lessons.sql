-- Destructive reset: remove all lesson content and learner completion records.
-- app_settings is preserved, so the shared avatar remains unchanged.

begin;

delete from public.user_progress;
delete from public.lesson_words;
delete from public.lessons;
delete from public.words;

commit;
