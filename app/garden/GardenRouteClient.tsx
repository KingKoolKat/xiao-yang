"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GardenScene } from "@/components/garden/GardenScene";
import { getLearnedWords } from "@/lib/dictionary";
import { buildMonthBuildings } from "@/lib/game/monthBuildings";
import { getLessons } from "@/lib/lessons";
import {
  getEquippedCosmetic,
  getRewardStates,
  saveEquippedCosmetic
} from "@/lib/rewards";
import {
  calculateStreak,
  getCompletedLessonIds,
  getUserProgress
} from "@/lib/progress";
import type {
  CosmeticProp,
  GardenSceneItem,
  LearnedWord,
  Lesson,
  RewardState,
  UserProgress
} from "@/lib/types";

const itemTypeLabels = {
  cosmetic: "Prop",
  garden: "Decoration",
  keepsake: "Keepsake"
};

const sectionStyles = {
  cosmetic: "bg-garden-petal",
  garden: "bg-garden-mist",
  keepsake: "bg-garden-ivory"
};

function CollectionCard({
  state,
  onEquip
}: {
  state: RewardState;
  onEquip: (prop: CosmeticProp, rewardId: string) => void;
}) {
  const { reward, unlocked, equipped, requirementLabel, progressLabel } = state;

  return (
    <article
      className={`border-4 border-garden-cocoa p-4 shadow-[4px_4px_0_#4A342A] ${
        unlocked ? "bg-garden-ivory" : "bg-garden-mist opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase text-garden-moss">
            {itemTypeLabels[reward.type]}
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

      {reward.cosmeticProp ? (
        <div className="mt-4">
          {unlocked ? (
            <button
              type="button"
              onClick={() => onEquip(reward.cosmeticProp as CosmeticProp, reward.id)}
              className={`w-full border-4 border-garden-cocoa px-4 py-3 font-mono text-xs font-black uppercase shadow-[3px_3px_0_#4A342A] ${
                equipped
                  ? "bg-garden-leaf text-garden-cocoa"
                  : "bg-garden-clay text-white"
              }`}
            >
              {equipped ? "Equipped" : "Equip"}
            </button>
          ) : (
            <p className="border-2 border-garden-cocoa bg-garden-ivory px-3 py-2 font-mono text-[10px] font-black uppercase text-garden-taupe">
              Unlock to equip
            </p>
          )}
        </div>
      ) : null}

      {reward.type === "garden" ? (
        <p className="mt-4 border-2 border-garden-cocoa bg-garden-leaf px-3 py-2 font-mono text-[10px] font-black uppercase text-garden-cocoa">
          {unlocked ? "Placed in garden" : "Unlock to place"}
        </p>
      ) : null}

      {reward.type === "keepsake" ? (
        <p className="mt-4 border-2 border-garden-cocoa bg-garden-petal px-3 py-2 font-mono text-[10px] font-black uppercase text-garden-cocoa">
          {unlocked ? "Saved keepsake" : "Still tucked away"}
        </p>
      ) : null}
    </article>
  );
}

function CollectionSection({
  title,
  states,
  tone,
  emptyText,
  onEquip
}: {
  title: string;
  states: RewardState[];
  tone: keyof typeof sectionStyles;
  emptyText: string;
  onEquip: (prop: CosmeticProp, rewardId: string) => void;
}) {
  return (
    <section
      className={`border-4 border-garden-cocoa p-4 shadow-[6px_6px_0_#4A342A] ${sectionStyles[tone]}`}
    >
      <div className="mb-4 border-b-4 border-garden-cocoa pb-3">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          Collection
        </p>
        <h2 className="font-hand text-3xl leading-9 text-garden-cocoa">{title}</h2>
      </div>

      {states.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {states.map((state) => (
            <CollectionCard key={state.reward.id} state={state} onEquip={onEquip} />
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

export function GardenRouteClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [equippedProp, setEquippedProp] = useState<CosmeticProp>("none");
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
        equippedProp
      }),
    [completedLessonIds, equippedProp, learnedWords, lessons, streak]
  );
  const rewardStates = useMemo(
    () =>
      previewAll
        ? computedRewardStates.map((state) => ({
            ...state,
            unlocked: true,
            equipped: state.reward.cosmeticProp === equippedProp,
            progressLabel: "Preview unlocked"
          }))
        : computedRewardStates,
    [computedRewardStates, equippedProp, previewAll]
  );
  const cosmeticStates = rewardStates.filter((state) => state.reward.type === "cosmetic");
  const gardenStates = rewardStates.filter((state) => state.reward.type === "garden");
  const keepsakeStates = rewardStates.filter((state) => state.reward.type === "keepsake");
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
      setEquippedProp(shouldPreviewAll ? "milk-tea" : getEquippedCosmetic().prop);
      setLoaded(true);
    }

    loadGarden();
  }, []);

  function handleEquip(prop: CosmeticProp, rewardId: string) {
    if (previewAll) {
      setEquippedProp(prop);
      return;
    }

    const nextEquippedCosmetic = saveEquippedCosmetic(prop, rewardId);

    setEquippedProp(nextEquippedCosmetic.prop);
  }

  function handleClearProp() {
    if (previewAll) {
      setEquippedProp("none");
      return;
    }

    const nextEquippedCosmetic = saveEquippedCosmetic("none");

    setEquippedProp(nextEquippedCosmetic.prop);
  }

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

        <section className="border-4 border-garden-cocoa bg-garden-ivory p-4 shadow-[6px_6px_0_#4A342A]">
          <p className="font-mono text-xs font-black uppercase text-garden-moss">
            Current prop
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-hand text-3xl text-garden-cocoa">
                {equippedProp === "none" ? "No prop equipped" : "Prop equipped"}
              </h2>
              <p className="mt-1 text-sm font-bold text-garden-taupe">
                Equipped props show up beside Xiao Yang in the garden and lessons.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearProp}
              className="border-4 border-garden-cocoa bg-garden-leaf px-4 py-3 font-mono text-xs font-black uppercase shadow-[3px_3px_0_#4A342A]"
            >
              No prop
            </button>
          </div>
        </section>

        {!loaded ? (
          <div className="border-4 border-garden-cocoa bg-garden-mist p-5 font-mono text-xs font-black uppercase text-garden-moss shadow-[4px_4px_0_#4A342A]">
            Loading garden...
          </div>
        ) : (
          <>
            <CollectionSection
              title="Props"
              states={cosmeticStates}
              tone="cosmetic"
              emptyText="No props yet."
              onEquip={handleEquip}
            />
            <CollectionSection
              title="Decorations"
              states={gardenStates}
              tone="garden"
              emptyText="No decorations yet."
              onEquip={handleEquip}
            />
            <CollectionSection
              title="Keepsakes"
              states={keepsakeStates}
              tone="keepsake"
              emptyText="No keepsakes yet."
              onEquip={handleEquip}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
