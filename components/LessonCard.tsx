import Link from "next/link";
import { Leaf, Lock } from "lucide-react";
import { formatPrettyDate } from "@/lib/date";
import type { Lesson, LessonStatus } from "@/lib/types";
import { ProgressPill } from "@/components/ProgressPill";

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  featured?: boolean;
}

export function LessonCard({ lesson, status, featured = false }: LessonCardProps) {
  const isLocked = status === "locked";
  const content = (
    <article
      className={`rounded-2xl border p-5 shadow-soft transition ${
        featured
          ? "border-garden-moss bg-garden-leaf"
          : "border-garden-pond bg-garden-ivory"
      } ${isLocked ? "opacity-70" : "hover:border-garden-moss"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-garden-moss">Day {lesson.dayNumber}</p>
          <h2 className="mt-1 font-hand text-xl text-garden-cocoa">{lesson.title}</h2>
          {lesson.description ? (
            <p className="mt-2 text-sm leading-6 text-garden-taupe">{lesson.description}</p>
          ) : null}
        </div>
        {isLocked ? (
          <Lock className="h-5 w-5 shrink-0 text-garden-taupe" aria-hidden="true" />
        ) : (
          <Leaf className="h-5 w-5 shrink-0 text-garden-moss" aria-hidden="true" />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {status === "completed" ? <ProgressPill tone="clay">Completed</ProgressPill> : null}
        {status === "unlocked" ? <ProgressPill tone="leaf">Unlocked</ProgressPill> : null}
        {status === "locked" ? <ProgressPill tone="muted">Locked</ProgressPill> : null}
        <ProgressPill tone="cream">{formatPrettyDate(lesson.unlockDate)}</ProgressPill>
      </div>
    </article>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/lesson/${lesson.id}`} className="block">
      {content}
    </Link>
  );
}
