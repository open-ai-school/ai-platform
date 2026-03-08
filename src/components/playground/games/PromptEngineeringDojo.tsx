"use client";

import { useState, useRef, memo } from "react";
import { useTranslations } from "next-intl";
import type { DynamicTranslate } from "@/lib/i18n-utils";
import { GameShell, StatusBar, GameOverScreen } from "../shared";
import { PROMPT_CHALLENGES, scorePrompt } from "../utils/promptChallenges";

export const PromptEngineeringDojo = memo(() => {
  const tp = useTranslations("lab.playground");
  const tpd = tp as unknown as DynamicTranslate;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ score: number; feedbackKey: string; simulatedResponse: string } | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const challenge = PROMPT_CHALLENGES[currentIdx];

  const handleSubmit = () => {
    if (!input.trim() || result) return;
    const r = scorePrompt(input, challenge);
    setResult(r);
    setScores(prev => [...prev, r.score]);

    // Typewriter effect for response
    setTyping(true);
    setDisplayedResponse("");
    let i = 0;
    const text = r.simulatedResponse;
    const interval = setInterval(() => {
      i++;
      setDisplayedResponse(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 15);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= PROMPT_CHALLENGES.length) {
      setGameOver(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setInput("");
      setResult(null);
      setDisplayedResponse("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setInput("");
    setResult(null);
    setScores([]);
    setGameOver(false);
    setDisplayedResponse("");
  };

  if (gameOver) {
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return <GameOverScreen emoji={avg >= 70 ? "🥋" : avg >= 40 ? "📝" : "🔰"} stat={`${avg}%`} label={tp("avgScoreLabel", { count: scores.length })} onReplay={reset} replayText={tp("playAgain")} />;
  }

  return (
    <GameShell title={tp("promptTitle")} icon="🥋">
      <style>{`
        @keyframes dojo-cursor { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .dojo-cursor::after { content: "▌"; animation: dojo-cursor 0.8s step-end infinite; color: var(--color-primary); }
      `}</style>

      <StatusBar
        left={<span className="font-mono">{tp("challengeLabel", { current: currentIdx + 1, total: PROMPT_CHALLENGES.length })} <span className="text-amber-400">[{challenge.difficulty}]</span></span>}
        right={scores.length > 0 ? <span className="font-mono">AVG: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%</span> : undefined}
      />

      {/* Mission briefing */}
      <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">{tp("missionLabel")}</span>
        </div>
        <p className="text-sm font-mono text-[var(--color-text)]">{challenge.context}</p>
      </div>

      {/* Target output */}
      <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">{tp("targetOutputLabel")}</span>
        </div>
        <pre className="text-xs font-mono text-[var(--color-text-muted)] whitespace-pre-wrap leading-relaxed">{challenge.target}</pre>
      </div>

      {/* Prompt input */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-section)]">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{tp("promptFile")}</span>
        </div>
        <div className="p-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            disabled={!!result}
            placeholder={tp("promptPlaceholder")}
            rows={3}
            className="w-full bg-transparent font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 resize-none focus:outline-none"
          />
        </div>
        {!result && (
          <div className="flex justify-end px-3 pb-3">
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-4 py-1.5 rounded-lg font-mono text-xs font-bold border border-[var(--color-primary)]/50 text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ▶ {tp("submit")}
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {/* Simulated AI response */}
          <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">{tp("aiResponseLabel")}</span>
            </div>
            <pre className={`text-xs font-mono text-[var(--color-text)] whitespace-pre-wrap leading-relaxed ${typing ? "dojo-cursor" : ""}`}>
              {displayedResponse}
            </pre>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)]">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-2xl font-bold" style={{ color: result.score >= 70 ? "#00FF88" : result.score >= 40 ? "#FBBF24" : "#EF4444" }}>
                  {result.score}%
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${result.score}%`,
                      background: result.score >= 70 ? "#00FF88" : result.score >= 40 ? "#FBBF24" : "#EF4444",
                    }}
                  />
                </div>
              </div>
              <p className="text-xs font-mono text-[var(--color-text-muted)]">{tpd(result.feedbackKey)}</p>
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs font-mono text-amber-300/80">{challenge.tips}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg font-mono text-xs font-bold border border-[var(--color-primary)]/50 text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-all"
            >
              {currentIdx + 1 >= PROMPT_CHALLENGES.length ? `${tp("seeResults")} →` : `${tp("nextChallenge")} →`}
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
});
