"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Brain,
  Bot,
  Sparkles,
  ImageIcon,
  Heart,
  MessageSquare,
  Scale,
  ArrowRight,
  Terminal,
} from "lucide-react";

interface Experiment {
  name: string;
  icon: typeof Brain;
  description: string;
  codePreview: string[];
}

interface HomeLabPreviewProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  experiments: {
    name: string;
    description: string;
  }[];
}

const EXPERIMENT_ICONS: (typeof Brain)[] = [
  Brain,
  Bot,
  Sparkles,
  ImageIcon,
  Heart,
  MessageSquare,
  Scale,
];

const CODE_PREVIEWS: string[][] = [
  [
    "// Neural Playground",
    "const network = new NeuralNetwork([2, 4, 1]);",
    "network.train(data, { epochs: 100 });",
    "const prediction = network.predict([0.5, 0.8]);",
    "console.log('Output:', prediction); // → 0.73",
  ],
  [
    "// AI or Human?",
    "const texts = ['Hello world', 'Greetings human'];",
    "const result = classifier.predict(texts);",
    "result.forEach(r =>",
    "  console.log(`${r.text}: ${r.label}`)",
    ");",
  ],
  [
    "// Prompt Engineering",
    "const prompt = buildPrompt({",
    "  role: 'assistant',",
    "  context: 'AI education platform',",
    "  task: 'Explain neural networks'",
    "});",
  ],
  [
    "// Image Generation",
    "const image = await generate({",
    "  prompt: 'a cat astronaut',",
    "  style: 'digital-art',",
    "  size: '512x512'",
    "});",
  ],
  [
    "// Sentiment Analysis",
    "const sentiment = analyze(",
    "  'This course is amazing!'",
    ");",
    "// → { score: 0.95, label: 'positive' }",
  ],
  [
    "// AI Chat",
    "const chat = new ChatSession();",
    "const response = await chat.send(",
    "  'What is machine learning?'",
    ");",
    "console.log(response.text);",
  ],
  [
    "// Ethics Scenarios",
    "const scenario = loadScenario('bias');",
    "const analysis = evaluateDecision({",
    "  fairness: 0.85,",
    "  transparency: 0.92",
    "});",
  ],
];

export default function HomeLabPreview({
  title,
  subtitle,
  ctaText,
  ctaHref,
  experiments,
}: HomeLabPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ margin: "-80px" });
  const reduced = useReducedMotion();

  const handleHover = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const activeIcon = EXPERIMENT_ICONS[activeIndex] ?? Brain;
  const ActiveIconComponent = activeIcon;
  const activeCode = CODE_PREVIEWS[activeIndex] ?? CODE_PREVIEWS[0];

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-12"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gradient-animated">
            {title}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Content grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          style={{
            opacity: sectionInView || reduced ? 1 : 0,
            transform: sectionInView || reduced ? "translateY(0)" : "translateY(30px)",
            transition: reduced ? "none" : "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 200ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 200ms",
          }}
        >
          {/* Left: Terminal preview */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden shadow-lg">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-glass)]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex items-center gap-1.5 ml-2 text-xs text-[var(--color-text-muted)]">
                <Terminal size={12} />
                <span>ai-lab</span>
              </div>
            </div>

            {/* Code area */}
            <div className="p-5 min-h-[220px] bg-[var(--color-code-bg)] font-mono text-sm">
              {activeCode.map((line, i) => (
                <div
                  key={`${activeIndex}-${i}`}
                  className="text-[var(--color-code-text)] leading-7"
                  style={{
                    opacity: sectionInView || reduced ? 1 : 0,
                    transition: reduced ? "none" : `opacity 0.3s ease ${i * 60}ms`,
                  }}
                >
                  <span className="text-[var(--color-text-muted)]/50 mr-3 select-none text-xs">
                    {String(i + 1).padStart(2, " ")}
                  </span>
                  {line.startsWith("//") ? (
                    <span className="text-emerald-400/70">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
              {/* Blinking cursor */}
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[var(--color-text-muted)]/50 mr-3 select-none text-xs">
                  {" >"}</span>
                <span className="w-2 h-4 bg-[var(--color-primary)] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Experiment list */}
          <div className="space-y-3">
            {experiments.map((exp, i) => {
              const Icon = EXPERIMENT_ICONS[i] ?? Brain;
              const isActive = i === activeIndex;

              return (
                <button
                  key={i}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-300 group ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md shadow-[var(--color-primary)]/10"
                      : "border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-primary)]/50"
                  }`}
                  style={{
                    opacity: sectionInView || reduced ? 1 : 0,
                    transform: sectionInView || reduced ? "translateX(0)" : "translateX(20px)",
                    transition: reduced
                      ? "none"
                      : `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, border-color 0.3s, background-color 0.3s, box-shadow 0.3s`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[var(--color-text)]">
                        {exp.name}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {exp.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "text-[var(--color-primary)] translate-x-0 opacity-100"
                          : "text-[var(--color-text-muted)] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {/* CTA */}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {ctaText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
