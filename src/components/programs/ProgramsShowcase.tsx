"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── types ─── */
export interface TrackData {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  tagline: string;
  brand?: string;
}

export interface LessonData {
  slug: string;
  title: string;
  icon: string;
  duration: number;
}

export interface ProgramData {
  slug: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  level: number;
  status: string;
  estimatedHours: number;
  topics: string[];
  lessonCount: number;
  firstLessonSlug?: string;
  lessons: LessonData[];
}

interface Props {
  tracks: TrackData[];
  programsByTrack: Record<string, ProgramData[]>;
  basePath: string;
  t: {
    title: string;
    subtitle: string;
    startLearning: string;
    comingSoon: string;
    hours: string;
    level: string;
    viewAll: string;
    levelLabels: Record<string, string>;
  };
}

/* ─── stagger ─── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ─── main ─── */
export default function ProgramsShowcase({ tracks, programsByTrack, basePath, t }: Props) {
  const [activeTrack, setActiveTrack] = useState(tracks[0]?.slug ?? "");
  const programs = programsByTrack[activeTrack] ?? [];

  const totalLessons = Object.values(programsByTrack).flat().reduce((s, p) => s + p.lessonCount, 0);
  const totalPrograms = Object.values(programsByTrack).flat().length;
  const totalTracks = tracks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ── Hero ── */}
      <HeroSection
        title={t.title}
        subtitle={t.subtitle}
        stats={[
          { value: totalTracks, label: "Tracks" },
          { value: totalPrograms, label: "Programs" },
          { value: totalLessons, label: "Lessons" },
        ]}
      />

      {/* ── Track Selector ── */}
      <TrackSelector tracks={tracks} active={activeTrack} onChange={setActiveTrack} />

      {/* ── Track Intro ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase font-medium mb-1">
            {tracks.find((tr) => tr.slug === activeTrack)?.tagline}
          </p>
          {tracks.find((tr) => tr.slug === activeTrack)?.brand && (
            <p className="text-xs text-[var(--color-text-muted)] max-w-xl mx-auto mt-2">
              {tracks.find((tr) => tr.slug === activeTrack)?.brand}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Program Grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack}
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="grid gap-8 md:gap-10 pb-20"
        >
          {programs.map((program, idx) => (
            <motion.div key={program.slug} variants={item}>
              <ProgramRow program={program} basePath={basePath} t={t} index={idx} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection({ title, subtitle, stats }: { title: string; subtitle: string; stats: { value: number; label: string }[] }) {
  return (
    <div className="relative pt-16 pb-12 md:pt-24 md:pb-16 text-center">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 text-gradient relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 relative"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {subtitle}
      </motion.p>
      <motion.div
        className="flex items-center justify-center gap-8 md:gap-16 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gradient">{s.value}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Track Selector ─── */
function TrackSelector({ tracks, active, onChange }: { tracks: TrackData[]; active: string; onChange: (s: string) => void }) {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm">
        {tracks.map((track) => (
          <button
            key={track.slug}
            onClick={() => onChange(track.slug)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              active === track.slug
                ? "text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {active === track.slug && (
              <motion.div
                layoutId="track-pill"
                className="absolute inset-0 rounded-xl bg-[var(--color-primary)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-lg">{track.icon}</span>
            <span className="relative z-10 hidden sm:inline">{track.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Program Row ─── */
function ProgramRow({ program, basePath, t, index }: { program: ProgramData; basePath: string; t: Props["t"]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const isActive = program.status === "active";

  const href = program.firstLessonSlug
    ? `${basePath}/programs/${program.slug}/lessons/${program.firstLessonSlug}`
    : `${basePath}/programs/${program.slug}`;

  return (
    <div ref={ref}>
      <motion.div
        className="group relative rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        {/* Glow border on hover */}
        <div
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
          style={{ background: `linear-gradient(135deg, ${program.color}50, transparent 40%, ${program.color}30)` }}
        />

        <div className={`relative border rounded-3xl p-6 md:p-8 transition-colors duration-500 ${
          isActive
            ? "bg-[var(--color-bg-card)] border-[var(--color-border)] group-hover:border-transparent"
            : "bg-[var(--color-bg-card)]/50 border-dashed border-[var(--color-border)] opacity-60"
        }`}>
          {/* Accent bar */}
          <div
            className="absolute top-0 left-8 right-8 h-px opacity-40 group-hover:opacity-80 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${program.color}, transparent)` }}
          />

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
            {/* Left: Info */}
            <div className="lg:w-[42%] lg:min-w-[42%]">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${program.color}20, ${program.color}08)` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {program.icon}
                </motion.div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold">{program.title}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${program.color}15`, color: program.color }}
                    >
                      {t.level} {program.level}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{program.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 line-clamp-2">
                {program.description}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <MetaChip icon="📚" text={`${program.lessonCount} lessons`} />
                <MetaChip icon="⏱️" text={`~${program.estimatedHours}${t.hours}`} />
                <MetaChip icon="📊" text={t.levelLabels[String(program.level)] ?? ""} accent={program.color} />
              </div>

              {/* CTA */}
              {isActive ? (
                <Link href={href} className="inline-block">
                  <motion.span
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                    style={{ background: `linear-gradient(135deg, ${program.color}, ${program.color}cc)` }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.startLearning}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] opacity-60">
                  🔒 {t.comingSoon}
                </span>
              )}
            </div>

            {/* Right: Lessons */}
            {isActive && program.lessons.length > 0 && (
              <div className="lg:w-[58%] overflow-hidden">
                <LessonGrid
                  lessons={program.lessons}
                  programSlug={program.slug}
                  programColor={program.color}
                  basePath={basePath}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Lesson Grid ─── */
function LessonGrid({ lessons, programSlug, programColor, basePath }: {
  lessons: LessonData[];
  programSlug: string;
  programColor: string;
  basePath: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? lessons : lessons.slice(0, 6);
  const hasMore = lessons.length > 6;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <AnimatePresence>
          {visible.map((lesson, i) => (
            <motion.div
              key={lesson.slug}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
            >
              <Link href={`${basePath}/programs/${programSlug}/lessons/${lesson.slug}`}>
                <div className="group/lesson relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 hover:border-transparent transition-all duration-200 cursor-pointer overflow-hidden hover:-translate-y-0.5">
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/lesson:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${programColor}08, ${programColor}03)` }}
                  />
                  <div className="relative flex items-center gap-2">
                    <span className="text-sm shrink-0">{lesson.icon || "📄"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate leading-tight">{lesson.title}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{lesson.duration}m</p>
                    </div>
                  </div>
                  <div
                    className="absolute top-1 right-1.5 text-[8px] font-bold opacity-15 group-hover/lesson:opacity-30 transition-opacity"
                    style={{ color: programColor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-xs font-medium text-[var(--color-primary)] hover:underline cursor-pointer"
        >
          {showAll ? "Show less ↑" : `+${lessons.length - 6} more lessons →`}
        </button>
      )}
    </div>
  );
}

/* ─── Meta Chip ─── */
function MetaChip({ icon, text, accent }: { icon: string; text: string; accent?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium border"
      style={accent
        ? { borderColor: `${accent}30`, color: accent, backgroundColor: `${accent}08` }
        : { borderColor: "var(--color-border)", color: "var(--color-text-muted)" }
      }
    >
      <span className="text-xs">{icon}</span> {text}
    </span>
  );
}
