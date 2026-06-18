export type LessonStatus = "locked" | "unlocked" | "completed";

export interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  partOfSpeech?: string;
  exampleHanzi?: string;
  examplePinyin?: string;
  exampleEnglish?: string;
  notes?: string;
}

export interface Lesson {
  id: string;
  dayNumber: number;
  title: string;
  description?: string;
  unlockDate: string;
  videoUrl?: string;
  personalNote?: string;
  createdAt?: string;
  wordIds: string[];
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: string;
  score: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progressLabel: string;
}

export interface DashboardStats {
  streak: number;
  totalWordsLearned: number;
  completedLessons: number;
}

export interface LearnedWord extends Word {
  lessonId: string;
  lessonTitle: string;
  dayNumber: number;
}

export type RewardType = "cosmetic" | "garden" | "keepsake";

export type CosmeticProp = "none" | "milk-tea" | "flower" | "notebook" | "umbrella";

export type GardenSceneItem = "bench" | "koi-pond" | "moon-gate" | "highland-cow";

export type RewardRequirement =
  | {
      type: "lesson_completed";
      dayNumber: number;
    }
  | {
      type: "streak";
      count: number;
    }
  | {
      type: "words_learned";
      count: number;
    };

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  requirement: RewardRequirement;
  cosmeticProp?: CosmeticProp;
  sceneItem?: GardenSceneItem;
}

export interface EquippedCosmetic {
  prop: CosmeticProp;
  rewardId?: string;
  equippedAt?: string;
}

export interface RewardState {
  reward: Reward;
  unlocked: boolean;
  equipped: boolean;
  requirementLabel: string;
  progressLabel: string;
}
