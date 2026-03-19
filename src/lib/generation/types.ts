// Types for the generation layer.
// These types create a clean boundary so we can later swap
// mock generation for a real AI provider (e.g. OpenAI, Anthropic).

export type CoachMode = "interview" | "pitch";

export interface GenerationInput {
  mode: CoachMode;
  title: string;   // role or goal
  level: string;   // seniority / experience level
  focus: string;   // free-text focus areas
}

export interface GeneratedContent {
  prompts: string[];      // questions or prompts to answer
  rubric: RubricItem[];   // scoring criteria
}

export interface RubricItem {
  criterion: string;
  description: string;
  maxScore: number;
}

export interface FeedbackResult {
  score: number;           // 0-100
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}
