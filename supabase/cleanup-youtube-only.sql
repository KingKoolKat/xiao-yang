drop policy if exists "lesson videos are publicly readable" on storage.objects;
drop policy if exists "lesson videos can be uploaded for mvp" on storage.objects;
drop policy if exists "lesson videos can be updated for mvp" on storage.objects;
drop policy if exists "lesson videos can be deleted for mvp" on storage.objects;

-- Supabase does not allow direct SQL deletes from storage.objects or
-- storage.buckets. Delete the old lesson-videos bucket from the Storage
-- dashboard, or use the Supabase Storage API, after this SQL finishes.

drop table if exists lesson_slide_cues;
drop table if exists slides;

alter table lessons
  drop column if exists video_storage_path;
