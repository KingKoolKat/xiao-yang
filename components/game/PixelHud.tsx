import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";

interface PixelHudProps {
  streak: number;
  wordsLearned: number;
  title: string;
  eyebrow: string;
  onGoToToday: () => void;
  onBackToHub?: () => void;
}

export function PixelHud({
  streak,
  wordsLearned,
  title,
  eyebrow,
  onGoToToday,
  onBackToHub
}: PixelHudProps) {
  return (
    <header className="border-4 border-garden-cocoa bg-garden-ivory p-3 shadow-[6px_6px_0_#4A342A]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-black uppercase text-garden-moss">
            {eyebrow}
          </p>
          <h1 className="font-hand text-2xl text-garden-cocoa">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-xs font-black">
          <span className="border-2 border-garden-cocoa bg-garden-petal px-2 py-1">
            Streak {streak}
          </span>
          <span className="border-2 border-garden-cocoa bg-garden-leaf px-2 py-1">
            Words {wordsLearned}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGoToToday}
          className="border-2 border-garden-cocoa bg-garden-seed px-3 py-2 font-mono text-xs font-black shadow-[3px_3px_0_#4A342A]"
        >
          Go to today
        </button>
        <Link
          href="/dictionary"
          className="border-2 border-garden-cocoa bg-garden-petal px-3 py-2 font-mono text-xs font-black shadow-[3px_3px_0_#4A342A]"
        >
          Dictionary
        </Link>
        <Link
          href="/garden"
          className="border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-xs font-black shadow-[3px_3px_0_#4A342A]"
        >
          Garden
        </Link>
        {onBackToHub ? (
          <button
            type="button"
            onClick={onBackToHub}
            className="border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-xs font-black shadow-[3px_3px_0_#4A342A]"
          >
            Months
          </button>
        ) : null}
        <form action={logoutAction}>
          <button
            type="submit"
            className="border-2 border-garden-cocoa bg-garden-ivory px-3 py-2 font-mono text-xs font-black shadow-[3px_3px_0_#4A342A]"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
