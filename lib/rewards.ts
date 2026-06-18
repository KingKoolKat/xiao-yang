import type {
  CosmeticProp,
  EquippedCosmetic,
  LearnedWord,
  Lesson,
  Reward,
  RewardRequirement,
  RewardState
} from "@/lib/types";

export const EQUIPPED_REWARD_STORAGE_KEY = "xiao-yang-equipped-reward";
export const EQUIPPED_REWARD_EVENT = "xiao-yang-equipped-reward-change";

export interface RewardContext {
  completedLessonIds: string[];
  lessons: Lesson[];
  streak: number;
  learnedWords: LearnedWord[];
  equippedProp: CosmeticProp;
}

export const rewards: Reward[] = [
  {
    id: "first-hello",
    name: "First Hello",
    description: "A little keepsake for finishing the first lesson.",
    type: "keepsake",
    requirement: { type: "lesson_completed", dayNumber: 1 }
  },
  {
    id: "milk-tea-prop",
    name: "Milk Tea Prop",
    description: "Xiao Yang can carry a tiny milk tea.",
    type: "cosmetic",
    cosmeticProp: "milk-tea",
    requirement: { type: "lesson_completed", dayNumber: 7 }
  },
  {
    id: "sprout-pin",
    name: "Sprout Pin",
    description: "A tiny marker for showing up three days in a row.",
    type: "keepsake",
    requirement: { type: "streak", count: 3 }
  },
  {
    id: "flower-bow",
    name: "Flower Bow",
    description: "A small flower Xiao Yang can hold.",
    type: "cosmetic",
    cosmeticProp: "flower",
    requirement: { type: "streak", count: 7 }
  },
  {
    id: "picnic-scarf",
    name: "Picnic Scarf",
    description: "A cozy streak keepsake for two steady weeks.",
    type: "keepsake",
    requirement: { type: "streak", count: 14 }
  },
  {
    id: "study-notebook",
    name: "Study Notebook",
    description: "Xiao Yang can carry a tiny study notebook.",
    type: "cosmetic",
    cosmeticProp: "notebook",
    requirement: { type: "words_learned", count: 10 }
  },
  {
    id: "garden-bench",
    name: "Garden Bench",
    description: "A quiet place to rest after a steady three-week streak.",
    type: "garden",
    sceneItem: "bench",
    requirement: { type: "streak", count: 21 }
  },
  {
    id: "koi-pond",
    name: "Koi Pond",
    description: "A peaceful pond with three swimming koi for a full month of learning.",
    type: "garden",
    sceneItem: "koi-pond",
    requirement: { type: "streak", count: 30 }
  },
  {
    id: "moon-gate",
    name: "Moon Gate",
    description: "A garden entrance earned by keeping a two-month streak.",
    type: "garden",
    sceneItem: "moon-gate",
    requirement: { type: "streak", count: 60 }
  },
  {
    id: "umbrella-prop",
    name: "Rainy Day Umbrella",
    description: "Xiao Yang can carry a little umbrella.",
    type: "cosmetic",
    cosmeticProp: "umbrella",
    requirement: { type: "words_learned", count: 75 }
  },
  {
    id: "highland-cow",
    name: "Highland Cow",
    description: "A shaggy garden friend earned after one hundred days of learning.",
    type: "garden",
    sceneItem: "highland-cow",
    requirement: { type: "streak", count: 100 }
  },
  {
    id: "special-garden-outfit",
    name: "Special Garden Outfit",
    description: "A future outfit for one hundred learned words.",
    type: "keepsake",
    requirement: { type: "words_learned", count: 100 }
  }
];

function safeParseEquippedCosmetic(rawValue: string | null): EquippedCosmetic {
  if (!rawValue) {
    return { prop: "none" };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<EquippedCosmetic>;

    if (isCosmeticProp(parsed.prop)) {
      return {
        prop: parsed.prop,
        rewardId: typeof parsed.rewardId === "string" ? parsed.rewardId : undefined,
        equippedAt: typeof parsed.equippedAt === "string" ? parsed.equippedAt : undefined
      };
    }
  } catch {
    return { prop: "none" };
  }

  return { prop: "none" };
}

function isCosmeticProp(value: unknown): value is CosmeticProp {
  return ["none", "milk-tea", "flower", "notebook", "umbrella"].includes(String(value));
}

export function getEquippedCosmetic(): EquippedCosmetic {
  if (typeof window === "undefined") {
    return { prop: "none" };
  }

  return safeParseEquippedCosmetic(window.localStorage.getItem(EQUIPPED_REWARD_STORAGE_KEY));
}

export function saveEquippedCosmetic(prop: CosmeticProp, rewardId?: string): EquippedCosmetic {
  const equippedCosmetic: EquippedCosmetic = {
    prop,
    rewardId,
    equippedAt: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      EQUIPPED_REWARD_STORAGE_KEY,
      JSON.stringify(equippedCosmetic)
    );
    window.dispatchEvent(new CustomEvent(EQUIPPED_REWARD_EVENT));
  }

  return equippedCosmetic;
}

function getCompletedLessonDays(lessons: Lesson[], completedLessonIds: string[]): Set<number> {
  const completedIds = new Set(completedLessonIds);

  return new Set(
    lessons
      .filter((lesson) => completedIds.has(lesson.id))
      .map((lesson) => lesson.dayNumber)
  );
}

function getRequirementLabel(requirement: RewardRequirement): string {
  if (requirement.type === "lesson_completed") {
    return `Finish Day ${requirement.dayNumber}`;
  }

  if (requirement.type === "streak") {
    return `Reach a ${requirement.count}-day streak`;
  }

  return `Learn ${requirement.count} words`;
}

function getRequirementProgress(requirement: RewardRequirement, context: RewardContext): number {
  if (requirement.type === "lesson_completed") {
    return getCompletedLessonDays(context.lessons, context.completedLessonIds).has(
      requirement.dayNumber
    )
      ? 1
      : 0;
  }

  if (requirement.type === "streak") {
    return context.streak;
  }

  return context.learnedWords.length;
}

function isUnlocked(requirement: RewardRequirement, context: RewardContext): boolean {
  if (requirement.type === "lesson_completed") {
    return getRequirementProgress(requirement, context) >= 1;
  }

  return getRequirementProgress(requirement, context) >= requirement.count;
}

function getProgressLabel(requirement: RewardRequirement, context: RewardContext): string {
  const progress = getRequirementProgress(requirement, context);

  if (requirement.type === "lesson_completed") {
    return progress >= 1 ? "Lesson complete" : "Not completed yet";
  }

  if (requirement.type === "streak") {
    return `${Math.min(progress, requirement.count)} / ${requirement.count} day streak`;
  }

  return `${Math.min(progress, requirement.count)} / ${requirement.count} words`;
}

export function getRewardStates(context: RewardContext): RewardState[] {
  return rewards.map((reward) => ({
    reward,
    unlocked: isUnlocked(reward.requirement, context),
    equipped: Boolean(reward.cosmeticProp && reward.cosmeticProp === context.equippedProp),
    requirementLabel: getRequirementLabel(reward.requirement),
    progressLabel: getProgressLabel(reward.requirement, context)
  }));
}
