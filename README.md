# 小羊学中文

**Xiao Yang Learns Chinese** is a personal, mobile-first pixel-style Next.js app where Xiao Yang unlocks one tiny Chinese lesson per day. The MVP works immediately with mock data and localStorage progress, then can be connected to Supabase for real persistence.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The main app opens directly into the pixel-style lesson experience. The
dictionary is available from the home HUD and at `/dictionary`. Legacy
user-facing routes like `/calendar`, `/rewards`, and `/game` redirect back to
`/` so there is one primary lesson surface.

## Supabase Env Vars

Create `.env.local` when you are ready to connect Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-server-only-secret-key
ADMIN_PASSWORD=4921
ADMIN_SESSION_SECRET=change-this-for-production
NEXT_PUBLIC_COURSE_START_DATE=2026-07-01
NEXT_PUBLIC_APP_TODAY_DATE=2026-07-01
```

If the Supabase values are missing, the app uses mock lessons plus local admin edits, and stores completed lessons in `localStorage` under the Xiao Yang Learns Chinese progress key.
When Supabase is configured, `/admin` saves lesson metadata, YouTube URLs, words, and the avatar sprite to Supabase so other devices see the same lesson content. Admin writes run through protected Next.js Server Actions using `SUPABASE_SECRET_KEY`; that key must never use a `NEXT_PUBLIC_` prefix or be exposed in browser code.
Learner sign-in uses Supabase Auth. Completed lessons are stored in
`user_progress` under the signed-in user ID and synchronize across devices.
By default, the mock app assumes the course starts on July 1, 2026 and that the current app day is July 1, 2026.

## Data Model

The dictionary is derived, not manually maintained:

```text
completed user_progress
  -> lesson_words
  -> words
```

Core tables live in `supabase/schema.sql`:

- `lessons`: daily lesson metadata and unlock date.
- `words`: reusable dictionary entries.
- `lesson_words`: links lessons to learned words.
- `user_progress`: completed lessons for a user.
- `app_settings`: shared app-level JSON settings, currently the avatar sprite.

Seed data for the first seven lessons is in `supabase/seed.sql`. Day 1 uses the date the seed file is run, then each later lesson unlocks one day after the previous one. The initial example sentences use `小羊`, Xiao Yang’s Chinese name.

## Add A New Lesson

For local mock editing:

1. Open `/admin`.
2. Enter the admin password. The default local password is `4921`.
3. Choose `New lesson` or select an existing lesson.
4. Paste an unlisted YouTube URL.
5. Add the words that should appear in the dictionary after the video is watched.
6. Save the draft. Other devices will see the lesson, YouTube URL, and dictionary words.

For Supabase:

1. Run `supabase/schema.sql` in your Supabase SQL editor.
2. Optionally run `supabase/seed.sql`.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SECRET_KEY`.
4. Use `/admin` to add or edit lessons.

For an existing project, run `supabase/secure-admin-writes.sql` once after
deploying this version. It enables RLS, keeps lesson/avatar reads public, and
blocks lesson/avatar writes made with the anon key. It also enables
authenticated per-user progress policies. If you already ran that file before
authentication was added, run `supabase/authenticated-progress.sql`.

## Learner Authentication

The `/login` page is invite-only. Every account receives isolated progress
through `auth.uid()` RLS policies.

1. In Supabase, open **Authentication → Providers → Email** and disable public
   user sign-ups.
2. Open **Authentication → Users → Add user**.
3. Create two confirmed accounts: Xiao Yang's learner account and your testing
   account.
4. Run `supabase/authenticated-progress.sql` in the SQL Editor for an existing
   database.
5. Sign in at `/login`.

The learner routes redirect signed-out visitors to `/login`. `/admin` remains
separate and continues to use `ADMIN_PASSWORD`.

The `/admin` page also has an avatar pixel painter. With Supabase configured, that avatar is saved in `app_settings` and loaded by the main app on other devices.

## YouTube Lessons

Lessons are YouTube-only. Upload your screen recording to YouTube as unlisted, paste the link into `/admin`, and the app embeds that video in the lesson. A lesson is marked complete when the YouTube player reports that the video ended.

For existing Supabase projects that previously used the recorder/slideshow version:

1. Deploy or run the YouTube-only app first.
2. Run `supabase/cleanup-youtube-only.sql` once in Supabase SQL Editor.
3. Keep using `/admin` to add or edit lessons.

## Future Improvements

- Protect `/admin` with Supabase Auth.
- Move admin writes behind server-only service-role actions or Supabase Auth policies.
- Store richer daily activity for more accurate streak recovery.
- Add gentle review/spaced repetition once the daily lesson loop feels right.
# xiao-yang
