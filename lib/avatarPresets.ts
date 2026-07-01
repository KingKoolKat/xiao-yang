import {
  AVATAR_GRID_HEIGHT,
  AVATAR_GRID_WIDTH,
  type AvatarPixel,
  type AvatarSprite
} from "@/lib/avatarTypes";

interface PresetOptions {
  outerX: 0 | 1 | 2;
  hairEnd: 13 | 14 | 15 | 16;
  bangs: "full" | "curtain" | "wispy";
  highlightStyle: number;
  hoodie: "light" | "medium" | "dark";
  sleeves: "straight" | "wide";
  stance: "close" | "relaxed";
}

const colors = {
  outline: "#4A342A",
  hair: "#B9783F",
  hairLight: "#E4BD72",
  hairMid: "#D7A85E",
  hairDark: "#7C4C2E",
  skin: "#D99A83",
  mouth: "#A84E5C",
  charcoal: "#25242A",
  pants: "#3A3840",
  hoodieLight: "#AEB5BE",
  hoodieMedium: "#747B85",
  hoodieDark: "#4F5660",
  pink: "#F4B7C9",
  silver: "#F8F1DD",
  white: "#FFFFFF"
};

function createBlankPixels(): AvatarPixel[] {
  return Array.from(
    { length: AVATAR_GRID_WIDTH * AVATAR_GRID_HEIGHT },
    () => null
  );
}

function getIndex(x: number, y: number): number {
  return y * AVATAR_GRID_WIDTH + x;
}

function setPixel(
  pixels: AvatarPixel[],
  x: number,
  y: number,
  color: string
): void {
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
): void {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      setPixel(pixels, column, row, color);
    }
  }
}

function fillRow(
  pixels: AvatarPixel[],
  y: number,
  left: number,
  right: number,
  color: string
): void {
  fillRect(pixels, left, y, right - left + 1, 1, color);
}

function mirrorPixel(
  pixels: AvatarPixel[],
  x: number,
  y: number,
  color: string
): void {
  setPixel(pixels, x, y, color);
  setPixel(pixels, AVATAR_GRID_WIDTH - 1 - x, y, color);
}

function getHairBounds(y: number, outerX: number): [number, number] {
  if (y === 0) {
    return [6, 9];
  }

  if (y === 1) {
    return [4, 11];
  }

  if (y === 2) {
    return [3, 12];
  }

  if (y === 3) {
    return [Math.max(outerX + 1, 2), Math.min(14 - outerX, 13)];
  }

  return [outerX, 15 - outerX];
}

function drawHairBase(pixels: AvatarPixel[], options: PresetOptions): void {
  for (let y = 0; y <= 12; y += 1) {
    const [left, right] = getHairBounds(y, options.outerX);
    fillRow(pixels, y, left, right, colors.outline);

    if (right - left > 2) {
      fillRow(pixels, y, left + 1, right - 1, colors.hair);
    }
  }

  const sideWidth = options.outerX === 0 ? 5 : 4;

  for (let y = 12; y <= options.hairEnd; y += 1) {
    const taper = y === options.hairEnd ? 1 : 0;
    const left = options.outerX + taper;
    const right = 15 - options.outerX - taper;
    fillRect(pixels, left, y, sideWidth - taper, 1, colors.outline);
    fillRect(pixels, right - sideWidth + taper + 1, y, sideWidth - taper, 1, colors.outline);
    fillRect(pixels, left + 1, y, Math.max(1, sideWidth - taper - 2), 1, colors.hair);
    fillRect(
      pixels,
      right - sideWidth + taper + 2,
      y,
      Math.max(1, sideWidth - taper - 2),
      1,
      colors.hair
    );
  }
}

function drawCurlTexture(pixels: AvatarPixel[], options: PresetOptions): void {
  const leftTrack = options.outerX + 1;
  const middleTrack = Math.min(options.outerX + 3, 5);

  for (let y = 3; y <= options.hairEnd; y += 2) {
    const offset = (y + options.highlightStyle) % 4 === 0 ? 1 : 0;
    mirrorPixel(pixels, leftTrack + offset, y, colors.hairDark);

    if (y <= 12) {
      mirrorPixel(pixels, middleTrack - offset, y + 1, colors.hairMid);
    }
  }

  const highlightRows = [2, 4, 6, 8, 10, 12];

  highlightRows.forEach((y, index) => {
    const pattern = (index + options.highlightStyle) % 3;
    const x = pattern === 0 ? options.outerX + 1 : pattern === 1 ? 4 : 5;
    mirrorPixel(pixels, x, y, colors.hairLight);
  });

  if (options.highlightStyle % 2 === 0) {
    mirrorPixel(pixels, options.outerX + 2, options.hairEnd - 1, colors.hairLight);
  } else {
    mirrorPixel(pixels, options.outerX + 1, options.hairEnd - 2, colors.hairMid);
  }
}

function drawFaceAndBangs(pixels: AvatarPixel[], options: PresetOptions): void {
  fillRect(pixels, 4, 5, 8, 8, colors.outline);
  fillRect(pixels, 5, 6, 6, 6, colors.skin);

  fillRow(pixels, 5, 5, 10, colors.hairDark);
  fillRow(pixels, 6, 5, 10, colors.hairMid);

  if (options.bangs === "full") {
    mirrorPixel(pixels, 5, 7, colors.hair);
    mirrorPixel(pixels, 6, 7, colors.hairLight);
  } else if (options.bangs === "curtain") {
    mirrorPixel(pixels, 5, 7, colors.hairLight);
    mirrorPixel(pixels, 7, 6, colors.hairDark);
  } else {
    mirrorPixel(pixels, 5, 7, colors.hair);
    mirrorPixel(pixels, 7, 7, colors.hairLight);
  }

  fillRect(pixels, 3, 6, 2, 7, colors.outline);
  fillRect(pixels, 11, 6, 2, 7, colors.outline);
  fillRect(pixels, 4, 7, 1, 6, colors.hair);
  fillRect(pixels, 11, 7, 1, 6, colors.hair);
  mirrorPixel(pixels, 3, 8 + (options.highlightStyle % 3), colors.hairLight);

  setPixel(pixels, 6, 9, colors.outline);
  setPixel(pixels, 9, 9, colors.outline);
  setPixel(pixels, 6, 8, colors.white);
  setPixel(pixels, 9, 8, colors.white);
  fillRect(pixels, 7, 11, 2, 1, colors.mouth);
  fillRect(pixels, 7, 13, 2, 1, colors.skin);
}

function drawOutfit(pixels: AvatarPixel[], options: PresetOptions): void {
  const hoodieColor =
    options.hoodie === "light"
      ? colors.hoodieLight
      : options.hoodie === "medium"
        ? colors.hoodieMedium
        : colors.hoodieDark;
  const armX = options.sleeves === "wide" ? 1 : 2;
  const armWidth = options.sleeves === "wide" ? 4 : 3;

  fillRect(pixels, 4, 14, 8, 6, colors.outline);
  fillRect(pixels, 5, 14, 6, 5, colors.charcoal);
  fillRect(pixels, 4, 14, 2, 5, hoodieColor);
  fillRect(pixels, 10, 14, 2, 5, hoodieColor);

  fillRect(pixels, armX, 15, armWidth, 5, colors.outline);
  fillRect(pixels, 16 - armX - armWidth, 15, armWidth, 5, colors.outline);
  fillRect(pixels, armX + 1, 15, Math.max(1, armWidth - 2), 4, hoodieColor);
  fillRect(
    pixels,
    16 - armX - armWidth + 1,
    15,
    Math.max(1, armWidth - 2),
    4,
    hoodieColor
  );
  setPixel(pixels, armX + 1, 19, colors.skin);
  setPixel(pixels, 14 - armX, 19, colors.skin);

  setPixel(pixels, 7, 14, colors.silver);
  setPixel(pixels, 8, 14, colors.silver);
  mirrorPixel(pixels, 6, 15, colors.pink);
  setPixel(pixels, 7, 15, colors.pink);
  setPixel(pixels, 8, 15, colors.pink);

  const leftLegX = options.stance === "close" ? 5 : 4;
  const rightLegX = options.stance === "close" ? 8 : 9;
  fillRect(pixels, leftLegX, 20, 3, 3, colors.outline);
  fillRect(pixels, rightLegX, 20, 3, 3, colors.outline);
  fillRect(pixels, leftLegX + 1, 20, 1, 2, colors.pants);
  fillRect(pixels, rightLegX + 1, 20, 1, 2, colors.pants);
  fillRect(pixels, leftLegX - 1, 23, 4, 1, colors.outline);
  fillRect(pixels, rightLegX, 23, 4, 1, colors.outline);
  setPixel(pixels, leftLegX, 23, colors.white);
  setPixel(pixels, rightLegX + 2, 23, colors.white);
}

function createPresetSprite(options: PresetOptions): AvatarSprite {
  const pixels = createBlankPixels();

  drawHairBase(pixels, options);
  drawCurlTexture(pixels, options);
  drawFaceAndBangs(pixels, options);
  drawOutfit(pixels, options);

  return {
    width: AVATAR_GRID_WIDTH,
    height: AVATAR_GRID_HEIGHT,
    pixels
  };
}

const xiaoYangOptions: PresetOptions = {
  outerX: 1,
  hairEnd: 16,
  bangs: "full",
  highlightStyle: 11,
  hoodie: "light",
  sleeves: "wide",
  stance: "close"
};

export function createXiaoYangAvatarSprite(): AvatarSprite {
  return createPresetSprite(xiaoYangOptions);
}
