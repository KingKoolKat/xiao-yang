"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import {
  getCourseOrderedMonthFlowers,
  type MonthFlower
} from "@/lib/game/monthFlowers";
import { useLanguage } from "@/lib/i18n";
import type { GardenSceneItem } from "@/lib/types";

interface GardenSceneProps {
  unlockedItems: GardenSceneItem[];
  completedMonthIndexes: number[];
}

type FacingDirection = "left" | "right";

interface WalkPoint {
  x: number;
  y: number;
}

interface WalkObstacle {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

const WALK_BOUNDS = {
  left: 4,
  right: 96,
  bottom: 12,
  top: 58
};

const BENCH_OBSTACLE: WalkObstacle = {
  left: 1,
  right: 27,
  bottom: 27,
  top: 45
};

const POND_OBSTACLE: WalkObstacle = {
  left: 72,
  right: 99,
  bottom: 25,
  top: 49
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function MoonGate() {
  return (
    <div className="absolute left-1/2 top-[23%] z-[8] h-28 w-36 -translate-x-1/2" aria-hidden="true">
      <div className="absolute left-4 top-0 h-24 w-28 border-4 border-garden-cocoa bg-garden-petal" />
      <div className="absolute left-10 top-8 h-20 w-16 border-4 border-garden-cocoa bg-garden-dew" />
      <div className="absolute left-0 bottom-0 h-6 w-8 border-4 border-garden-cocoa bg-garden-cream" />
      <div className="absolute right-0 bottom-0 h-6 w-8 border-4 border-garden-cocoa bg-garden-cream" />
    </div>
  );
}

function GardenBench({ onSit }: { onSit: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSit();
      }}
      className="absolute bottom-[31%] left-7 z-30 h-12 w-24 cursor-pointer border-0 bg-transparent p-0 focus:outline-none focus-visible:outline-4 focus-visible:outline-garden-seed"
      aria-label="Sit on the garden bench"
    >
      <div className="absolute left-1 top-2 h-5 w-20 border-4 border-garden-cocoa bg-garden-seed" />
      <div className="absolute left-0 top-8 h-4 w-24 border-4 border-garden-cocoa bg-garden-clay" />
      <div className="absolute left-4 top-10 h-6 w-3 bg-garden-cocoa" />
      <div className="absolute right-5 top-10 h-6 w-3 bg-garden-cocoa" />
    </button>
  );
}

function KoiPond() {
  return (
    <div
      className="absolute bottom-[28%] right-5 z-10 h-20 w-36 border-4 border-garden-cocoa bg-garden-pond p-2"
      aria-label="Koi pond with three swimming fish"
    >
      <div className="relative h-full w-full overflow-hidden border-2 border-garden-moss bg-[#CDE9E3]">
        <span className="koi-swim-one absolute left-3 top-3 h-3 w-8 border-2 border-garden-cocoa bg-garden-ivory">
          <span className="absolute left-2 top-0 h-2 w-4 bg-garden-clay" />
          <span className="absolute -right-3 top-0 h-3 w-3 border-y-2 border-r-2 border-garden-cocoa bg-garden-clay" />
        </span>
        <span className="koi-swim-two absolute bottom-3 right-5 h-3 w-9 border-2 border-garden-cocoa bg-garden-clay">
          <span className="absolute left-3 top-0 h-2 w-3 bg-garden-ivory" />
          <span className="absolute -left-3 top-0 h-3 w-3 border-y-2 border-l-2 border-garden-cocoa bg-garden-ivory" />
        </span>
        <span className="koi-swim-three absolute bottom-2 left-7 h-3 w-7 border-2 border-garden-cocoa bg-garden-ivory">
          <span className="absolute right-1 top-0 h-2 w-3 bg-garden-clay" />
          <span className="absolute -right-3 top-0 h-3 w-3 border-y-2 border-r-2 border-garden-cocoa bg-garden-clay" />
        </span>
      </div>
    </div>
  );
}

function HighlandCow() {
  return (
    <div className="highland-cow-wander pointer-events-none absolute bottom-[24%] left-[8%] z-30 h-20 w-28" aria-label="Highland cow">
      <div className="highland-cow-facing relative h-full w-full origin-bottom">
        <div className="highland-cow-pose relative h-full w-full origin-bottom">
        <div className="highland-cow-body absolute bottom-3 left-8 h-12 w-[72px] border-4 border-garden-cocoa bg-[#C97835]">
          <span className="absolute -left-2 top-1 h-4 w-4 bg-[#E89B55]" />
          <span className="absolute left-2 -top-2 h-4 w-5 bg-[#E89B55]" />
          <span className="absolute right-2 -top-2 h-5 w-5 bg-[#E89B55]" />
          <span className="absolute -right-2 top-2 h-4 w-4 bg-[#E89B55]" />
          <span className="highland-cow-leg absolute bottom-[-12px] left-2 h-4 w-3 border-x-2 border-b-2 border-garden-cocoa bg-[#6F4931]" />
          <span className="highland-cow-leg absolute bottom-[-12px] right-3 h-4 w-3 border-x-2 border-b-2 border-garden-cocoa bg-[#6F4931]" />
          <span className="absolute -right-4 top-1 h-3 w-5 border-b-2 border-garden-cocoa bg-[#C97835]" />
        </div>

        <div className="highland-cow-head absolute bottom-4 left-0 h-12 w-12 origin-top-right">
          <span className="absolute left-1 top-1 h-10 w-10 border-4 border-garden-cocoa bg-[#C97835]" />
          <span className="absolute left-0 top-0 h-5 w-4 bg-[#E89B55]" />
          <span className="absolute right-0 top-0 h-5 w-4 bg-[#E89B55]" />
          <span className="absolute -left-3 top-0 h-3 w-5 border-l-2 border-t-2 border-garden-cocoa bg-garden-cream" />
          <span className="absolute -right-3 top-0 h-3 w-5 border-r-2 border-t-2 border-garden-cocoa bg-garden-cream" />
          <span className="absolute left-1 top-3 h-5 w-10 bg-[#D98743]" />
          <span className="absolute left-2 top-8 h-5 w-8 border-2 border-garden-cocoa bg-[#A86B48]" />
          <span className="highland-cow-eye absolute left-2 top-7 h-2 w-2 bg-garden-cocoa" />
          <span className="highland-cow-eye absolute right-2 top-7 h-2 w-2 bg-garden-cocoa" />
          <span className="absolute left-4 top-10 h-1 w-1 bg-garden-cocoa" />
          <span className="absolute right-4 top-10 h-1 w-1 bg-garden-cocoa" />
        </div>

        <div className="absolute bottom-0 left-8 h-2 w-20 bg-garden-cocoa/20" />
        <div className="highland-cow-sleep absolute -top-2 right-1 font-mono text-sm font-black text-garden-cocoa">
          Z
          <span className="ml-1 text-[10px]">z</span>
        </div>
        </div>
      </div>
    </div>
  );
}

function FlowerStem({ flower }: { flower: MonthFlower }) {
  return (
    <>
      <span
        className="absolute bottom-0 left-1/2 h-6 w-1 -translate-x-1/2"
        style={{ backgroundColor: flower.leafColor }}
      />
      <span
        className="absolute bottom-2 left-2 h-2 w-3 border border-garden-cocoa"
        style={{ backgroundColor: flower.leafColor }}
      />
    </>
  );
}

function Carnation({ flower }: { flower: MonthFlower }) {
  const petals = [
    "left-0 top-2",
    "left-1 top-0",
    "left-3 top-1",
    "right-0 top-2",
    "left-1 top-3",
    "right-1 top-4",
    "left-3 top-4"
  ];

  return (
    <div className="absolute left-1/2 top-0 h-7 w-8 -translate-x-1/2">
      {petals.map((position) => (
        <span
          key={position}
          className={`absolute h-3 w-3 border border-garden-cocoa ${position}`}
          style={{ backgroundColor: flower.petalColor }}
        />
      ))}
      <span
        className="absolute left-3 top-3 h-2 w-2 border border-garden-cocoa"
        style={{ backgroundColor: flower.centerColor }}
      />
    </div>
  );
}

function Violet({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2">
      <span className="absolute left-0 top-1 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-0 top-1 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-0 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-1 top-3 h-4 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-1 top-3 h-4 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-3 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function Daffodil({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-7 w-8 -translate-x-1/2">
      <span className="absolute left-3 top-0 h-3 w-2 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-0 top-2 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-0 top-2 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-1 top-5 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-1 top-5 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-2 h-4 w-4 border-2 border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function Daisy({ flower }: { flower: MonthFlower }) {
  const rays = [
    "left-3 top-0 h-3 w-2",
    "left-3 top-5 h-3 w-2",
    "left-0 top-3 h-2 w-3",
    "right-0 top-3 h-2 w-3"
  ];

  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      {rays.map((position) => (
        <span
          key={position}
          className={`absolute border border-garden-cocoa ${position}`}
          style={{ backgroundColor: flower.petalColor }}
        />
      ))}
      <span className="absolute left-2 top-2 h-4 w-4 border-2 border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function LilyOfTheValley({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-9 w-8 -translate-x-1/2">
      <span className="absolute left-2 top-0 h-8 w-1 rotate-12" style={{ backgroundColor: flower.leafColor }} />
      <span className="absolute left-3 top-2 h-1 w-3 bg-garden-cocoa" />
      <span className="absolute left-5 top-3 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-3 top-4 h-1 w-3 bg-garden-cocoa" />
      <span className="absolute left-5 top-5 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-6 h-1 w-3 bg-garden-cocoa" />
      <span className="absolute left-4 top-7 h-3 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
    </div>
  );
}

function Rose({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      <span className="absolute left-0 top-2 h-5 w-8 border-2 border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-0 h-8 w-5 border-2 border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-2 h-4 w-4 border-2 border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
      <span className="absolute left-3 top-3 h-2 w-2" style={{ backgroundColor: flower.petalColor }} />
    </div>
  );
}

function Larkspur({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-9 w-6 -translate-x-1/2">
      <span className="absolute left-1/2 top-0 h-9 w-1 -translate-x-1/2" style={{ backgroundColor: flower.leafColor }} />
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={`absolute h-2 w-2 border border-garden-cocoa ${index % 2 === 0 ? "left-1" : "right-1"}`}
          style={{ backgroundColor: flower.petalColor, top: `${index * 6}px` }}
        />
      ))}
    </div>
  );
}

function Gladiolus({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-9 w-8 -translate-x-1/2">
      <span className="absolute left-2 top-0 h-9 w-1" style={{ backgroundColor: flower.leafColor }} />
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="absolute left-3 h-3 w-5 border border-garden-cocoa"
          style={{ backgroundColor: flower.petalColor, top: `${index * 8}px` }}
        >
          <span className="absolute right-0 top-1 h-1 w-2" style={{ backgroundColor: flower.centerColor }} />
        </span>
      ))}
    </div>
  );
}

function Aster({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      {[0, 45, 90, 135].map((rotation) => (
        <span
          key={rotation}
          className="absolute left-1/2 top-1/2 h-1 w-8 border border-garden-cocoa"
          style={{
            backgroundColor: flower.petalColor,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`
          }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function Marigold({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      <span className="absolute left-0 top-2 h-5 w-8 border-2 border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-2 top-0 h-8 w-5 border-2 border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-1 top-1 h-6 w-6 border-2 border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
      <span className="absolute left-3 top-3 h-2 w-2 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
    </div>
  );
}

function Chrysanthemum({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      {[0, 30, 60, 90, 120, 150].map((rotation) => (
        <span
          key={rotation}
          className="absolute left-1/2 top-1/2 h-1 w-8 border border-garden-cocoa"
          style={{
            backgroundColor: flower.petalColor,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`
          }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function Narcissus({ flower }: { flower: MonthFlower }) {
  return (
    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2">
      <span className="absolute left-3 top-0 h-3 w-2 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-0 top-2 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-0 top-2 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-1 top-5 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute right-1 top-5 h-2 w-3 border border-garden-cocoa" style={{ backgroundColor: flower.petalColor }} />
      <span className="absolute left-3 top-3 h-2 w-2 border border-garden-cocoa" style={{ backgroundColor: flower.centerColor }} />
    </div>
  );
}

function PixelMonthFlower({ flower }: { flower: MonthFlower }) {
  const bloom = [
    <Carnation key="carnation" flower={flower} />,
    <Violet key="violet" flower={flower} />,
    <Daffodil key="daffodil" flower={flower} />,
    <Daisy key="daisy" flower={flower} />,
    <LilyOfTheValley key="lily" flower={flower} />,
    <Rose key="rose" flower={flower} />,
    <Larkspur key="larkspur" flower={flower} />,
    <Gladiolus key="gladiolus" flower={flower} />,
    <Aster key="aster" flower={flower} />,
    <Marigold key="marigold" flower={flower} />,
    <Chrysanthemum key="chrysanthemum" flower={flower} />,
    <Narcissus key="narcissus" flower={flower} />
  ][flower.monthIndex];

  return (
    <div className="relative h-10 w-8" aria-hidden="true">
      <FlowerStem flower={flower} />
      {bloom}
    </div>
  );
}

function MonthFlowerBed({
  completedMonthIndexes
}: {
  completedMonthIndexes: number[];
}) {
  const { language } = useLanguage();
  const completedMonths = new Set(completedMonthIndexes);
  const flowers = getCourseOrderedMonthFlowers();

  return (
    <div className="absolute bottom-2 left-1/2 z-30 h-28 w-[96%] -translate-x-1/2 border-4 border-garden-cocoa bg-garden-seed p-1" aria-label="Twelve month flower plots">
      <div className="grid h-full grid-cols-6 grid-rows-2 gap-1">
        {flowers.map((flower) => {
          const isComplete = completedMonths.has(flower.monthIndex);

          return (
            <div
              key={flower.monthIndex}
              className="relative flex min-w-0 flex-col items-center justify-end overflow-hidden border-2 border-garden-cocoa bg-garden-parchment px-0.5 pb-0.5"
              title={`${flower.monthName}: ${flower.flowerName}${isComplete ? " unlocked" : " locked"}`}
            >
              <div className="absolute inset-x-0 bottom-4 h-3 bg-garden-cream" />
              <div className="relative z-10 flex min-h-10 items-end justify-center">
                {isComplete ? (
                  <PixelMonthFlower flower={flower} />
                ) : (
                  <span className="mb-1 h-2 w-3 border-2 border-garden-cocoa bg-garden-taupe" aria-hidden="true" />
                )}
              </div>
              <span className="relative z-20 w-full truncate text-center font-mono text-[7px] font-black uppercase leading-none text-garden-cocoa sm:text-[9px]">
                {language === "zh" ? `${flower.monthIndex + 1}月` : flower.shortName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GardenBackground() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[43%] bg-garden-pond" aria-hidden="true" />

      <div className="absolute right-8 top-6 h-12 w-12 border-4 border-garden-cocoa bg-garden-seed" aria-hidden="true">
        <span className="absolute -left-3 top-4 h-3 w-3 bg-garden-seed" />
        <span className="absolute -right-3 top-4 h-3 w-3 bg-garden-seed" />
        <span className="absolute left-4 -top-3 h-3 w-3 bg-garden-seed" />
        <span className="absolute bottom-[-12px] left-4 h-3 w-3 bg-garden-seed" />
      </div>

      <div className="absolute left-8 top-8 h-7 w-24" aria-hidden="true">
        <span className="absolute bottom-0 left-0 h-5 w-24 border-4 border-garden-cocoa bg-garden-ivory" />
        <span className="absolute left-5 top-0 h-5 w-12 border-4 border-garden-cocoa bg-garden-ivory" />
      </div>
      <div className="absolute right-28 top-24 h-6 w-20" aria-hidden="true">
        <span className="absolute bottom-0 left-0 h-5 w-20 border-4 border-garden-cocoa bg-garden-ivory" />
        <span className="absolute left-5 top-0 h-5 w-10 border-4 border-garden-cocoa bg-garden-ivory" />
      </div>

      <div className="absolute left-0 top-[25%] h-[18%] w-[42%]" aria-hidden="true">
        <span className="absolute bottom-0 left-0 h-10 w-full border-r-4 border-t-4 border-garden-cocoa bg-garden-leaf" />
        <span className="absolute bottom-8 left-[16%] h-10 w-[62%] border-x-4 border-t-4 border-garden-cocoa bg-garden-leaf" />
        <span className="absolute bottom-16 left-[35%] h-8 w-[28%] border-x-4 border-t-4 border-garden-cocoa bg-garden-leaf" />
      </div>
      <div className="absolute right-0 top-[28%] h-[15%] w-[48%]" aria-hidden="true">
        <span className="absolute bottom-0 right-0 h-9 w-full border-l-4 border-t-4 border-garden-cocoa bg-garden-sprout" />
        <span className="absolute bottom-7 right-[14%] h-9 w-[66%] border-x-4 border-t-4 border-garden-cocoa bg-garden-sprout" />
        <span className="absolute bottom-14 right-[32%] h-7 w-[28%] border-x-4 border-t-4 border-garden-cocoa bg-garden-sprout" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[58%] border-t-4 border-garden-cocoa bg-garden-leaf" aria-hidden="true" />

      <div className="absolute left-[4%] top-[22%] z-[5] h-[22%] w-24" aria-hidden="true">
        <span className="absolute bottom-0 left-10 h-[65%] w-5 border-4 border-garden-cocoa bg-garden-clay" />
        <span className="absolute left-0 top-3 h-14 w-16 border-4 border-garden-cocoa bg-garden-moss" />
        <span className="absolute right-0 top-0 h-16 w-16 border-4 border-garden-cocoa bg-garden-moss" />
        <span className="absolute left-6 top-8 h-14 w-16 border-4 border-garden-cocoa bg-garden-sprout" />
      </div>

      <div className="absolute inset-x-0 top-[37%] z-10 h-20" aria-hidden="true">
        <span className="absolute left-3 right-3 top-5 h-3 border-2 border-garden-cocoa bg-garden-seed" />
        <span className="absolute left-3 right-3 top-12 h-3 border-2 border-garden-cocoa bg-garden-seed" />
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className="absolute top-0 h-20 w-4 border-2 border-garden-cocoa bg-garden-ivory"
            style={{ left: `${3 + index * 8.4}%` }}
          >
            <span className="absolute -top-2 left-0 h-3 w-3 rotate-45 border-l-2 border-t-2 border-garden-cocoa bg-garden-ivory" />
          </span>
        ))}
      </div>

      <div className="absolute bottom-[24%] left-1/2 z-10 h-[34%] w-28 -translate-x-1/2" aria-hidden="true">
        <span className="absolute bottom-0 left-0 h-8 w-28 border-4 border-garden-cocoa bg-garden-parchment" />
        <span className="absolute bottom-8 left-3 h-8 w-[88px] border-4 border-garden-cocoa bg-garden-parchment" />
        <span className="absolute bottom-16 left-6 h-8 w-16 border-4 border-garden-cocoa bg-garden-parchment" />
        <span className="absolute bottom-24 left-9 h-8 w-10 border-4 border-garden-cocoa bg-garden-parchment" />
      </div>

    </>
  );
}

export function GardenScene({
  unlockedItems,
  completedMonthIndexes
}: GardenSceneProps) {
  const { t } = useLanguage();
  const unlockedItemSet = new Set(unlockedItems);
  const hasDecorations = unlockedItems.length > 0 || completedMonthIndexes.length > 0;
  const [avatarX, setAvatarX] = useState(50);
  const [avatarY, setAvatarY] = useState(42);
  const [facing, setFacing] = useState<FacingDirection>("right");
  const [isSitting, setIsSitting] = useState(false);

  function isInsideObstacle(point: WalkPoint, obstacle: WalkObstacle): boolean {
    return (
      point.x >= obstacle.left &&
      point.x <= obstacle.right &&
      point.y >= obstacle.bottom &&
      point.y <= obstacle.top
    );
  }

  function isWalkable(point: WalkPoint): boolean {
    if (
      unlockedItemSet.has("koi-pond") &&
      isInsideObstacle(point, POND_OBSTACLE)
    ) {
      return false;
    }

    if (
      unlockedItemSet.has("bench") &&
      isInsideObstacle(point, BENCH_OBSTACLE)
    ) {
      return false;
    }

    return true;
  }

  function moveAvatar(nextX: number, nextY = avatarY) {
    const nextPoint = {
      x: clamp(nextX, WALK_BOUNDS.left, WALK_BOUNDS.right),
      y: clamp(nextY, WALK_BOUNDS.bottom, WALK_BOUNDS.top)
    };
    const currentPoint = { x: avatarX, y: avatarY };
    let resolvedPoint = nextPoint;

    if (!isWalkable(nextPoint)) {
      const horizontalOnly = { x: nextPoint.x, y: currentPoint.y };
      const verticalOnly = { x: currentPoint.x, y: nextPoint.y };

      if (isWalkable(horizontalOnly)) {
        resolvedPoint = horizontalOnly;
      } else if (isWalkable(verticalOnly)) {
        resolvedPoint = verticalOnly;
      } else {
        return;
      }
    }

    if (resolvedPoint.x !== avatarX) {
      setFacing(resolvedPoint.x < avatarX ? "left" : "right");
    }

    setIsSitting(false);
    setAvatarX(resolvedPoint.x);
    setAvatarY(resolvedPoint.y);
  }

  function sitOnBench() {
    setFacing("right");
    setAvatarX(15);
    setAvatarY(35);
    setIsSitting(true);
  }

  function handleSceneClick(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const nextY = ((bounds.bottom - event.clientY) / bounds.height) * 100;

    moveAvatar(nextX, nextY);
  }

  function handleSceneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      moveAvatar(avatarX - 10);
    }

    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      moveAvatar(avatarX + 10);
    }

    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      event.preventDefault();
      moveAvatar(avatarX, avatarY + 8);
    }

    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      event.preventDefault();
      moveAvatar(avatarX, avatarY - 8);
    }
  }

  return (
    <section className="border-4 border-garden-cocoa bg-garden-ivory p-3 shadow-[6px_6px_0_#4A342A]">
      <div
        role="region"
        tabIndex={0}
        onClick={handleSceneClick}
        onKeyDown={handleSceneKeyDown}
        className="relative aspect-[4/3] min-h-72 cursor-pointer overflow-hidden border-4 border-garden-cocoa bg-garden-dew focus:outline-none focus-visible:outline-4 focus-visible:outline-garden-seed sm:aspect-[16/9]"
        aria-label="Xiao Yang's garden"
      >
        <GardenBackground />

        {unlockedItemSet.has("moon-gate") ? <MoonGate /> : null}
        {unlockedItemSet.has("bench") ? <GardenBench onSit={sitOnBench} /> : null}
        {unlockedItemSet.has("koi-pond") ? <KoiPond /> : null}
        {unlockedItemSet.has("highland-cow") ? <HighlandCow /> : null}

        <div
          className="absolute flex h-28 w-28 items-end justify-center p-4 transition-[left,bottom] duration-500 ease-out"
          style={{
            left: `${avatarX}%`,
            bottom: `${avatarY}%`,
            transform: "translate(-50%, 50%)",
            zIndex: Math.round(100 - avatarY)
          }}
        >
          <div
            className={`absolute left-1/2 h-2 w-12 -translate-x-1/2 bg-garden-cocoa/25 ${
              isSitting ? "bottom-0" : "bottom-3"
            }`}
            aria-hidden="true"
          />
          <div
            className="relative origin-bottom transition-transform duration-200"
            style={{
              transform: `${facing === "left" ? "scaleX(-1)" : "scaleX(1)"} ${
                isSitting ? "translateY(7px) scaleY(0.88)" : ""
              }`
            }}
          >
            <PixelAvatar />
          </div>
        </div>

        <MonthFlowerBed completedMonthIndexes={completedMonthIndexes} />

        {!hasDecorations ? (
          <div className="pointer-events-none absolute left-1/2 top-16 z-40 w-[78%] -translate-x-1/2 border-4 border-garden-cocoa bg-garden-ivory p-3 text-center shadow-[4px_4px_0_#4A342A] sm:w-auto">
            <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
              {t("littleGarden")}
            </p>
            <p className="mt-1 font-hand text-2xl leading-7 text-garden-cocoa">
              {t("keepLearningGarden")}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
