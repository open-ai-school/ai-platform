import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/programs";

const BASE_URL = "https://openaischool.vercel.app";
const locales = ["en", "fr", "nl", "hi", "te"];

function localizedEntries(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const programs = getPrograms();

  const staticPages: MetadataRoute.Sitemap = [
    // Homepage — highest priority
    ...localizedEntries("", "weekly", 1.0, now),
    // Programs listing
    ...localizedEntries("/programs", "weekly", 0.9, now),
    // Playground
    ...localizedEntries("/playground", "monthly", 0.8, now),
    // About
    ...localizedEntries("/about", "monthly", 0.7, now),
    // Lessons listing
    ...localizedEntries("/lessons", "weekly", 0.8, now),
  ];

  // Individual program pages
  const programPages: MetadataRoute.Sitemap = programs.flatMap((program) =>
    localizedEntries(
      `/programs/${program.slug}`,
      program.status === "active" ? "weekly" : "monthly",
      program.status === "active" ? 0.8 : 0.4,
      now
    )
  );

  // Program lesson listing pages
  const programLessonPages: MetadataRoute.Sitemap = programs
    .filter((p) => p.status === "active")
    .flatMap((program) =>
      localizedEntries(`/programs/${program.slug}/lessons`, "weekly", 0.7, now)
    );

  return [...staticPages, ...programPages, ...programLessonPages];
}
