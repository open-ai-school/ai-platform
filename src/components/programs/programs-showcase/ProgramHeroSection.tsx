"use client";

import { motion } from "framer-motion";
import type { ProgramsI18n } from "./types";

/* ─────────────────────── Hero ─────────────────────── */
export function ProgramHeroSection({ t, stats }: { t: ProgramsI18n; stats: { tracks: number; programs: number; lessons: number } }) {
  return (
    <div className="relative py-20 sm:py-28 text-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)] opacity-[0.04] blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-secondary)] opacity-[0.04] blur-[100px] animate-[float-slow_12s_ease-in-out_infinite]" />
      </div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 text-gradient relative leading-tight tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {t.title}
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-12 relative leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {t.subtitle}
      </motion.p>

      {/* Stats */}
      <motion.div
        className="flex items-center justify-center gap-10 md:gap-20 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {([
          { value: stats.tracks, label: t.statsTracksLabel },
          { value: stats.programs, label: t.statsProgramsLabel },
          { value: stats.lessons, label: t.statsLessonsLabel },
        ]).map((s) => (
          <div key={s.label} className="text-center group">
            <motion.div
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gradient"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {s.value}
            </motion.div>
            <div className="text-[11px] sm:text-xs text-[var(--color-text-muted)] uppercase tracking-widest mt-1.5 font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
