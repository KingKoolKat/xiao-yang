import { createXiaoYangAvatarSprite } from "@/lib/avatarPresets";

export {
  AVATAR_GRID_HEIGHT,
  AVATAR_GRID_WIDTH,
  AVATAR_PALETTE
} from "@/lib/avatarTypes";
export type { AvatarPixel, AvatarSprite } from "@/lib/avatarTypes";

export function createDefaultAvatarSprite() {
  return createXiaoYangAvatarSprite();
}
