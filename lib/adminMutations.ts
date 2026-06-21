import "server-only";

import {
  AVATAR_SETTING_KEY,
  normalizeAvatarSprite,
  type AvatarSprite
} from "@/lib/avatar";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Lesson, Word } from "@/lib/types";

export async function saveAdminLesson(
  lesson: Lesson,
  words: Word[]
): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const { error: lessonError } = await supabase.from("lessons").upsert(
    {
      id: lesson.id,
      day_number: lesson.dayNumber,
      title: lesson.title,
      description: lesson.description ?? null,
      unlock_date: lesson.unlockDate,
      video_url: lesson.videoUrl ?? null,
      personal_note: lesson.personalNote ?? null,
      created_at: lesson.createdAt ?? new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (lessonError) {
    throw lessonError;
  }

  const { error: wordsError } = await supabase.from("words").upsert(
    words.map((word) => ({
      id: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      english: word.english,
      part_of_speech: word.partOfSpeech ?? null,
      example_hanzi: word.exampleHanzi ?? null,
      example_pinyin: word.examplePinyin ?? null,
      example_english: word.exampleEnglish ?? null,
      notes: word.notes ?? null
    })),
    { onConflict: "id" }
  );

  if (wordsError) {
    throw wordsError;
  }

  const { error: deleteLinksError } = await supabase
    .from("lesson_words")
    .delete()
    .eq("lesson_id", lesson.id);

  if (deleteLinksError) {
    throw deleteLinksError;
  }

  const { error: linksError } = await supabase.from("lesson_words").insert(
    words.map((word) => ({
      lesson_id: lesson.id,
      word_id: word.id
    }))
  );

  if (linksError) {
    throw linksError;
  }
}

export async function saveAdminAvatarSprite(
  sprite: AvatarSprite
): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const normalizedSprite = normalizeAvatarSprite(sprite);
  const { error } = await supabase.from("app_settings").upsert(
    {
      key: AVATAR_SETTING_KEY,
      value: normalizedSprite,
      updated_at: new Date().toISOString()
    },
    { onConflict: "key" }
  );

  if (error) {
    throw error;
  }
}
