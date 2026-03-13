"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const LAUNCH_DATE = new Date("2026-03-17T08:01:00Z");
const DISMISS_KEY = "launch-banner-dismissed";
const PH_URL = "https://www.producthunt.com/posts/ai-educademy";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export function LaunchBanner() {
  const t = useTranslations("launch");
  const [dismissed, setDismissed] = useState(true); // hidden by default to avoid flash
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);
  const [isLive, setIsLive] = useState(() => Date.now() >= LAUNCH_DATE.getTime());

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = getTimeLeft();
      if (remaining) {
        setTimeLeft(remaining);
      } else {
        setIsLive(true);
        setTimeLeft(null);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // storage full / blocked — banner stays dismissed for this session
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label={isLive ? t("liveMessage") : t("countdownPrefix")}
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-white motion-safe:animate-[fadeIn_0.3s_ease-out]"
      style={{ height: 40, fontSize: "0.8125rem", lineHeight: 1 }}
    >
      {isLive ? (
        <a
          href={PH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-medium text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          🎉 {t("liveMessage")} →
        </a>
      ) : timeLeft ? (
        <p className="font-medium">
          🚀 {t("countdownPrefix")}{" "}
          <span className="tabular-nums">
            {timeLeft.days} {t("days")}, {timeLeft.hours} {t("hours")},{" "}
            {timeLeft.minutes} {t("minutes")}!
          </span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={dismiss}
        aria-label={t("dismiss")}
        className="absolute right-2 flex h-6 w-6 items-center justify-center rounded text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        ✕
      </button>
    </div>
  );
}
