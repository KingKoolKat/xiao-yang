import { PixelAvatar } from "@/components/game/PixelAvatar";
import { PixelMonthBuilding } from "@/components/game/PixelMonthBuilding";
import type { GamePosition, MonthBuilding } from "@/lib/game/types";

interface PixelGardenHubProps {
  buildings: MonthBuilding[];
  avatarPosition: GamePosition;
  onEnterBuilding: (building: MonthBuilding) => void;
  onEnterFocusedBuilding: () => void;
  onMoveAvatar: (dx: number, dy: number) => void;
}

function samePosition(a: GamePosition, b: GamePosition): boolean {
  return a.x === b.x && a.y === b.y;
}

export function PixelGardenHub({
  buildings,
  avatarPosition,
  onEnterBuilding,
  onEnterFocusedBuilding,
  onMoveAvatar
}: PixelGardenHubProps) {
  return (
    <main className="border-4 border-garden-cocoa bg-garden-mist p-3 shadow-[8px_8px_0_#4A342A]">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {buildings.map((building) => {
          const avatarIsHere = samePosition(building.position, avatarPosition);

          return (
            <div key={building.id} className="relative min-h-36">
              <PixelMonthBuilding
                building={building}
                isFocused={avatarIsHere}
                onEnter={onEnterBuilding}
              />
              {avatarIsHere ? (
                <div className="pointer-events-none absolute bottom-2 right-2 origin-bottom scale-75">
                  <PixelAvatar />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
        <span />
        <button
          type="button"
          onClick={() => onMoveAvatar(0, -1)}
          className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
        >
          Up
        </button>
        <span />
        <button
          type="button"
          onClick={() => onMoveAvatar(-1, 0)}
          className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
        >
          Left
        </button>
        <button
          type="button"
          onClick={onEnterFocusedBuilding}
          className="border-4 border-garden-cocoa bg-garden-clay py-2 font-mono font-black text-white shadow-[3px_3px_0_#4A342A]"
        >
          Enter
        </button>
        <button
          type="button"
          onClick={() => onMoveAvatar(1, 0)}
          className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
        >
          Right
        </button>
        <span />
        <button
          type="button"
          onClick={() => onMoveAvatar(0, 1)}
          className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
        >
          Down
        </button>
        <span />
      </div>
    </main>
  );
}
