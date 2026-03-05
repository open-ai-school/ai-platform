"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Animation = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
  stagger?: boolean;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  stagger = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${stagger ? "stagger-children" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        animation: isVisible
          ? `${animation} 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
          : "none",
      }}
    >
      {children}
    </div>
  );
}
