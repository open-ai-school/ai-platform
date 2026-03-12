import { getTranslations } from "next-intl/server";
import { getProgramsByTrack } from "@/lib/programs";
import { getLessons } from "@/lib/lessons";
import HeroBackground from "@/components/home/HeroBackgroundLazy";
import HomeHero from "@/components/home/HomeHero";
import {
  HomeProgramCardsLazy as HomeProgramCards,
  HomeCommunitySectionLazy as HomeCommunitySection,
} from "@/components/home/HomeDynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const tP = await getTranslations("programs");
  const tc = await getTranslations("community");
  const tf = await getTranslations("features");
  const tLT = await getTranslations("lessonTitles");
  const basePath = locale === "en" ? "" : `/${locale}`;

  const aiLearningPrograms = getProgramsByTrack("ai-learning").map((p) => ({
    slug: p.slug,
    icon: p.icon,
    title: tP(`${p.slug}.title`),
    color: p.color,
    active: true,
    level: p.level,
  }));

  const craftPrograms = getProgramsByTrack("craft-engineering").map((p) => ({
    slug: p.slug,
    icon: p.icon,
    title: tP(`${p.slug}.title`),
    color: p.color,
    active: true,
    level: p.level,
    desc: tP(`${p.slug}.subtitle`),
  }));

  const careerPrograms = getProgramsByTrack("career-ready").map((p) => ({
    slug: p.slug,
    icon: p.icon,
    title: tP(`${p.slug}.title`),
    color: p.color,
    active: true,
    level: p.level,
    desc: tP(`${p.slug}.subtitle`),
  }));

  // Resolve first lesson slugs for direct navigation
  const allHomePrograms = [...aiLearningPrograms, ...craftPrograms, ...careerPrograms];
  const firstLessonSlugs: Record<string, string | undefined> = {};
  const lessonNames: Record<string, string[]> = {};
  for (const p of allHomePrograms) {
    if (p.active) {
      const lessons = getLessons(p.slug, locale);
      firstLessonSlugs[p.slug] = lessons[0]?.slug;
      lessonNames[p.slug] = lessons.map((l) => tLT(l.slug));
    }
  }

  // Build program title map for client components
  const programTitles: Record<string, string> = {};
  for (const p of allHomePrograms) {
    programTitles[p.slug] = tP(`${p.slug}.title`);
  }

  return (
    <>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <HeroBackground />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-[2]">
          <HomeHero
            title={t("hero.title")}
            titleHighlight={t("hero.titleHighlight")}
            subtitle={t("hero.subtitle")}
            ctaText={t("hero.cta")}
            ctaHref={`${basePath}/programs`}
            ctaSecondaryText={t("hero.ctaSecondary")}
            ctaSecondaryHref={`${basePath}/lab`}
            basePath={basePath}
            totalLessons={3}
            statPrograms={t("hero.statPrograms")}
            statLessons={t("hero.statLessons")}
            statLanguages={t("hero.statLanguages")}
          />
        </div>
      </section>

      {/* Programs Section - Bento Grid */}
      <section className="py-12 sm:py-16">
        <HomeProgramCards
          sectionTitle={t("programs.title")}
          sectionSubtitle={t("programs.subtitle")}
          highlights={[
            {
              icon: "📚",
              value: "100+",
              label: tf("lessonsTitle"),
              desc: tf("lessonsDesc"),
            },
            {
              icon: "🌍",
              value: "5",
              label: tf("languagesTitle"),
              desc: tf("languagesDesc"),
            },
            {
              icon: "🎯",
              value: "15",
              label: tf("programsTitle"),
              desc: tf("programsDesc"),
            },
          ]}
          trackAI={{
            trackIcon: "🌳",
            trackTitle: tP("track.ai-learning.title"),
            trackDesc: tP("track.ai-learning.desc"),
            programs: aiLearningPrograms,
            programTitles,
            firstLessonSlugs,
            lessonNames,
            basePath,
            href: `${basePath}/programs#ai-learning`,
          }}
          trackCraft={{
            trackIcon: "🔨",
            trackTitle: tP("track.craft-engineering.title"),
            trackDesc: tP("track.craft-engineering.desc"),
            programs: craftPrograms,
            programTitles,
            firstLessonSlugs,
            lessonNames,
            basePath,
            href: `${basePath}/programs#craft-engineering`,
          }}
          trackCareer={{
            trackIcon: "🚀",
            trackTitle: tP("track.career-ready.title"),
            trackDesc: tP("track.career-ready.desc"),
            programs: careerPrograms,
            programTitles,
            firstLessonSlugs,
            lessonNames,
            basePath,
            href: `${basePath}/programs#career-ready`,
          }}
        />
      </section>

      {/* Community CTA - Full-width gradient section */}
      <section className="py-12 sm:py-16 relative overflow-hidden bg-gradient-mesh-cta">
        <div className="absolute inset-0 noise-texture pointer-events-none" />
        <HomeCommunitySection
          headline={tc("headline")}
          subtitle={tc("subtitle")}
          openSourceText={tc("openSource")}
        />
      </section>
    </>
  );
}
