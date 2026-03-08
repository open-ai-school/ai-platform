import { STORAGE_KEY } from "./types";
import type { SavedCanvas } from "./types";

/* ── persistence helpers ──────────────────────────────────────── */
export function getUserKey(session: { user?: { email?: string | null; name?: string | null } } | null): string {
  const id = session?.user?.email || session?.user?.name || "guest";
  return `${STORAGE_KEY}-${id}`;
}

export function loadCanvases(key: string): SavedCanvas[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { /* invalid saved data */ return []; }
}

export function saveCanvases(key: string, canvases: SavedCanvas[]) {
  localStorage.setItem(key, JSON.stringify(canvases));
}
