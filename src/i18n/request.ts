import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr", "nl", "hi", "te"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  nl: "Nederlands",
  hi: "हिन्दी",
  te: "తెలుగు",
};

export const localeFlags: Record<Locale, string> = {
  en: "🌐",
  fr: "🇫🇷",
  nl: "🇳🇱",
  hi: "🇮🇳",
  te: "🇮🇳",
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
