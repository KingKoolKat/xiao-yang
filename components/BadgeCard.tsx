import type { Badge } from "@/lib/types";

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-soft ${
        badge.unlocked
          ? "border-garden-seed bg-garden-ivory"
          : "border-garden-cream bg-garden-mist opacity-75"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
            badge.unlocked ? "bg-garden-petal" : "bg-white"
          }`}
        >
          {badge.emoji}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-garden-cocoa">{badge.name}</h2>
          <p className="mt-1 text-sm leading-6 text-garden-taupe">{badge.description}</p>
          <p className="mt-3 text-sm font-semibold text-garden-moss">{badge.progressLabel}</p>
        </div>
      </div>
    </article>
  );
}
