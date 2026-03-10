import { useState, useEffect, useRef, type RefObject } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: { margin?: string; once?: boolean }
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const once = options?.once ?? true;
  const margin = options?.margin ?? "-60px";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, margin]);

  return [ref, isInView];
}
