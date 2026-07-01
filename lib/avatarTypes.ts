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
  "#AEB5BE",
  "#747B85",
  "#4F5660",
  "#FFFFFF"
];
