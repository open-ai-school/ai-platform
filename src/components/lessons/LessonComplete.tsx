"use client";

import { useProgress } from "@/hooks/useProgress";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface LessonCompleteProps {
  slug: string; // "programSlug/lessonSlug"
  programSlug: string;
  totalLessons: number;
  currentIndex: number;
  nextSlug?: string;
  nextTitle?: string;
  prevSlug?: string;
  prevTitle?: string;
  basePath: string;
  programPath: string;
  programTitle: string;
}

export function LessonComplete({
  slug,
  programSlug,
  totalLessons,
  currentIndex,
  nextSlug,
  nextTitle,
  prevSlug,
  prevTitle,
  basePath,
  programPath,
  programTitle,
}: LessonCompleteProps) {
  const { isCompleted, markComplete, getProgram } = useProgress(programSlug);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const completed = isCompleted(slug);

  const progData = getProgram(programSlug);
  const progCompleted = progData.completed.length;
  const allDone = progCompleted >= totalLessons || (progCompleted >= totalLessons - 1 && justCompleted);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-complete when user scrolls to the bottom (Intersection Observer)
  const handleAutoComplete = useCallback(() => {
    if (!completed && !justCompleted) {
      markComplete(slug);
      setJustCompleted(true);
      if (progCompleted + 1 >= totalLessons) {
        setShowConfetti(true);
      }
    }
  }, [completed, justCompleted, markComplete, slug, progCompleted, totalLessons]);

  useEffect(() => {
    const el = endRef.current;
    if (!el || completed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleAutoComplete();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [completed, handleAutoComplete]);

  // Auto-hide confetti after 4s
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const isComplete = completed || justCompleted;

  return (
    <>
      {/* Scroll progress bar (fixed at top) */}
      <div
        className="lesson-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="mt-12 space-y-6" ref={endRef}>
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>
            Lesson {currentIndex + 1} of {totalLessons}
          </span>
          <span>
            {progCompleted} of {totalLessons} completed
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(progCompleted / totalLessons) * 100}%` }}
          />
        </div>

        {/* Completion state */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] relative overflow-hidden">
          {/* Confetti animation overlay */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1.5 + Math.random() * 1.5}s`,
                    fontSize: `${12 + Math.random() * 12}px`,
                    color: ['#F97316', '#06B6D4', '#8B5CF6', '#EC4899', '#EAB308', '#34D399', '#6366F1'][i % 7],
                  }}
                >
                  {['✦', '●', '■', '▲', '★', '◆'][i % 6]}
                </span>
              ))}
            </div>
          )}

          {isComplete ? (
            <div className="text-center space-y-4 relative z-20">
              <div className={`flex items-center justify-center gap-3 text-[var(--color-accent)] ${justCompleted ? 'animate-bounce-once' : ''}`}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-bold text-lg">
                  ✓ Lesson Complete!
                </span>
              </div>

              {allDone && (
                <div className={`space-y-3 ${justCompleted ? 'animate-fade-in-up' : ''}`}>
                  <div className="text-5xl animate-float-slow">🏆</div>
                  <p className="text-xl font-bold text-gradient">
                    Congratulations!
                  </p>
                  <p className="text-[var(--color-text-muted)]">
                    You&apos;ve completed all {totalLessons} lessons in <strong>{programTitle}</strong>!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-[var(--color-text-muted)] text-sm py-2">
              Keep reading to complete this lesson…
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
          {prevSlug ? (
            <Link
              href={`${basePath}/${prevSlug}`}
              className="group flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors min-w-0"
            >
              <span className="shrink-0 group-hover:-translate-x-1 transition-transform">←</span>
              <span className="truncate">{prevTitle}</span>
            </Link>
          ) : (
            <Link
              href={programPath}
              className="group flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="shrink-0 group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to program</span>
            </Link>
          )}
          {nextSlug ? (
            <Link
              href={`${basePath}/${nextSlug}`}
              className="group flex items-center gap-2 text-sm font-medium px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl hover:brightness-110 transition-all min-w-0"
            >
              <span className="truncate">Next Lesson: {nextTitle}</span>
              <span className="shrink-0 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <Link
              href={`${programPath}`}
              className="group flex items-center gap-2 text-sm font-medium px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <span>All Lessons</span>
              <span className="shrink-0 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
