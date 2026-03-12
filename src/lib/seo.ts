import { routing } from "@/i18n/routing";

const BASE_URL = "https://aieducademy.org";

/**
 * Builds the full hreflang alternates map for a given path.
 * Pass the locale-agnostic path (no locale prefix), e.g. "/programs/ai-seeds/lessons/what-is-ai"
 * or "" for the homepage.
 */
export function buildAlternates(path: string) {
  const canonical = (locale: string) =>
    locale === "en" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;

  const languages: Record<string, string> = {
    "x-default": `${BASE_URL}${path}`,
    ...Object.fromEntries(routing.locales.map((l) => [l, canonical(l)])),
  };

  return { languages };
}
