"use client";

import { loginAction } from "@/app/auth/actions";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

interface LoginFormProps {
  error?: string;
  nextPath: string;
}

export function LoginForm({ error, nextPath }: LoginFormProps) {
  const { t } = useLanguage();
  const errorMessage =
    error === "invalid"
      ? t("invalidLogin")
      : error === "missing"
        ? t("missingLogin")
        : error
          ? t("loginFailed")
          : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-garden-dew p-4 text-garden-cocoa">
      <section className="w-full max-w-md border-4 border-garden-cocoa bg-garden-ivory p-5 shadow-[8px_8px_0_#4A342A]">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-xs font-black uppercase text-garden-moss">
            {t("brand")}
          </p>
          <LanguageToggle />
        </div>
        <h1 className="mt-1 font-hand text-4xl leading-tight text-garden-cocoa">
          {t("welcomeBack")}
        </h1>
        <p className="mt-2 text-sm font-bold leading-6 text-garden-taupe">
          {t("loginSubtitle")}
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block space-y-2">
            <span className="font-mono text-xs font-black uppercase text-garden-moss">
              {t("email")}
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border-4 border-garden-cocoa bg-white px-3 py-3 font-bold outline-none focus:bg-garden-mist"
            />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-xs font-black uppercase text-garden-moss">
              {t("password")}
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border-4 border-garden-cocoa bg-white px-3 py-3 font-bold outline-none focus:bg-garden-mist"
            />
          </label>

          {errorMessage ? (
            <p className="border-4 border-garden-cocoa bg-garden-petal p-3 text-sm font-bold text-garden-clay">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full border-4 border-garden-cocoa bg-garden-clay px-4 py-3 font-mono text-sm font-black uppercase text-white shadow-[4px_4px_0_#4A342A]"
          >
            {t("enterLessons")}
          </button>
        </form>
      </section>
    </main>
  );
}
