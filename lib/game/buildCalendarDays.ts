import { getAppTodayDate, parseDateKey, toDateKey } from "@/lib/date";
import { getLessonMonthIndex } from "@/lib/game/monthBuildings";
import { getLessonStatus } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";
import type { CalendarDayMap, CalendarDayTile } from "@/lib/game/types";

function buildDateKey(year: number, monthIndex: number, day: number): string {
  return toDateKey(new Date(year, monthIndex, day));
}

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function buildCalendarDays(
  lessons: Lesson[],
  completedLessonIds: string[],
  monthIndex: number,
  todayKey = getAppTodayDate()
): CalendarDayMap {
  const today = parseDateKey(todayKey);
  const monthLesson = lessons.find((lesson) => getLessonMonthIndex(lesson) === monthIndex);
  const year = monthLesson ? parseDateKey(monthLesson.unlockDate).getFullYear() : today.getFullYear();
  const firstDay = new Date(year, monthIndex, 1);
  const leadingOffset = firstDay.getDay();
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const rows = Math.ceil((leadingOffset + daysInMonth) / 7);
  const lessonsByDate = new Map(
    lessons
      .filter((lesson) => getLessonMonthIndex(lesson) === monthIndex)
      .map((lesson) => [lesson.unlockDate, lesson])
  );
  const latestUnlockedLesson = Array.from(lessonsByDate.values())
    .filter((lesson) => lesson.unlockDate <= todayKey)
    .sort((a, b) => b.dayNumber - a.dayNumber)[0];

  const days: CalendarDayTile[] = Array.from({ length: daysInMonth }, (_, index) => {
    const calendarDay = index + 1;
    const dateKey = buildDateKey(year, monthIndex, calendarDay);
    const lesson = lessonsByDate.get(dateKey);
    const positionIndex = leadingOffset + index;

    return {
      id: `day-${dateKey}`,
      label: String(calendarDay),
      dateKey,
      calendarDay,
      lesson,
      status: lesson
        ? getLessonStatus(lesson, completedLessonIds, todayKey)
        : dateKey > todayKey
          ? "locked"
          : "empty",
      position: {
        x: positionIndex % 7,
        y: Math.floor(positionIndex / 7)
      },
      isToday: dateKey === todayKey
    };
  });

  const todayDay =
    days.find((day) => day.dateKey === todayKey) ??
    days.find((day) => day.lesson?.id === latestUnlockedLesson?.id);

  return {
    width: 7,
    height: rows,
    days,
    todayDay,
    spawn: todayDay ? todayDay.position : { x: 3, y: Math.max(rows - 1, 0) }
  };
}
