"use client";

import dynamic from "next/dynamic";

export const HomeProgramCardsLazy = dynamic(
  () => import("@/components/home/HomeProgramCards"),
  { ssr: false },
);

export const HomeCommunitySectionLazy = dynamic(
  () => import("@/components/home/HomeCommunitySection"),
  { ssr: false },
);

export const HomeContinueLearningLazy = dynamic(
  () => import("@/components/home/HomeContinueLearning"),
  { ssr: false },
);

export const GitHubStatsWidgetLazy = dynamic(
  () => import("@/components/home/GitHubStatsWidget"),
  { ssr: false },
);
