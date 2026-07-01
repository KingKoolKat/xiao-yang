"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GardenScene } from "@/components/garden/GardenScene";
import { getLearnedWords } from "@/lib/dictionary";
import { buildMonthBuildings } from "@/lib/game/monthBuildings";
import { getLessons } from "@/lib/lessons";
import { getRewardStates } from "@/lib/rewards";
import { useLanguage } from "@/lib/i18n";
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

const rewardCopyKeys = {
  "garden-bench": {
    name: "rewardBenchName",
    description: "rewardBenchDescription"
  },
  "koi-pond": {
    name: "rewardPondName",
    description: "rewardPondDescription"
  },
  "moon-gate": {
    name: "rewardGateName",
    description: "rewardGateDescription"
  },
  "highland-cow": {
    name: "rewardCowName",
    description: "rewardCowDescription"
  }
} as const;

function CollectionCard({
  state,
  streak,
  previewAll
}: {
  state: RewardState;
  streak: number;
  previewAll: boolean;
}) {
  const { t } = useLanguage();
  const { reward, unlocked } = state;
  const copyKeys = rewardCopyKeys[reward.id as keyof typeof rewardCopyKeys];
  const requirementCount =
    reward.requirement.type === "streak" ? reward.requirement.count : 0;

  return (
    <article
      className={`border-4 border-garden-cocoa p-4 shadow-[4px_4px_0_#4A342A] ${
        unlocked ? "bg-garden-ivory" : "bg-garden-mist opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            {t("decoration")}
          </p>
          <h2 className="mt-1 font-hand text-2xl leading-7 text-garden-cocoa">
            {copyKeys ? t(copyKeys.name) : reward.name}
          </h2>
        </div>
        <span
          className={`shrink-0 border-2 border-garden-cocoa px-2 py-1 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#4A342A] ${
            unlocked ? "bg-garden-leaf text-garden-cocoa" : "bg-garden-petal text-garden-clay"
          }`}
        >
          {unlocked ? t("unlocked") : t("locked")}
        </span>
      </div>

      <p className="mt-3 text-sm font-bold leading-6 text-garden-taupe">
        {copyKeys ? t(copyKeys.description) : reward.description}
      </p>

      <div className="mt-4 grid gap-2 font-mono text-[10px] font-black uppercase sm:grid-cols-2">
        <p className="border-2 border-garden-cocoa bg-garden-leaf px-2 py-2 text-garden-cocoa">
          {reward.requirement.type === "streak"
            ? t("requirementStreak", { count: reward.requirement.count })
            : ""}
        </p>
        <p className="border-2 border-garden-cocoa bg-garden-petal px-2 py-2 text-garden-cocoa">
          {previewAll
            ? t("unlocked")
            : t("progressStreak", {
                progress: Math.min(streak, requirementCount),
                count: requirementCount
              })}
        </p>
      </div>

      <p className="mt-4 border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-[10px] font-black uppercase text-garden-cocoa">
        {unlocked ? t("placedInGarden") : t("unlockToPlace")}
      </p>
    </article>
  );
}

function CollectionSection({
  title,
  states,
  emptyText,
  streak,
  previewAll
}: {
  title: string;
  states: RewardState[];
  emptyText: string;
  streak: number;
  previewAll: boolean;
}) {
  const { t } = useLanguage();

  return (
    <section className="border-4 border-garden-cocoa bg-garden-mist p-4 shadow-[6px_6px_0_#4A342A]">
      <div className="mb-4 border-b-4 border-garden-cocoa pb-3">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          {t("collection")}
        </p>
        <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">{title}</h2>
      </div>

      {states.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {states.map((state) => (
            <CollectionCard
              key={state.reward.id}
              state={state}
              streak={streak}
              previewAll={previewAll}
            />
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
  const { t } = useLanguage();

  return (
    <section className="border-4 border-garden-cocoa bg-garden-petal p-4 shadow-[6px_6px_0_#4A342A]">
      <div className="border-b-4 border-garden-cocoa pb-3">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          {t("collection")}
        </p>
        <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">
          {t("outfits")}
        </h2>
      </div>
      <div className="mt-4 border-4 border-garden-cocoa bg-garden-ivory p-6 text-center shadow-[4px_4px_0_#4A342A]">
        <span className="inline-block border-2 border-garden-cocoa bg-garden-seed px-3 py-2 font-mono text-xs font-black uppercase text-garden-cocoa shadow-[2px_2px_0_#4A342A]">
          {t("comingSoon")}
        </span>
        <p className="mt-4 font-hand text-2xl text-garden-cocoa">
          {t("outfitsSoon")}
        </p>
      </div>
    </section>
  );
}

export function GardenRouteClient() {
  const { t } = useLanguage();
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
            progressLabel: t("unlocked")
          }))
        : computedRewardStates,
    [computedRewardStates, previewAll, t]
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
    <AppShell title={t("garden")} subtitle={t("gardenSubtitle")}>
      <div className="space-y-5">
        {previewAll ? (
          <div className="border-4 border-garden-cocoa bg-garden-seed px-4 py-3 font-mono text-xs font-black uppercase text-garden-cocoa shadow-[4px_4px_0_#4A342A]">
            {t("previewMode")}
          </div>
        ) : null}

        <GardenScene
          unlockedItems={loaded ? unlockedGardenItems : []}
          completedMonthIndexes={loaded ? visibleCompletedMonthIndexes : []}
        />

        {!loaded ? (
          <div className="border-4 border-garden-cocoa bg-garden-mist p-5 font-mono text-xs font-black uppercase text-garden-moss shadow-[4px_4px_0_#4A342A]">
            {t("loadingGarden")}
          </div>
        ) : (
          <>
            <CollectionSection
              title={t("decorations")}
              states={gardenStates}
              emptyText={t("noDecorations")}
              streak={streak}
              previewAll={previewAll}
            />
            <OutfitsComingSoon />
          </>
        )}
      </div>
    </AppShell>
  );
}
