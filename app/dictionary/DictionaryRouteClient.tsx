"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DictionaryCard } from "@/components/DictionaryCard";
import { SearchInput } from "@/components/SearchInput";
import { filterLearnedWords, getLearnedWords } from "@/lib/dictionary";
import { getUserProgress } from "@/lib/progress";
import { useLanguage } from "@/lib/i18n";
import type { LearnedWord } from "@/lib/types";

export function DictionaryRouteClient() {
  const { t } = useLanguage();
  const [words, setWords] = useState<LearnedWord[]>([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const filteredWords = useMemo(
    () => filterLearnedWords(words, query),
    [words, query]
  );

  useEffect(() => {
    async function loadDictionary() {
      const progress = await getUserProgress();
      const learnedWords = await getLearnedWords(progress);

      setWords(learnedWords);
      setLoaded(true);
    }

    loadDictionary();
  }, []);

  return (
    <AppShell title={t("dictionary")} subtitle={t("wordsFromLessons")}>
      <section className="border-4 border-garden-cocoa bg-garden-ivory p-4 shadow-[6px_6px_0_#4A342A]">
        <SearchInput value={query} onChange={setQuery} />

        {!loaded ? (
          <div className="mt-5 border-4 border-garden-cocoa bg-garden-mist p-5 font-mono text-xs font-black uppercase text-garden-moss shadow-[4px_4px_0_#4A342A]">
            {t("loadingWords")}
          </div>
        ) : words.length === 0 ? (
          <section className="mt-5 border-4 border-garden-cocoa bg-garden-leaf p-6 text-center shadow-[4px_4px_0_#4A342A]">
            <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
              {t("dictionary")}
            </p>
            <h2 className="font-hand text-3xl text-garden-cocoa">
              {t("noWordsYet")}
            </h2>
            <p className="mt-2 text-sm font-bold text-garden-taupe">
              {t("finishLessonWords")}
            </p>
          </section>
        ) : filteredWords.length === 0 ? (
          <section className="mt-5 border-4 border-garden-cocoa bg-garden-mist p-6 text-center shadow-[4px_4px_0_#4A342A]">
            <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
              {t("searchResult")}
            </p>
            <h2 className="font-hand text-3xl text-garden-cocoa">
              {t("nothingFound")}
            </h2>
            <p className="mt-2 text-sm font-bold text-garden-taupe">
              {t("trySearch")}
            </p>
          </section>
        ) : (
          <div className="mt-5 grid gap-4">
            {filteredWords.map((word) => (
              <DictionaryCard key={`${word.lessonId}-${word.id}`} word={word} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
