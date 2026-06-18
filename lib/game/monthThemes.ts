export interface MonthTheme {
  panel: string;
  surface: string;
  soft: string;
  locked: string;
  unlocked: string;
  completed: string;
  empty: string;
  accent: string;
  previewSwatches: string[];
}

type MonthThemeSource = Omit<MonthTheme, "previewSwatches">;

function createMonthTheme(theme: MonthThemeSource): MonthTheme {
  return {
    ...theme,
    previewSwatches: [
      theme.unlocked,
      theme.completed,
      theme.surface,
      theme.panel,
      theme.soft,
      theme.accent
    ]
  };
}

export const monthThemes: MonthTheme[] = [
  createMonthTheme({
    panel: "#DCEFF6",
    surface: "#F8FCFE",
    soft: "#EAF6FA",
    locked: "#E5ECEF",
    unlocked: "#CBE7F3",
    completed: "#BFD9E8",
    empty: "#F3F7F8",
    accent: "#6E9CAF"
  }),
  createMonthTheme({
    panel: "#F9DCE8",
    surface: "#FFF5FA",
    soft: "#EDE0F4",
    locked: "#EFE8EE",
    unlocked: "#F5BFD5",
    completed: "#DCC7EE",
    empty: "#FFF1F6",
    accent: "#B76C8B"
  }),
  createMonthTheme({
    panel: "#DDF2DA",
    surface: "#F5FFF4",
    soft: "#E7F4DF",
    locked: "#EAF0E6",
    unlocked: "#BFE5B9",
    completed: "#9FD39B",
    empty: "#F0F8EC",
    accent: "#5E9B64"
  }),
  createMonthTheme({
    panel: "#DCEFFA",
    surface: "#FFF8FB",
    soft: "#E8F5EF",
    locked: "#E8EEF2",
    unlocked: "#BFDFF3",
    completed: "#BFE6C6",
    empty: "#F4FAF7",
    accent: "#6FAAC0"
  }),
  createMonthTheme({
    panel: "#FFF0B8",
    surface: "#FFFBEA",
    soft: "#FDE5EF",
    locked: "#F1E9D2",
    unlocked: "#FFE08A",
    completed: "#BFE2A8",
    empty: "#FFF7D6",
    accent: "#D69A3A"
  }),
  createMonthTheme({
    panel: "#FFE1C8",
    surface: "#FFF8EA",
    soft: "#F7E7B7",
    locked: "#EFE6D8",
    unlocked: "#FFCDA8",
    completed: "#F1D789",
    empty: "#FFF1DC",
    accent: "#C98545"
  }),
  createMonthTheme({
    panel: "#FBD3D4",
    surface: "#F3FAFF",
    soft: "#CFE7D1",
    locked: "#ECEAE4",
    unlocked: "#F5B4BC",
    completed: "#BFDDA7",
    empty: "#F9EEF0",
    accent: "#C86168"
  }),
  createMonthTheme({
    panel: "#FFDDB8",
    surface: "#FFF9DE",
    soft: "#DDEEC2",
    locked: "#EFE7D9",
    unlocked: "#FFC878",
    completed: "#CFE6A6",
    empty: "#FFF0D2",
    accent: "#C9862F"
  }),
  createMonthTheme({
    panel: "#F7D7C6",
    surface: "#FFF6E3",
    soft: "#EADDA9",
    locked: "#EEE7DC",
    unlocked: "#EFA7A0",
    completed: "#C9D8A5",
    empty: "#F8EDD9",
    accent: "#B85C4E"
  }),
  createMonthTheme({
    panel: "#F7C89E",
    surface: "#FFF3DE",
    soft: "#EBC8A2",
    locked: "#EFE0D3",
    unlocked: "#F4B26F",
    completed: "#D8B07A",
    empty: "#FBE8D1",
    accent: "#B86C37"
  }),
  createMonthTheme({
    panel: "#E8D3DD",
    surface: "#FFF7ED",
    soft: "#D8CDBB",
    locked: "#E9E0DB",
    unlocked: "#D9B6C8",
    completed: "#CBBCA6",
    empty: "#F4EADF",
    accent: "#9B6B74"
  }),
  createMonthTheme({
    panel: "#CFE5DC",
    surface: "#FFFDF6",
    soft: "#E7F0EA",
    locked: "#E5ECE8",
    unlocked: "#B7D7C8",
    completed: "#9DC8B2",
    empty: "#F4F8F4",
    accent: "#8F4F5A"
  })
];

export function getMonthTheme(monthIndex: number): MonthTheme {
  const normalizedMonthIndex = ((monthIndex % monthThemes.length) + monthThemes.length) % monthThemes.length;

  return monthThemes[normalizedMonthIndex];
}
