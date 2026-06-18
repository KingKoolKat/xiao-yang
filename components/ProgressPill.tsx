import type { ReactNode } from "react";

interface ProgressPillProps {
  children: ReactNode;
  tone?: "leaf" | "cream" | "clay" | "blossom" | "muted";
}

const toneClasses = {
  leaf: "border-garden-moss/25 bg-garden-leaf text-garden-moss",
  cream: "border-garden-seed/60 bg-garden-parchment text-garden-cocoa",
  clay: "border-garden-clay/25 bg-garden-clay text-white",
  blossom: "border-garden-blossom bg-garden-petal text-garden-clay",
  muted: "border-garden-taupe/20 bg-garden-mist text-garden-taupe"
};

export function ProgressPill({ children, tone = "cream" }: ProgressPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
