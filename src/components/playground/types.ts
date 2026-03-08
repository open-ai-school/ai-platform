import type { GameCategory, GameDifficulty } from "./GameCard";

export interface GameEntry {
  id: string;
  name: string;
  desc: string;
  icon: string;
  component: React.ComponentType;
  difficulty: GameDifficulty;
  estimatedMinutes: number;
  category: GameCategory;
}

export type { GameCategory, GameDifficulty };
