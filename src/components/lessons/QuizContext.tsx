'use client';

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

type QuizState = {
  registered: Set<string>;
  passed: Set<string>;
};

type QuizContextType = {
  registerQuiz: (id: string) => void;
  markQuizPassed: (id: string) => void;
  allQuizzesPassed: boolean;
  totalQuizzes: number;
  passedQuizzes: number;
};

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>({
    registered: new Set(),
    passed: new Set(),
  });

  const registerQuiz = useCallback((id: string) => {
    setState((prev) => {
      if (prev.registered.has(id)) return prev;
      const next = new Set(prev.registered);
      next.add(id);
      return { ...prev, registered: next };
    });
  }, []);

  const markQuizPassed = useCallback((id: string) => {
    setState((prev) => {
      if (prev.passed.has(id)) return prev;
      const next = new Set(prev.passed);
      next.add(id);
      return { ...prev, passed: next };
    });
  }, []);

  const value = useMemo<QuizContextType>(() => {
    const total = state.registered.size;
    const passed = state.passed.size;
    return {
      registerQuiz,
      markQuizPassed,
      allQuizzesPassed: total === 0 || passed >= total,
      totalQuizzes: total,
      passedQuizzes: passed,
    };
  }, [state, registerQuiz, markQuizPassed]);

  return <QuizContext value={value}>{children}</QuizContext>;
}

export function useQuizContext(): QuizContextType {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    // Fallback for quizzes rendered outside a provider (e.g. previews)
    return {
      registerQuiz: () => {},
      markQuizPassed: () => {},
      allQuizzesPassed: true,
      totalQuizzes: 0,
      passedQuizzes: 0,
    };
  }
  return ctx;
}
