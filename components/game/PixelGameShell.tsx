"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PixelDayTile } from "@/components/game/PixelDayTile";
import { PixelGardenHub } from "@/components/game/PixelGardenHub";
import { PixelHud } from "@/components/game/PixelHud";
import { PixelLessonOverlay } from "@/components/game/PixelLessonOverlay";
import { PixelQuestPanel } from "@/components/game/PixelQuestPanel";
import { getAppTodayDate } from "@/lib/date";
import { getLearnedWords } from "@/lib/dictionary";
import { buildCalendarDays } from "@/lib/game/buildCalendarDays";
import {
  buildMonthBuildings,
  getCurrentMonthIndex,
  getLessonMonthIndex,
  getMonthGridPosition
} from "@/lib/game/monthBuildings";
import { getMonthTheme } from "@/lib/game/monthThemes";
import {
  getLocalizedMonthName,
  getLocalizedWeekdays,
  useLanguage
} from "@/lib/i18n";
import type { CalendarDayTile, GamePosition, MonthBuilding } from "@/lib/game/types";
import { getLessons } from "@/lib/lessons";
import {
  calculateStreak,
  completeLesson,
  getCompletedLessonIds,
  getUserProgress
} from "@/lib/progress";
import type { LearnedWord, Lesson, UserProgress } from "@/lib/types";

function samePosition(a: GamePosition, b: GamePosition): boolean {
  return a.x === b.x && a.y === b.y;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function canStandOnDay(day?: CalendarDayTile): day is CalendarDayTile {
  return Boolean(day);
}

const HUB_WIDTH = 3;
const HUB_HEIGHT = 4;
export function PixelGameShell() {
  const { language, t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [hubPosition, setHubPosition] = useState<GamePosition>(() =>
    getMonthGridPosition(getCurrentMonthIndex())
  );
  const [avatarPosition, setAvatarPosition] = useState<GamePosition>({ x: 4, y: 5 });
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [message, setMessage] = useState(() => t("chooseMonthMessage"));
  const [hasPlacedAvatar, setHasPlacedAvatar] = useState(false);

  useEffect(() => {
    async function loadGame() {
      const [lessonData, progressData] = await Promise.all([getLessons(), getUserProgress()]);
      const wordData = await getLearnedWords(progressData);

      setLessons(lessonData);
      setProgress(progressData);
      setLearnedWords(wordData);
    }

    loadGame();
  }, []);

  const completedLessonIds = useMemo(() => getCompletedLessonIds(progress), [progress]);
  const monthBuildings = useMemo(
    () => buildMonthBuildings(lessons, completedLessonIds),
    [lessons, completedLessonIds]
  );
  const currentMonthIndex = useMemo(() => getCurrentMonthIndex(), []);
  const activeMonthIndex = selectedMonthIndex ?? currentMonthIndex;
  const selectedBuilding = monthBuildings.find(
    (building) => building.monthIndex === activeMonthIndex
  );
  const activeMonthTheme = useMemo(() => getMonthTheme(activeMonthIndex), [activeMonthIndex]);
  const focusedBuilding = monthBuildings.find((building) =>
    samePosition(building.position, hubPosition)
  );
  const calendarMap = useMemo(
    () => buildCalendarDays(lessons, completedLessonIds, activeMonthIndex),
    [lessons, completedLessonIds, activeMonthIndex]
  );
  const streak = useMemo(() => calculateStreak(progress), [progress]);
  const weekdayLabels = useMemo(
    () => getLocalizedWeekdays(language),
    [language]
  );

  useEffect(() => {
    setMessage(
      selectedMonthIndex === null
        ? t("chooseMonthMessage")
        : t("selectedDay")
    );
  }, [language, selectedMonthIndex, t]);

  useEffect(() => {
    if (selectedMonthIndex !== null && !hasPlacedAvatar) {
      setAvatarPosition(calendarMap.spawn);
      setHasPlacedAvatar(true);
    }
  }, [calendarMap.spawn, hasPlacedAvatar, selectedMonthIndex]);

  const activeDay = useMemo(
    () => calendarMap.days.find((day) => samePosition(avatarPosition, day.position)),
    [avatarPosition, calendarMap.days]
  );

  const moveAvatar = useCallback(
    (dx: number, dy: number) => {
      setAvatarPosition((currentPosition) => {
        const nextPosition = {
          x: clamp(currentPosition.x + dx, 0, calendarMap.width - 1),
          y: clamp(currentPosition.y + dy, 0, calendarMap.height - 1)
        };
        const nextDay = calendarMap.days.find((day) =>
          samePosition(day.position, nextPosition)
        );

        return canStandOnDay(nextDay) ? nextPosition : currentPosition;
      });
    },
    [calendarMap.days, calendarMap.height, calendarMap.width]
  );

  const moveHubAvatar = useCallback((dx: number, dy: number) => {
    setHubPosition((currentPosition) => ({
      x: clamp(currentPosition.x + dx, 0, HUB_WIDTH - 1),
      y: clamp(currentPosition.y + dy, 0, HUB_HEIGHT - 1)
    }));
  }, []);

  const selectDay = useCallback((day: CalendarDayTile) => {
    const dayIsAlreadySelected = samePosition(avatarPosition, day.position);

    if (dayIsAlreadySelected && day.lesson && day.status !== "locked") {
      setMessage(
        day.status === "completed"
          ? t("revisitLessonMessage", { day: day.lesson.dayNumber })
          : t("enterLessonMessage", { day: day.lesson.dayNumber })
      );
      setSelectedLesson(day.lesson);
      return;
    }

    setAvatarPosition(day.position);

    if (!day.lesson) {
      setMessage(t("dateNoLessonMessage", { date: day.dateKey }));
      return;
    }

    if (day.status === "locked") {
      setMessage(t("dateLockedMessage", { date: day.dateKey }));
      return;
    }

    setMessage(
      day.status === "completed"
        ? t("selectedCompletedMessage", { day: day.lesson.dayNumber })
        : t("selectedLessonMessage", { day: day.lesson.dayNumber })
    );
  }, [avatarPosition, t]);

  const openActiveDay = useCallback(() => {
    if (!activeDay) {
      setMessage(t("moveCalendarDayMessage"));
      return;
    }

    if (activeDay.status === "locked") {
      setMessage(t("dateLockedMessage", { date: activeDay.dateKey }));
      return;
    }

    if (!activeDay.lesson) {
      setMessage(t("dateNoLessonMessage", { date: activeDay.dateKey }));
      return;
    }

    setMessage(
      activeDay.status === "completed"
        ? t("revisitLessonMessage", { day: activeDay.lesson.dayNumber })
        : t("enterLessonMessage", { day: activeDay.lesson.dayNumber })
    );
    setSelectedLesson(activeDay.lesson);
  }, [activeDay, t]);

  const enterBuilding = useCallback((building: MonthBuilding) => {
    setHubPosition(building.position);

    if (building.status === "locked" || building.status === "empty") {
      setMessage(
        t("dateLockedMessage", {
          date: getLocalizedMonthName(language, building.monthIndex)
        })
      );
      return;
    }

    setSelectedMonthIndex(building.monthIndex);
    setHasPlacedAvatar(false);
    setMessage(
      building.lessonCount > 0
        ? t("openedMonthMessage", {
            month: getLocalizedMonthName(language, building.monthIndex)
          })
        : t("monthNoLessonsMessage", {
            month: getLocalizedMonthName(language, building.monthIndex)
          })
    );
  }, [language, t]);

  const enterFocusedBuilding = useCallback(() => {
    if (!focusedBuilding) {
      setMessage(t("chooseMonthFirstMessage"));
      return;
    }

    enterBuilding(focusedBuilding);
  }, [enterBuilding, focusedBuilding, t]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedLesson) {
        return;
      }

      if (["ArrowUp", "w", "W"].includes(event.key)) {
        event.preventDefault();
        if (selectedMonthIndex === null) {
          moveHubAvatar(0, -1);
        } else {
          moveAvatar(0, -1);
        }
      }
      if (["ArrowDown", "s", "S"].includes(event.key)) {
        event.preventDefault();
        if (selectedMonthIndex === null) {
          moveHubAvatar(0, 1);
        } else {
          moveAvatar(0, 1);
        }
      }
      if (["ArrowLeft", "a", "A"].includes(event.key)) {
        event.preventDefault();
        if (selectedMonthIndex === null) {
          moveHubAvatar(-1, 0);
        } else {
          moveAvatar(-1, 0);
        }
      }
      if (["ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        if (selectedMonthIndex === null) {
          moveHubAvatar(1, 0);
        } else {
          moveAvatar(1, 0);
        }
      }
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        if (selectedMonthIndex === null) {
          enterFocusedBuilding();
        } else {
          openActiveDay();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enterFocusedBuilding,
    moveAvatar,
    moveHubAvatar,
    openActiveDay,
    selectedLesson,
    selectedMonthIndex
  ]);

  async function handleCompleteLesson(lessonId: string) {
    const nextProgress = await completeLesson(lessonId);
    const nextLearnedWords = await getLearnedWords(nextProgress);

    setProgress(nextProgress);
    setLearnedWords(nextLearnedWords);
    setMessage(t("lessonCompleteMessage"));
  }

  function goToToday() {
    const todayKey = getAppTodayDate();
    const todayLesson = lessons
      .filter((lesson) => lesson.unlockDate <= todayKey)
      .sort((a, b) => b.dayNumber - a.dayNumber)[0];
    const todayMonthIndex = todayLesson
      ? getLessonMonthIndex(todayLesson)
      : currentMonthIndex;

    setHubPosition(getMonthGridPosition(todayMonthIndex));

    if (selectedMonthIndex !== todayMonthIndex) {
      setSelectedMonthIndex(todayMonthIndex);
      setHasPlacedAvatar(false);
      setMessage(t("openingTodayMonthMessage"));
      return;
    }

    if (!calendarMap.todayDay) {
      setMessage(t("todayNotReadyMessage"));
      return;
    }

    setAvatarPosition(calendarMap.todayDay.position);
    setMessage(
      calendarMap.todayDay.lesson
        ? t("todayLessonMessage", {
            day: calendarMap.todayDay.lesson.dayNumber
          })
        : t("todayDateMessage", { date: calendarMap.todayDay.dateKey })
    );
  }

  function backToHub() {
    if (selectedBuilding) {
      setHubPosition(selectedBuilding.position);
    }

    setSelectedMonthIndex(null);
    setSelectedLesson(null);
    setHasPlacedAvatar(false);
    setMessage(t("chooseMonthMessage"));
  }

  return (
    <div className="min-h-screen bg-garden-dew p-4 text-garden-cocoa">
      <div className="mx-auto max-w-5xl space-y-4">
        <PixelHud
          streak={streak}
          wordsLearned={learnedWords.length}
          eyebrow={selectedMonthIndex === null ? t("brand") : t("lessonCalendar")}
          title={
            selectedMonthIndex === null
              ? t("months")
              : selectedBuilding
                ? getLocalizedMonthName(language, selectedBuilding.monthIndex)
                : t("monthLessons")
          }
          onGoToToday={goToToday}
          onBackToHub={selectedMonthIndex === null ? undefined : backToHub}
        />

        <PixelQuestPanel
          layer={selectedMonthIndex === null ? "hub" : "building"}
          message={message}
          focusedBuilding={focusedBuilding}
          activeDay={activeDay}
          selectedBuilding={selectedBuilding}
        />

        {selectedMonthIndex === null ? (
          <PixelGardenHub
            buildings={monthBuildings}
            avatarPosition={hubPosition}
            onEnterBuilding={enterBuilding}
            onEnterFocusedBuilding={enterFocusedBuilding}
            onMoveAvatar={moveHubAvatar}
          />
        ) : (
        <main
          className="border-4 border-garden-cocoa p-3 shadow-[8px_8px_0_#4A342A]"
          style={{ backgroundColor: activeMonthTheme.soft }}
        >
          <div
            className="mb-2 grid gap-1 font-mono text-[10px] font-black uppercase text-garden-moss"
            style={{
              gridTemplateColumns: `repeat(${calendarMap.width}, minmax(0, 1fr))`
            }}
          >
            {weekdayLabels.map((weekday) => (
              <span
                key={weekday}
                className="border-2 border-garden-cocoa px-1 py-1 text-center"
                style={{ backgroundColor: activeMonthTheme.surface }}
              >
                {weekday}
              </span>
            ))}
          </div>

          <div
            className="grid gap-1 border-4 border-garden-cocoa p-2 sm:gap-2 sm:p-3"
            style={{
              backgroundColor: activeMonthTheme.panel,
              gridTemplateColumns: `repeat(${calendarMap.width}, minmax(0, 1fr))`
            }}
          >
            {calendarMap.days.length === 0 ? (
              <div
                className="col-span-full border-4 border-garden-cocoa p-6 text-center shadow-[4px_4px_0_#4A342A]"
                style={{ backgroundColor: activeMonthTheme.surface }}
              >
                <p className="font-hand text-3xl text-garden-cocoa">
                  {t("noLessonsYet")}
                </p>
                <p className="mt-2 text-sm font-bold text-garden-taupe">
                  {t("addLessonsHint")}
                </p>
              </div>
            ) : Array.from({ length: calendarMap.width * calendarMap.height }, (_, index) => {
              const x = index % calendarMap.width;
              const y = Math.floor(index / calendarMap.width);
              const position = { x, y };
              const day = calendarMap.days.find((candidate) =>
                samePosition(candidate.position, position)
              );
              const dayIsSelected = samePosition(avatarPosition, position);

              return (
                <div
                  key={`${x}-${y}`}
                  className="relative min-h-24 border-2 shadow-[2px_2px_0_#4A342A] sm:min-h-28"
                  style={{
                    backgroundColor: activeMonthTheme.empty,
                    borderColor: activeMonthTheme.accent
                  }}
                >
                  {day ? (
                    <PixelDayTile
                      day={day}
                      isSelected={dayIsSelected}
                      theme={activeMonthTheme}
                      onSelect={selectDay}
                    />
                  ) : (
                    <div
                      className="h-full min-h-24 w-full sm:min-h-28"
                      style={{ backgroundColor: activeMonthTheme.empty }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
            <span />
            <button
              type="button"
              onClick={() => moveAvatar(0, -1)}
              className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
            >
              {t("up")}
            </button>
            <span />
            <button
              type="button"
              onClick={() => moveAvatar(-1, 0)}
              className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
            >
              {t("left")}
            </button>
            <button
              type="button"
              onClick={openActiveDay}
              className="border-4 border-garden-cocoa bg-garden-clay py-2 font-mono font-black text-white shadow-[3px_3px_0_#4A342A]"
            >
              {t("open")}
            </button>
            <button
              type="button"
              onClick={() => moveAvatar(1, 0)}
              className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
            >
              {t("right")}
            </button>
            <span />
            <button
              type="button"
              onClick={() => moveAvatar(0, 1)}
              className="border-4 border-garden-cocoa bg-garden-ivory py-2 font-mono font-black shadow-[3px_3px_0_#4A342A]"
            >
              {t("down")}
            </button>
            <span />
          </div>
        </main>
        )}
      </div>

      {selectedLesson ? (
        <PixelLessonOverlay
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onComplete={handleCompleteLesson}
        />
      ) : null}

    </div>
  );
}
