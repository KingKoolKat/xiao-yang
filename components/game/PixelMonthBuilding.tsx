"use client";

import type { CSSProperties } from "react";
import { PixelMonthFlower } from "@/components/garden/GardenScene";
import { monthFlowers } from "@/lib/game/monthFlowers";
import { getMonthTheme } from "@/lib/game/monthThemes";
import { getLocalizedMonthName, useLanguage } from "@/lib/i18n";
import type { MonthBuilding } from "@/lib/game/types";

interface PixelMonthBuildingProps {
  building: MonthBuilding;
  isFocused: boolean;
  onEnter: (building: MonthBuilding) => void;
}

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
  const { language, t } = useLanguage();
  const disabled = building.status === "locked" || building.status === "empty";
  const theme = getMonthTheme(building.monthIndex);
  const flower = monthFlowers[building.monthIndex];
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
        className="mx-auto mb-2 flex h-14 w-16 items-center justify-center"
        role="img"
        aria-label={`${flower.flowerName} silhouette`}
        title={`${flower.monthName}: ${flower.flowerName}`}
        style={{ color: disabled ? "#766456" : theme.accent }}
      >
        <div className="scale-125 [&_span]:!border-current [&_span]:!bg-current">
          <PixelMonthFlower flower={flower} />
        </div>
      </div>
      <p
        className="font-mono text-[10px] font-black uppercase"
        style={{ color: disabled ? "#766456" : theme.accent }}
      >
        {building.status === "current"
          ? t("today")
          : building.status === "completed"
            ? t("done")
            : building.status === "open"
              ? t("open")
              : t("locked")}
      </p>
      <h2 className="mt-1 font-hand text-xl leading-6 text-garden-cocoa">
        {getLocalizedMonthName(language, building.monthIndex)}
      </h2>
      <p className="mt-2 font-mono text-xs font-black">
        {t("lessonsCount", { count: building.totalDays })}
      </p>
    </button>
  );
}
