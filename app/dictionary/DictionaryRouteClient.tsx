"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DictionaryCard } from "@/components/DictionaryCard";
import { SearchInput } from "@/components/SearchInput";
import { filterLearnedWords, getLearnedWords } from "@/lib/dictionary";
import { getUserProgress } from "@/lib/progress";
import type { LearnedWord } from "@/lib/types";

export function DictionaryRouteClient() {
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
    <AppShell title="Dictionary" subtitle="Words from completed lessons.">
      <section className="border-4 border-garden-cocoa bg-garden-ivory p-4 shadow-[6px_6px_0_#4A342A]">
        <SearchInput value={query} onChange={setQuery} />

        {!loaded ? (
          <div className="mt-5 border-4 border-garden-cocoa bg-garden-mist p-5 font-mono text-xs font-black uppercase text-garden-moss shadow-[4px_4px_0_#4A342A]">
            Loading words...
          </div>
        ) : words.length === 0 ? (
          <section className="mt-5 border-4 border-garden-cocoa bg-garden-leaf p-6 text-center shadow-[4px_4px_0_#4A342A]">
            <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
              Dictionary
            </p>
            <h2 className="font-hand text-3xl text-garden-cocoa">No words yet</h2>
            <p className="mt-2 text-sm font-bold text-garden-taupe">
              Finish a lesson and its words will appear here.
            </p>
          </section>
        ) : filteredWords.length === 0 ? (
          <section className="mt-5 border-4 border-garden-cocoa bg-garden-mist p-6 text-center shadow-[4px_4px_0_#4A342A]">
            <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
              Search result
            </p>
            <h2 className="font-hand text-3xl text-garden-cocoa">Nothing found</h2>
            <p className="mt-2 text-sm font-bold text-garden-taupe">
              Try hanzi, pinyin, or English.
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
