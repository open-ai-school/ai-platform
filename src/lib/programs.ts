import programsData from "@data/programs.json";

export interface ProgramMeta {
  slug: string;
  level: number;
  color: string;
  icon: string;
  track: string;
  estimatedHours: number;
}

export interface TrackMeta {
  slug: string;
  icon: string;
  programs: string[];
}

export function getPrograms(): ProgramMeta[] {
  return Object.entries(programsData.programs)
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => a.level - b.level);
}

export function getProgramsByTrack(track: string): ProgramMeta[] {
  return getPrograms().filter((p) => p.track === track);
}

export function getProgram(slug: string): ProgramMeta | null {
  const data = programsData.programs[slug as keyof typeof programsData.programs];
  return data ? { slug, ...data } : null;
}

export function getTracks(): TrackMeta[] {
  return programsData.tracks;
}
