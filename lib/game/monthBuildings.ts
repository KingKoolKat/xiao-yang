import { getAppTodayDate, getCourseStartDate, parseDateKey } from "@/lib/date";
import type { GamePosition, MonthBuilding, MonthBuildingStatus } from "@/lib/game/types";
import type { Lesson } from "@/lib/types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const MONTH_GRID_WIDTH = 3;

export function getCurrentMonthIndex(todayKey = getAppTodayDate()): number {
  return parseDateKey(todayKey).getMonth();
}

export function getCourseMonthOrderIndex(
  monthIndex: number,
  startDate = getCourseStartDate()
): number {
  const startMonthIndex = parseDateKey(startDate).getMonth();

  return (monthIndex - startMonthIndex + 12) % 12;
}

export function getMonthGridPosition(monthIndex: number): GamePosition {
  const orderIndex = getCourseMonthOrderIndex(monthIndex);

  return {
    x: orderIndex % MONTH_GRID_WIDTH,
    y: Math.floor(orderIndex / MONTH_GRID_WIDTH)
  };
}

export function getLessonMonthIndex(lesson: Lesson): number {
  return parseDateKey(lesson.unlockDate).getMonth();
}

function getMonthYear(monthIndex: number): number {
  const startDate = parseDateKey(getCourseStartDate());
  const startMonthIndex = startDate.getMonth();
  const courseOrderIndex = getCourseMonthOrderIndex(monthIndex);
  const wrapsIntoNextYear = startMonthIndex + courseOrderIndex > 11;

  return startDate.getFullYear() + (wrapsIntoNextYear ? 1 : 0);
}

function getDaysInMonth(monthIndex: number): number {
  return new Date(getMonthYear(monthIndex), monthIndex + 1, 0).getDate();
}

export function buildMonthBuildings(
  lessons: Lesson[],
  completedLessonIds: string[],
  todayKey = getAppTodayDate()
): MonthBuilding[] {
  const currentMonthIndex = getCurrentMonthIndex(todayKey);
  const currentCourseOrderIndex = getCourseMonthOrderIndex(currentMonthIndex);

  return monthNames.map((name, monthIndex) => {
    const courseOrderIndex = getCourseMonthOrderIndex(monthIndex);
    const monthLessons = lessons.filter(
      (lesson) => getLessonMonthIndex(lesson) === monthIndex
    );
    const completedCount = monthLessons.filter((lesson) =>
      completedLessonIds.includes(lesson.id)
    ).length;
    const lessonCount = monthLessons.length;
    const totalDays = getDaysInMonth(monthIndex);
    const hasLessons = lessonCount > 0;
    const allComplete = completedCount >= totalDays;
    const status: MonthBuildingStatus = allComplete
      ? "completed"
      : courseOrderIndex === currentCourseOrderIndex
        ? "current"
        : courseOrderIndex > currentCourseOrderIndex
          ? "locked"
          : hasLessons
            ? "open"
            : "empty";

    return {
      id: `month-set-${monthIndex}`,
      monthIndex,
      name,
      lessonCount,
      totalDays,
      completedCount,
      position: getMonthGridPosition(monthIndex),
      status
    };
  }).sort(
    (a, b) => getCourseMonthOrderIndex(a.monthIndex) - getCourseMonthOrderIndex(b.monthIndex)
  );
}
