import type { Lesson, LessonStatus } from "@/lib/types";

export interface GamePosition {
  x: number;
  y: number;
}

export interface CalendarDayTile {
  id: string;
  label: string;
  dateKey: string;
  calendarDay: number;
  lesson?: Lesson;
  status: LessonStatus | "empty";
  position: GamePosition;
  isToday: boolean;
}

export type MonthBuildingStatus = "locked" | "open" | "current" | "completed" | "empty";

export interface MonthBuilding {
  id: string;
  monthIndex: number;
  name: string;
  lessonCount: number;
  totalDays: number;
  completedCount: number;
  status: MonthBuildingStatus;
  position: GamePosition;
}

export interface CalendarDayMap {
  width: number;
  height: number;
  days: CalendarDayTile[];
  spawn: GamePosition;
  todayDay?: CalendarDayTile;
}
