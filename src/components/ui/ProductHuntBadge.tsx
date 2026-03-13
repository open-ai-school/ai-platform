"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const LAUNCH_DATE = new Date("2026-03-17T08:01:00Z");
const DISMISS_KEY = "ph-badge-dismissed";
const PH_URL = "https://www.producthunt.com/posts/ai-educademy";

export function ProductHuntBadge() {
  const t = useTranslations("launch");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      Date.now() >= LAUNCH_DATE.getTime() &&
      localStorage.getItem(DISMISS_KEY) !== "true"
    ) {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // storage full / blocked — badge stays hidden for this session
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="complementary"
      aria-label={t("badge")}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-[var(--color-bg-card)] px-3 py-2 shadow-lg motion-safe:animate-[fadeIn_0.3s_ease-out]"
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      <a
        href={PH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: "var(--color-primary)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect width="40" height="40" rx="8" fill="#DA552F" />
          <path
            d="M22.667 20H18v-6.667h4.667a3.333 3.333 0 0 1 0 6.667ZM18 10v20h3.333v-6.667h1.334A6.666 6.666 0 0 0 29.333 16.667 6.666 6.666 0 0 0 22.667 10H18Z"
            fill="#FFF"
          />
        </svg>
        {t("badge")}
      </a>

      <button
        type="button"
        onClick={dismiss}
        aria-label={t("dismiss")}
        className="ml-1 flex h-5 w-5 items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ✕
      </button>
    </div>
  );
}
