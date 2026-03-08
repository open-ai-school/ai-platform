"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ClickableCard } from "@/components/ui/ClickableCard";
import { ComingSoonCard } from "@/components/ui/ComingSoon";

/* ── Types ── */
interface ProgramInfo {
  slug: string;
  icon: string;
  title: string;
  color: string;
  active: boolean;
  level: number;
}

interface TrackCardProps {
  trackIcon: string;
  trackTitle: string;
  trackDesc: string;
  programs: ProgramInfo[];
  programTitles: Record<string, string>;
  firstLessonSlugs: Record<string, string | undefined>;
  lessonNames: Record<string, string[]>;
  basePath: string;
  href: string;
  delay?: number;
}

interface HomeProgramCardsProps {
  sectionTitle: string;
  sectionSubtitle: string;
  trackAI: TrackCardProps;
  trackCraft: TrackCardProps;
  viewAllText: string;
  viewAllHref: string;
}

/* ── 3D Tilt Card ── */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      className={`card-3d cursor-glow ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => { handleMouseMove(e); setIsHovered(true); }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor glow overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{
            background: `radial-gradient(300px circle at ${glowPos.x}px ${glowPos.y}px, var(--color-primary-glow), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

/* ── Program Mini Card (with expanding lessons) ── */
function ProgramMiniCard({
  program,
  href,
  title,
  lessons,
  index,
}: {
  program: ProgramInfo;
  href: string;
  title: string;
  lessons: string[];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 200, damping: 25 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block group relative">
        <motion.div
          className="text-center p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
          style={{ borderLeftColor: program.color, borderLeftWidth: 3 }}
          whileHover={{ scale: 1.08, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className="text-2xl mb-1">{program.icon}</div>
          <div className="text-[10px] font-bold truncate">{title}</div>
        </motion.div>
      </Link>

      {/* Expanding lesson preview */}
      <motion.div
        className="absolute top-full left-1/2 z-30 mt-2 w-48 origin-top"
        style={{ x: "-50%" }}
        initial={false}
        animate={
          isHovered && lessons.length > 0
            ? { opacity: 1, scaleY: 1, y: 0 }
            : { opacity: 0, scaleY: 0.8, y: -8 }
        }
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl p-2 space-y-1">
          {lessons.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
              className="text-[10px] text-[var(--color-text-muted)] truncate px-2 py-1 rounded hover:bg-[var(--color-primary)]/10"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Track Card ── */
function TrackCard({ data }: { data: TrackCardProps }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: data.delay ? data.delay / 1000 : 0,
      }}
    >
      <ClickableCard href={data.href} className="block h-full">
        <TiltCard className="relative rounded-2xl h-full">
          <div className="gradient-border rounded-2xl h-full">
            <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 h-full relative z-20">
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {data.trackIcon}
                </motion.span>
                <h3 className="text-xl font-bold">{data.trackTitle}</h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                {data.trackDesc}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {data.programs.map((program, idx) => {
                  const href = data.firstLessonSlugs[program.slug]
                    ? `${data.basePath}/programs/${program.slug}/lessons/${data.firstLessonSlugs[program.slug]}`
                    : `${data.basePath}/programs/${program.slug}`;
                  const lessons = data.lessonNames[program.slug] || [];
                  const title = (data.programTitles[program.slug] || "").replace("AI ", "");

                  return program.active ? (
                    <ProgramMiniCard
                      key={program.slug}
                      program={program}
                      href={href}
                      title={title}
                      lessons={lessons}
                      index={idx}
                    />
                  ) : (
                    <ComingSoonCard
                      key={program.slug}
                      icon={program.icon}
                      label={title}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </TiltCard>
      </ClickableCard>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function HomeProgramCards({
  sectionTitle,
  sectionSubtitle,
  trackAI,
  trackCraft,
  viewAllText,
  viewAllHref,
}: HomeProgramCardsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const linkRef = useRef<HTMLDivElement>(null);
  const linkInView = useInView(linkRef, { once: true, margin: "-40px" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{sectionTitle}</h2>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          {sectionSubtitle}
        </p>
      </motion.div>

      {/* Track cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <TrackCard data={trackAI} />
        <TrackCard data={{ ...trackCraft, delay: 100 }} />
      </div>

      {/* View all link */}
      <motion.div
        ref={linkRef}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={linkInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
      >
        <Link
          href={viewAllHref}
          className="text-[var(--color-primary)] font-semibold hover:underline"
        >
          {viewAllText} →
        </Link>
      </motion.div>
    </div>
  );
}
