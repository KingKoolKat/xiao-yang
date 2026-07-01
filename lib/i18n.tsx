"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type Language = "en" | "zh";

const LANGUAGE_STORAGE_KEY = "xiao-yang-ui-language";

const translations = {
  en: {
    brand: "Xiao Yang Learns Chinese",
    back: "Back",
    signOut: "Sign out",
    chineseMode: "Chinese mode",
    streak: "Streak",
    words: "Words",
    goToToday: "Go to today",
    dictionary: "Dictionary",
    garden: "Garden",
    months: "Months",
    lessonCalendar: "Lesson Calendar",
    monthLessons: "Month Lessons",
    currentMonth: "Current month",
    selectedDay: "Selected day",
    chooseMonth: "Choose a month",
    lessonDays: "{count} lesson days",
    moveToMonth: "Move to a month tile.",
    monthLocked: "This month is still locked.",
    pressEnterMonth: "Press Enter to open this month.",
    noDaySelected: "No day selected",
    dayWithLesson: "Day {day}: {title}",
    dayNoLesson: "Day {day}: no lesson",
    moveToLessonDay: "Move onto a lesson day.",
    dayOpensLater: "This day opens later.",
    noLessonScheduled: "No lesson scheduled here yet.",
    openRevisit: "Open to revisit the lesson.",
    openBegin: "Open to begin the lesson.",
    locked: "Locked",
    open: "Open",
    today: "Today",
    done: "Done",
    lessonsCount: "{count} lessons",
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
    enter: "Enter",
    lesson: "Lesson",
    day: "Day",
    noLessonsYet: "No lessons yet",
    addLessonsHint: "Add lessons with unlock dates in this month and they’ll show up here.",
    chooseMonthMessage: "Choose a month.",
    revisitLessonMessage: "Revisiting Lesson Day {day}.",
    enterLessonMessage: "Entering Lesson Day {day}.",
    selectedCompletedMessage: "Selected completed Lesson Day {day}.",
    selectedLessonMessage: "Selected Lesson Day {day}.",
    moveCalendarDayMessage: "Move onto a calendar day first.",
    dateNoLessonMessage: "{date} does not have a lesson yet.",
    dateLockedMessage: "{date} unlocks later.",
    openedMonthMessage: "Opened {month}.",
    monthNoLessonsMessage: "{month} has no lessons yet.",
    chooseMonthFirstMessage: "Choose a month first.",
    lessonCompleteMessage: "Lesson complete. I’m proud of you.",
    openingTodayMonthMessage: "Opening today’s month.",
    todayNotReadyMessage: "Today’s lesson is not ready yet.",
    todayLessonMessage: "Today’s lesson is Day {day}.",
    todayDateMessage: "Today is {date}.",
    lessonComplete: "Lesson complete",
    newWordsPlanted: "New words planted",
    daySaved: "Day {day} is saved in Xiao Yang’s Chinese lessons.",
    backToLessons: "Back to lessons",
    savingLesson: "Saving your lesson...",
    watchToEnd: "Watch the video to the end to complete today’s lesson.",
    invalidVideo: "This lesson needs a valid YouTube link before it can be completed.",
    videoNotReady: "Video not ready",
    addVideoAdmin: "Add a valid unlisted YouTube link in admin.",
    loadingVideo: "Loading YouTube lesson",
    videoPlayError: "This YouTube video could not be played here.",
    videoLoadError: "Could not load YouTube.",
    wordsFromLessons: "Words from completed lessons.",
    loadingWords: "Loading words...",
    noWordsYet: "No words yet",
    finishLessonWords: "Finish a lesson and its words will appear here.",
    searchResult: "Search result",
    nothingFound: "Nothing found",
    trySearch: "Try hanzi, pinyin, or English.",
    search: "Search",
    searchPlaceholder: "Search hanzi, pinyin, or English",
    learnedWord: "Learned word",
    pinyin: "Pinyin",
    meaning: "Meaning",
    example: "Example",
    learnedFrom: "Learned from {lesson}",
    gardenSubtitle: "Xiao Yang’s little garden grows as she learns.",
    previewMode: "Preview mode: everything unlocked. Saved progress is unchanged.",
    loadingGarden: "Loading garden...",
    collection: "Collection",
    decorations: "Decorations",
    decoration: "Decoration",
    unlocked: "Unlocked",
    placedInGarden: "Placed in garden",
    unlockToPlace: "Unlock to place",
    noDecorations: "No decorations yet.",
    outfits: "Outfits",
    comingSoon: "Coming soon",
    outfitsSoon: "New looks for Xiao Yang will appear here.",
    littleGarden: "Little garden",
    keepLearningGarden: "Keep learning to fill the garden.",
    welcomeBack: "Welcome back",
    loginSubtitle: "Sign in to continue your lessons and keep your progress in sync.",
    email: "Email",
    password: "Password",
    enterLessons: "Enter lessons",
    invalidLogin: "That email or password did not work.",
    missingLogin: "Enter both an email and password.",
    loginFailed: "Sign in failed. Please try again.",
    requirementLesson: "Finish Day {day}",
    requirementStreak: "Reach a {count}-day streak",
    requirementWords: "Learn {count} words",
    progressLessonDone: "Lesson complete",
    progressLessonPending: "Not completed yet",
    progressStreak: "{progress} / {count} day streak",
    progressWords: "{progress} / {count} words",
    rewardBenchDescription: "A quiet place to rest after a steady three-week streak.",
    rewardPondDescription: "A peaceful pond with three swimming koi for a full month of learning.",
    rewardGateDescription: "A garden entrance earned by keeping a two-month streak.",
    rewardCowDescription: "A shaggy garden friend earned after one hundred days of learning.",
    rewardBenchName: "Garden Bench",
    rewardPondName: "Koi Pond",
    rewardGateName: "Moon Gate",
    rewardCowName: "Wally"
  },
  zh: {
    brand: "小羊学中文",
    back: "返回",
    signOut: "退出登录",
    chineseMode: "中文模式",
    streak: "连续学习",
    words: "词汇",
    goToToday: "回到今天",
    dictionary: "词典",
    garden: "花园",
    months: "月份",
    lessonCalendar: "课程日历",
    monthLessons: "本月课程",
    currentMonth: "当前月份",
    selectedDay: "已选日期",
    chooseMonth: "选择月份",
    lessonDays: "{count} 个课程日",
    moveToMonth: "移动到一个月份。",
    monthLocked: "这个月份还未解锁。",
    pressEnterMonth: "按回车键打开这个月份。",
    noDaySelected: "尚未选择日期",
    dayWithLesson: "{day}日：{title}",
    dayNoLesson: "{day}日：暂无课程",
    moveToLessonDay: "移动到一个课程日期。",
    dayOpensLater: "这一天稍后解锁。",
    noLessonScheduled: "这一天还没有安排课程。",
    openRevisit: "打开以复习课程。",
    openBegin: "打开以开始课程。",
    locked: "未解锁",
    open: "已开放",
    today: "今天",
    done: "已完成",
    lessonsCount: "{count} 节课",
    up: "上",
    down: "下",
    left: "左",
    right: "右",
    enter: "进入",
    lesson: "课程",
    day: "第",
    noLessonsYet: "暂无课程",
    addLessonsHint: "在管理页面添加本月解锁的课程后，它们会显示在这里。",
    chooseMonthMessage: "请选择一个月份。",
    revisitLessonMessage: "正在复习第 {day} 课。",
    enterLessonMessage: "正在进入第 {day} 课。",
    selectedCompletedMessage: "已选择完成的第 {day} 课。",
    selectedLessonMessage: "已选择第 {day} 课。",
    moveCalendarDayMessage: "请先移动到一个日期。",
    dateNoLessonMessage: "{date} 还没有课程。",
    dateLockedMessage: "{date} 稍后解锁。",
    openedMonthMessage: "已打开{month}。",
    monthNoLessonsMessage: "{month}还没有课程。",
    chooseMonthFirstMessage: "请先选择一个月份。",
    lessonCompleteMessage: "课程完成。我为你骄傲。",
    openingTodayMonthMessage: "正在打开今天所在的月份。",
    todayNotReadyMessage: "今天的课程还没准备好。",
    todayLessonMessage: "今天是第 {day} 课。",
    todayDateMessage: "今天是 {date}。",
    lessonComplete: "课程完成",
    newWordsPlanted: "学会了新词",
    daySaved: "第 {day} 课已保存。",
    backToLessons: "返回课程",
    savingLesson: "正在保存课程……",
    watchToEnd: "请看完视频以完成今天的课程。",
    invalidVideo: "这节课需要有效的 YouTube 链接才能完成。",
    videoNotReady: "视频尚未准备好",
    addVideoAdmin: "请在管理页面添加有效的非公开视频链接。",
    loadingVideo: "正在加载课程视频",
    videoPlayError: "无法在这里播放这个 YouTube 视频。",
    videoLoadError: "无法加载 YouTube。",
    wordsFromLessons: "已完成课程中的词汇。",
    loadingWords: "正在加载词汇……",
    noWordsYet: "还没有词汇",
    finishLessonWords: "完成课程后，新词会显示在这里。",
    searchResult: "搜索结果",
    nothingFound: "没有找到",
    trySearch: "请尝试输入汉字、拼音或英文。",
    search: "搜索",
    searchPlaceholder: "搜索汉字、拼音或英文",
    learnedWord: "已学词汇",
    pinyin: "拼音",
    meaning: "释义",
    example: "例句",
    learnedFrom: "来自课程：{lesson}",
    gardenSubtitle: "小羊的花园会随着学习慢慢成长。",
    previewMode: "预览模式：所有奖励已解锁，不会更改已保存的进度。",
    loadingGarden: "正在加载花园……",
    collection: "收藏",
    decorations: "装饰",
    decoration: "装饰",
    unlocked: "已解锁",
    placedInGarden: "已放入花园",
    unlockToPlace: "解锁后放入花园",
    noDecorations: "还没有装饰。",
    outfits: "服装",
    comingSoon: "即将推出",
    outfitsSoon: "小羊的新造型以后会出现在这里。",
    littleGarden: "小花园",
    keepLearningGarden: "继续学习，让花园越来越丰富。",
    welcomeBack: "欢迎回来",
    loginSubtitle: "登录后继续学习，并在不同设备间同步进度。",
    email: "邮箱",
    password: "密码",
    enterLessons: "进入课程",
    invalidLogin: "邮箱或密码不正确。",
    missingLogin: "请输入邮箱和密码。",
    loginFailed: "登录失败，请重试。",
    requirementLesson: "完成第 {day} 课",
    requirementStreak: "连续学习 {count} 天",
    requirementWords: "学习 {count} 个词",
    progressLessonDone: "课程已完成",
    progressLessonPending: "尚未完成",
    progressStreak: "{progress} / {count} 天连续学习",
    progressWords: "{progress} / {count} 个词",
    rewardBenchDescription: "连续学习三周后获得一个安静休息的地方。",
    rewardPondDescription: "连续学习一个月后获得有三条锦鲤的池塘。",
    rewardGateDescription: "连续学习两个月后获得花园月洞门。",
    rewardCowDescription: "连续学习一百天后，毛茸茸的 Wally 会来到花园。",
    rewardBenchName: "花园长椅",
    rewardPondName: "锦鲤池",
    rewardGateName: "月洞门",
    rewardCowName: "Wally"
  }
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function translate(
  language: Language,
  key: TranslationKey,
  values: Record<string, string | number> = {}
): string {
  let text: string = translations[language][key] ?? translations.en[key];

  Object.entries(values).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage === "zh" ? "zh-CN" : "en";
    }
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "en" ? "zh" : "en"),
      t: (key, values) => translate(language, key, values)
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

export function getLocalizedMonthName(language: Language, monthIndex: number): string {
  const names = language === "zh"
    ? ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return names[monthIndex] ?? "";
}

export function getLocalizedWeekdays(language: Language): string[] {
  return language === "zh"
    ? ["日", "一", "二", "三", "四", "五", "六"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}
