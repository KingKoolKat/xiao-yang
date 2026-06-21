"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GardenScene } from "@/components/garden/GardenScene";
import { getLearnedWords } from "@/lib/dictionary";
import { buildMonthBuildings } from "@/lib/game/monthBuildings";
import { getLessons } from "@/lib/lessons";
import { getRewardStates } from "@/lib/rewards";
import {
  calculateStreak,
  getCompletedLessonIds,
  getUserProgress
} from "@/lib/progress";
import type {
  GardenSceneItem,
  LearnedWord,
  Lesson,
  RewardState,
  UserProgress
} from "@/lib/types";

function CollectionCard({ state }: { state: RewardState }) {
  const { reward, unlocked, requirementLabel, progressLabel } = state;

  return (
    <article
      className={`border-4 border-garden-cocoa p-4 shadow-[4px_4px_0_#4A342A] ${
        unlocked ? "bg-garden-ivory" : "bg-garden-mist opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            Decoration
          </p>
          <h2 className="mt-1 font-hand text-2xl leading-7 text-garden-cocoa">
            {reward.name}
          </h2>
        </div>
        <span
          className={`shrink-0 border-2 border-garden-cocoa px-2 py-1 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#4A342A] ${
            unlocked ? "bg-garden-leaf text-garden-cocoa" : "bg-garden-petal text-garden-clay"
          }`}
        >
          {unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      <p className="mt-3 text-sm font-bold leading-6 text-garden-taupe">
        {reward.description}
      </p>

      <div className="mt-4 grid gap-2 font-mono text-[10px] font-black uppercase sm:grid-cols-2">
        <p className="border-2 border-garden-cocoa bg-garden-leaf px-2 py-2 text-garden-cocoa">
          {requirementLabel}
        </p>
        <p className="border-2 border-garden-cocoa bg-garden-petal px-2 py-2 text-garden-cocoa">
          {progressLabel}
        </p>
      </div>

      <p className="mt-4 border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-[10px] font-black uppercase text-garden-cocoa">
        {unlocked ? "Placed in garden" : "Unlock to place"}
      </p>
    </article>
  );
}

function CollectionSection({
  title,
  states,
  emptyText
}: {
  title: string;
  states: RewardState[];
  emptyText: string;
}) {
  return (
    <section className="border-4 border-garden-cocoa bg-garden-mist p-4 shadow-[6px_6px_0_#4A342A]">
      <div className="mb-4 border-b-4 border-garden-cocoa pb-3">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          Collection
        </p>
        <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">{title}</h2>
      </div>

      {states.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {states.map((state) => (
            <CollectionCard key={state.reward.id} state={state} />
          ))}
        </div>
      ) : (
        <div className="border-4 border-garden-cocoa bg-garden-ivory p-5 text-center shadow-[4px_4px_0_#4A342A]">
          <p className="font-hand text-2xl text-garden-cocoa">{emptyText}</p>
        </div>
      )}
    </section>
  );
}

function OutfitsComingSoon() {
  return (
    <section className="border-4 border-garden-cocoa bg-garden-petal p-4 shadow-[6px_6px_0_#4A342A]">
      <div className="border-b-4 border-garden-cocoa pb-3">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          Collection
        </p>
        <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">Outfits</h2>
      </div>
      <div className="mt-4 border-4 border-garden-cocoa bg-garden-ivory p-6 text-center shadow-[4px_4px_0_#4A342A]">
        <span className="inline-block border-2 border-garden-cocoa bg-garden-seed px-3 py-2 font-mono text-xs font-black uppercase text-garden-cocoa shadow-[2px_2px_0_#4A342A]">
          Coming soon
        </span>
        <p className="mt-4 font-hand text-2xl text-garden-cocoa">
          New looks for Xiao Yang will appear here.
        </p>
      </div>
    </section>
  );
}

export function GardenRouteClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [previewAll, setPreviewAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const completedLessonIds = useMemo(() => getCompletedLessonIds(progress), [progress]);
  const streak = useMemo(() => calculateStreak(progress), [progress]);
  const completedMonthIndexes = useMemo(
    () =>
      buildMonthBuildings(lessons, completedLessonIds)
        .filter((building) => building.status === "completed")
        .map((building) => building.monthIndex),
    [completedLessonIds, lessons]
  );
  const computedRewardStates = useMemo(
    () =>
      getRewardStates({
        lessons,
        completedLessonIds,
        streak,
        learnedWords,
        equippedProp: "none"
      }),
    [completedLessonIds, learnedWords, lessons, streak]
  );
  const rewardStates = useMemo(
    () =>
      previewAll
        ? computedRewardStates.map((state) => ({
            ...state,
            unlocked: true,
            equipped: false,
            progressLabel: "Preview unlocked"
          }))
        : computedRewardStates,
    [computedRewardStates, previewAll]
  );
  const gardenStates = rewardStates.filter((state) => state.reward.type === "garden");
  const unlockedGardenItems = rewardStates
    .filter((state) => state.unlocked && state.reward.sceneItem)
    .map((state) => state.reward.sceneItem as GardenSceneItem);
  const visibleCompletedMonthIndexes = previewAll
    ? Array.from({ length: 12 }, (_, monthIndex) => monthIndex)
    : completedMonthIndexes;

  useEffect(() => {
    async function loadGarden() {
      const shouldPreviewAll =
        new URLSearchParams(window.location.search).get("preview") === "all";
      const [lessonData, progressData] = await Promise.all([getLessons(), getUserProgress()]);
      const wordData = await getLearnedWords(progressData);

      setLessons(lessonData);
      setProgress(progressData);
      setLearnedWords(wordData);
      setPreviewAll(shouldPreviewAll);
      setLoaded(true);
    }

    loadGarden();
  }, []);

  return (
    <AppShell title="Garden" subtitle="Xiao Yang's little garden grows as she learns.">
      <div className="space-y-5">
        {previewAll ? (
          <div className="border-4 border-garden-cocoa bg-garden-seed px-4 py-3 font-mono text-xs font-black uppercase text-garden-cocoa shadow-[4px_4px_0_#4A342A]">
            Preview mode: everything unlocked. Saved progress is unchanged.
          </div>
        ) : null}

        <GardenScene
          unlockedItems={loaded ? unlockedGardenItems : []}
          completedMonthIndexes={loaded ? visibleCompletedMonthIndexes : []}
        />

        {!loaded ? (
          <div className="border-4 border-garden-cocoa bg-garden-mist p-5 font-mono text-xs font-black uppercase text-garden-moss shadow-[4px_4px_0_#4A342A]">
            Loading garden...
          </div>
        ) : (
          <>
            <CollectionSection
              title="Decorations"
              states={gardenStates}
              emptyText="No decorations yet."
            />
            <OutfitsComingSoon />
          </>
        )}
      </div>
    </AppShell>
  );
}
