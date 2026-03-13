"use client";

import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Bot, Eye, BarChart3, Cpu } from "lucide-react";

interface ProjectCard {
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
}

interface HomeProjectsProps {
  title: string;
  subtitle: string;
  projects: ProjectCard[];
}

const PROJECT_ICONS = [Bot, Eye, BarChart3, Cpu];
const PROJECT_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
];
const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function HomeProjects({
  title,
  subtitle,
  projects,
}: HomeProjectsProps) {
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ margin: "-80px" });
  const reduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500 opacity-[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
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

        {/* Project cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const Icon = PROJECT_ICONS[i % PROJECT_ICONS.length];
            const gradient = PROJECT_COLORS[i % PROJECT_COLORS.length];
            const diffColor =
              DIFFICULTY_COLORS[project.difficulty] ?? DIFFICULTY_COLORS.Beginner;
            const delay = i * 120;

            return (
              <div
                key={i}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm p-6 hover-lift gradient-border-hover transition-all duration-300 relative overflow-hidden"
                style={{
                  opacity: sectionInView || reduced ? 1 : 0,
                  transform: sectionInView || reduced ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent" />

                <div className="relative z-10">
                  {/* Icon + difficulty */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} className="text-white" strokeWidth={1.5} />
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${diffColor}`}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Title + description */}
                  <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
