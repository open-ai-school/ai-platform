"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "framer-motion";

type MotionH = Omit<HTMLMotionProps<"h1">, "ref">;
type MotionP = Omit<HTMLMotionProps<"p">, "ref">;
type MotionUL = Omit<HTMLMotionProps<"ul">, "ref">;
type MotionOL = Omit<HTMLMotionProps<"ol">, "ref">;
type MotionBQ = Omit<HTMLMotionProps<"blockquote">, "ref">;
type MotionPre = Omit<HTMLMotionProps<"pre">, "ref">;

/* ── Shared animation config ── */
const VIEWPORT = { once: true, margin: "-60px" as const };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

/* ── Hook helper ── */
function useAnimProps(variants: Variants) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return {};
  return {
    variants,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: VIEWPORT,
  };
}

/* ── Animated MDX elements ── */

export function AnimatedH1(props: MotionH) {
  const anim = useAnimProps(slideLeft);
  return (
    <motion.h1
      className="text-3xl font-bold mt-8 mb-4 text-[var(--color-primary)]"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedH2(props: MotionH) {
  const anim = useAnimProps(slideLeft);
  return (
    <motion.h2
      className="text-2xl font-bold mt-8 mb-3"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedH3(props: MotionH) {
  const anim = useAnimProps(slideLeft);
  return (
    <motion.h3
      className="text-xl font-semibold mt-6 mb-2"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedP(props: MotionP) {
  const anim = useAnimProps(fadeIn);
  return (
    <motion.p
      className="text-lg leading-relaxed mb-4 text-[var(--color-text-muted)]"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedUL(props: MotionUL) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.ul
      className="list-disc list-inside space-y-2 mb-4 text-lg text-[var(--color-text-muted)]"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedOL(props: MotionOL) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.ol
      className="list-decimal list-inside space-y-2 mb-4 text-lg text-[var(--color-text-muted)]"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedBlockquote(props: MotionBQ) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.blockquote
      className="border-l-4 border-[var(--color-primary)] pl-4 py-2 my-4 bg-[var(--color-primary)]/5 rounded-r-lg italic text-lg"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedPre(props: MotionPre) {
  const anim = useAnimProps(scaleIn);
  return (
    <motion.pre
      className="bg-[#1e293b] text-[#e2e8f0] p-4 sm:p-6 rounded-xl overflow-x-auto my-6 text-sm shadow-lg shadow-black/20"
      {...anim}
      {...props}
    />
  );
}

export function AnimatedTable(props: React.HTMLAttributes<HTMLTableElement>) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.div
      className="overflow-x-auto my-6 rounded-xl border border-[var(--color-border)]"
      {...anim}
    >
      <table className="w-full text-sm" {...props} />
    </motion.div>
  );
}

export function AnimatedImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const anim = useAnimProps(scaleIn);
  return (
    <motion.span className="block my-8" {...anim}>
      <span className="block rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white">
        <Image
          src={String(props.src || "")}
          alt={props.alt || ""}
          width={720}
          height={280}
          className="w-full h-auto"
          unoptimized={String(props.src || "").endsWith(".svg")}
        />
      </span>
      {props.alt && (
        <span className="block text-center text-sm text-[var(--color-text-muted)] mt-3 italic">
          {props.alt}
        </span>
      )}
    </motion.span>
  );
}

export function AnimatedIllustration({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const anim = useAnimProps(scaleIn);
  return (
    <motion.figure className="my-8" {...anim}>
      <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={720}
          height={280}
          className="w-full h-auto"
          unoptimized={src.endsWith(".svg")}
        />
      </div>
      {(caption || alt) && (
        <figcaption className="text-center text-sm text-[var(--color-text-muted)] mt-3 italic">
          {caption || alt}
        </figcaption>
      )}
    </motion.figure>
  );
}

export function AnimatedCallout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning";
  children: React.ReactNode;
}) {
  const anim = useAnimProps(fadeUp);
  const styles = {
    info: "border-[var(--color-primary)] bg-[var(--color-primary)]/8",
    tip: "border-[var(--color-accent)] bg-[var(--color-accent)]/8",
    warning: "border-[var(--color-secondary)] bg-[var(--color-secondary)]/8",
  };
  const icons = { info: "💡", tip: "✅", warning: "⚠️" };
  return (
    <motion.div className={`border-l-4 p-5 my-6 rounded-r-xl ${styles[type]}`} {...anim}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{icons[type]}</span>
        <div className="text-[var(--color-text)] text-base leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}

export function AnimatedFunFact({ children }: { children: React.ReactNode }) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.div
      className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-6 my-6"
      {...anim}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🤯</span>
        <div className="text-[var(--color-text)]">{children}</div>
      </div>
    </motion.div>
  );
}

export function AnimatedThinkAboutIt({ children }: { children: React.ReactNode }) {
  const anim = useAnimProps(fadeUp);
  return (
    <motion.div
      className="bg-[var(--color-secondary)]/8 border border-[var(--color-secondary)]/20 rounded-2xl p-6 my-6"
      {...anim}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🤔</span>
        <div className="text-[var(--color-text)]">
          <strong className="block mb-1 text-[var(--color-secondary)]">Think about it:</strong>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
