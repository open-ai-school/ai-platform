import fs from "fs";
import path from "path";

export interface TrackMeta {
  slug: string;
  title: string;
  icon: string;
  description: string;
  tagline: string;
  brand: string;
  order: number;
}

const tracksPath = path.join(process.cwd(), "content", "tracks.json");

export function getTracks(): TrackMeta[] {
  if (!fs.existsSync(tracksPath)) return [];
  const data = JSON.parse(fs.readFileSync(tracksPath, "utf-8"));
  return (data.tracks as TrackMeta[]).sort((a, b) => a.order - b.order);
}

export function getTrack(slug: string): TrackMeta | null {
  return getTracks().find((t) => t.slug === slug) || null;
}
