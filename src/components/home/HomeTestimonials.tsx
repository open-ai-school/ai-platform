"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BookOpen, Globe, GitBranch, Quote } from "lucide-react";

interface StatCard {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
  icon: typeof BookOpen;
}

interface HomeTestimonialsProps {
  title: string;
  stats: {
    programs: string;
    programsSub: string;
    languages: string;
    languagesSub: string;
    openSource: string;
    openSourceSub: string;
  };
  quote: string;
}

function useCountUp(target: number, inView: boolean, reduced: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || reduced) {
      if (reduced && inView) setCount(target);
      return;
    }
    hasAnimated.current = true;
    const duration = 1500;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target, reduced]);

  return count;
}

const STAT_DATA: { icon: typeof BookOpen; value: number; suffix?: string }[] = [
  { icon: BookOpen, value: 15 },
  { icon: Globe, value: 11 },
  { icon: GitBranch, value: 100, suffix: "%" },
];

export default function HomeTestimonials({
  title,
  stats,
  quote,
}: HomeTestimonialsProps) {
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ margin: "-80px" });
  const reduced = useReducedMotion();

  const statCards: { icon: typeof BookOpen; value: number; suffix?: string; label: string; sublabel: string }[] = [
    { ...STAT_DATA[0], label: stats.programs, sublabel: stats.programsSub },
    { ...STAT_DATA[1], label: stats.languages, sublabel: stats.languagesSub },
    { ...STAT_DATA[2], label: stats.openSource, sublabel: stats.openSourceSub },
  ];

  const count0 = useCountUp(statCards[0].value, sectionInView, reduced);
  const count1 = useCountUp(statCards[1].value, sectionInView, reduced);
  const count2 = useCountUp(statCards[2].value, sectionInView, reduced);
  const counts = [count0, count1, count2];

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-mesh-cta" />
      <div className="absolute inset-0 noise-texture pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-12"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gradient-animated">
            {title}
          </h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            const delay = i * 150;

            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm p-8 text-center hover-lift transition-all duration-300"
                style={{
                  opacity: sectionInView || reduced ? 1 : 0,
                  transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[var(--color-primary)]" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[var(--color-text)] mb-1 tabular-nums">
                  {counts[i]}
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <div className="text-base font-semibold text-[var(--color-text)] mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote block */}
        <div
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm p-8 sm:p-10 text-center relative"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(20px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 500ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 500ms",
          }}
        >
          <Quote
            size={32}
            className="text-[var(--color-primary)] opacity-30 mx-auto mb-4"
          />
          <p className="text-lg sm:text-xl text-[var(--color-text)] leading-relaxed font-medium italic max-w-3xl mx-auto">
            {quote}
          </p>
        </div>
      </div>
    </section>
  );
}
