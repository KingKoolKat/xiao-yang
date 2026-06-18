"use client";

import { useEffect, useState } from "react";
import { PixelAvatarSprite } from "@/components/game/PixelAvatar";
import {
  AVATAR_GRID_HEIGHT,
  AVATAR_GRID_WIDTH,
  AVATAR_PALETTE,
  AVATAR_SPRITE_EVENT,
  type AvatarPixel,
  type AvatarSprite,
  createDefaultAvatarSprite,
  getSharedAvatarSprite,
  saveSharedAvatarSprite
} from "@/lib/avatar";

function cloneSprite(sprite: AvatarSprite): AvatarSprite {
  return {
    width: sprite.width,
    height: sprite.height,
    pixels: [...sprite.pixels]
  };
}

function getIndex(x: number, y: number): number {
  return y * AVATAR_GRID_WIDTH + x;
}

export function AvatarPixelEditor() {
  const [sprite, setSprite] = useState<AvatarSprite>(() => createDefaultAvatarSprite());
  const [selectedPixel, setSelectedPixel] = useState<AvatarPixel>(AVATAR_PALETTE[1]);
  const [mirrorMode, setMirrorMode] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Not saved yet");

  useEffect(() => {
    void getSharedAvatarSprite().then(setSprite);
  }, []);

  function commitSprite(nextSprite: AvatarSprite) {
    setSprite(nextSprite);
    setSaveStatus("Saving...");
    window.dispatchEvent(new Event(AVATAR_SPRITE_EVENT));
    void saveSharedAvatarSprite(nextSprite).then((mode) => {
      setSaveStatus(mode === "supabase" ? "Saved to Supabase" : "Saved locally");
      window.dispatchEvent(new Event(AVATAR_SPRITE_EVENT));
    });
  }

  function paintPixel(index: number) {
    const x = index % AVATAR_GRID_WIDTH;
    const y = Math.floor(index / AVATAR_GRID_WIDTH);
    const nextSprite = cloneSprite(sprite);

    nextSprite.pixels[index] = selectedPixel;

    if (mirrorMode) {
      const mirroredX = AVATAR_GRID_WIDTH - 1 - x;
      nextSprite.pixels[getIndex(mirroredX, y)] = selectedPixel;
    }

    commitSprite(nextSprite);
  }

  function resetSprite() {
    commitSprite(createDefaultAvatarSprite());
  }

  function clearSprite() {
    commitSprite({
      width: AVATAR_GRID_WIDTH,
      height: AVATAR_GRID_HEIGHT,
      pixels: Array.from({ length: AVATAR_GRID_WIDTH * AVATAR_GRID_HEIGHT }, () => null)
    });
  }

  return (
    <section className="mb-5 rounded-2xl border border-garden-cocoa bg-garden-ivory p-4 shadow-soft">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-garden-cocoa">Avatar painter</h2>
          <p className="mt-1 text-sm text-garden-taupe">
            Paint the sprite. Changes save automatically and sync through Supabase when configured.
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-garden-moss">{saveStatus}</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="mb-1 text-xs font-bold uppercase text-garden-taupe">App</p>
            <div className="flex h-16 w-12 items-end justify-center border-2 border-garden-cocoa bg-garden-mist p-1">
              <PixelAvatarSprite sprite={sprite} pixelSize={2} />
            </div>
          </div>
          <div className="text-center">
            <p className="mb-1 text-xs font-bold uppercase text-garden-taupe">Tile</p>
            <div className="flex h-10 w-8 items-end justify-center border-2 border-garden-cocoa bg-garden-mist p-1">
              <PixelAvatarSprite sprite={sprite} pixelSize={1} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div>
          <div
            className="inline-grid border-4 border-garden-cocoa bg-white touch-none"
            style={{
              gridTemplateColumns: `repeat(${AVATAR_GRID_WIDTH}, 18px)`,
              gridTemplateRows: `repeat(${AVATAR_GRID_HEIGHT}, 18px)`
            }}
          >
            {sprite.pixels.map((pixel, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Paint pixel ${index + 1}`}
                className="h-[18px] w-[18px] border border-garden-cocoa/20"
                style={{
                  backgroundColor: pixel ?? "transparent"
                }}
                onPointerDown={(event) => {
                  event.preventDefault();
                  paintPixel(index);
                }}
                onPointerEnter={(event) => {
                  if (event.buttons === 1) {
                    paintPixel(index);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-bold text-garden-cocoa">Palette</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color}`}
                  onClick={() => setSelectedPixel(color)}
                  className={`h-9 w-9 border-4 ${
                    selectedPixel === color ? "border-garden-clay" : "border-garden-cocoa"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => setSelectedPixel(null)}
                className={`h-9 min-w-20 border-4 px-2 text-xs font-black ${
                  selectedPixel === null ? "border-garden-clay" : "border-garden-cocoa"
                } bg-garden-mist text-garden-cocoa`}
              >
                Erase
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-garden-cocoa">
            <input
              type="checkbox"
              checked={mirrorMode}
              onChange={(event) => setMirrorMode(event.target.checked)}
            />
            Mirror left/right
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={resetSprite}
              className="rounded-xl border border-garden-cocoa bg-garden-leaf px-4 py-3 text-sm font-bold text-garden-cocoa"
            >
              Reset default
            </button>
            <button
              type="button"
              onClick={clearSprite}
              className="rounded-xl border border-garden-cocoa bg-garden-petal px-4 py-3 text-sm font-bold text-garden-cocoa"
            >
              Clear canvas
            </button>
          </div>

          <p className="rounded-xl border border-garden-seed bg-garden-mist p-3 text-sm text-garden-taupe">
            Tip: keep mirror on for the body and hair shape, then turn it off for tiny details.
          </p>
        </div>
      </div>
    </section>
  );
}
