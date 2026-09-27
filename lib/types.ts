// Shared types for the HerNext transition engine.

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  date: string; // human-readable, e.g. "2023" or "Updated 2024"
  relevance: string; // one line: why this source matters to the recommendation
}

export interface UserContext {
  transitionId: string; // which transition the user selected (see transitions.ts)
  transitionPhrase: string; // the plain-language "what's changing" phrase the user picked
  goal: string; // free text or picked goal
  age?: string;
  timeline?: string; // e.g. "about 12 months"
  details?: string; // free text: conditions, medications, anything else
}

export interface RoadmapItem {
  text: string;
  sourceIds: string[];
}

export interface RoadmapPhase {
  phase: string; // "NOW", "BEFORE TRYING", "WHEN YOU'RE READY", etc.
  subtitle: string; // one line describing the phase
  items: RoadmapItem[];
}

export interface ProviderQuestion {
  question: string; // personalized question to bring to the clinician
  rationale: string; // why this question, given her situation
  sourceIds: string[];
}

export interface InformationGap {
  gap: string; // what we don't know
  whyItMatters: string; // how it could change the recommendations
}

export interface Pathway {
  transitionLabel: string; // "PCOS → Pregnancy Planning"
  currentStage: string; // "Preconception"
  stageStatus: string; // "Preparing"
  goal: string;
  summary: string; // one-sentence framing of where she is and what's ahead
  roadmap: RoadmapPhase[];
  questionsForProvider: ProviderQuestion[];
  informationGaps: InformationGap[];
  sources: Source[]; // resolved, only the ones actually referenced
  disclaimer: string;
  generatedBy: "ai" | "demo"; // provenance, shown subtly in the UI
}
