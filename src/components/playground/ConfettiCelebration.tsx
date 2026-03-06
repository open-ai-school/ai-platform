"use client";

import { useEffect, useState } from "react";

/* CSS-only confetti celebration — no external dependencies */
export default function ConfettiCelebration() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#eab308", "#34d399", "#06b6d4"];
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
      size: Math.random() * 6 + 4,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg) scale(0.3); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
