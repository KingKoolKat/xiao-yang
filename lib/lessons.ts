import { getAppTodayDate, isUnlocked } from "@/lib/date";
import { getSharedLessons } from "@/lib/adminLessons";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { Lesson, LessonStatus } from "@/lib/types";

export async function getLessons(): Promise<Lesson[]> {
  if (isSupabaseConfigured && supabase) {
    // TODO: Replace mock fallback with Supabase query scoped by real auth/user rules.
  }

  return getSharedLessons();
}

export async function getLessonById(id: string): Promise<Lesson | undefined> {
  const lessons = await getLessons();

  return lessons.find((lesson) => lesson.id === id);
}

export async function getTodayLesson(): Promise<Lesson | undefined> {
  const lessons = await getLessons();
  const todayKey = getAppTodayDate();
  const unlockedLessons = lessons
    .filter((lesson) => isUnlocked(lesson.unlockDate, todayKey))
    .sort((a, b) => b.dayNumber - a.dayNumber);

  return unlockedLessons[0] ?? lessons[0];
}

export function getLessonStatus(
  lesson: Lesson,
  completedLessonIds: string[],
  todayKey = getAppTodayDate()
): LessonStatus {
  if (completedLessonIds.includes(lesson.id)) {
    return "completed";
  }

  return isUnlocked(lesson.unlockDate, todayKey) ? "unlocked" : "locked";
}
