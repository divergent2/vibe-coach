// Mock content generation.
// All functions here return pre-written content so the app works
// without any AI API keys. Replace these with real AI calls later.

import { GenerationInput, GeneratedContent, FeedbackResult, RubricItem } from "./types";

// Interview questions by level
const INTERVIEW_QUESTIONS: Record<string, string[]> = {
  entry: [
    "Tell me about yourself and why you're interested in this role.",
    "Describe a project you're proud of. What was your contribution?",
    "How do you approach learning a new technology or skill?",
    "Describe a time you faced a challenge. How did you handle it?",
    "What are your strengths and areas you want to improve?",
    "How do you prioritize tasks when you have multiple deadlines?",
    "Where do you see yourself in 3 years?",
    "What do you know about our company and why do you want to work here?",
    "Describe your ideal work environment.",
    "Do you have any questions for us?",
  ],
  junior: [
    "Walk me through your most complex project technically.",
    "How do you handle code reviews — giving and receiving feedback?",
    "Describe a bug that was hard to fix. How did you debug it?",
    "How do you ensure the code you write is maintainable?",
    "Tell me about a time you had to work with an unclear requirement.",
    "How do you stay up to date with industry trends and new tools?",
    "Describe a time you disagreed with a technical decision. What happened?",
    "How do you approach testing your code?",
    "What's the most important thing you've learned from a past mistake?",
    "What technologies are you most excited about right now?",
  ],
  senior: [
    "Describe a system you designed from scratch. What trade-offs did you make?",
    "How do you approach technical leadership and mentoring junior engineers?",
    "Tell me about a time you had to refactor a large, legacy codebase.",
    "How do you make build-vs-buy decisions for infrastructure or libraries?",
    "Describe a major incident you handled. What was your role and what did you improve after?",
    "How do you balance technical debt with feature velocity?",
    "Tell me about a cross-team collaboration that required significant coordination.",
    "How do you evaluate whether a technology or architecture decision was a success?",
    "Describe your approach to performance optimization.",
    "What's the hardest technical problem you've ever solved?",
  ],
};

// Pitch/Portfolio prompts by level
const PITCH_PROMPTS: Record<string, string[]> = {
  entry: [
    "In 60 seconds, describe yourself and the kind of work you want to do.",
    "Pick one project from your portfolio and explain what problem it solves.",
    "What skills do you bring that aren't obvious from your resume?",
    "Describe a project that didn't go as planned. What did you learn?",
    "Why should someone hire you over another candidate at your level?",
    "What's the most creative solution you've built, even if it's small?",
    "How does your portfolio show your growth as a developer?",
    "Describe your process for starting a new personal project.",
    "What's a project you want to build next and why?",
    "How do your projects show that you can learn independently?",
  ],
  junior: [
    "Walk me through your strongest portfolio project end-to-end.",
    "How do you decide which projects to include in your portfolio?",
    "Describe a technical challenge in one of your projects and how you solved it.",
    "What does your portfolio say about your coding style and values?",
    "Pick a project and explain what you would improve if you had more time.",
    "How have your projects prepared you for a professional engineering role?",
    "Describe how you collaborated with others on a project (even open source).",
    "What's the most important thing your portfolio communicates about you?",
    "How does your portfolio differentiate you from other junior developers?",
    "Tell me about a project where you had to learn a new technology quickly.",
  ],
  senior: [
    "How does your portfolio reflect your technical leadership abilities?",
    "Pick your most impactful project and describe its business or user value.",
    "How have your side projects influenced your approach to professional work?",
    "Describe a project where you made significant architectural decisions.",
    "How do you demonstrate depth vs breadth in your portfolio?",
    "Tell me about a project where you contributed to open source. What was your impact?",
    "How do your projects show your ability to ship production-quality software?",
    "Describe how one of your portfolio projects could be scaled to 10x usage.",
    "What's a project that changed how you think about engineering?",
    "How would you pitch your portfolio to a CTO in 3 minutes?",
  ],
};

// Default rubric for interview mode
const INTERVIEW_RUBRIC: RubricItem[] = [
  { criterion: "Clarity", description: "Answer is clear, structured, and easy to follow.", maxScore: 25 },
  { criterion: "Specificity", description: "Uses concrete examples (STAR: Situation, Task, Action, Result).", maxScore: 25 },
  { criterion: "Technical Depth", description: "Demonstrates technical knowledge appropriate for the level.", maxScore: 25 },
  { criterion: "Self-Awareness", description: "Shows honest reflection on strengths and growth areas.", maxScore: 25 },
];

// Default rubric for pitch mode
const PITCH_RUBRIC: RubricItem[] = [
  { criterion: "Storytelling", description: "Engaging narrative that holds attention.", maxScore: 25 },
  { criterion: "Value Communication", description: "Clearly communicates the value and impact of work.", maxScore: 25 },
  { criterion: "Technical Credibility", description: "Demonstrates genuine understanding of the work.", maxScore: 25 },
  { criterion: "Confidence & Tone", description: "Confident, professional, and authentic delivery.", maxScore: 25 },
];

/**
 * Generates mock coaching content based on the input.
 * Replace this function body with real AI generation later.
 */
export function generateContent(input: GenerationInput): GeneratedContent {
  const level = input.level.toLowerCase();
  let normalizedLevel: string;
  if (level === "senior") {
    normalizedLevel = "senior";
  } else if (level === "mid" || level === "junior") {
    normalizedLevel = "junior";
  } else {
    normalizedLevel = "entry";
  }

  const prompts =
    input.mode === "interview"
      ? INTERVIEW_QUESTIONS[normalizedLevel] ?? INTERVIEW_QUESTIONS.entry
      : PITCH_PROMPTS[normalizedLevel] ?? PITCH_PROMPTS.entry;

  const rubric =
    input.mode === "interview" ? INTERVIEW_RUBRIC : PITCH_RUBRIC;

  return { prompts, rubric };
}

/**
 * Generates mock feedback for a given answer.
 * Replace this function body with real AI evaluation later.
 */
export function generateFeedback(
  _prompt: string,
  answer: string,
  mode: string
): FeedbackResult {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  // Simple heuristic scoring based on answer length
  let score = 40; // baseline
  if (wordCount > 20) score += 15;
  if (wordCount > 50) score += 15;
  if (wordCount > 100) score += 15;
  if (wordCount > 150) score += 15;
  score = Math.min(score, 100);

  const isInterview = mode === "interview";

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount > 50) {
    strengths.push("Good detail level — you provided enough context to evaluate.");
  } else {
    improvements.push("Try to add more detail. Aim for at least 3-4 sentences.");
  }

  if (answer.includes("because") || answer.includes("so that") || answer.includes("result")) {
    strengths.push("You explained the 'why' behind your actions — that's great.");
  } else {
    improvements.push(
      isInterview
        ? "Add more context on the outcome/result (STAR method: Situation, Task, Action, Result)."
        : "Explain the impact and value — what problem does this solve for the user?"
    );
  }

  if (answer.includes("I") && answer.includes("we")) {
    strengths.push("Good balance of individual contribution and team collaboration.");
  } else if (!answer.includes("I")) {
    improvements.push("Be specific about YOUR personal contribution, not just the team.");
  }

  if (improvements.length === 0) {
    improvements.push("Polish your delivery — read it aloud and refine any awkward phrasing.");
  }

  const suggestedAnswer = isInterview
    ? `A strong answer would open with the situation and your specific role, describe the concrete action you took and why, then close with a measurable result. For example: "In my last project, I was responsible for X. The challenge was Y, so I did Z. As a result, we achieved W." Try to tie your answer back to how it demonstrates your value for this role.`
    : `A compelling pitch would open with the problem you solved, explain your specific technical decisions and why you made them, then highlight the real-world impact (e.g., users helped, performance improvement, lessons learned). Make it concrete and personal — "I built this because..." is stronger than "this project does...".`;

  return { score, strengths, improvements, suggestedAnswer };
}
