"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { saveAdminAvatarSprite, saveAdminLesson } from "@/lib/adminMutations";
import { requireAdminAuthenticated } from "@/lib/adminAuth";
import {
  AVATAR_GRID_HEIGHT,
  AVATAR_GRID_WIDTH,
  normalizeAvatarSprite,
  type AvatarSprite
} from "@/lib/avatar";
import { isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import type { Lesson, Word } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/youtube";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function requireString(
  value: unknown,
  label: string,
  maxLength: number,
  allowEmpty = false
): string {
  if (typeof value !== "string") {
    throw new Error(`${label} must be text.`);
  }

  const normalized = value.trim();

  if (!allowEmpty && !normalized) {
    throw new Error(`${label} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${label} is too long.`);
  }

  return normalized;
}

function optionalString(
  value: unknown,
  label: string,
  maxLength: number
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return requireString(value, label, maxLength);
}

function validateWord(value: unknown): Word {
  if (!value || typeof value !== "object") {
    throw new Error("Each word must be an object.");
  }

  const word = value as Partial<Word>;
  const id = requireString(word.id, "Word ID", 36);

  if (!UUID_PATTERN.test(id)) {
    throw new Error("Word ID is invalid.");
  }

  return {
    id,
    hanzi: requireString(word.hanzi, "Hanzi", 100),
    pinyin: requireString(word.pinyin, "Pinyin", 200),
    english: requireString(word.english, "English meaning", 300),
    partOfSpeech: optionalString(word.partOfSpeech, "Part of speech", 100),
    exampleHanzi: optionalString(word.exampleHanzi, "Example hanzi", 500),
    examplePinyin: optionalString(word.examplePinyin, "Example pinyin", 700),
    exampleEnglish: optionalString(word.exampleEnglish, "Example English", 700),
    notes: optionalString(word.notes, "Notes", 2000)
  };
}

function validateLesson(value: unknown, words: Word[]): Lesson {
  if (!value || typeof value !== "object") {
    throw new Error("Lesson data is invalid.");
  }

  const lesson = value as Partial<Lesson>;
  const id = requireString(lesson.id, "Lesson ID", 36);
  const dayNumber = Number(lesson.dayNumber);
  const unlockDate = requireString(lesson.unlockDate, "Unlock date", 10);
  const videoUrl = requireString(lesson.videoUrl, "YouTube URL", 500);

  if (!UUID_PATTERN.test(id)) {
    throw new Error("Lesson ID is invalid.");
  }

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 366) {
    throw new Error("Day number must be between 1 and 366.");
  }

  if (!DATE_PATTERN.test(unlockDate) || Number.isNaN(Date.parse(`${unlockDate}T00:00:00Z`))) {
    throw new Error("Unlock date is invalid.");
  }

  if (!getYouTubeVideoId(videoUrl)) {
    throw new Error("YouTube URL is invalid.");
  }

  return {
    id,
    dayNumber,
    title: requireString(lesson.title, "Title", 200),
    description: optionalString(lesson.description, "Description", 2000),
    unlockDate,
    videoUrl,
    personalNote: optionalString(lesson.personalNote, "Personal note", 2000),
    createdAt: optionalString(lesson.createdAt, "Created date", 100),
    wordIds: words.map((word) => word.id)
  };
}

function validateAvatarSprite(value: unknown): AvatarSprite {
  if (!value || typeof value !== "object") {
    throw new Error("Avatar data is invalid.");
  }

  const sprite = value as Partial<AvatarSprite>;

  if (
    sprite.width !== AVATAR_GRID_WIDTH ||
    sprite.height !== AVATAR_GRID_HEIGHT ||
    !Array.isArray(sprite.pixels) ||
    sprite.pixels.length !== AVATAR_GRID_WIDTH * AVATAR_GRID_HEIGHT ||
    !sprite.pixels.every(
      (pixel) => pixel === null || (typeof pixel === "string" && HEX_COLOR_PATTERN.test(pixel))
    )
  ) {
    throw new Error("Avatar sprite is invalid.");
  }

  return normalizeAvatarSprite(sprite);
}

export async function saveLessonAction(
  lessonValue: unknown,
  wordValues: unknown
): Promise<{ mode: "supabase" | "local" }> {
  await requireAdminAuthenticated();

  if (!Array.isArray(wordValues) || wordValues.length < 1 || wordValues.length > 50) {
    throw new Error("A lesson must contain between 1 and 50 words.");
  }

  const words = wordValues.map(validateWord);
  const lesson = validateLesson(lessonValue, words);

  if (!isAdminSupabaseConfigured) {
    return { mode: "local" };
  }

  await saveAdminLesson(lesson, words);
  revalidatePath("/");
  revalidatePath("/dictionary");
  revalidatePath("/admin");

  return { mode: "supabase" };
}

export async function saveAvatarSpriteAction(
  spriteValue: unknown
): Promise<{ mode: "supabase" | "local" }> {
  await requireAdminAuthenticated();
  const sprite = validateAvatarSprite(spriteValue);

  if (!isAdminSupabaseConfigured) {
    return { mode: "local" };
  }

  await saveAdminAvatarSprite(sprite);
  revalidatePath("/");
  revalidatePath("/garden");
  revalidatePath("/admin");

  return { mode: "supabase" };
}
