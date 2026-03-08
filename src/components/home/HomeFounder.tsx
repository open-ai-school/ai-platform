"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ── Types ── */
interface SocialLink {
  label: string;
  href: string;
  iconPath: string;
}

interface FounderStat {
  value: string; // e.g. "15+" — number extracted for animation
  label: string;
}

interface HomeFounderProps {
  brainsTitle: string;
  name: string;
  role: string;
  description: string;
  stats: FounderStat[];
  ctaText: string;
  ctaHref: string;
  coffeeText: string;
  coffeeHref: string;
  socialLinks: SocialLink[];
  lightbulbSrc: string;
  avatarSrc: string;
}

/* ── Animated stat counter ── */
function AnimatedStat({ value, label }: FounderStat) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericMatch = value.match(/(\d+)/);
          if (!numericMatch) {
            setDisplayed(value);
            return;
          }
          const end = parseInt(numericMatch[1], 10);
          const suffix = value.replace(numericMatch[1], "");
          const start = performance.now();
          const duration = 1800;
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(eased * end) + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center p-3 rounded-xl bg-[var(--color-bg-section)]">
      <div className="text-2xl font-bold text-gradient">{displayed}</div>
      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</div>
    </div>
  );
}

/* ── Social icon with spring hover ── */
function SocialIcon({ link }: { link: SocialLink }) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
      aria-label={link.label}
      whileHover={{ scale: 1.2, rotate: 8 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={link.iconPath} />
      </svg>
    </motion.a>
  );
}

/* ── Container variants ── */
const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 as const, delayChildren: 0.2 as const } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

/* ── Main Component ── */
export default function HomeFounder({
  brainsTitle,
  name,
  role,
  description,
  stats,
  ctaText,
  ctaHref,
  coffeeText,
  coffeeHref,
  socialLinks,
  lightbulbSrc,
  avatarSrc,
}: HomeFounderProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={sectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 relative">
      {/* Section title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gradient flex items-center justify-center gap-3">
          <Image
            src={lightbulbSrc}
            alt=""
            width={32}
            height={32}
            className="inline-block"
          />
          {brainsTitle}
        </h2>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.15 }}
        className="rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-section)] border border-[var(--color-border)] shadow-2xl"
      >
        <div className="grid md:grid-cols-[300px_1fr] items-stretch">
          {/* Photo column — parallax */}
          <motion.div
            className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10 flex flex-col items-center justify-center text-center"
            style={{ y: photoY }}
          >
            <div className="relative mb-5">
              <motion.div
                className="absolute -inset-3 rounded-full bg-white/20 blur-xl"
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
              >
                <Image
                  src={avatarSrc}
                  alt={name}
                  width={512}
                  height={512}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>
            </div>
            <motion.h3
              className="text-xl md:text-2xl font-bold text-white mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            >
              {name}
            </motion.h3>
            <motion.p
              className="text-indigo-200 text-sm font-medium mb-5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {role}
            </motion.p>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, type: "spring", stiffness: 100, damping: 20 }}
            >
              {socialLinks.map((link) => (
                <SocialIcon key={link.label} link={link} />
              ))}
            </motion.div>
          </motion.div>

          {/* Content column — parallax */}
          <motion.div
            className="p-8 md:p-10 flex flex-col justify-center"
            style={{ y: textY }}
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.p
              className="text-[var(--color-text-muted)] leading-relaxed text-[17px] mb-6"
              variants={itemVariants}
            >
              {description}
            </motion.p>

            {/* Stats — animated counters */}
            <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={itemVariants}>
              {stats.map((stat) => (
                <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </motion.div>

            <motion.div className="flex items-center gap-4" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                >
                  {ctaText} →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a
                  href={coffeeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
                >
                  ☕ {coffeeText}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
