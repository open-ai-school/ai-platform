"use client";

import dynamic from "next/dynamic";

const HeroBackground = dynamic(
  () => import("@/components/home/HeroBackground").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-primary)]/[0.03] to-[var(--color-bg)]" />
    ),
  }
);

export default function HeroBackgroundLazy() {
  return <HeroBackground />;
}
