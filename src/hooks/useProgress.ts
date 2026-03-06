"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "open-ai-school-progress";
const SESSION_KEY = "open-ai-school-session";

interface ProgramProgress {
  completed: string[];
  timestamps: Record<string, string>;
}

type ProgressData = Record<string, ProgramProgress>;

function emptyProgram(): ProgramProgress {
  return { completed: [], timestamps: {} };
}

function getStorageKey(): string {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.username) return `${STORAGE_PREFIX}-${parsed.username}`;
    }
  } catch { /* ignore */ }
  return `${STORAGE_PREFIX}-guest`;
}

function migrateOldFormat(stored: string): ProgressData {
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return { "ai-seeds": { completed: parsed, timestamps: {} } };
    }
    if (parsed.completed && Array.isArray(parsed.completed)) {
      return { "ai-seeds": parsed as ProgramProgress };
    }
    return parsed as ProgressData;
  } catch {
    return {};
  }
}

// Migrate legacy global key to user-scoped key on first load
function migrateGlobalKey() {
  const legacy = localStorage.getItem(STORAGE_PREFIX);
  if (!legacy) return;
  const userKey = getStorageKey();
  if (!localStorage.getItem(userKey)) {
    localStorage.setItem(userKey, legacy);
  }
  localStorage.removeItem(STORAGE_PREFIX);
}

export function useProgress(programSlug?: string) {
  const [data, setData] = useState<ProgressData>({});
  const [storageKey, setStorageKey] = useState<string>(`${STORAGE_PREFIX}-guest`);

  useEffect(() => {
    migrateGlobalKey();
    const key = getStorageKey();
    setStorageKey(key);
    const stored = localStorage.getItem(key);
    if (stored) {
      setData(migrateOldFormat(stored));
    } else {
      setData({});
    }
  }, []);

  const getProgram = useCallback(
    (slug: string): ProgramProgress => data[slug] || emptyProgram(),
    [data]
  );

  const markComplete = useCallback((lessonKey: string) => {
    setData((prev) => {
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
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [programSlug, storageKey]);

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
    localStorage.removeItem(storageKey);
  }, [storageKey]);

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
