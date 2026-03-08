"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause, Square, ChevronDown, Minus, Plus } from "lucide-react";

const STORAGE_KEY = "aieducademy-tts-prefs";

/* Voice preference order per locale */
const LOCALE_LANGS: Record<string, string[]> = {
  en: ["en-GB", "en-US", "en"],
  fr: ["fr-FR", "fr"],
  nl: ["nl-NL", "nl-BE", "nl"],
  hi: ["hi-IN", "hi"],
  te: ["te-IN", "te"],
};

/* Keywords that indicate premium / natural voices (ranked) */
const PREMIUM_KEYWORDS = [
  "premium", "enhanced", "natural", "neural", "google",
  "samantha", "karen", "daniel", "moira", "fiona",
  "thomas", "amelie", "audrey",
];

/** Score a voice — higher = better quality */
function voiceScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;
  for (let i = 0; i < PREMIUM_KEYWORDS.length; i++) {
    if (name.includes(PREMIUM_KEYWORDS[i])) score += 20 - i;
  }
  if (!v.localService) score += 5; // network voices tend to sound better
  return score;
}

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

/** Load saved preferences from localStorage */
function loadPrefs(): { voiceName?: string; rate: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { rate: 0.95 };
}

function savePrefs(prefs: { voiceName?: string; rate: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

interface ListenButtonProps {
  locale: string;
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.95);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get locale-matching voices sorted by quality
  const getLocaleVoices = useCallback(
    (allVoices: SpeechSynthesisVoice[]) => {
      const langPrefixes = LOCALE_LANGS[locale] || [locale];
      const langFamily = locale.slice(0, 2);
      return allVoices
        .filter((v) =>
          langPrefixes.some((l) => v.lang.startsWith(l)) ||
          v.lang.startsWith(langFamily)
        )
        .sort((a, b) => voiceScore(b) - voiceScore(a));
    },
    [locale],
  );

  // Check browser support, load voices and prefs
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);

    const prefs = loadPrefs();
    setRate(prefs.rate);

    const loadVoices = () => {
      const all = speechSynthesis.getVoices();
      const matching = getLocaleVoices(all);
      setVoices(matching);

      // Restore saved voice or pick best
      const saved = prefs.voiceName
        ? matching.find((v) => v.name === prefs.voiceName)
        : null;
      setSelectedVoice(saved || matching[0] || null);
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [getLocaleVoices]);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { speechSynthesis.cancel(); };
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
      if (selectedVoice) utt.voice = selectedVoice;
      utt.lang = LOCALE_LANGS[locale]?.[0] || locale;
      utt.rate = rate;
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
    [locale, selectedVoice, rate],
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

  const handleVoiceChange = useCallback(
    (voice: SpeechSynthesisVoice) => {
      setSelectedVoice(voice);
      savePrefs({ voiceName: voice.name, rate });
      // If currently playing, restart with new voice
      if (state === "playing" || state === "paused") {
        speechSynthesis.cancel();
        setState("idle");
        setProgress(0);
      }
      setShowSettings(false);
    },
    [rate, state],
  );

  const handleRateChange = useCallback(
    (delta: number) => {
      setRate((prev) => {
        const next = Math.round(Math.max(0.5, Math.min(1.5, prev + delta)) * 100) / 100;
        savePrefs({ voiceName: selectedVoice?.name, rate: next });
        return next;
      });
    },
    [selectedVoice],
  );

  if (!supported) return null;

  const isActive = state === "playing" || state === "paused";

  /** Friendly voice label: strip engine prefixes */
  const voiceLabel = (v: SpeechSynthesisVoice) => {
    const name = v.name
      .replace(/^(Google|Microsoft|Apple)\s+/i, "")
      .replace(/\s+Online.*$/i, "")
      .replace(/\s+\(.*\)$/, "");
    return name;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Play / Pause button */}
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
          state === "playing" ? t("pause") : state === "paused" ? t("resume") : t("listen")
        }
      >
        {state === "playing" ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span>
          {state === "playing" ? t("pause") : state === "paused" ? t("resume") : t("listen")}
        </span>
      </motion.button>

      {/* Voice picker toggle */}
      <div className="relative" ref={settingsRef}>
        <motion.button
          onClick={() => setShowSettings((p) => !p)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium
            border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)]
            hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer min-h-[40px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label={t("voice")}
        >
          <span className="max-w-[120px] truncate">
            {selectedVoice ? voiceLabel(selectedVoice) : t("voice")}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSettings ? "rotate-180" : ""}`} />
        </motion.button>

        {/* Settings dropdown */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="absolute left-0 top-full mt-2 z-50 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Voice list */}
              <div className="p-2 max-h-48 overflow-y-auto">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {t("voice")}
                </p>
                {voices.length === 0 && (
                  <p className="px-2 py-2 text-xs text-[var(--color-text-muted)]">
                    {t("noVoices")}
                  </p>
                )}
                {voices.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => handleVoiceChange(v)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
                      ${
                        selectedVoice?.name === v.name
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-text)] hover:bg-[var(--color-bg-section)]"
                      }
                    `}
                  >
                    <span className="block truncate">{voiceLabel(v)}</span>
                    <span className="block text-[10px] text-[var(--color-text-muted)]">
                      {v.lang}
                    </span>
                  </button>
                ))}
              </div>

              {/* Speed control */}
              <div className="border-t border-[var(--color-border)] px-3 py-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  {t("speed")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRateChange(-0.1)}
                    disabled={rate <= 0.5}
                    className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold tabular-nums w-10 text-center">
                    {rate.toFixed(1)}×
                  </span>
                  <button
                    onClick={() => handleRateChange(0.1)}
                    disabled={rate >= 1.5}
                    className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active controls: progress + stop */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs text-[var(--color-text-muted)] tabular-nums whitespace-nowrap">
              {progress}%
            </span>
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
