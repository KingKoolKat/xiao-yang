import { addDays, getCourseStartDate } from "@/lib/date";
import type { Lesson, Word } from "@/lib/types";

const lessonId = (day: number) =>
  `00000000-0000-4000-8000-${String(day).padStart(12, "0")}`;

const wordId = (day: number) =>
  `10000000-0000-4000-8000-${String(day).padStart(12, "0")}`;

export const mockWords: Word[] = [
  {
    id: wordId(1),
    hanzi: "你好",
    pinyin: "ni hao",
    english: "hello",
    partOfSpeech: "phrase",
    exampleHanzi: "你好，小羊。",
    examplePinyin: "Ni hao, Xiao Yang.",
    exampleEnglish: "Hello, Xiao Yang.",
    notes: "A gentle, everyday greeting."
  },
  {
    id: wordId(2),
    hanzi: "谢谢",
    pinyin: "xie xie",
    english: "thank you",
    partOfSpeech: "phrase",
    exampleHanzi: "谢谢你。",
    examplePinyin: "Xie xie ni.",
    exampleEnglish: "Thank you.",
    notes: "Say it twice softly: xie xie."
  },
  {
    id: wordId(3),
    hanzi: "再见",
    pinyin: "zai jian",
    english: "goodbye",
    partOfSpeech: "phrase",
    exampleHanzi: "明天再见。",
    examplePinyin: "Ming tian zai jian.",
    exampleEnglish: "See you tomorrow.",
    notes: "Literally carries the feeling of seeing someone again."
  },
  {
    id: wordId(4),
    hanzi: "我",
    pinyin: "wo",
    english: "I / me",
    partOfSpeech: "pronoun",
    exampleHanzi: "我是小羊。",
    examplePinyin: "Wo shi Xiao Yang.",
    exampleEnglish: "I am Xiao Yang.",
    notes: "The third tone dips low before rising."
  },
  {
    id: wordId(5),
    hanzi: "你",
    pinyin: "ni",
    english: "you",
    partOfSpeech: "pronoun",
    exampleHanzi: "你好吗？",
    examplePinyin: "Ni hao ma?",
    exampleEnglish: "How are you?",
    notes: "Pairs with hao to make ni hao."
  },
  {
    id: wordId(6),
    hanzi: "喜欢",
    pinyin: "xi huan",
    english: "to like",
    partOfSpeech: "verb",
    exampleHanzi: "我喜欢你。",
    examplePinyin: "Wo xi huan ni.",
    exampleEnglish: "I like you.",
    notes: "A useful word for feelings, food, music, and tiny joys."
  },
  {
    id: wordId(7),
    hanzi: "奶茶",
    pinyin: "nai cha",
    english: "milk tea",
    partOfSpeech: "noun",
    exampleHanzi: "我喜欢奶茶。",
    examplePinyin: "Wo xi huan nai cha.",
    exampleEnglish: "I like milk tea.",
    notes: "Important vocabulary for excellent dates."
  }
];

const lessonContent = [
  {
    day: 1,
    title: "你好 — Hello",
    description: "Your first tiny greeting.",
    hanzi: "你好",
    pinyin: "ni hao",
    english: "hello",
    exampleHanzi: "你好，小羊。",
    examplePinyin: "Ni hao, Xiao Yang.",
    exampleEnglish: "Hello, Xiao Yang.",
    note: "First word learned. I am already proud of you."
  },
  {
    day: 2,
    title: "谢谢 — Thank you",
    description: "A sweet way to show gratitude.",
    hanzi: "谢谢",
    pinyin: "xie xie",
    english: "thank you",
    exampleHanzi: "谢谢你。",
    examplePinyin: "Xie xie ni.",
    exampleEnglish: "Thank you.",
    note: "Thank you for learning this with me."
  },
  {
    day: 3,
    title: "再见 — Goodbye",
    description: "A goodbye that feels like see you again.",
    hanzi: "再见",
    pinyin: "zai jian",
    english: "goodbye",
    exampleHanzi: "明天再见。",
    examplePinyin: "Ming tian zai jian.",
    exampleEnglish: "See you tomorrow.",
    note: "Tiny lesson done, but never goodbye for long."
  },
  {
    day: 4,
    title: "我 — I/me",
    description: "A small word for yourself.",
    hanzi: "我",
    pinyin: "wo",
    english: "I / me",
    exampleHanzi: "我是小羊。",
    examplePinyin: "Wo shi Xiao Yang.",
    exampleEnglish: "I am Xiao Yang.",
    note: "A sentence with your Chinese name in it looks extra pretty."
  },
  {
    day: 5,
    title: "你 — You",
    description: "A word for the person right in front of you.",
    hanzi: "你",
    pinyin: "ni",
    english: "you",
    exampleHanzi: "你好吗？",
    examplePinyin: "Ni hao ma?",
    exampleEnglish: "How are you?",
    note: "This one is for you, obviously."
  },
  {
    day: 6,
    title: "喜欢 — Like",
    description: "Say what makes your heart light up.",
    hanzi: "喜欢",
    pinyin: "xi huan",
    english: "to like",
    exampleHanzi: "我喜欢你。",
    examplePinyin: "Wo xi huan ni.",
    exampleEnglish: "I like you.",
    note: "A very useful word. I may have picked it on purpose."
  },
  {
    day: 7,
    title: "奶茶 — Milk tea",
    description: "Essential vocabulary for our next treat.",
    hanzi: "奶茶",
    pinyin: "nai cha",
    english: "milk tea",
    exampleHanzi: "我喜欢奶茶。",
    examplePinyin: "Wo xi huan nai cha.",
    exampleEnglish: "I like milk tea.",
    note: "Lesson complete. Milk tea soon?"
  }
];

export function getMockLessons(): Lesson[] {
  const courseStartDate = getCourseStartDate();

  return lessonContent.map((lesson) => {
    const id = lessonId(lesson.day);

    return {
      id,
      dayNumber: lesson.day,
      title: lesson.title,
      description: lesson.description,
      unlockDate: addDays(courseStartDate, lesson.day - 1),
      videoUrl: "",
      personalNote: lesson.note,
      createdAt: `${courseStartDate}T00:00:00.000Z`,
      wordIds: [wordId(lesson.day)]
    };
  });
}

export const mockLessonWords = getMockLessons().flatMap((lesson) =>
  lesson.wordIds.map((wordIdValue) => ({
    lessonId: lesson.id,
    wordId: wordIdValue
  }))
);
