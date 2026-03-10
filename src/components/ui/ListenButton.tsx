"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Volume2, Pause, Square } from "lucide-react";

/* Voice preference order per locale */
const LOCALE_LANGS: Record<string, string[]> = {
  en: ["en-GB", "en-US", "en"],
  fr: ["fr-FR", "fr"],
  nl: ["nl-NL", "nl-BE", "nl"],
  hi: ["hi-IN", "hi"],
  te: ["te-IN", "te"],
};

const PREMIUM_KEYWORDS = [
  "premium", "enhanced", "natural", "neural", "google",
  "samantha", "karen", "daniel", "moira", "fiona",
  "thomas", "amelie", "audrey",
];

function voiceScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;
  for (let i = 0; i < PREMIUM_KEYWORDS.length; i++) {
    if (name.includes(PREMIUM_KEYWORDS[i])) score += 20 - i;
  }
  if (!v.localService) score += 5;
  return score;
}

function cleanForSpeech(text: string): string {
  // eslint-disable-next-line no-misleading-character-class
  const emojiRe = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\uFE0F]/gu;
  return (
    text
      .replace(emojiRe, "")
      .replace(/[→←↑↓↔↕⇒⇐⇑⇓➜➤►▶◀▸▾▴«»]/g, "")
      .replace(/[•◦◉○●★☆✦✧✶✴✸❖◆◇■□▪▫♦♠♣♥♡]/g, "")
      // eslint-disable-next-line no-misleading-character-class
      .replace(/[✓✔✗✘✕✖❌❎⚠️℗©®™§¶†‡]/g, "")
      .replace(/[≈≠≤≥±∞∑∏∫∂√∆∇]/g, "")
      .replace(/[─━│┃═║╔╗╚╝┌┐└┘├┤┬┴┼…⋯|~`]/g, "")
      .replace(/  +/g, " ")
  );
}

function chunkText(text: string, maxLen = 400): string[] {
  const cleaned = cleanForSpeech(text);
  const paragraphs = cleaned
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
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);
    const pickBestVoice = () => {
      const all = speechSynthesis.getVoices();
      const langPrefixes = LOCALE_LANGS[locale] || [locale];
      const langFamily = locale.slice(0, 2);
      const matching = all
        .filter((v) => langPrefixes.some((l) => v.lang.startsWith(l)) || v.lang.startsWith(langFamily))
        .sort((a, b) => voiceScore(b) - voiceScore(a));
      voiceRef.current = matching[0] || null;
    };
    pickBestVoice();
    speechSynthesis.addEventListener("voiceschanged", pickBestVoice);
    return () => speechSynthesis.removeEventListener("voiceschanged", pickBestVoice);
  }, [locale]);

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
      if (voiceRef.current) utt.voice = voiceRef.current;
      utt.lang = LOCALE_LANGS[locale]?.[0] || locale;
      utt.rate = 0.95;
      utt.pitch = 1;
      utt.onend = () => speakChunk(index + 1);
      utt.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setState("idle");
          setProgress(0);
        }
      };
      speechSynthesis.speak(utt);
    },
    [locale],
  );

  const handlePlay = useCallback(() => {
    if (state === "playing") { speechSynthesis.pause(); setState("paused"); return; }
    if (state === "paused") { speechSynthesis.resume(); setState("playing"); return; }
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
      <button
        onClick={handlePlay}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          transition-all cursor-pointer min-h-[40px] hover:scale-[1.03] active:scale-[0.97]
          ${
            isActive
              ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
              : "border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }
        `}
        aria-label={
          state === "playing" ? t("pause") : state === "paused" ? t("resume") : t("listen")
        }
      >
        {state === "playing" ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span>
          {state === "playing" ? t("pause") : state === "paused" ? t("resume") : t("listen")}
        </span>
      </button>

      <div
        className="flex items-center gap-2 overflow-hidden"
        style={{
          opacity: isActive ? 1 : 0,
          width: isActive ? "auto" : 0,
          transition: "opacity 0.2s, width 0.2s",
        }}
      >
        {isActive && (
          <>
            <span className="text-xs text-[var(--color-text-muted)] tabular-nums whitespace-nowrap">
              {progress}%
            </span>
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-500 hover:border-red-400 hover:scale-110 active:scale-90 transition-all cursor-pointer"
              aria-label={t("stop")}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
