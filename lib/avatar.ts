import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export const AVATAR_STORAGE_KEY = "xiao-yangs-avatar-sprite";
export const AVATAR_SPRITE_EVENT = "xiao-yangs-avatar-sprite-updated";
export const AVATAR_SETTING_KEY = "avatar_sprite";
export const AVATAR_GRID_WIDTH = 16;
export const AVATAR_GRID_HEIGHT = 24;

export type AvatarPixel = string | null;

export interface AvatarSprite {
  width: number;
  height: number;
  pixels: AvatarPixel[];
}

export const AVATAR_PALETTE = [
  "#4A342A",
  "#D7A85E",
  "#E4BD72",
  "#C8904B",
  "#D99A83",
  "#A84E5C",
  "#25242A",
  "#3A3840",
  "#F8F1DD",
  "#2F6B45",
  "#F4B7C9",
  "#FFFFFF"
];

function createBlankPixels(): AvatarPixel[] {
  return Array.from({ length: AVATAR_GRID_WIDTH * AVATAR_GRID_HEIGHT }, () => null);
}

function getIndex(x: number, y: number): number {
  return y * AVATAR_GRID_WIDTH + x;
}

function setPixel(pixels: AvatarPixel[], x: number, y: number, color: string) {
  if (x < 0 || x >= AVATAR_GRID_WIDTH || y < 0 || y >= AVATAR_GRID_HEIGHT) {
    return;
  }

  pixels[getIndex(x, y)] = color;
}

function fillRect(
  pixels: AvatarPixel[],
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      setPixel(pixels, column, row, color);
    }
  }
}

export function createDefaultAvatarSprite(): AvatarSprite {
  const pixels = createBlankPixels();
  const outline = "#4A342A";
  const hair = "#D7A85E";
  const hairLight = "#E4BD72";
  const hairDark = "#C8904B";
  const skin = "#D99A83";
  const mouth = "#A84E5C";
  const hoodie = "#25242A";
  const pants = "#3A3840";
  const cord = "#F8F1DD";

  fillRect(pixels, 6, 0, 4, 1, outline);
  fillRect(pixels, 5, 1, 6, 1, hair);
  fillRect(pixels, 4, 2, 8, 1, hairLight);
  fillRect(pixels, 3, 3, 10, 2, hair);
  fillRect(pixels, 2, 5, 12, 2, hairDark);
  fillRect(pixels, 1, 7, 3, 7, outline);
  fillRect(pixels, 12, 7, 3, 7, outline);
  fillRect(pixels, 2, 7, 2, 7, hair);
  fillRect(pixels, 12, 7, 2, 7, hair);
  fillRect(pixels, 0, 10, 2, 4, hairDark);
  fillRect(pixels, 14, 10, 2, 4, hairDark);

  fillRect(pixels, 4, 5, 8, 8, outline);
  fillRect(pixels, 5, 6, 6, 6, skin);
  fillRect(pixels, 4, 6, 2, 2, hairLight);
  fillRect(pixels, 10, 6, 2, 2, hairLight);
  fillRect(pixels, 6, 5, 4, 1, hairLight);
  setPixel(pixels, 6, 9, outline);
  setPixel(pixels, 9, 9, outline);
  fillRect(pixels, 7, 11, 2, 1, mouth);
  fillRect(pixels, 7, 13, 2, 1, skin);

  fillRect(pixels, 4, 14, 8, 6, outline);
  fillRect(pixels, 5, 14, 6, 5, hoodie);
  fillRect(pixels, 2, 15, 3, 5, outline);
  fillRect(pixels, 11, 15, 3, 5, outline);
  fillRect(pixels, 3, 15, 2, 4, hoodie);
  fillRect(pixels, 11, 15, 2, 4, hoodie);
  setPixel(pixels, 6, 14, cord);
  setPixel(pixels, 9, 14, cord);

  fillRect(pixels, 5, 20, 3, 3, outline);
  fillRect(pixels, 8, 20, 3, 3, outline);
  fillRect(pixels, 6, 20, 1, 2, pants);
  fillRect(pixels, 9, 20, 1, 2, pants);
  fillRect(pixels, 4, 23, 4, 1, outline);
  fillRect(pixels, 8, 23, 4, 1, outline);

  return {
    width: AVATAR_GRID_WIDTH,
    height: AVATAR_GRID_HEIGHT,
    pixels
  };
}

export function normalizeAvatarSprite(value: unknown): AvatarSprite {
  if (
    typeof value !== "object" ||
    value === null ||
    !("width" in value) ||
    !("height" in value) ||
    !("pixels" in value)
  ) {
    return createDefaultAvatarSprite();
  }

  const sprite = value as Partial<AvatarSprite>;

  if (
    sprite.width !== AVATAR_GRID_WIDTH ||
    sprite.height !== AVATAR_GRID_HEIGHT ||
    !Array.isArray(sprite.pixels) ||
    sprite.pixels.length !== AVATAR_GRID_WIDTH * AVATAR_GRID_HEIGHT
  ) {
    return createDefaultAvatarSprite();
  }

  return {
    width: AVATAR_GRID_WIDTH,
    height: AVATAR_GRID_HEIGHT,
    pixels: sprite.pixels.map((pixel) => (typeof pixel === "string" ? pixel : null))
  };
}

export function parseStoredAvatarSprite(rawValue: string | null): AvatarSprite {
  if (!rawValue) {
    return createDefaultAvatarSprite();
  }

  try {
    return normalizeAvatarSprite(JSON.parse(rawValue));
  } catch {
    return createDefaultAvatarSprite();
  }
}

export function serializeAvatarSprite(sprite: AvatarSprite): string {
  return JSON.stringify(normalizeAvatarSprite(sprite));
}

function getLocalAvatarSprite(): AvatarSprite {
  if (typeof window === "undefined") {
    return createDefaultAvatarSprite();
  }

  return parseStoredAvatarSprite(window.localStorage.getItem(AVATAR_STORAGE_KEY));
}

export function saveLocalAvatarSprite(sprite: AvatarSprite): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AVATAR_STORAGE_KEY, serializeAvatarSprite(sprite));
}

export async function getSharedAvatarSprite(): Promise<AvatarSprite> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", AVATAR_SETTING_KEY)
      .maybeSingle();

    if (!error && data?.value) {
      return normalizeAvatarSprite(data.value);
    }
  }

  return getLocalAvatarSprite();
}
