"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowRight, Map } from "lucide-react";

interface HomeFinalCTAProps {
  headline: string;
  subtitle: string;
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
}

export default function HomeFinalCTA({
  headline,
  subtitle,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: HomeFinalCTAProps) {
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ margin: "-80px" });
  const reduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-pink-500/8 dark:from-indigo-500/5 dark:via-purple-500/3 dark:to-pink-500/5" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full animate-float-slow"
          style={{
            background: "radial-gradient(ellipse, var(--color-primary-glow) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="absolute inset-0 noise-texture pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Headline */}
        <div
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gradient-animated">
            {headline}
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-text-muted)] mb-8 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(20px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 200ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 200ms",
          }}
        >
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-base hover:opacity-90 transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5"
          >
            {primaryText}
            <ArrowRight size={18} />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm font-semibold text-base text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
          >
            <Map size={18} />
            {secondaryText}
          </Link>
        </div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--color-primary)] opacity-20 animate-float-slow"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + i}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
