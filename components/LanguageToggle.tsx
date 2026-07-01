"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();
  const isChinese = language === "zh";

  return (
    <label className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase text-garden-cocoa">
      <span>{t("chineseMode")}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isChinese}
        onClick={toggleLanguage}
        className={`relative h-7 w-14 border-2 border-garden-cocoa shadow-[2px_2px_0_#4A342A] ${
          isChinese ? "bg-garden-leaf" : "bg-garden-ivory"
        }`}
        aria-label={t("chineseMode")}
      >
        <span
          className={`absolute top-0.5 flex h-5 w-6 items-center justify-center border border-garden-cocoa bg-garden-petal text-[8px] transition-[left] ${
            isChinese ? "left-6" : "left-0.5"
          }`}
        >
          {isChinese ? "中" : "EN"}
        </span>
      </button>
    </label>
  );
}
