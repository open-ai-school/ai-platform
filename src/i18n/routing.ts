import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "nl", "hi", "te", "es", "pt", "de", "zh", "ja", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
