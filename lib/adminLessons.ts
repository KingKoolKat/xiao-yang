import { getMockLessons, mockWords } from "@/lib/mockData";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { Lesson, Word } from "@/lib/types";

export const ADMIN_LESSON_STORAGE_KEY = "xiao-yangs-admin-lessons";

export interface AdminLessonStore {
  lessons: Lesson[];
  words: Word[];
}

interface LessonRow {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  unlock_date: string;
  video_url: string | null;
  personal_note: string | null;
  created_at: string | null;
}

interface WordRow {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  part_of_speech: string | null;
  example_hanzi: string | null;
  example_pinyin: string | null;
  example_english: string | null;
  notes: string | null;
}

interface LessonWordRow {
  lesson_id: string;
  word_id: string;
}

function emptyStore(): AdminLessonStore {
  return {
    lessons: [],
    words: []
  };
}

function mergeLessons(overrides: Lesson[]): Lesson[] {
  const lessonsByDay = new Map<number, Lesson>();

  getMockLessons().forEach((lesson) => lessonsByDay.set(lesson.dayNumber, lesson));
  overrides.forEach((lesson) => lessonsByDay.set(lesson.dayNumber, lesson));

  return Array.from(lessonsByDay.values()).sort((a, b) => a.dayNumber - b.dayNumber);
}

function mergeWords(overrides: Word[]): Word[] {
  const wordsById = new Map<string, Word>();

  mockWords.forEach((word) => wordsById.set(word.id, word));
  overrides.forEach((word) => wordsById.set(word.id, word));

  return Array.from(wordsById.values());
}

function mapLessonRow(lesson: LessonRow, lessonWords: LessonWordRow[]): Lesson {
  return {
    id: lesson.id,
    dayNumber: lesson.day_number,
    title: lesson.title,
    description: lesson.description ?? undefined,
    unlockDate: lesson.unlock_date,
    videoUrl: lesson.video_url ?? undefined,
    personalNote: lesson.personal_note ?? undefined,
    createdAt: lesson.created_at ?? undefined,
    wordIds: lessonWords
      .filter((link) => link.lesson_id === lesson.id)
      .map((link) => link.word_id)
  };
}

function mapWordRow(word: WordRow): Word {
  return {
    id: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    english: word.english,
    partOfSpeech: word.part_of_speech ?? undefined,
    exampleHanzi: word.example_hanzi ?? undefined,
    examplePinyin: word.example_pinyin ?? undefined,
    exampleEnglish: word.example_english ?? undefined,
    notes: word.notes ?? undefined
  };
}

async function getSupabaseLessons(): Promise<Lesson[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, day_number, title, description, unlock_date, video_url, personal_note, created_at")
    .order("day_number", { ascending: true });

  if (lessonsError || !lessons) {
    return null;
  }

  const lessonIds = lessons.map((lesson) => lesson.id);

  if (lessonIds.length === 0) {
    return [];
  }

  const { data: lessonWords, error: linksError } = await supabase
    .from("lesson_words")
    .select("lesson_id, word_id")
    .in("lesson_id", lessonIds);

  if (linksError || !lessonWords) {
    return null;
  }

  return lessons.map((lesson) =>
    mapLessonRow(lesson as LessonRow, lessonWords as LessonWordRow[])
  );
}

async function getSupabaseWords(): Promise<Word[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("words")
    .select("id, hanzi, pinyin, english, part_of_speech, example_hanzi, example_pinyin, example_english, notes");

  if (error || !data) {
    return null;
  }

  return (data as WordRow[]).map(mapWordRow);
}

function safeParseStore(rawValue: string | null): AdminLessonStore {
  if (!rawValue) {
    return emptyStore();
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AdminLessonStore>;

    return {
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      words: Array.isArray(parsed.words) ? parsed.words : []
    };
  } catch {
    return emptyStore();
  }
}

export function getLocalAdminLessonStore(): AdminLessonStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }

  return safeParseStore(window.localStorage.getItem(ADMIN_LESSON_STORAGE_KEY));
}

export function saveLocalAdminLessonStore(store: AdminLessonStore): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_LESSON_STORAGE_KEY, JSON.stringify(store));
}

export function getMergedLessons(): Lesson[] {
  const localLessons = getLocalAdminLessonStore().lessons;
  return mergeLessons(localLessons);
}

export function getMergedWords(): Word[] {
  const localWords = getLocalAdminLessonStore().words;
  return mergeWords(localWords);
}

export async function getSharedLessons(): Promise<Lesson[]> {
  const supabaseLessons = await getSupabaseLessons();

  if (supabaseLessons) {
    return mergeLessons(supabaseLessons);
  }

  return getMergedLessons();
}

export async function getSharedWords(): Promise<Word[]> {
  const supabaseWords = await getSupabaseWords();

  if (supabaseWords) {
    return mergeWords(supabaseWords);
  }

  return getMergedWords();
}

export function saveLocalAdminLesson(lesson: Lesson, words: Word[]): AdminLessonStore {
  const store = getLocalAdminLessonStore();
  const replacedLesson = store.lessons.find(
    (existingLesson) =>
      existingLesson.id === lesson.id || existingLesson.dayNumber === lesson.dayNumber
  );
  const nextLessons = [
    ...store.lessons.filter(
      (existingLesson) =>
        existingLesson.id !== lesson.id && existingLesson.dayNumber !== lesson.dayNumber
    ),
    lesson
  ].sort((a, b) => a.dayNumber - b.dayNumber);
  const editedWordIds = new Set([
    ...words.map((word) => word.id),
    ...(replacedLesson?.wordIds ?? [])
  ]);
  const nextWords = [
    ...store.words.filter((word) => !editedWordIds.has(word.id)),
    ...words
  ];
  const nextStore = {
    lessons: nextLessons,
    words: nextWords
  };

  saveLocalAdminLessonStore(nextStore);

  return nextStore;
}
