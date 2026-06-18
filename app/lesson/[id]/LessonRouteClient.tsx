"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LessonPlayer } from "@/components/LessonPlayer";
import { ProgressPill } from "@/components/ProgressPill";
import { getLessonById, getLessonStatus } from "@/lib/lessons";
import { getCompletedLessonIds, getUserProgress } from "@/lib/progress";
import type { Lesson, UserProgress } from "@/lib/types";

interface LessonRouteClientProps {
  lessonId: string;
}

export function LessonRouteClient({ lessonId }: LessonRouteClientProps) {
  const [lesson, setLesson] = useState<Lesson | undefined>();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      const [lessonData, progressData] = await Promise.all([
        getLessonById(lessonId),
        getUserProgress()
      ]);

      setLesson(lessonData);
      setProgress(progressData);
      setLoaded(true);
    }

    loadLesson();
  }, [lessonId]);

  const completedLessonIds = useMemo(() => getCompletedLessonIds(progress), [progress]);

  if (!loaded) {
    return (
      <AppShell title="Loading lesson" subtitle="Getting Xiao Yang’s lesson ready.">
        <div className="rounded-2xl border border-garden-pond bg-garden-ivory p-6 text-garden-taupe shadow-soft">
          One moment...
        </div>
      </AppShell>
    );
  }

  if (!lesson) {
    return (
      <AppShell title="Lesson not found" subtitle="This lesson is not available yet.">
        <section className="rounded-2xl border border-garden-pond bg-garden-ivory p-6 text-center shadow-soft">
          <p className="leading-7 text-garden-taupe">
            This lesson does not exist in the mock data.
          </p>
          <Link
            href="/calendar"
            className="mt-5 inline-flex rounded-2xl bg-garden-clay px-5 py-3 font-semibold text-white"
          >
            Back to calendar
          </Link>
        </section>
      </AppShell>
    );
  }

  const status = getLessonStatus(lesson, completedLessonIds);

  if (status === "locked") {
    return (
      <AppShell title={lesson.title} subtitle="This lesson is still locked.">
        <section className="rounded-2xl border border-garden-blossom bg-garden-petal p-6 text-center shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-garden-mist text-garden-taupe">
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-garden-cocoa">Not unlocked yet</h2>
          <p className="mt-3 leading-7 text-garden-taupe">
            This tiny lesson unlocks soon. Today’s lesson is waiting on the main screen.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-2xl bg-garden-clay px-5 py-3 font-semibold text-white"
          >
            Back home
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title={lesson.title} subtitle={lesson.description}>
      <div className="mb-5 flex flex-wrap gap-2">
        <ProgressPill tone="leaf">Day {lesson.dayNumber}</ProgressPill>
        <ProgressPill tone={status === "completed" ? "clay" : "cream"}>
          {status === "completed" ? "Completed" : "Unlocked"}
        </ProgressPill>
      </div>
      <LessonPlayer lesson={lesson} initiallyCompleted={status === "completed"} />
    </AppShell>
  );
}
