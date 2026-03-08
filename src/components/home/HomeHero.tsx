"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { CourseProgress } from "@ai-educademy/ai-ui-library";

interface HomeHeroProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
  basePath: string;
  totalLessons: number;
}

/* ── Typewriter ── */
function Typewriter({ text, delay = 30 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, delay);
    return () => clearInterval(id);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  );
}

/* ── Floating Orb ── */
function FloatingOrb({
  size,
  color,
  initialX,
  initialY,
  mouseX,
  mouseY,
  parallaxFactor,
}: {
  size: number;
  color: string;
  initialX: string;
  initialY: string;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  parallaxFactor: number;
}) {
  const x = useSpring(0, { stiffness: 50, damping: 30 });
  const y = useSpring(0, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const unsubX = mouseX.on("change", (v) => x.set(v * parallaxFactor));
    const unsubY = mouseY.on("change", (v) => y.set(v * parallaxFactor));
    return () => { unsubX(); unsubY(); };
  }, [mouseX, mouseY, x, y, parallaxFactor]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-2xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: initialX,
        top: initialY,
        x,
        y,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ── Animated Stat Counter ── */
function StatCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 2000;
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Shimmer Button ── */
function ShimmerButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={`
          relative overflow-hidden inline-block px-10 py-4 rounded-2xl text-lg font-bold transition-all
          ${
            isPrimary
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
              : "border-2 border-[var(--color-border)] hover:border-indigo-500 hover:text-indigo-500 backdrop-blur-sm hover:shadow-lg"
          }
        `}
      >
        <span className="relative z-10">{children}</span>
        {isPrimary && (
          <span className="absolute inset-0 shimmer-sweep pointer-events-none" />
        )}
      </Link>
    </motion.div>
  );
}

/* ── Main Hero ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function HomeHero({
  title,
  titleHighlight,
  subtitle,
  ctaText,
  ctaHref,
  ctaSecondaryText,
  ctaSecondaryHref,
  basePath,
  totalLessons,
}: HomeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    },
    [mouseX, mouseY]
  );

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">
      {/* Floating orbs */}
      <FloatingOrb size={200} color="rgba(99,102,241,0.12)" initialX="10%" initialY="20%" mouseX={mouseX} mouseY={mouseY} parallaxFactor={40} />
      <FloatingOrb size={150} color="rgba(168,85,247,0.10)" initialX="75%" initialY="15%" mouseX={mouseX} mouseY={mouseY} parallaxFactor={-30} />
      <FloatingOrb size={120} color="rgba(236,72,153,0.08)" initialX="60%" initialY="70%" mouseX={mouseX} mouseY={mouseY} parallaxFactor={25} />
      <FloatingOrb size={100} color="rgba(16,185,129,0.08)" initialX="20%" initialY="75%" mouseX={mouseX} mouseY={mouseY} parallaxFactor={-20} />

      <motion.div
        className="text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Image
            src="https://avatars.githubusercontent.com/u/265648179?v=4"
            alt="AI Educademy"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-2xl shadow-lg"
            unoptimized
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6"
          variants={itemVariants}
        >
          <span className="block">{title}</span>
          <span className="block text-gradient">{titleHighlight}</span>
        </motion.h1>

        {/* Subtitle — typewriter */}
        <motion.p
          className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8 leading-relaxed"
          variants={itemVariants}
        >
          <Typewriter text={subtitle} delay={25} />
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <ShimmerButton href={ctaHref} variant="primary">
            {ctaText} →
          </ShimmerButton>
          <ShimmerButton href={ctaSecondaryHref} variant="secondary">
            {ctaSecondaryText} →
          </ShimmerButton>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-10 text-sm text-[var(--color-text-muted)]"
          variants={itemVariants}
        >
          {[
            { end: 100, suffix: "+", label: "Lessons" },
            { end: 5, suffix: "", label: "Programs" },
            { end: 2, suffix: "", label: "Tracks" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xl font-bold text-gradient">
                <StatCounter end={stat.end} suffix={stat.suffix} />
              </span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Course progress */}
        <motion.div variants={itemVariants}>
          <CourseProgress totalLessons={totalLessons} basePath={basePath} />
        </motion.div>
      </motion.div>
    </div>
  );
}
