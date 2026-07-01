"use client";

import { useEffect, useState } from "react";
import {
  AVATAR_GRID_HEIGHT,
  AVATAR_GRID_WIDTH,
  type AvatarSprite,
  createDefaultAvatarSprite
} from "@/lib/avatar";
import { EQUIPPED_REWARD_EVENT, getEquippedCosmetic } from "@/lib/rewards";
import type { CosmeticProp } from "@/lib/types";

interface PixelAvatarProps {
  size?: "normal" | "small";
}

interface PixelAvatarSpriteProps {
  sprite: AvatarSprite;
  pixelSize: number;
  showGrid?: boolean;
}

const avatarFrameClasses = {
  normal: "h-12 w-8",
  small: "h-6 w-4"
};

const avatarPixelSizes = {
  normal: 2,
  small: 1
};

const propPositionClasses = {
  normal: "bottom-1 -right-4",
  small: "bottom-0 -right-2"
};

function makePropSprite(rows: string[], colors: Record<string, string>): AvatarSprite {
  return {
    width: rows[0]?.length ?? 0,
    height: rows.length,
    pixels: rows.flatMap((row) =>
      row.split("").map((cell) => (cell === "." ? null : colors[cell] ?? null))
    )
  };
}

const propSprites: Record<Exclude<CosmeticProp, "none">, AvatarSprite> = {
  "milk-tea": makePropSprite(
    [
      "....S.",
      "...S..",
      ".CCCC.",
      ".CPPC.",
      ".CPPC.",
      ".CCCC.",
      ".C..C.",
      ".CCCC."
    ],
    {
      C: "#D99A6C",
      P: "#F9DCE3",
      S: "#FFFDF6"
    }
  ),
  flower: makePropSprite(
    [
      "..P..",
      ".PPPP",
      "..P..",
      "..S..",
      ".SS..",
      "..S..",
      "..L..",
      ".L.L."
    ],
    {
      P: "#F3B8C3",
      S: "#5E9B64",
      L: "#BFDDA7"
    }
  ),
  notebook: makePropSprite(
    [
      "BBBBB",
      "BYYBB",
      "BYYYB",
      "BYYLB",
      "BYYYB",
      "BYYBB",
      "BBBBB"
    ],
    {
      B: "#6E9CAF",
      Y: "#FFF6E3",
      L: "#D69A3A"
    }
  ),
  umbrella: makePropSprite(
    [
      "..R..",
      ".RRR.",
      "RRRRR",
      "R.R.R",
      "..H..",
      "..H..",
      "..HH.",
      "...H."
    ],
    {
      R: "#C86168",
      H: "#4A342A"
    }
  )
};

export function PixelAvatarSprite({
  sprite,
  pixelSize,
  showGrid = false
}: PixelAvatarSpriteProps) {
  return (
    <div
      className="overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sprite.width}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${sprite.height}, ${pixelSize}px)`,
        imageRendering: "pixelated"
      }}
      aria-hidden="true"
    >
      {sprite.pixels.map((pixel, index) => (
        <span
          key={index}
          className={showGrid ? "border border-garden-cocoa/20" : ""}
          style={{
            width: pixelSize,
            height: pixelSize,
            backgroundColor: pixel ?? "transparent"
          }}
        />
      ))}
    </div>
  );
}

function PixelAvatarProp({
  prop,
  size
}: {
  prop: CosmeticProp;
  size: "normal" | "small";
}) {
  if (prop === "none") {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute ${propPositionClasses[size]}`}>
      <PixelAvatarSprite sprite={propSprites[prop]} pixelSize={avatarPixelSizes[size]} />
    </div>
  );
}

export function PixelAvatar({ size = "normal" }: PixelAvatarProps) {
  const sprite = createDefaultAvatarSprite();
  const [equippedProp, setEquippedProp] = useState<CosmeticProp>("none");

  useEffect(() => {
    function loadEquippedProp() {
      setEquippedProp(getEquippedCosmetic().prop);
    }

    loadEquippedProp();
    window.addEventListener("storage", loadEquippedProp);
    window.addEventListener(EQUIPPED_REWARD_EVENT, loadEquippedProp);

    return () => {
      window.removeEventListener("storage", loadEquippedProp);
      window.removeEventListener(EQUIPPED_REWARD_EVENT, loadEquippedProp);
    };
  }, []);

  return (
    <div
      className={`relative mx-auto flex items-end justify-center ${avatarFrameClasses[size]}`}
      aria-label="Xiao Yang avatar"
    >
      <PixelAvatarSprite
        sprite={{
          width: AVATAR_GRID_WIDTH,
          height: AVATAR_GRID_HEIGHT,
          pixels: sprite.pixels
        }}
        pixelSize={avatarPixelSizes[size]}
      />
      <PixelAvatarProp prop={equippedProp} size={size} />
    </div>
  );
}
