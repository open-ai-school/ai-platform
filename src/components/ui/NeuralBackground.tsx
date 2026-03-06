"use client";
import { useEffect, useState } from "react";

// Generate fixed positions for dots (deterministic, not random)
const DOTS = [
  { cx: 10, cy: 20 }, { cx: 25, cy: 50 }, { cx: 40, cy: 15 },
  { cx: 55, cy: 45 }, { cx: 70, cy: 25 }, { cx: 85, cy: 55 },
  { cx: 15, cy: 75 }, { cx: 35, cy: 85 }, { cx: 60, cy: 70 },
  { cx: 80, cy: 80 }, { cx: 95, cy: 35 }, { cx: 50, cy: 90 },
];

const CONNECTIONS = [
  [0,1], [1,2], [2,3], [3,4], [4,5], [1,3], [6,7], [7,8],
  [8,9], [6,8], [3,8], [4,10], [7,11], [2,4], [5,10],
];

export default function NeuralBackground({ variant = "section" }: { variant?: "hero" | "section" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const opacity = variant === "hero" ? 0.15 : 0.08;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONNECTIONS.map(([a, b], i) => (
          <line
            key={i}
            x1={`${DOTS[a].cx}%`} y1={`${DOTS[a].cy}%`}
            x2={`${DOTS[b].cx}%`} y2={`${DOTS[b].cy}%`}
            stroke="var(--color-primary)"
            strokeWidth="0.15"
            style={{ animation: `connection-pulse ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s` }}
          />
        ))}
        {DOTS.map((dot, i) => (
          <circle
            key={i}
            cx={`${dot.cx}%`} cy={`${dot.cy}%`}
            r="0.4"
            fill="var(--color-primary)"
            style={{ animation: `float ${3 + (i % 3)}s ease-in-out infinite ${i * 0.5}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
