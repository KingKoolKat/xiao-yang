import type { Lesson, Word } from "@/lib/types";

// The production course starts empty. These exports preserve the local fallback
// interface without preloading example lessons or dictionary words.
export const mockWords: Word[] = [];

export function getMockLessons(): Lesson[] {
  return [];
}

export const mockLessonWords: Array<{
  lessonId: string;
  wordId: string;
}> = [];
