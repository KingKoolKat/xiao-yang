"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface YouTubeLessonVideoProps {
  videoId: string | null;
  title: string;
  onEnded: () => void;
}

interface YouTubePlayer {
  destroy: () => void;
}

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  playerVars: {
    playsinline: 1;
    rel: 0;
    modestbranding: 1;
    origin: string;
  };
  events: {
    onReady: () => void;
    onStateChange: (event: YouTubePlayerEvent) => void;
    onError: () => void;
  };
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube player is only available in the browser."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youTubeApiPromise) {
    return youTubeApiPromise;
  }

  youTubeApiPromise = new Promise((resolve, reject) => {
    const existingCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();

      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube player API did not load."));
      }
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("Could not load YouTube player API."));
      document.body.appendChild(script);
    }
  });

  return youTubeApiPromise;
}

export function YouTubeLessonVideo({
  videoId,
  title,
  onEnded
}: YouTubeLessonVideoProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onEndedRef = useRef(onEnded);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    if (!videoId || !containerRef.current) {
      return;
    }

    let player: YouTubePlayer | null = null;
    let ignore = false;

    setIsReady(false);
    setErrorMessage("");

    loadYouTubeApi()
      .then((api) => {
        if (ignore || !containerRef.current) {
          return;
        }

        player = new api.Player(containerRef.current, {
          videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin
          },
          events: {
            onReady: () => setIsReady(true),
            onStateChange: (event) => {
              if (event.data === api.PlayerState.ENDED) {
                onEndedRef.current();
              }
            },
            onError: () => {
              setErrorMessage(t("videoPlayError"));
            }
          }
        });
      })
      .catch(() => {
        setErrorMessage(t("videoLoadError"));
      });

    return () => {
      ignore = true;
      player?.destroy();
    };
  }, [t, videoId]);

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center border-4 border-garden-cocoa bg-garden-mist p-6 text-center shadow-[5px_5px_0_#4A342A]">
        <div>
          <Video className="mx-auto h-8 w-8 text-garden-moss" aria-hidden="true" />
          <h2 className="mt-3 font-hand text-3xl text-garden-cocoa">
            {t("videoNotReady")}
          </h2>
          <p className="mt-2 text-sm font-bold text-garden-taupe">
            {t("addVideoAdmin")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-4 border-garden-cocoa bg-garden-mist shadow-[5px_5px_0_#4A342A]">
      <div
        ref={containerRef}
        className="aspect-video w-full bg-garden-cocoa"
        title={title}
      />
      {!isReady && !errorMessage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-garden-mist p-4 text-center font-mono text-xs font-black uppercase text-garden-moss">
          {t("loadingVideo")}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-garden-petal p-6 text-center">
          <p className="font-bold text-garden-clay">{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
