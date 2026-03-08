"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BookOpen, Clock, BarChart3, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import type { ProgramData, ProgramsI18n } from "./types";
import { Chip } from "./Chip";

/* ─────────────────────── Program Card ─────────────────────── */
export function ProgramCard({ program, basePath, t, index, reducedMotion }: {
  program: ProgramData;
  basePath: string;
  t: ProgramsI18n;
  index: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isActive = program.hasLessons;
  const [lessonsExpanded, setLessonsExpanded] = useState(false);

  const href = program.firstLessonSlug
    ? `${basePath}/programs/${program.slug}/lessons/${program.firstLessonSlug}`
    : `${basePath}/programs/${program.slug}`;

  const visibleLessons = lessonsExpanded ? program.lessons : program.lessons.slice(0, 6);
  const hasMore = program.lessons.length > 6;

  return (
    <div ref={ref}>
      <motion.div
        className="group relative"
        initial={reducedMotion ? undefined : { opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : reducedMotion ? undefined : { opacity: 0, y: 40 }}
        transition={reducedMotion ? undefined : { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        {/* Animated glow border */}
        <div
          className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-700"
          style={{
            background: `conic-gradient(from ${index * 72}deg, ${program.color}40, transparent, ${program.color}25, transparent, ${program.color}40)`,
            filter: "blur(1px)",
          }}
        />

        <div className={`relative rounded-[26px] p-6 sm:p-8 transition-all duration-500 ${
          isActive
            ? "bg-[var(--color-bg-card)] border border-[var(--color-border)] group-hover:border-transparent group-hover:shadow-2xl"
            : "bg-[var(--color-bg-card)]/50 border border-dashed border-[var(--color-border)] opacity-50"
        }`}>
          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full"
            style={{ background: `linear-gradient(90deg, transparent, ${program.color}, transparent)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 0.6 } : {}}
            transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
          />

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
            {/* ── Left: Program Info ── */}
            <div className={`${isActive && program.lessons.length > 0 ? "lg:w-[42%] lg:min-w-[42%]" : "w-full"}`}>
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${program.color}22, ${program.color}08)`,
                    boxShadow: `0 4px 16px ${program.color}12`,
                  }}
                  whileHover={{ scale: 1.12, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {program.icon}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className="text-xl font-bold leading-relaxed">{program.title}</h3>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${program.color}15`, color: program.color }}
                    >
                      {t.level} {program.level}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{program.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5 line-clamp-3">
                {program.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Chip color={program.color}>
                  <BookOpen className="w-3 h-3" />
                  {t.lessonsCount.replace("{count}", String(program.lessonCount))}
                </Chip>
                <Chip>
                  <Clock className="w-3 h-3" />
                  ~{program.estimatedHours}{t.hours}
                </Chip>
                <Chip color={program.color} filled>
                  <BarChart3 className="w-3 h-3" />
                  {t.levelLabels[String(program.level)] ?? ""}
                </Chip>
              </div>

              {/* CTA */}
              {isActive ? (
                <Link href={href} className="inline-block group/cta">
                  <motion.span
                    className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3 text-sm font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${program.color}, ${program.color}bb)`,
                      boxShadow: `0 8px 24px ${program.color}30`,
                    }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.startLearning}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                  </motion.span>
                </Link>
              ) : (
                <motion.span
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  🔒 {t.comingSoon}
                </motion.span>
              )}
            </div>

            {/* ── Right: Lesson Tiles ── */}
            {isActive && program.lessons.length > 0 && (
              <div className="lg:w-[58%]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <AnimatePresence>
                    {visibleLessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.slug}
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link href={`${basePath}/programs/${program.slug}/lessons/${lesson.slug}`}>
                          <motion.div
                            className="group/tile relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 min-h-[60px] cursor-pointer overflow-hidden"
                            whileHover={{ y: -3, scale: 1.02, borderColor: program.color + "60" }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Hover shimmer */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500 rounded-xl"
                              style={{ background: `linear-gradient(135deg, ${program.color}10, transparent 60%, ${program.color}05)` }}
                            />
                            <div className="relative flex items-center gap-2.5">
                              <span className="text-sm shrink-0">{lesson.icon || "📄"}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold line-clamp-2 leading-tight">{lesson.title}</p>
                                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{lesson.duration}m</p>
                              </div>
                            </div>
                            {/* Number watermark */}
                            <div
                              className="absolute top-0.5 right-1.5 text-[9px] font-black opacity-10 group-hover/tile:opacity-25 transition-opacity"
                              style={{ color: program.color }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {hasMore && (
                  <motion.button
                    onClick={() => setLessonsExpanded(!lessonsExpanded)}
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                    whileTap={{ scale: 0.97 }}
                  >
                    {lessonsExpanded ? (
                      <>{t.showLess} <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>{t.moreLessons.replace("{count}", String(program.lessons.length - 6))} <ChevronDown className="w-3 h-3" /></>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
