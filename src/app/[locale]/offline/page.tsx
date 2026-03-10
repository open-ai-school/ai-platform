"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  const t = useTranslations("pwa");
  const locale = useLocale();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-[var(--color-bg)] motion-section motion-fade-up motion-visible"
      style={{ animation: "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
    >
      <div className="rounded-full bg-[var(--color-bg-card)] p-6 mb-6">
        <WifiOff className="h-12 w-12 text-[var(--color-text-muted)]" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3 text-[var(--color-text)]">
        {t("offline")}
      </h1>
      <p className="text-lg text-[var(--color-text-muted)] max-w-md mb-8">
        {t("offlineMessage")}
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
