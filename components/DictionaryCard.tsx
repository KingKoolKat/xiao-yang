"use client";

import type { LearnedWord } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

interface DictionaryCardProps {
  word: LearnedWord;
  compact?: boolean;
}

export function DictionaryCard({ word, compact = false }: DictionaryCardProps) {
  const { t } = useLanguage();

  return (
    <article
      className={`border-4 border-garden-cocoa bg-garden-ivory shadow-[4px_4px_0_#4A342A] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            {t("learnedWord")}
          </p>
          <p className={`mt-1 break-words font-hand leading-none text-garden-clay ${compact ? "text-5xl" : "text-6xl"}`}>
            {word.hanzi}
          </p>
        </div>
        <span className="shrink-0 border-2 border-garden-cocoa bg-garden-leaf px-2 py-1 font-mono text-[10px] font-black uppercase text-garden-cocoa shadow-[2px_2px_0_#4A342A]">
          {t("day")} {word.dayNumber}
        </span>
      </div>

      <div className={`mt-3 grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="border-2 border-garden-cocoa bg-garden-mist p-3">
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            {t("pinyin")}
          </p>
          <p className={`${compact ? "text-lg" : "text-xl"} mt-1 break-words font-black text-garden-cocoa`}>
            {word.pinyin}
          </p>
        </div>
        <div className="border-2 border-garden-cocoa bg-garden-petal p-3">
          <p className="font-mono text-[10px] font-black uppercase text-garden-clay">
            {t("meaning")}
          </p>
          <p className={`${compact ? "text-base" : "text-lg"} mt-1 break-words font-bold text-garden-cocoa`}>
            {word.english}
          </p>
        </div>
      </div>

      {word.exampleHanzi ? (
        <div className={`${compact ? "mt-3 p-3" : "mt-4 p-4"} border-2 border-garden-cocoa bg-garden-leaf`}>
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            {t("example")}
          </p>
          <p className="mt-2 break-words font-hand text-2xl leading-7 text-garden-cocoa">
            {word.exampleHanzi}
          </p>
          <p className="mt-1 break-words font-mono text-sm font-black text-garden-cocoa">
            {word.examplePinyin}
          </p>
          <p className="mt-2 text-sm font-bold text-garden-taupe">
            {word.exampleEnglish}
          </p>
        </div>
      ) : null}
      <p className={`${compact ? "mt-3" : "mt-4"} border-t-2 border-garden-cocoa pt-2 font-mono text-[10px] font-black uppercase text-garden-taupe`}>
        {t("learnedFrom", { lesson: word.lessonTitle })}
      </p>
    </article>
  );
}
