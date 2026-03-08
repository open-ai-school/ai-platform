"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{t("title")}</h1>
        <p className="text-[var(--color-text-muted)]">{t("description")}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
