import { getTracks as getTracksFromPrograms, type TrackMeta } from "./programs";

export type { TrackMeta };

export function getTracks(): TrackMeta[] {
  return getTracksFromPrograms();
}

export function getTrack(slug: string): TrackMeta | null {
  return getTracks().find((t) => t.slug === slug) || null;
}
