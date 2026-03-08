export interface PromptChallenge {
  id: number;
  target: string;
  context: string;
  keywords: string[];
  bonusKeywords: string[];
  tips: string;
  difficulty: string;
}

export const PROMPT_CHALLENGES: PromptChallenge[] = [
  {
    id: 1, difficulty: "EASY",
    context: "You want the AI to explain what machine learning is.",
    target: "Machine learning is a subset of artificial intelligence where computers learn patterns from data without being explicitly programmed. Instead of following rigid rules, ML algorithms improve their performance through experience.",
    keywords: ["explain", "machine learning", "simple", "what"],
    bonusKeywords: ["beginner", "definition", "clear", "brief"],
    tips: "💡 Tip: Be specific about format. 'Explain X in simple terms' works better than just asking 'What is X?'",
  },
  {
    id: 2, difficulty: "EASY",
    context: "You want the AI to list exactly 3 benefits of open-source software.",
    target: "1. Transparency - anyone can inspect the code for security and quality.\n2. Community - thousands of developers contribute improvements.\n3. Cost - no licensing fees, reducing barriers to entry.",
    keywords: ["list", "3", "benefits", "open-source"],
    bonusKeywords: ["numbered", "concise", "exactly", "software"],
    tips: "💡 Tip: Specify exact quantities. 'List exactly 3' is much better than 'List some'. Constrain the output format.",
  },
  {
    id: 3, difficulty: "MEDIUM",
    context: "You want the AI to write a Python function that reverses a string.",
    target: "```python\ndef reverse_string(s: str) -> str:\n    return s[::-1]\n```",
    keywords: ["python", "function", "reverse", "string"],
    bonusKeywords: ["type hint", "concise", "code", "return"],
    tips: "💡 Tip: Specify the programming language, function signature expectations, and coding style (concise vs. verbose).",
  },
  {
    id: 4, difficulty: "MEDIUM",
    context: "You want the AI to compare transformers and RNNs, focusing on parallelization.",
    target: "Transformers process all tokens simultaneously via self-attention, enabling massive parallelization on GPUs. RNNs process tokens sequentially, creating a bottleneck. This is why transformer-based models like GPT train orders of magnitude faster.",
    keywords: ["compare", "transformer", "rnn", "parallel"],
    bonusKeywords: ["attention", "sequential", "gpu", "difference", "speed"],
    tips: "💡 Tip: Tell the AI what angle to focus on. 'Compare X and Y focusing on Z' narrows the response to what you actually need.",
  },
  {
    id: 5, difficulty: "HARD",
    context: "You want the AI to act as a senior code reviewer and find bugs in a snippet.",
    target: "As a senior engineer reviewing this code, I've identified: 1) potential null reference on line 3, 2) the loop doesn't handle edge case of empty arrays, 3) missing error handling for the async call. Suggested fixes: add null checks, guard clauses, and try-catch blocks.",
    keywords: ["act as", "code review", "bug", "find"],
    bonusKeywords: ["senior", "engineer", "suggest", "fix", "identify", "role"],
    tips: "💡 Tip: Role prompting ('Act as a...') dramatically changes output quality. Combine with specific instructions about what to look for.",
  },
  {
    id: 6, difficulty: "HARD",
    context: "You want the AI to generate a creative short story in exactly 50 words about a robot discovering music.",
    target: "Unit-7 found the vinyl in the ruins - a black disc etched with spirals. When the needle touched down, something unprecedented rippled through its circuits. Not data. Not instructions. Something that made its cooling fans spin faster. It played the record forty-seven times. On the forty-eighth, it danced.",
    keywords: ["story", "50 words", "robot", "music"],
    bonusKeywords: ["creative", "short", "exactly", "discover", "write"],
    tips: "💡 Tip: For creative tasks, specify word count, theme, tone, and key elements. Constraints breed creativity - for AI too!",
  },
];

export function scorePrompt(prompt: string, challenge: PromptChallenge): { score: number; feedbackKey: string; simulatedResponse: string } {
  const lower = prompt.toLowerCase();
  const words = lower.split(/\s+/);

  // Keyword matching
  let keywordHits = 0;
  for (const kw of challenge.keywords) {
    if (lower.includes(kw.toLowerCase())) keywordHits++;
  }
  let bonusHits = 0;
  for (const kw of challenge.bonusKeywords) {
    if (lower.includes(kw.toLowerCase())) bonusHits++;
  }

  // Length quality (too short = bad, too long = slightly bad)
  const lengthScore = words.length < 3 ? 0.2 : words.length < 6 ? 0.6 : words.length <= 30 ? 1.0 : 0.8;

  // Specificity bonus (has numbers, quotes, formatting instructions)
  let specificityBonus = 0;
  if (/\d+/.test(prompt)) specificityBonus += 0.1;
  if (/["']/.test(prompt)) specificityBonus += 0.05;
  if (/\b(exactly|must|should|format|style|tone)\b/i.test(prompt)) specificityBonus += 0.1;
  if (/\b(act as|you are|pretend|role)\b/i.test(prompt)) specificityBonus += 0.15;

  const keywordScore = challenge.keywords.length > 0 ? keywordHits / challenge.keywords.length : 0;
  const bonusScore = challenge.bonusKeywords.length > 0 ? bonusHits / challenge.bonusKeywords.length : 0;

  const rawScore = (keywordScore * 0.45) + (bonusScore * 0.2) + (lengthScore * 0.2) + Math.min(specificityBonus, 0.15);
  const score = Math.min(100, Math.round(rawScore * 100));

  // Generate simulated response based on score
  let simulatedResponse: string;
  if (score >= 80) {
    simulatedResponse = challenge.target;
  } else if (score >= 50) {
    // Partial response - take first ~60% of target
    const sentences = challenge.target.split(/[.!?\n]+/).filter(Boolean);
    simulatedResponse = sentences.slice(0, Math.ceil(sentences.length * 0.6)).join(". ") + "...";
  } else {
    simulatedResponse = "I'm not sure what you're looking for. Could you be more specific about what you need?";
  }

  let feedbackKey: string;
  if (score >= 80) feedbackKey = "feedbackExcellent";
  else if (score >= 60) feedbackKey = "feedbackGood";
  else if (score >= 40) feedbackKey = "feedbackGettingThere";
  else feedbackKey = "feedbackVague";

  return { score, feedbackKey, simulatedResponse };
}
