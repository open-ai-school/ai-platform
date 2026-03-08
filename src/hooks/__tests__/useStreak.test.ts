import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock next-auth/react before importing useStreak (it's not needed, but
// other hooks in the same codebase may pull it in via barrel exports).
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { useStreak } from '@/hooks/useStreak';

const STORAGE_KEY = 'aieducademy-streak';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function twoDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString().split('T')[0];
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useStreak', () => {
  it('starts with zero streaks when localStorage is empty', () => {
    const { result } = renderHook(() => useStreak());

    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });

  it('starts a new streak of 1 when recordStreak is called for the first time', () => {
    const { result } = renderHook(() => useStreak());

    act(() => {
      result.current.recordStreak();
    });

    expect(result.current.currentStreak).toBe(1);
    expect(result.current.longestStreak).toBe(1);
  });

  it('does not increment if recordStreak is called twice on the same day', () => {
    const { result } = renderHook(() => useStreak());

    act(() => {
      result.current.recordStreak();
    });
    act(() => {
      result.current.recordStreak();
    });

    expect(result.current.currentStreak).toBe(1);
  });

  it('continues a streak when last active was yesterday', () => {
    const stored = JSON.stringify({
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: yesterday(),
    });
    localStorage.setItem(STORAGE_KEY, stored);

    const { result } = renderHook(() => useStreak());

    // Initial load should preserve yesterday's streak
    expect(result.current.currentStreak).toBe(3);

    act(() => {
      result.current.recordStreak();
    });

    expect(result.current.currentStreak).toBe(4);
    expect(result.current.longestStreak).toBe(5);
  });

  it('resets current streak but keeps longest when gap > 1 day', () => {
    const stored = JSON.stringify({
      currentStreak: 10,
      longestStreak: 10,
      lastActiveDate: twoDaysAgo(),
    });
    localStorage.setItem(STORAGE_KEY, stored);

    const { result } = renderHook(() => useStreak());

    // Streak should have been reset on load due to gap
    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(10);
  });

  it('updates longestStreak when current exceeds it', () => {
    const stored = JSON.stringify({
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: yesterday(),
    });
    localStorage.setItem(STORAGE_KEY, stored);

    const { result } = renderHook(() => useStreak());

    act(() => {
      result.current.recordStreak();
    });

    expect(result.current.currentStreak).toBe(6);
    expect(result.current.longestStreak).toBe(6);
  });

  it('persists streak data to localStorage', () => {
    const { result } = renderHook(() => useStreak());

    act(() => {
      result.current.recordStreak();
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.currentStreak).toBe(1);
    expect(stored.longestStreak).toBe(1);
    expect(stored.lastActiveDate).toBe(today());
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json!!!');

    const { result } = renderHook(() => useStreak());

    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });
});
