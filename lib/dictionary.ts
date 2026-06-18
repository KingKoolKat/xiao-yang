import { getSharedLessons, getSharedWords } from "@/lib/adminLessons";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { LearnedWord, UserProgress } from "@/lib/types";
import { getCompletedLessonIds } from "@/lib/progress";

export async function getLearnedWords(progress: UserProgress[]): Promise<LearnedWord[]> {
  if (isSupabaseConfigured && supabase) {
    // TODO: Query completed user_progress -> lesson_words -> words for the authenticated user.
  }

  const completedLessonIds = getCompletedLessonIds(progress);
  const lessons = await getSharedLessons();
  const words = await getSharedWords();
  const learnedWordIds = new Set(
    lessons
      .filter((lesson) => completedLessonIds.includes(lesson.id))
      .flatMap((lesson) => lesson.wordIds)
  );

  return words
    .filter((word) => learnedWordIds.has(word.id))
    .map((word) => {
      const sourceLesson = lessons.find((lesson) => lesson.wordIds.includes(word.id));

      return {
        ...word,
        lessonId: sourceLesson?.id ?? "",
        lessonTitle: sourceLesson?.title ?? "A tiny lesson",
        dayNumber: sourceLesson?.dayNumber ?? 0
      };
    })
    .sort((a, b) => a.dayNumber - b.dayNumber);
}

export function filterLearnedWords(words: LearnedWord[], query: string): LearnedWord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return words;
  }

  return words.filter((word) => {
    return [word.hanzi, word.pinyin, word.english, word.exampleEnglish]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(normalizedQuery));
  });
}
