import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
  tone?: "leaf" | "pond" | "blossom";
}

const toneClasses = {
  leaf: {
    card: "border-garden-moss bg-garden-leaf",
    icon: "border-garden-moss/20 bg-garden-ivory text-garden-moss"
  },
  pond: {
    card: "border-garden-moss/40 bg-garden-pond",
    icon: "border-garden-moss/20 bg-garden-ivory text-garden-moss"
  },
  blossom: {
    card: "border-garden-blossom bg-garden-petal",
    icon: "border-garden-clay/20 bg-garden-ivory text-garden-clay"
  }
};

export function DashboardCard({
  title,
  value,
  caption,
  icon,
  tone = "leaf"
}: DashboardCardProps) {
  const classes = toneClasses[tone];

  return (
    <section className={`rounded-2xl border p-4 shadow-soft ${classes.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-garden-taupe">{title}</p>
          <p className="mt-2 text-3xl font-bold text-garden-cocoa">{value}</p>
          {caption ? <p className="mt-1 text-sm text-garden-taupe">{caption}</p> : null}
        </div>
        {icon ? (
          <div className={`rounded-2xl border p-2 ${classes.icon}`}>
            {icon}
          </div>
        ) : null}
      </div>
    </section>
  );
}
