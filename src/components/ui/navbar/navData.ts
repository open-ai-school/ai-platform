import programsData from "@data/programs.json";

/* ─── Build program lists from registry ─── */

export interface NavProgram {
  slug: string;
  icon: string;
}

const AI_PATH_SLUGS = programsData.tracks.find((t) => t.slug === "ai-learning")?.programs ?? [];
const CRAFT_PATH_SLUGS = programsData.tracks.find((t) => t.slug === "craft-engineering")?.programs ?? [];

export function buildNavPrograms(slugs: string[]): NavProgram[] {
  return slugs.map((slug) => {
    const p = programsData.programs[slug as keyof typeof programsData.programs];
    return { slug, icon: p?.icon ?? "📚" };
  });
}

export const AI_PATH = buildNavPrograms(AI_PATH_SLUGS);
export const CRAFT_PATH = buildNavPrograms(CRAFT_PATH_SLUGS);

export const LAB_EXPERIMENTS = [
  { slug: "neural-playground", icon: "🧠" },
  { slug: "ai-or-human", icon: "🤖" },
  { slug: "prompt-lab", icon: "💬" },
  { slug: "image-gen", icon: "🎨" },
  { slug: "sentiment", icon: "😊" },
  { slug: "chatbot", icon: "💡" },
  { slug: "ethics-sim", icon: "⚖️" },
];
