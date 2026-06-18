import { addDays, getAppTodayDate, toDateKey } from "@/lib/date";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { UserProgress } from "@/lib/types";

const STORAGE_KEY = "xiao-yangs-chinese-lessons-progress";
const LEGACY_STORAGE_KEYS = [
  "xiao-yangs-garden-progress",
  "jadas-chinese-garden-progress"
];
export const MOCK_USER_ID = "local-xiao-yang";

function createProgressId(lessonId: string): string {
  return `local-${lessonId}`;
}

function safeParseProgress(value: string | null): UserProgress[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalProgress(): UserProgress[] {
  if (typeof window === "undefined") {
    return [];
  }

  const progress = safeParseProgress(window.localStorage.getItem(STORAGE_KEY));

  if (progress.length > 0) {
    return progress;
  }

  const legacyProgress = LEGACY_STORAGE_KEYS.map((key) =>
    safeParseProgress(window.localStorage.getItem(key))
  ).find((items) => items.length > 0) ?? [];

  if (legacyProgress.length > 0) {
    saveLocalProgress(legacyProgress);
  }

  return legacyProgress;
}

export function saveLocalProgress(progress: UserProgress[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function getUserProgress(): Promise<UserProgress[]> {
  if (isSupabaseConfigured && supabase) {
    // TODO: Replace localStorage fallback with Supabase query scoped to the authenticated user.
  }

  return getLocalProgress();
}

export function getCompletedLessonIds(progress: UserProgress[]): string[] {
  return Array.from(new Set(progress.map((item) => item.lessonId)));
}

export async function completeLesson(lessonId: string): Promise<UserProgress[]> {
  const progress = await getUserProgress();
  const existing = progress.find((item) => item.lessonId === lessonId);

  if (existing) {
    return progress;
  }

  const nextProgress = [
    ...progress,
    {
      id: createProgressId(lessonId),
      userId: MOCK_USER_ID,
      lessonId,
      completedAt: `${getAppTodayDate()}T12:00:00.000Z`,
      score: 100
    }
  ];

  if (isSupabaseConfigured && supabase) {
    // TODO: Insert user_progress row in Supabase once auth is enabled.
  }

  saveLocalProgress(nextProgress);

  return nextProgress;
}

export function calculateStreak(
  progress: UserProgress[],
  todayKey = getAppTodayDate()
): number {
  const completionDates = new Set(
    progress.map((item) => toDateKey(new Date(item.completedAt)))
  );

  if (completionDates.size === 0) {
    return 0;
  }

  let cursor = todayKey;

  if (!completionDates.has(cursor)) {
    const yesterday = addDays(todayKey, -1);

    if (!completionDates.has(yesterday)) {
      return 0;
    }

    cursor = yesterday;
  }

  let streak = 0;

  while (completionDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
