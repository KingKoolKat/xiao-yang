const DEFAULT_COURSE_START_DATE = "2026-07-01";

export function toDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function addDays(dateKey: string, amount: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);

  return toDateKey(date);
}

export function formatPrettyDate(dateKey: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric"
  }).format(parseDateKey(dateKey));
}

export function isUnlocked(unlockDate: string, todayKey = getAppTodayDate()): boolean {
  return unlockDate <= todayKey;
}

export function getCourseStartDate(): string {
  return process.env.NEXT_PUBLIC_COURSE_START_DATE?.trim() || DEFAULT_COURSE_START_DATE;
}

export function getAppTodayDate(): string {
  return process.env.NEXT_PUBLIC_APP_TODAY_DATE?.trim() || toDateKey();
}
