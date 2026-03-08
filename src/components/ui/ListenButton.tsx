"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause, Square } from "lucide-react";

/* Voice preference order per locale */
const LOCALE_LANGS: Record<string, string[]> = {
  en: ["en-GB", "en-US", "en"],
  fr: ["fr-FR", "fr"],
  nl: ["nl-NL", "nl-BE", "nl"],
  hi: ["hi-IN", "hi"],
  te: ["te-IN", "te"],
};

/** Split text into speakable chunks — paragraphs, then sentences if too long */
function chunkText(text: string, maxLen = 400): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  for (const para of paragraphs) {
    if (para.length <= maxLen) {
      chunks.push(para);
    } else {
      // Split long paragraphs by sentence boundaries
      const sentences = para.match(/[^.!?]+[.!?]+\s*/g) || [para];
      let current = "";
      for (const s of sentences) {
        if ((current + s).length > maxLen && current) {
          chunks.push(current.trim());
          current = s;
        } else {
          current += s;
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }
  }
  return chunks;
}

interface ListenButtonProps {
  locale: string;
  /** CSS selector for the content container. Defaults to ".lesson-content" */
  contentSelector?: string;
}

export function ListenButton({
  locale,
  contentSelector = ".lesson-content",
}: ListenButtonProps) {
  const t = useTranslations("listen");
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Check browser support and find best voice
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      const preferred = LOCALE_LANGS[locale] || [locale];
      for (const lang of preferred) {
        const match = voices.find((v) => v.lang.startsWith(lang));
        if (match) {
          voiceRef.current = match;
          return;
        }
      }
      // Fallback: any voice for this locale's language family
      const fallback = voices.find((v) => v.lang.startsWith(locale.slice(0, 2)));
      if (fallback) voiceRef.current = fallback;
    };

    pickVoice();
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, [locale]);

  // Cleanup on unmount / page navigation
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speakChunk = useCallback(
    (index: number) => {
      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        setState("idle");
        setProgress(0);
        currentChunkRef.current = 0;
        return;
      }

      currentChunkRef.current = index;
      setProgress(Math.round(((index + 1) / chunks.length) * 100));

      const utt = new SpeechSynthesisUtterance(chunks[index]);
      if (voiceRef.current) utt.voice = voiceRef.current;
      utt.lang = LOCALE_LANGS[locale]?.[0] || locale;
      utt.rate = 1;
      utt.pitch = 1;

      utt.onend = () => speakChunk(index + 1);
      utt.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setState("idle");
          setProgress(0);
        }
      };

      utteranceRef.current = utt;
      speechSynthesis.speak(utt);
    },
    [locale],
  );

  const handlePlay = useCallback(() => {
    if (state === "playing") {
      speechSynthesis.pause();
      setState("paused");
      return;
    }

    if (state === "paused") {
      speechSynthesis.resume();
      setState("playing");
      return;
    }

    // Fresh start — extract text from DOM
    const el = document.querySelector(contentSelector);
    if (!el) return;

    const text = el.textContent || "";
    if (!text.trim()) return;

    const chunks = chunkText(text);
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    currentChunkRef.current = 0;
    speechSynthesis.cancel();
    setState("playing");
    speakChunk(0);
  }, [state, contentSelector, speakChunk]);

  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setState("idle");
    setProgress(0);
    currentChunkRef.current = 0;
  }, []);

  if (!supported) return null;

  const isActive = state === "playing" || state === "paused";

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={handlePlay}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          transition-colors cursor-pointer min-h-[40px]
          ${
            isActive
              ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
              : "border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }
        `}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label={
          state === "playing"
            ? t("pause")
            : state === "paused"
              ? t("resume")
              : t("listen")
        }
      >
        {state === "playing" ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span>
          {state === "playing"
            ? t("pause")
            : state === "paused"
              ? t("resume")
              : t("listen")}
        </span>
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress pill */}
            <span className="text-xs text-[var(--color-text-muted)] tabular-nums whitespace-nowrap">
              {progress}%
            </span>

            {/* Stop button */}
            <motion.button
              onClick={handleStop}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-500 hover:border-red-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t("stop")}
            >
              <Square className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
