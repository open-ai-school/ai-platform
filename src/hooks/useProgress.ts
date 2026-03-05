"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "open-ai-school-progress";

interface ProgramProgress {
  completed: string[];
  timestamps: Record<string, string>;
}

type ProgressData = Record<string, ProgramProgress>;

function emptyProgram(): ProgramProgress {
  return { completed: [], timestamps: {} };
}

function migrateOldFormat(stored: string): ProgressData {
  try {
    const parsed = JSON.parse(stored);
    // Old format: plain array of slugs
    if (Array.isArray(parsed)) {
      return { "ai-seeds": { completed: parsed, timestamps: {} } };
    }
    // Old format: { completed: [...], timestamps: {...} }
    if (parsed.completed && Array.isArray(parsed.completed)) {
      return { "ai-seeds": parsed as ProgramProgress };
    }
    // New format: already namespaced
    return parsed as ProgressData;
  } catch {
    return {};
  }
}

export function useProgress(programSlug?: string) {
  const [data, setData] = useState<ProgressData>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(migrateOldFormat(stored));
    }
  }, []);

  const getProgram = useCallback(
    (slug: string): ProgramProgress => data[slug] || emptyProgram(),
    [data]
  );

  const markComplete = useCallback((lessonKey: string) => {
    setData((prev) => {
      // lessonKey can be "programSlug/lessonSlug" or just "lessonSlug" (backward compat)
      const parts = lessonKey.split("/");
      const pSlug = parts.length > 1 ? parts[0] : (programSlug || "ai-seeds");
      const lSlug = parts.length > 1 ? parts.slice(1).join("/") : parts[0];

      const prog = prev[pSlug] || emptyProgram();
      if (prog.completed.includes(lSlug)) return prev;

      const next: ProgressData = {
        ...prev,
        [pSlug]: {
          completed: [...prog.completed, lSlug],
          timestamps: { ...prog.timestamps, [lSlug]: new Date().toISOString() },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [programSlug]);

  const isCompleted = useCallback(
    (lessonKey: string) => {
      const parts = lessonKey.split("/");
      const pSlug = parts.length > 1 ? parts[0] : (programSlug || "ai-seeds");
      const lSlug = parts.length > 1 ? parts.slice(1).join("/") : parts[0];
      return (data[pSlug]?.completed || []).includes(lSlug);
    },
    [data, programSlug]
  );

  const getCompletedAt = useCallback(
    (lessonKey: string) => {
      const parts = lessonKey.split("/");
      const pSlug = parts.length > 1 ? parts[0] : (programSlug || "ai-seeds");
      const lSlug = parts.length > 1 ? parts.slice(1).join("/") : parts[0];
      return data[pSlug]?.timestamps[lSlug] || null;
    },
    [data, programSlug]
  );

  const reset = useCallback(() => {
    setData({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Per-program counts
  const prog = programSlug ? getProgram(programSlug) : null;
  const completed = prog ? prog.completed : Object.values(data).flatMap((p) => p.completed);
  const completedCount = completed.length;

  // Total across all programs
  const totalCompleted = Object.values(data).reduce((sum, p) => sum + p.completed.length, 0);

  return {
    completed,
    completedCount,
    totalCompleted,
    markComplete,
    isCompleted,
    getCompletedAt,
    getProgram,
    allData: data,
    reset,
  };
}
