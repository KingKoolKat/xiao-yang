"use client";

import type { CalendarDayTile, MonthBuilding } from "@/lib/game/types";
import { getLocalizedMonthName, useLanguage } from "@/lib/i18n";

type QuestLayer = "hub" | "building";

interface PixelQuestPanelProps {
  layer: QuestLayer;
  message: string;
  focusedBuilding?: MonthBuilding;
  activeDay?: CalendarDayTile;
  selectedBuilding?: MonthBuilding;
}

function getBuildingAction(
  t: ReturnType<typeof useLanguage>["t"],
  building?: MonthBuilding
): string {
  if (!building) {
    return t("moveToMonth");
  }

  if (building.status === "locked") {
    return t("monthLocked");
  }

  return t("pressEnterMonth");
}

function getDayTitle(
  t: ReturnType<typeof useLanguage>["t"],
  day?: CalendarDayTile
): string {
  if (!day) {
    return t("noDaySelected");
  }

  if (day.lesson) {
    return t("dayWithLesson", { day: day.calendarDay, title: day.lesson.title });
  }

  return t("dayNoLesson", { day: day.calendarDay });
}

function getDayAction(
  t: ReturnType<typeof useLanguage>["t"],
  day?: CalendarDayTile
): string {
  if (!day) {
    return t("moveToLessonDay");
  }

  if (day.status === "locked") {
    return t("dayOpensLater");
  }

  if (!day.lesson) {
    return t("noLessonScheduled");
  }

  if (day.status === "completed") {
    return t("openRevisit");
  }

  return t("openBegin");
}

export function PixelQuestPanel({
  layer,
  message,
  focusedBuilding,
  activeDay,
  selectedBuilding
}: PixelQuestPanelProps) {
  const { language, t } = useLanguage();
  const isHub = layer === "hub";
  const title = isHub
    ? focusedBuilding
      ? getLocalizedMonthName(language, focusedBuilding.monthIndex)
      : t("chooseMonth")
    : getDayTitle(t, activeDay);
  const subtitle = isHub
    ? t("lessonDays", { count: focusedBuilding?.totalDays ?? 0 })
    : activeDay?.lesson?.description ??
      activeDay?.dateKey ??
      (selectedBuilding
        ? getLocalizedMonthName(language, selectedBuilding.monthIndex)
        : t("monthLessons"));
  const action = isHub
    ? getBuildingAction(t, focusedBuilding)
    : getDayAction(t, activeDay);

  return (
    <aside className="grid gap-2 border-4 border-garden-cocoa bg-garden-ivory p-3 font-mono text-xs font-black shadow-[6px_6px_0_#4A342A] sm:grid-cols-[1fr_auto]">
      <div>
        <p className="uppercase text-garden-moss">
          {isHub ? t("currentMonth") : t("selectedDay")}
        </p>
        <h2 className="mt-1 font-hand text-2xl leading-7 text-garden-cocoa">{title}</h2>
        <p className="mt-1 leading-5 text-garden-taupe">{subtitle}</p>
      </div>
      <div className="grid gap-2 sm:min-w-64">
        <p className="border-2 border-garden-cocoa bg-garden-leaf px-2 py-1 leading-5">
          {action}
        </p>
        <p className="border-2 border-garden-cocoa bg-garden-petal px-2 py-1 leading-5">
          {message}
        </p>
      </div>
    </aside>
  );
}
