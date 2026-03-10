"use client";

import { type ReactNode, useRef, useState, useEffect } from "react";

/* ─── AnimatedSection ─── */
type Animation = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  className,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`motion-section motion-${animation} ${isInView ? "motion-visible" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── AnimatedProgressBar ─── */
interface AnimatedProgressBarProps {
  percentage: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}

export function AnimatedProgressBar({
  percentage,
  className = "h-3 rounded-full bg-[var(--color-bg-section)] overflow-hidden",
  barClassName = "h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500",
  delay = 0,
}: AnimatedProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <div
        className={barClassName}
        style={{
          width: prefersReducedMotion || isInView ? `${percentage}%` : "0%",
          transition: prefersReducedMotion ? "none" : `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        }}
      />
    </div>
  );
}
