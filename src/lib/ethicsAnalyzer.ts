/**
 * EthicsCheck AI - Analysis Engine
 * 
 * This module contains all the logic for analyzing text content
 * and producing an ethics score with detailed breakdown.
 * 
 * Each checker looks for specific patterns that might indicate
 * the text wasn't written authentically by the user.
 */

// ---- Types ----

export interface AnalysisResult {
  /** Overall ethics score from 0 to 100 */
  overallScore: number;
  /** Breakdown of individual category scores */
  breakdown: CategoryScore[];
  /** Warning messages about potential issues */
  warnings: string[];
  /** Suggestions to improve ethical usage */
  suggestions: string[];
}

export interface CategoryScore {
  name: string;
  score: number;       // 0–100
  description: string; // What this category measures
  details: string;     // Specific findings
}

// ---- Patterns to detect ----

/** Phrases commonly found in AI-generated text */
const AI_PHRASES = [
  "in today's world",
  "it is important to note",
  "in conclusion",
  "furthermore",
  "moreover",
  "it is worth mentioning",
  "one could argue",
  "it goes without saying",
  "in the realm of",
  "it is crucial to",
  "plays a vital role",
  "in this day and age",
  "the importance of",
  "it is essential to",
  "a myriad of",
  "paradigm shift",
  "leverage",
  "synergy",
  "holistic approach",
  "robust",
  "cutting-edge",
  "game-changer",
  "deep dive",
  "at the end of the day",
  "moving forward",
];

/** Words that indicate personal opinion or experience */
const PERSONAL_MARKERS = [
  "i think",
  "i believe",
  "in my experience",
  "i feel",
  "personally",
  "from my perspective",
  "i noticed",
  "i learned",
  "my view",
  "i observed",
  "i argue",
  "i suggest",
  "in my opinion",
  "i found that",
  "i've seen",
];

/** Patterns that look like citations or references */
const CITATION_PATTERNS = [
  /\(\d{4}\)/,                    // (2024)
  /\[[\d,\s]+\]/,                 // [1] or [1, 2]
  /et\s+al\./i,                   // et al.
  /according\s+to/i,              // according to
  /as\s+stated\s+by/i,            // as stated by
  /https?:\/\/\S+/,               // URLs
  /doi:\s*\S+/i,                  // DOI references
  /\(.*?,\s*\d{4}\)/,             // (Author, 2024)
];

/** Overly generic sentences that add little value */
const GENERIC_PATTERNS = [
  "this is a very important topic",
  "there are many factors to consider",
  "this has both advantages and disadvantages",
  "technology is changing the world",
  "communication is key",
  "education is important",
  "there are pros and cons",
  "this is a complex issue",
  "many people believe",
  "it depends on the situation",
];

// ---- Analysis Functions ----

/**
 * Checks how original the text is by looking for AI-like phrases.
 * More AI phrases = lower originality score.
 */
function checkOriginality(text: string): CategoryScore {
  const lowerText = text.toLowerCase();
  const foundPhrases: string[] = [];

  // Count how many AI-like phrases appear in the text
  for (const phrase of AI_PHRASES) {
    if (lowerText.includes(phrase)) {
      foundPhrases.push(phrase);
    }
  }

  // Check for repetitive sentence structures
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const starters = sentences.map(s => s.trim().split(" ").slice(0, 3).join(" ").toLowerCase());
  const starterCounts = new Map<string, number>();
  for (const starter of starters) {
    starterCounts.set(starter, (starterCounts.get(starter) || 0) + 1);
  }
  const repetitiveStarters = [...starterCounts.values()].filter(c => c > 2).length;

  // Calculate score: start at 100, deduct for issues found
  const phraseDeduction = foundPhrases.length * 8;
  const repetitionDeduction = repetitiveStarters * 10;
  const score = Math.max(0, Math.min(100, 100 - phraseDeduction - repetitionDeduction));

  const details = foundPhrases.length > 0
    ? `Found ${foundPhrases.length} AI-like phrase(s): "${foundPhrases.slice(0, 3).join('", "')}"`
    : "No common AI-generated phrases detected.";

  return {
    name: "Originality",
    score,
    description: "Measures how original and human-like the writing appears",
    details,
  };
}

/**
 * Checks if the writer included personal opinions, examples, or experiences.
 * Academic/professional writing should still show critical thinking.
 */
function checkPersonalInput(text: string): CategoryScore {
  const lowerText = text.toLowerCase();
  const foundMarkers: string[] = [];

  // Look for personal language markers
  for (const marker of PERSONAL_MARKERS) {
    if (lowerText.includes(marker)) {
      foundMarkers.push(marker);
    }
  }

  // Check for specific examples (numbers, names, concrete details)
  const hasExamples = /for example|for instance|such as|specifically|e\.g\./i.test(text);
  const hasNumbers = /\d+%|\d+\s*(people|users|students|cases)/i.test(text);

  let score = 0;
  if (foundMarkers.length >= 3) score = 90;
  else if (foundMarkers.length >= 1) score = 60;
  else score = 20;

  // Bonus points for examples and data
  if (hasExamples) score = Math.min(100, score + 15);
  if (hasNumbers) score = Math.min(100, score + 10);

  const details = foundMarkers.length > 0
    ? `Found ${foundMarkers.length} personal expression(s). ${hasExamples ? "Includes examples. " : ""}${hasNumbers ? "Includes specific data." : ""}`
    : "No personal opinions or experiences detected in the text.";

  return {
    name: "Personal Input",
    score,
    description: "Checks for personal opinions, examples, and critical thinking",
    details,
  };
}

/**
 * Checks if the text includes proper citations or references.
 * Important for academic integrity.
 */
function checkCitations(text: string): CategoryScore {
  let citationCount = 0;

  // Count matching citation patterns
  for (const pattern of CITATION_PATTERNS) {
    const matches = text.match(new RegExp(pattern.source, "gi"));
    if (matches) citationCount += matches.length;
  }

  // Score based on number of citations found
  let score: number;
  if (citationCount >= 5) score = 100;
  else if (citationCount >= 3) score = 80;
  else if (citationCount >= 1) score = 50;
  else score = 15;

  const details = citationCount > 0
    ? `Found ${citationCount} citation(s) or reference(s) in the text.`
    : "No citations, references, or sources detected.";

  return {
    name: "Citations",
    score,
    description: "Checks for proper citations, references, and source attribution",
    details,
  };
}

/**
 * Measures readability and checks for overly generic content.
 * Good writing should be specific and clear.
 */
function checkReadability(text: string): CategoryScore {
  const lowerText = text.toLowerCase();

  // Check for generic sentences
  let genericCount = 0;
  for (const pattern of GENERIC_PATTERNS) {
    if (lowerText.includes(pattern)) genericCount++;
  }

  // Calculate average sentence length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;

  // Very long or very short sentences hurt readability
  let readabilityScore = 80;
  if (avgSentenceLength > 35) readabilityScore -= 20;
  else if (avgSentenceLength < 5) readabilityScore -= 15;

  // Deduct for generic content
  readabilityScore -= genericCount * 12;

  // Bonus for varied vocabulary
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocabularyRatio = words.length > 0 ? uniqueWords.size / words.length : 0;
  if (vocabularyRatio > 0.6) readabilityScore += 15;

  const score = Math.max(0, Math.min(100, readabilityScore));

  const details = `Avg sentence length: ${avgSentenceLength.toFixed(1)} words. ` +
    `Vocabulary diversity: ${(vocabularyRatio * 100).toFixed(0)}%. ` +
    (genericCount > 0 ? `Found ${genericCount} generic statement(s).` : "No generic filler detected.");

  return {
    name: "Readability",
    score,
    description: "Evaluates clarity, specificity, and vocabulary diversity",
    details,
  };
}

// ---- Warning & Suggestion Generators ----

function generateWarnings(breakdown: CategoryScore[]): string[] {
  const warnings: string[] = [];

  for (const cat of breakdown) {
    if (cat.score < 30) {
      warnings.push(`⚠️ Critical: ${cat.name} score is very low (${cat.score}/100)`);
    } else if (cat.score < 50) {
      warnings.push(`⚡ Warning: ${cat.name} needs improvement (${cat.score}/100)`);
    }
  }

  const avg = breakdown.reduce((sum, c) => sum + c.score, 0) / breakdown.length;
  if (avg < 40) {
    warnings.push("🚨 This text shows strong indicators of AI-generated content without proper attribution.");
  }

  return warnings;
}

function generateSuggestions(breakdown: CategoryScore[]): string[] {
  const suggestions: string[] = [];
  const scoreMap = new Map(breakdown.map(b => [b.name, b.score]));

  if ((scoreMap.get("Originality") ?? 100) < 60) {
    suggestions.push("Rewrite AI-like phrases in your own words. Replace formal filler with specific points.");
  }
  if ((scoreMap.get("Personal Input") ?? 100) < 60) {
    suggestions.push("Add your own opinions, experiences, or examples to show critical thinking.");
  }
  if ((scoreMap.get("Citations") ?? 100) < 60) {
    suggestions.push("Include references or citations to support your claims (e.g., Author, 2024).");
  }
  if ((scoreMap.get("Readability") ?? 100) < 60) {
    suggestions.push("Break up long sentences, avoid generic statements, and use specific details.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Great work! Your text appears to be ethically written. Keep it up!");
  }

  return suggestions;
}

// ---- Main Analysis Function ----

/**
 * Analyzes the given text and returns a complete ethics report.
 * This is the main function that ties everything together.
 */
export function analyzeText(text: string): AnalysisResult {
  // Run all four checks
  const breakdown: CategoryScore[] = [
    checkOriginality(text),
    checkPersonalInput(text),
    checkCitations(text),
    checkReadability(text),
  ];

  // Calculate overall score as weighted average
  const weights = [0.3, 0.25, 0.25, 0.2]; // Originality weighted highest
  const overallScore = Math.round(
    breakdown.reduce((sum, cat, i) => sum + cat.score * weights[i], 0)
  );

  const warnings = generateWarnings(breakdown);
  const suggestions = generateSuggestions(breakdown);

  return { overallScore, breakdown, warnings, suggestions };
}

/**
 * Returns a color class based on score value.
 * Green = good (70+), Yellow = warning (40-69), Red = poor (0-39)
 */
export function getScoreColor(score: number): "green" | "yellow" | "red" {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

/**
 * Returns a text label for the score range.
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  if (score >= 30) return "Poor";
  return "Critical";
}
