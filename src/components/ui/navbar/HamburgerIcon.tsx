"use client";

/* ─── Animated hamburger icon (CSS transitions, no framer-motion) ─── */

export function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="overflow-visible">
      <line
        x1="3" y1="5" x2="17" y2="5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        className="origin-center transition-all duration-300"
        style={{
          transform: open ? "rotate(45deg) translateY(5px)" : "none",
        }}
      />
      <line
        x1="3" y1="10" x2="17" y2="10"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        className="transition-all duration-150"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "none",
        }}
      />
      <line
        x1="3" y1="15" x2="17" y2="15"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        className="origin-center transition-all duration-300"
        style={{
          transform: open ? "rotate(-45deg) translateY(-5px)" : "none",
        }}
      />
    </svg>
  );
}
