import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getProgramsByTrack } from "@/lib/programs";
import { getLessons } from "@/lib/lessons";
import { getTracks } from "@/lib/tracks";
import ProgramsShowcase from "@/components/programs/ProgramsShowcase";
import type { TrackData, ProgramData } from "@/components/programs/ProgramsShowcase";

const BASE_URL = "https://aieducademy.org";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "programs" });
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/programs`,
    },
    openGraph: {
      title: `${t("pageTitle")} | AI Educademy`,
      description: t("pageDescription"),
    },
  };
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("programs");
  const tracks = getTracks();
  const basePath = locale === "en" ? "" : `/${locale}`;

  // Build serialisable data for the client component
  const trackData: TrackData[] = tracks.map((track) => ({
    slug: track.slug,
    icon: track.icon,
    title: t(`track.${track.slug}.title`),
    desc: t(`track.${track.slug}.desc`),
    tagline: t(`track.${track.slug}.tagline`),
    brand: track.brand ? t(`track.${track.slug}.brand`) : undefined,
  }));

  const programsByTrack: Record<string, ProgramData[]> = {};
  for (const track of tracks) {
    const progs = getProgramsByTrack(track.slug);
    programsByTrack[track.slug] = progs.map((p) => {
      const lessons = p.status === "active" ? getLessons(p.slug, locale) : [];
      return {
        slug: p.slug,
        icon: p.icon,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        color: p.color,
        level: p.level,
        status: p.status,
        estimatedHours: p.estimatedHours,
        topics: p.topics,
        lessonCount: p.lessonCount,
        firstLessonSlug: lessons[0]?.slug,
        lessons: lessons.map((l) => ({
          slug: l.slug,
          title: l.title,
          icon: l.icon ?? "📄",
          duration: l.duration,
        })),
      };
    });
  }

  const levelLabels: Record<string, string> = {
    "1": t("levelLabels.1"),
    "2": t("levelLabels.2"),
    "3": t("levelLabels.3"),
    "4": t("levelLabels.4"),
    "5": t("levelLabels.5"),
  };

  return (
    <ProgramsShowcase
      tracks={trackData}
      programsByTrack={programsByTrack}
      basePath={basePath}
      t={{
        title: t("title"),
        subtitle: t("subtitle"),
        startLearning: t("startLearning"),
        comingSoon: t("comingSoon"),
        hours: t("hours"),
        level: t("level"),
        viewAll: t("viewAll"),
        levelLabels,
      }}
    />
  );
}
