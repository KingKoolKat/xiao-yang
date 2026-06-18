import type { CalendarDayTile, MonthBuilding } from "@/lib/game/types";

type QuestLayer = "hub" | "building";

interface PixelQuestPanelProps {
  layer: QuestLayer;
  message: string;
  focusedBuilding?: MonthBuilding;
  activeDay?: CalendarDayTile;
  selectedBuilding?: MonthBuilding;
}

function getBuildingAction(building?: MonthBuilding): string {
  if (!building) {
    return "Move to a month tile.";
  }

  if (building.status === "locked") {
    return "This month is still locked.";
  }

  return "Press Enter to open this month.";
}

function getDayTitle(day?: CalendarDayTile): string {
  if (!day) {
    return "No day selected";
  }

  if (day.lesson) {
    return `Day ${day.calendarDay}: ${day.lesson.title}`;
  }

  return `Day ${day.calendarDay}: no lesson`;
}

function getDayAction(day?: CalendarDayTile): string {
  if (!day) {
    return "Move onto a lesson day.";
  }

  if (day.status === "locked") {
    return "This day opens later.";
  }

  if (!day.lesson) {
    return "No lesson scheduled here yet.";
  }

  if (day.status === "completed") {
    return "Open to revisit the lesson.";
  }

  return "Open to begin the lesson.";
}

export function PixelQuestPanel({
  layer,
  message,
  focusedBuilding,
  activeDay,
  selectedBuilding
}: PixelQuestPanelProps) {
  const isHub = layer === "hub";
  const title = isHub
    ? focusedBuilding?.name ?? "Choose a month"
    : getDayTitle(activeDay);
  const subtitle = isHub
    ? `${focusedBuilding?.totalDays ?? 0} lesson days`
    : activeDay?.lesson?.description ?? activeDay?.dateKey ?? selectedBuilding?.name ?? "Month lessons";
  const action = isHub ? getBuildingAction(focusedBuilding) : getDayAction(activeDay);

  return (
    <aside className="grid gap-2 border-4 border-garden-cocoa bg-garden-ivory p-3 font-mono text-xs font-black shadow-[6px_6px_0_#4A342A] sm:grid-cols-[1fr_auto]">
      <div>
        <p className="uppercase text-garden-moss">{isHub ? "Current month" : "Selected day"}</p>
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
