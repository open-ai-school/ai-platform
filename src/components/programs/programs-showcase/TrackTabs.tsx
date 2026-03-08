"use client";

import { motion } from "framer-motion";
import type { TrackData } from "./types";

/* ─────────────────────── Track Tabs ─────────────────────── */
export function TrackTabs({ tracks, active, onChange, allLabel }: {
  tracks: TrackData[];
  active: string | null;
  onChange: (s: string | null) => void;
  allLabel: string;
}) {
  return (
    <motion.div
      className="flex justify-center mb-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm max-w-full overflow-x-auto whitespace-nowrap">
        {/* All tracks tab */}
        <TabButton
          isActive={active === null}
          onClick={() => onChange(null)}
          icon="✦"
          label={allLabel}
        />
        {tracks.map((track) => (
          <TabButton
            key={track.slug}
            isActive={active === track.slug}
            onClick={() => onChange(track.slug)}
            icon={track.icon}
            label={track.title}
          />
        ))}
      </div>
    </motion.div>
  );
}

function TabButton({ isActive, onClick, icon, label }: {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
        isActive ? "text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="active-track-pill"
          className="absolute inset-0 rounded-full bg-[var(--color-primary)] shadow-lg"
          style={{ boxShadow: "0 4px 12px var(--color-primary-glow, rgba(99,102,241,0.25))" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10 text-base">{icon}</span>
      <span className="relative z-10 hidden sm:inline">{label}</span>
    </button>
  );
}
