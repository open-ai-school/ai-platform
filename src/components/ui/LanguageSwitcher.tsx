"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeNames, localeFlags } from "@/i18n/request";
import type { Locale } from "@/i18n/request";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  function switchLocale(newLocale: string) {
    if (newLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

    const segments = pathname.split("/").filter(Boolean);
    if ((locales as readonly string[]).includes(segments[0])) {
      segments.shift();
    }

    let newPath: string;
    if (newLocale === "en") {
      newPath = "/" + segments.join("/");
    } else {
      newPath = "/" + newLocale + (segments.length > 0 ? "/" + segments.join("/") : "");
    }

    newPath = newPath.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    window.location.href = newPath;
  }

  return (
    <div className="flex items-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-[3px] gap-[2px] shrink-0">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          title={localeNames[locale as Locale]}
          className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all duration-200 ${
            locale === currentLocale
              ? "bg-white dark:bg-indigo-500/15 shadow-sm ring-1 ring-black/[0.04] dark:ring-indigo-400/20"
              : "hover:bg-white/60 dark:hover:bg-white/[0.06] opacity-60 hover:opacity-100"
          }`}
          aria-label={`Switch to ${localeNames[locale as Locale]}`}
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          <span className="text-[13px] leading-none">{localeFlags[locale as Locale]}</span>
        </button>
      ))}
    </div>
  );
}
