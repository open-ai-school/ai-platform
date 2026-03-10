import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "nl", "hi", "te", "es", "pt", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
