"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Props } from "./types";
import { stagger, fadeUp } from "./animations";
import { ProgramHeroSection } from "./ProgramHeroSection";
import { ProgramSearch } from "./ProgramSearch";
import { TrackTabs } from "./TrackTabs";
import { ProgramCard } from "./ProgramCard";

/* ─── main ─── */
export default function ProgramsShowcase({ tracks, programsByTrack, basePath, t }: Props) {
  const [activeTrack, setActiveTrack] = useState<string | null>(null); // null = all tracks
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  // Auto-select track from URL hash (e.g. /programs#ai-learning)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && tracks.some((tr) => tr.slug === hash)) {
      setActiveTrack(hash);
    }
  }, [tracks]);

  const allPrograms = useMemo(
    () => Object.values(programsByTrack).flat(),
    [programsByTrack]
  );

  // Filter by track and search
  const filtered = useMemo(() => {
    let programs = activeTrack ? (programsByTrack[activeTrack] ?? []) : allPrograms;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      programs = programs.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.topics.some((tp) => tp.toLowerCase().includes(q)) ||
          p.lessons.some((l) => l.title.toLowerCase().includes(q))
      );
    }
    return programs;
  }, [activeTrack, searchQuery, programsByTrack, allPrograms]);

  const totalLessons = allPrograms.reduce((s, p) => s + p.lessonCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ── Hero ── */}
      <ProgramHeroSection t={t} stats={{ tracks: tracks.length, programs: allPrograms.length, lessons: totalLessons }} />

      {/* ── Search ── */}
      <ProgramSearch query={searchQuery} onChange={setSearchQuery} placeholder={t.searchPlaceholder} />

      {/* ── Track Tabs ── */}
      <TrackTabs tracks={tracks} active={activeTrack} onChange={setActiveTrack} allLabel={t.allTracks} />

      {/* ── Active Track Brand ── */}
      <AnimatePresence mode="wait">
        {activeTrack && (
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10 overflow-hidden"
          >
            <p className="text-sm tracking-widest uppercase font-medium text-[var(--color-primary)] mb-1">
              {tracks.find((tr) => tr.slug === activeTrack)?.tagline}
            </p>
            {tracks.find((tr) => tr.slug === activeTrack)?.brand && (
              <p className="text-xs text-[var(--color-text-muted)] max-w-xl mx-auto mt-1 leading-relaxed">
                {tracks.find((tr) => tr.slug === activeTrack)?.brand}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Programs ── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg text-[var(--color-text-muted)]">{t.noResults}</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTrack}-${searchQuery}`}
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid gap-6 md:gap-8 pb-24"
          >
            {filtered.map((program, idx) => (
              <motion.div key={program.slug} variants={prefersReducedMotion ? undefined : fadeUp}>
                <ProgramCard program={program} basePath={basePath} t={t} index={idx} reducedMotion={!!prefersReducedMotion} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
