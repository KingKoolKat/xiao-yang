"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/auth/actions";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackLink?: boolean;
  showLogout?: boolean;
  showLanguageToggle?: boolean;
}

export function AppShell({
  children,
  title = "小羊学中文",
  subtitle,
  showBackLink = true,
  showLogout = true,
  showLanguageToggle = true
}: AppShellProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-garden-dew text-garden-cocoa">
      <div className="mx-auto min-h-screen w-full max-w-5xl space-y-4 px-4 pb-28 pt-5 sm:px-6">
        <header className="border-4 border-garden-cocoa bg-garden-ivory p-3 shadow-[6px_6px_0_#4A342A]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Link href="/" className="block min-w-0">
              <p className="font-mono text-xs font-black uppercase text-garden-moss">
                {t("brand")}
              </p>
              <h1 className="mt-1 font-hand text-3xl leading-9 text-garden-cocoa">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm font-bold leading-6 text-garden-taupe">
                  {subtitle}
                </p>
              ) : null}
            </Link>
            <div className="flex flex-wrap gap-2">
              {showLanguageToggle ? <LanguageToggle /> : null}
              {showBackLink ? (
                <Link
                  href="/"
                  className="border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-xs font-black text-garden-cocoa shadow-[3px_3px_0_#4A342A]"
                >
                  {t("back")}
                </Link>
              ) : null}
              {showLogout ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="border-2 border-garden-cocoa bg-garden-ivory px-3 py-2 font-mono text-xs font-black text-garden-cocoa shadow-[3px_3px_0_#4A342A]"
                  >
                    {t("signOut")}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
