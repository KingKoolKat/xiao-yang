import type { CSSProperties } from "react";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import type { MonthTheme } from "@/lib/game/monthThemes";
import type { CalendarDayTile } from "@/lib/game/types";

interface PixelDayTileProps {
  day: CalendarDayTile;
  isSelected: boolean;
  theme: MonthTheme;
  onSelect: (day: CalendarDayTile) => void;
}

function getStatusBackground(day: CalendarDayTile, theme: MonthTheme): string {
  if (day.status === "locked") {
    return theme.locked;
  }

  if (day.status === "completed") {
    return theme.completed;
  }

  if (day.status === "empty") {
    return theme.empty;
  }

  return theme.unlocked;
}

export function PixelDayTile({ day, isSelected, theme, onSelect }: PixelDayTileProps) {
  const todayLabel = day.isToday ? " today" : "";
  const tileStyle: CSSProperties = {
    backgroundColor: getStatusBackground(day, theme),
    color: day.status === "locked" || day.status === "empty" ? "#766456" : "#4A342A",
    borderColor: day.status === "unlocked" ? theme.accent : "#4A342A"
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.currentTarget.blur();
        onSelect(day);
      }}
      style={tileStyle}
      className="relative flex h-full min-h-24 w-full flex-col border-4 p-1 text-xs font-black shadow-[3px_3px_0_#4A342A] transition focus:outline-none focus-visible:outline-none sm:min-h-28"
      aria-label={`Select lesson day ${day.label} ${day.status}${todayLabel}`}
    >
      <span className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <span className="text-[8px] uppercase leading-none sm:text-[10px]">
          Lesson
        </span>
        <span className="font-hand text-xl leading-none sm:text-2xl">{day.label}</span>
        {day.lesson ? (
          <span className="mt-1 hidden max-w-full truncate font-mono text-[9px] uppercase sm:block">
            Day {day.lesson.dayNumber}
          </span>
        ) : null}
      </span>
      <span className="flex h-7 w-full items-end justify-center border-t-2 border-garden-cocoa/30 pt-1">
        {isSelected ? <PixelAvatar size="small" /> : null}
      </span>
      {day.isToday ? (
        <span
          className="pointer-events-none absolute -right-2 -top-3 h-6 w-5"
          aria-hidden="true"
        >
          <span className="absolute bottom-0 left-1 h-6 w-1 bg-garden-cocoa" />
          <span
            className="absolute left-1 top-0 h-4 w-4 border-2 border-garden-cocoa shadow-[2px_2px_0_#4A342A]"
            style={{ backgroundColor: theme.accent }}
          />
          <span
            className="absolute left-3 top-2 h-2 w-2 border-b-2 border-r-2 border-garden-cocoa"
            style={{ backgroundColor: theme.surface }}
          />
        </span>
      ) : null}
    </button>
  );
}
