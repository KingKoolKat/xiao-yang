const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeVideoId(rawUrl: string | undefined): string | null {
  const value = rawUrl?.trim();

  if (!value) {
    return null;
  }

  if (YOUTUBE_ID_PATTERN.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      const watchId = url.searchParams.get("v");

      if (watchId && YOUTUBE_ID_PATTERN.test(watchId)) {
        return watchId;
      }

      const [firstPathPart, secondPathPart] = url.pathname.split("/").filter(Boolean);

      if (
        ["embed", "shorts", "live"].includes(firstPathPart) &&
        secondPathPart &&
        YOUTUBE_ID_PATTERN.test(secondPathPart)
      ) {
        return secondPathPart;
      }
    }
  } catch {
    return null;
  }

  return null;
}
