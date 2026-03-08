"use client";

import { motion } from "framer-motion";

/* ─── Animated hamburger icon ─── */

export function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="overflow-visible">
      <motion.line
        x1="3" y1="5" x2="17" y2="5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { rotate: 45, y: 5, x: 0 } : { rotate: 0, y: 0, x: 0 }}
        style={{ originX: "10px", originY: "10px" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
      <motion.line
        x1="3" y1="10" x2="17" y2="10"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.line
        x1="3" y1="15" x2="17" y2="15"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { rotate: -45, y: -5, x: 0 } : { rotate: 0, y: 0, x: 0 }}
        style={{ originX: "10px", originY: "10px" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </svg>
  );
}
