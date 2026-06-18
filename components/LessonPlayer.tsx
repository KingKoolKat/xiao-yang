"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { YouTubeLessonVideo } from "@/components/YouTubeLessonVideo";
import { completeLesson } from "@/lib/progress";
import type { Lesson } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/youtube";

interface LessonPlayerProps {
  lesson: Lesson;
  initiallyCompleted: boolean;
}

export function LessonPlayer({ lesson, initiallyCompleted }: LessonPlayerProps) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [saving, setSaving] = useState(false);
  const completionStartedRef = useRef(initiallyCompleted);
  const videoId = getYouTubeVideoId(lesson.videoUrl);

  async function handleVideoEnded() {
    if (completionStartedRef.current) {
      return;
    }

    completionStartedRef.current = true;
    setSaving(true);
    await completeLesson(lesson.id);
    setCompleted(true);
    setSaving(false);
  }

  if (completed) {
    return (
      <section className="rounded-2xl border border-garden-moss bg-garden-leaf p-6 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-garden-ivory text-garden-moss">
          <Sprout className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-garden-cocoa">I’m proud of you</h2>
        <p className="mt-3 leading-7 text-garden-taupe">
          You finished Day {lesson.dayNumber}. These words are now saved in your
          Chinese dictionary.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-garden-clay px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-garden-cocoa"
          >
            Back home
          </Link>
          <Link
            href="/dictionary"
            className="flex-1 rounded-2xl border border-garden-pond bg-garden-ivory px-5 py-3 text-center font-semibold text-garden-cocoa transition hover:border-garden-moss"
          >
            See dictionary
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <YouTubeLessonVideo
        videoId={videoId}
        title={lesson.title}
        onEnded={handleVideoEnded}
      />
      <p className="rounded-2xl border border-garden-pond bg-garden-ivory p-4 text-sm font-semibold text-garden-cocoa shadow-soft">
        {saving
          ? "Saving your lesson..."
          : videoId
            ? "Watch the video to the end to complete this lesson."
            : "This lesson needs a valid YouTube link before it can be completed."}
      </p>
    </section>
  );
}
