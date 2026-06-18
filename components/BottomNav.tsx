"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Flower2, Gamepad2, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dictionary", label: "Words", icon: BookOpen },
  { href: "/garden", label: "Garden", icon: Flower2 }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-garden-blossom bg-garden-petal/95 px-3 py-2 shadow-soft backdrop-blur">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-garden-moss text-white"
                  : "text-garden-taupe hover:bg-garden-ivory hover:text-garden-cocoa"
              }`}
              aria-label={item.label}
            >
              <Icon className="mb-1 h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <Flower2 className="pointer-events-none absolute left-1/2 top-2 hidden h-3 w-3 -translate-x-1/2 text-garden-clay sm:block" />
    </nav>
  );
}
