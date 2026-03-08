export { NeuralNetworkPlayground } from "./games/NeuralNetworkPlayground";
export { PromptEngineeringDojo } from "./games/PromptEngineeringDojo";
export { AlgorithmVisualizer } from "./games/AlgorithmVisualizer";
export type { GameEntry } from "./types";

import { NeuralNetworkPlayground } from "./games/NeuralNetworkPlayground";
import { PromptEngineeringDojo } from "./games/PromptEngineeringDojo";
import { AlgorithmVisualizer } from "./games/AlgorithmVisualizer";
import AITriviaChallenge from "./AITriviaChallenge";
import { SystemDesignCanvas } from "./system-design";
import type { GameEntry } from "./types";

export const ALL_GAMES: GameEntry[] = [
  { id: "neural-network", name: "gameNeuralName", desc: "gameNeuralDesc", icon: "🧬", component: NeuralNetworkPlayground, difficulty: "medium", estimatedMinutes: 5, category: "creative" },
  { id: "prompt-dojo", name: "gamePromptName", desc: "gamePromptDesc", icon: "🥋", component: PromptEngineeringDojo, difficulty: "hard", estimatedMinutes: 5, category: "knowledge" },
  { id: "algo-race", name: "gameAlgoName", desc: "gameAlgoDesc", icon: "🏁", component: AlgorithmVisualizer, difficulty: "easy", estimatedMinutes: 3, category: "quick" },
  { id: "ai-trivia", name: "gameTriviaName", desc: "gameTriviaDesc", icon: "🧠", component: AITriviaChallenge, difficulty: "medium", estimatedMinutes: 4, category: "knowledge" },
  { id: "system-design", name: "gameDesignName", desc: "gameDesignDesc", icon: "🏗️", component: SystemDesignCanvas, difficulty: "medium", estimatedMinutes: 10, category: "quick" },
];
