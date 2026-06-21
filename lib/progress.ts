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

function mapProgressRow(row: {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string | null;
  score: number | null;
}): UserProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    completedAt: row.completed_at ?? new Date().toISOString(),
    score: row.score ?? 100
  };
}

async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export async function getUserProgress(): Promise<UserProgress[]> {
  if (isSupabaseConfigured && supabase) {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from("user_progress")
      .select("id, user_id, lesson_id, completed_at, score")
      .eq("user_id", userId)
      .order("completed_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapProgressRow);
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

  if (isSupabaseConfigured && supabase) {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("You must be signed in to complete a lesson.");
    }

    const { error } = await supabase.from("user_progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      completed_at: `${getAppTodayDate()}T12:00:00.000Z`,
      score: 100
    });

    if (error) {
      throw error;
    }

    return getUserProgress();
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
