"use client";

import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Compass, Code, Rocket } from "lucide-react";

interface HomeHowItWorksProps {
  title: string;
  subtitle: string;
  steps: {
    title: string;
    description: string;
  }[];
}

const STEP_ICONS = [Compass, Code, Rocket];
const STEP_COLORS = [
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-cyan-500",
  "from-orange-500 to-rose-500",
];

export default function HomeHowItWorks({
  title,
  subtitle,
  steps,
}: HomeHowItWorksProps) {
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ margin: "-80px" });
  const reduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-12 sm:mb-16"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gradient-animated">
            {title}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[calc(16.67%+30px)] right-[calc(16.67%+30px)] h-[2px]">
            <div
              className="h-full bg-gradient-to-r from-indigo-500/30 via-emerald-500/30 to-orange-500/30"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 8px, transparent 8px, transparent 16px)",
                opacity: sectionInView || reduced ? 1 : 0,
                transition: reduced ? "none" : "opacity 1s ease 0.3s",
              }}
            />
          </div>

          {/* Connector line (mobile) */}
          <div className="lg:hidden absolute left-[39px] top-[80px] bottom-[80px] w-[2px]">
            <div
              className="h-full"
              style={{
                backgroundImage: "repeating-linear-gradient(180deg, var(--color-border) 0, var(--color-border) 8px, transparent 8px, transparent 16px)",
                opacity: sectionInView || reduced ? 1 : 0,
                transition: reduced ? "none" : "opacity 1s ease 0.3s",
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Compass;
              const colorGradient = STEP_COLORS[i] ?? STEP_COLORS[0];
              const delay = i * 150;

              return (
                <div
                  key={i}
                  className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 group"
                  style={{
                    opacity: sectionInView || reduced ? 1 : 0,
                    transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
                    transition: reduced
                      ? "none"
                      : `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                  }}
                >
                  {/* Numbered circle */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-[80px] h-[80px] rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon size={32} className="text-white" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text)]">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="lg:mt-6 lg:text-center">
                    <div
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm p-6 hover-lift gradient-border-hover transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
