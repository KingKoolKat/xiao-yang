import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { formatPrettyDate, toDateKey } from "@/lib/date";
import { getLessonStatus } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

interface CalendarGridProps {
  lessons: Lesson[];
  completedLessonIds: string[];
}

interface CalendarDay {
  dateKey: string;
  dayLabel: number;
  isCurrentMonth: boolean;
}

function buildMonthDays(anchorDate = new Date()): CalendarDay[] {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstGridDay = new Date(firstDay);
  firstGridDay.setDate(firstGridDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstGridDay);
    day.setDate(firstGridDay.getDate() + index);

    return {
      dateKey: toDateKey(day),
      dayLabel: day.getDate(),
      isCurrentMonth: day.getMonth() === month
    };
  });
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ lessons, completedLessonIds }: CalendarGridProps) {
  const days = buildMonthDays();
  const monthTitle = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric"
  }).format(new Date());
  const lessonByDate = new Map(lessons.map((lesson) => [lesson.unlockDate, lesson]));

  return (
    <section className="rounded-2xl border border-garden-pond bg-garden-ivory p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-garden-cocoa">{monthTitle}</h2>
          <p className="text-sm text-garden-taupe">One tiny lesson at a time.</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-garden-taupe">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const lesson = lessonByDate.get(day.dateKey);
          const status = lesson
            ? getLessonStatus(lesson, completedLessonIds)
            : undefined;
          const baseClass =
            "min-h-20 rounded-2xl border p-2 text-left transition sm:min-h-24";
          const mutedClass = day.isCurrentMonth
            ? "border-garden-pond bg-white"
            : "border-garden-cream bg-garden-mist text-garden-taupe opacity-60";

          if (!lesson) {
            return (
              <div key={day.dateKey} className={`${baseClass} ${mutedClass}`}>
                <span className="text-xs font-semibold">{day.dayLabel}</span>
              </div>
            );
          }

          const cell = (
            <div
              className={`${baseClass} ${
                status === "completed"
                  ? "border-garden-clay bg-garden-leaf"
                  : status === "unlocked"
                    ? "border-garden-blossom bg-garden-petal"
                    : "border-garden-cream bg-garden-mist opacity-70"
              }`}
              title={`${lesson.title} unlocks ${formatPrettyDate(lesson.unlockDate)}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-garden-cocoa">{day.dayLabel}</span>
                {status === "locked" ? (
                  <Lock className="h-3.5 w-3.5 text-garden-taupe" aria-hidden="true" />
                ) : null}
                {status === "completed" ? (
                  <Check className="h-3.5 w-3.5 text-garden-moss" aria-hidden="true" />
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-4 text-garden-cocoa">
                Day {lesson.dayNumber}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-garden-taupe">
                {lesson.title.split("—")[0].trim()}
              </p>
            </div>
          );

          return status === "locked" ? (
            <div key={day.dateKey} aria-disabled="true">
              {cell}
            </div>
          ) : (
            <Link key={day.dateKey} href={`/lesson/${lesson.id}`}>
              {cell}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
