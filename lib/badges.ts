import type { Badge, LearnedWord, UserProgress } from "@/lib/types";
import { calculateStreak, getCompletedLessonIds } from "@/lib/progress";

export function getBadges(progress: UserProgress[], learnedWords: LearnedWord[]): Badge[] {
  const completedCount = getCompletedLessonIds(progress).length;
  const streak = calculateStreak(progress);
  const hasFirstSentence = learnedWords.some((word) => Boolean(word.exampleHanzi));
  const hasMilkTea = learnedWords.some((word) => word.hanzi === "奶茶");

  return [
    {
      id: "first-word",
      name: "First Word",
      emoji: "🌱",
      description: "Learn Xiao Yang’s first Chinese word.",
      unlocked: learnedWords.length >= 1,
      progressLabel: `${Math.min(learnedWords.length, 1)} / 1 word`
    },
    {
      id: "three-day-streak",
      name: "3 Day Streak",
      emoji: "🔥",
      description: "Complete lessons three days in a row.",
      unlocked: streak >= 3,
      progressLabel: `${Math.min(streak, 3)} / 3 days`
    },
    {
      id: "first-sentence",
      name: "First Sentence",
      emoji: "✍️",
      description: "Grow one word into a full example sentence.",
      unlocked: hasFirstSentence,
      progressLabel: hasFirstSentence ? "Sentence unlocked" : "Complete one lesson"
    },
    {
      id: "milk-tea-master",
      name: "Milk Tea Master",
      emoji: "🧋",
      description: "Learn the most important milk tea phrase.",
      unlocked: hasMilkTea,
      progressLabel: hasMilkTea ? "Milk tea unlocked" : "Reach Day 7"
    },
    {
      id: "one-month-scholar",
      name: "One Month Scholar",
      emoji: "🏮",
      description: "Complete thirty tiny Chinese lessons.",
      unlocked: completedCount >= 30,
      progressLabel: `${Math.min(completedCount, 30)} / 30 lessons`
    }
  ];
}
