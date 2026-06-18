"use client";

import { useRef, useState } from "react";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import { YouTubeLessonVideo } from "@/components/YouTubeLessonVideo";
import type { Lesson } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/youtube";

interface PixelLessonOverlayProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (lessonId: string) => Promise<void>;
}

export function PixelLessonOverlay({
  lesson,
  onClose,
  onComplete
}: PixelLessonOverlayProps) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const completionStartedRef = useRef(false);
  const videoId = getYouTubeVideoId(lesson.videoUrl);

  async function handleVideoEnded() {
    if (completionStartedRef.current) {
      return;
    }

    completionStartedRef.current = true;
    setSaving(true);
    await onComplete(lesson.id);
    setCompleted(true);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-garden-cocoa/80 p-4">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-4 border-garden-cocoa bg-garden-ivory p-4 shadow-[8px_8px_0_#2F6B45]">
        {completed ? (
          <div className="text-center">
            <p className="font-mono text-xs font-black uppercase text-garden-moss">
              Lesson complete
            </p>
            <div className="mx-auto mt-4 flex h-24 w-32 items-end justify-center border-4 border-garden-cocoa bg-garden-leaf p-3 shadow-[5px_5px_0_#4A342A]">
              <PixelAvatar />
              <span className="ml-3 h-8 w-5 border-2 border-garden-cocoa bg-garden-blossom" />
            </div>
            <h2 className="mt-3 font-hand text-4xl text-garden-clay">
              New words planted
            </h2>
            <p className="mt-4 text-garden-taupe">
              Day {lesson.dayNumber} is saved in Xiao Yang’s Chinese lessons.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 border-4 border-garden-cocoa bg-garden-leaf px-5 py-3 font-mono text-sm font-black shadow-[4px_4px_0_#4A342A]"
            >
              Back to lessons
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between gap-3 border-b-4 border-garden-cocoa pb-3">
              <div>
                <p className="font-mono text-xs font-black uppercase text-garden-moss">
                  Day {lesson.dayNumber}
                </p>
                <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">
                  {lesson.title}
                </h2>
                {lesson.description ? (
                  <p className="mt-1 text-sm font-bold text-garden-taupe">
                    {lesson.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-garden-cocoa bg-garden-petal px-3 py-1 font-mono text-xs font-black"
              >
                X
              </button>
            </div>

            <YouTubeLessonVideo
              videoId={videoId}
              title={lesson.title}
              onEnded={handleVideoEnded}
            />

            <p className="mt-4 border-4 border-garden-cocoa bg-garden-leaf p-4 text-sm font-black leading-6 text-garden-cocoa shadow-[4px_4px_0_#4A342A]">
              {saving
                ? "Saving your lesson..."
                : videoId
                  ? "Watch the video to the end to complete today’s lesson."
                  : "This lesson needs a valid YouTube link before it can be completed."}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
