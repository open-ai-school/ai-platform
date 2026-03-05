"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales, localeNames, localeFlags } from "@/i18n/request";
import type { Locale } from "@/i18n/request";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale =
    (locales as readonly string[]).find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
    || "en";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    if ((locales as readonly string[]).includes(segments[1])) {
      if (newLocale === "en") {
        // English has no prefix — remove the locale segment entirely
        segments.splice(1, 1);
      } else {
        segments[1] = newLocale;
      }
    } else if (newLocale !== "en") {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";
    router.push(newPath);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-card)] transition-colors"
        aria-label={t("language")}
      >
        <span>{localeFlags[currentLocale as Locale]}</span>
        <span className="hidden sm:inline">
          {localeNames[currentLocale as Locale]}
        </span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 py-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-lg z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[var(--color-bg)] transition-colors ${
                locale === currentLocale
                  ? "text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text)]"
              }`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {locale === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
