"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { saveLessonAction } from "@/app/admin/actions";
import { DictionaryCard } from "@/components/DictionaryCard";
import { ProgressPill } from "@/components/ProgressPill";
import { getSharedWords, saveLocalAdminLesson } from "@/lib/adminLessons";
import { getLessons } from "@/lib/lessons";
import type { LearnedWord, Lesson, Word } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/youtube";

const inputClass =
  "w-full rounded-2xl border border-garden-cream bg-garden-ivory px-4 py-3 outline-none focus:border-garden-moss";
const textareaClass =
  "min-h-24 w-full rounded-2xl border border-garden-cream bg-garden-ivory px-4 py-3 outline-none focus:border-garden-moss";
const smallButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-garden-cream bg-garden-ivory p-2 text-garden-cocoa transition hover:border-garden-moss";

interface DraftWord {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  partOfSpeech: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleEnglish: string;
  notes: string;
}

interface AdminLessonBuilderProps {
  logoutAction: () => Promise<void>;
}

function createDraftId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createUuid(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) =>
    (
      Number(character) ^
      (Math.random() * 16) >> (Number(character) / 4)
    ).toString(16)
  );
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function emptyWord(): DraftWord {
  return {
    id: createDraftId("draft-word"),
    hanzi: "",
    pinyin: "",
    english: "",
    partOfSpeech: "",
    exampleHanzi: "",
    examplePinyin: "",
    exampleEnglish: "",
    notes: ""
  };
}

function createLessonId(): string {
  return createUuid();
}

function createWordId(): string {
  return createUuid();
}

function clean(value: string): string | undefined {
  return value.trim() || undefined;
}

function toDraftWords(lesson: Lesson, availableWords: Word[]): DraftWord[] {
  return lesson.wordIds.map((wordId) => {
    const word = availableWords.find((candidate) => candidate.id === wordId);

    return {
      id: wordId,
      hanzi: word?.hanzi ?? "",
      pinyin: word?.pinyin ?? "",
      english: word?.english ?? "",
      partOfSpeech: word?.partOfSpeech ?? "",
      exampleHanzi: word?.exampleHanzi ?? "",
      examplePinyin: word?.examplePinyin ?? "",
      exampleEnglish: word?.exampleEnglish ?? "",
      notes: word?.notes ?? ""
    };
  });
}

function toPreviewWords(
  words: DraftWord[],
  lessonTitle: string,
  dayNumber: string
): LearnedWord[] {
  return words.map((word) => ({
    id: word.id,
    hanzi: clean(word.hanzi) ?? "字",
    pinyin: clean(word.pinyin) ?? "pinyin",
    english: clean(word.english) ?? "English meaning",
    partOfSpeech: clean(word.partOfSpeech),
    exampleHanzi: clean(word.exampleHanzi),
    examplePinyin: clean(word.examplePinyin),
    exampleEnglish: clean(word.exampleEnglish),
    notes: clean(word.notes),
    lessonId: "preview-lesson",
    lessonTitle: lessonTitle || "Draft lesson",
    dayNumber: Number(dayNumber) || 0
  }));
}

function toSavedWords(words: DraftWord[]): Word[] {
  return words.map((word) => ({
    id: isUuid(word.id) ? word.id : createWordId(),
    hanzi: word.hanzi.trim(),
    pinyin: word.pinyin.trim(),
    english: word.english.trim(),
    partOfSpeech: clean(word.partOfSpeech),
    exampleHanzi: clean(word.exampleHanzi),
    examplePinyin: clean(word.examplePinyin),
    exampleEnglish: clean(word.exampleEnglish),
    notes: clean(word.notes)
  }));
}

function toSavedLesson(
  lessonId: string,
  dayNumber: number,
  title: string,
  description: string,
  unlockDate: string,
  videoUrl: string,
  words: Word[]
): Lesson {
  return {
    id: lessonId,
    dayNumber,
    title,
    description: clean(description),
    unlockDate,
    videoUrl: clean(videoUrl),
    personalNote: undefined,
    createdAt: new Date().toISOString(),
    wordIds: words.map((word) => word.id)
  };
}

export function AdminLessonBuilder({ logoutAction }: AdminLessonBuilderProps) {
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState("new");
  const [editingLessonId, setEditingLessonId] = useState(createLessonId());
  const [dayNumber, setDayNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [words, setWords] = useState<DraftWord[]>(() => [emptyWord()]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadEditableLessons() {
      const lessons = await getLessons();
      const sharedWords = await getSharedWords();

      setAvailableLessons(lessons);
      setAvailableWords(sharedWords);
    }

    loadEditableLessons();
  }, []);

  const youtubeVideoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);
  const previewWords = useMemo(
    () => toPreviewWords(words, title, dayNumber),
    [words, title, dayNumber]
  );
  const wordsAreValid =
    words.length > 0 &&
    words.every((word) => word.hanzi.trim() && word.pinyin.trim() && word.english.trim());
  const draftIsValid =
    dayNumber.trim().length > 0 &&
    title.trim().length > 0 &&
    unlockDate.trim().length > 0 &&
    Boolean(youtubeVideoId) &&
    wordsAreValid;

  function updateWord(id: string, patch: Partial<DraftWord>) {
    setWords((currentWords) =>
      currentWords.map((word) => (word.id === id ? { ...word, ...patch } : word))
    );
  }

  function loadLessonIntoForm(lesson: Lesson) {
    const lessonWords = toDraftWords(lesson, availableWords);

    setEditingLessonId(lesson.id);
    setDayNumber(String(lesson.dayNumber));
    setTitle(lesson.title);
    setDescription(lesson.description ?? "");
    setUnlockDate(lesson.unlockDate);
    setVideoUrl(lesson.videoUrl ?? "");
    setWords(lessonWords.length > 0 ? lessonWords : [emptyWord()]);
    setMessage(`Loaded Day ${lesson.dayNumber} for editing.`);
  }

  function startNewLesson() {
    const nextDayNumber =
      Math.max(0, ...availableLessons.map((lesson) => lesson.dayNumber)) + 1;

    setEditingLessonId(createLessonId());
    setDayNumber(String(nextDayNumber));
    setTitle("");
    setDescription("");
    setUnlockDate("");
    setVideoUrl("");
    setWords([emptyWord()]);
    setMessage("Started a new lesson draft.");
  }

  function handleLessonSelection(lessonId: string) {
    setSelectedLessonId(lessonId);

    if (lessonId === "new") {
      startNewLesson();
      return;
    }

    const lesson = availableLessons.find((candidate) => candidate.id === lessonId);

    if (lesson) {
      loadLessonIntoForm(lesson);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draftIsValid) {
      setMessage("Add lesson details, a valid YouTube URL, and at least one complete word.");
      return;
    }

    const parsedDayNumber = Number(dayNumber);
    const existingLessonForDay = availableLessons.find(
      (lesson) => lesson.dayNumber === parsedDayNumber
    );
    const lessonIdForSave = existingLessonForDay?.id ?? editingLessonId;
    const savedWords = toSavedWords(words);
    const savedLesson = toSavedLesson(
      lessonIdForSave,
      parsedDayNumber,
      title,
      description,
      unlockDate,
      videoUrl,
      savedWords
    );

    setMessage("Saving lesson...");

    let saveResult: Awaited<ReturnType<typeof saveLessonAction>>;

    try {
      saveResult = await saveLessonAction(savedLesson, savedWords);
      saveLocalAdminLesson(savedLesson, savedWords);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Save failed: ${error.message}`
          : "Save failed. Please try again."
      );
      return;
    }

    setAvailableLessons((currentLessons) => {
      const nextLessons = [
        ...currentLessons.filter(
          (lesson) => lesson.id !== savedLesson.id && lesson.dayNumber !== savedLesson.dayNumber
        ),
        savedLesson
      ].sort((a, b) => a.dayNumber - b.dayNumber);

      return nextLessons;
    });
    setAvailableWords(await getSharedWords());
    setSelectedLessonId(savedLesson.id);
    setEditingLessonId(savedLesson.id);
    setMessage(
      saveResult.mode === "supabase"
        ? `Saved Day ${savedLesson.dayNumber} to Supabase. Other devices will see it.`
        : `Saved Day ${savedLesson.dayNumber} locally. Add Supabase env vars to sync across devices.`
    );
  }

  return (
    <AppShell
      title="Lesson Admin"
      subtitle="Add a YouTube lesson and dictionary words."
      showLogout={false}
      showLanguageToggle={false}
    >
      <form action={logoutAction} className="mb-5 flex justify-end">
        <button
          type="submit"
          className="rounded-xl border border-garden-cream bg-garden-ivory px-4 py-2 text-sm font-bold text-garden-cocoa"
        >
          Log out
        </button>
      </form>
      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-garden-pond bg-garden-ivory p-5 shadow-soft">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-garden-cocoa">Lesson details</h2>
              <p className="mt-1 text-sm text-garden-taupe">
                Paste an unlisted YouTube link and list the words this lesson teaches.
              </p>
            </div>
            <ProgressPill tone={draftIsValid ? "leaf" : "muted"}>
              {draftIsValid ? "Draft ready" : "Needs details"}
            </ProgressPill>
          </div>

          <label className="mb-4 block space-y-2">
            <span className="text-sm font-semibold text-garden-cocoa">Edit lesson</span>
            <select
              value={selectedLessonId}
              onChange={(event) => handleLessonSelection(event.target.value)}
              className={inputClass}
            >
              <option value="new">New lesson</option>
              {availableLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  Day {lesson.dayNumber}: {lesson.title}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-garden-cocoa">Day number</span>
              <input
                value={dayNumber}
                onChange={(event) => setDayNumber(event.target.value)}
                className={inputClass}
                type="number"
                min="1"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-garden-cocoa">Unlock date</span>
              <input
                value={unlockDate}
                onChange={(event) => setUnlockDate(event.target.value)}
                className={inputClass}
                type="date"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-garden-cocoa">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-garden-cocoa">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={textareaClass}
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-garden-cocoa">YouTube URL</span>
            <input
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              className={inputClass}
              placeholder="https://youtu.be/..."
            />
          </label>

          {videoUrl && !youtubeVideoId ? (
            <p className="mt-3 rounded-2xl border border-garden-blossom bg-garden-petal p-3 text-sm font-semibold text-garden-clay">
              This does not look like a valid YouTube link.
            </p>
          ) : null}

          {youtubeVideoId ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-garden-pond bg-garden-mist">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube lesson preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-garden-blossom bg-garden-petal p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-garden-cocoa">Words builder</h2>
              <p className="mt-1 text-sm text-garden-taupe">
                These words appear in the dictionary after the YouTube lesson is watched.
              </p>
            </div>
            <ProgressPill tone="blossom">{words.length} words</ProgressPill>
          </div>

          <div className="mt-5 space-y-4">
            {words.map((word, index) => (
              <article
                key={word.id}
                className="rounded-2xl border border-garden-blossom bg-garden-ivory p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-garden-clay">Word {index + 1}</p>
                    <p className="text-xs text-garden-taupe">Required: hanzi, pinyin, English</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setWords((currentWords) =>
                        currentWords.filter((currentWord) => currentWord.id !== word.id)
                      )
                    }
                    className={smallButtonClass}
                    aria-label="Remove word"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">Hanzi</span>
                        <input
                          value={word.hanzi}
                          onChange={(event) => updateWord(word.id, { hanzi: event.target.value })}
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">Pinyin</span>
                        <input
                          value={word.pinyin}
                          onChange={(event) => updateWord(word.id, { pinyin: event.target.value })}
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">English</span>
                        <input
                          value={word.english}
                          onChange={(event) => updateWord(word.id, { english: event.target.value })}
                          className={inputClass}
                        />
                      </label>
                    </div>

                    <label className="mt-4 block space-y-2">
                      <span className="text-sm font-semibold text-garden-cocoa">Part of speech</span>
                      <input
                        value={word.partOfSpeech}
                        onChange={(event) =>
                          updateWord(word.id, { partOfSpeech: event.target.value })
                        }
                        className={inputClass}
                        placeholder="phrase, noun, verb..."
                      />
                    </label>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">Example hanzi</span>
                        <input
                          value={word.exampleHanzi}
                          onChange={(event) =>
                            updateWord(word.id, { exampleHanzi: event.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">Example pinyin</span>
                        <input
                          value={word.examplePinyin}
                          onChange={(event) =>
                            updateWord(word.id, { examplePinyin: event.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-garden-cocoa">Example English</span>
                        <input
                          value={word.exampleEnglish}
                          onChange={(event) =>
                            updateWord(word.id, { exampleEnglish: event.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                    </div>

                    <label className="mt-4 block space-y-2">
                      <span className="text-sm font-semibold text-garden-cocoa">Notes</span>
                      <textarea
                        value={word.notes}
                        onChange={(event) => updateWord(word.id, { notes: event.target.value })}
                        className={textareaClass}
                      />
                    </label>
                  </div>

                  <aside className="lg:sticky lg:top-4 lg:self-start">
                    <p className="mb-2 text-sm font-bold text-garden-clay">Dictionary preview</p>
                    <DictionaryCard word={previewWords[index]} compact />
                  </aside>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setWords((currentWords) => [...currentWords, emptyWord()])}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-garden-blossom bg-garden-ivory px-5 py-3 font-bold text-garden-clay shadow-sm transition hover:bg-garden-petal"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add word
          </button>
        </section>

        {message ? (
          <p className="rounded-2xl border border-garden-seed bg-garden-ivory p-4 text-sm font-semibold text-garden-cocoa">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-2xl bg-garden-clay px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-garden-cocoa"
        >
          Save YouTube lesson
        </button>
      </form>
    </AppShell>
  );
}
