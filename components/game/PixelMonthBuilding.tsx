import type { CSSProperties } from "react";
import { getMonthTheme } from "@/lib/game/monthThemes";
import type { MonthBuilding } from "@/lib/game/types";

interface PixelMonthBuildingProps {
  building: MonthBuilding;
  isFocused: boolean;
  onEnter: (building: MonthBuilding) => void;
}

const statusLabels = {
  locked: "LOCKED",
  open: "OPEN",
  current: "TODAY",
  completed: "DONE",
  empty: "LOCKED"
};

function getCardBackground(building: MonthBuilding): string {
  const theme = getMonthTheme(building.monthIndex);

  if (building.status === "current") {
    return theme.unlocked;
  }

  if (building.status === "completed") {
    return theme.completed;
  }

  if (building.status === "locked") {
    return theme.locked;
  }

  if (building.status === "empty") {
    return theme.empty;
  }

  return theme.surface;
}

export function PixelMonthBuilding({
  building,
  isFocused,
  onEnter
}: PixelMonthBuildingProps) {
  const disabled = building.status === "locked" || building.status === "empty";
  const theme = getMonthTheme(building.monthIndex);
  const cardStyle: CSSProperties = {
    backgroundColor: getCardBackground(building),
    color: disabled ? "#766456" : "#4A342A",
    outlineColor: isFocused ? theme.accent : undefined
  };

  return (
    <button
      type="button"
      onClick={() => onEnter(building)}
      disabled={disabled}
      style={cardStyle}
      className={`h-full min-h-36 w-full border-4 border-garden-cocoa p-3 text-left shadow-[5px_5px_0_#4A342A] transition disabled:cursor-not-allowed disabled:opacity-70 ${
        isFocused ? "outline outline-4" : ""
      }`}
    >
      <div
        className="mx-auto mb-3 h-12 w-16 border-4 border-garden-cocoa"
        style={{ backgroundColor: theme.surface }}
      >
        <div
          className="h-3 border-b-4 border-garden-cocoa"
          style={{ backgroundColor: theme.accent }}
        />
        <div className="grid grid-cols-3 gap-1 p-2">
          {theme.previewSwatches.map((color, index) => (
            <span
              key={`${building.id}-swatch-${index}`}
              className="h-2 border border-garden-cocoa"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <p
        className="font-mono text-[10px] font-black uppercase"
        style={{ color: disabled ? "#766456" : theme.accent }}
      >
        {statusLabels[building.status]}
      </p>
      <h2 className="mt-1 font-hand text-xl leading-6 text-garden-cocoa">{building.name}</h2>
      <p className="mt-2 font-mono text-xs font-black">
        {building.totalDays} lessons
      </p>
    </button>
  );
}
