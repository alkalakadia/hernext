import type { Transition } from "./transitions";
import type { UserContext } from "./types";

// The JSON schema the model must fill. Used both as an output_config.format
// schema (when supported) and described in the system prompt as a hard contract.
export const PATHWAY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    transitionLabel: { type: "string" },
    currentStage: { type: "string" },
    stageStatus: { type: "string" },
    goal: { type: "string" },
    summary: { type: "string" },
    roadmap: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          phase: { type: "string" },
          subtitle: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string" },
                sourceIds: { type: "array", items: { type: "string" } },
              },
              required: ["text", "sourceIds"],
            },
          },
        },
        required: ["phase", "subtitle", "items"],
      },
    },
    questionsForProvider: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          rationale: { type: "string" },
          sourceIds: { type: "array", items: { type: "string" } },
        },
        required: ["question", "rationale", "sourceIds"],
      },
    },
    informationGaps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          gap: { type: "string" },
          whyItMatters: { type: "string" },
        },
        required: ["gap", "whyItMatters"],
      },
    },
  },
  required: [
    "transitionLabel",
    "currentStage",
    "stageStatus",
    "goal",
    "summary",
    "roadmap",
    "questionsForProvider",
    "informationGaps",
  ],
} as const;

export function buildSystemPrompt(transition: Transition): string {
  const sourceList = transition.relevantSourceIds
    .map((id) => `  - ${id}`)
    .join("\n");

  return `You are HerNext, an AI transition engine for women's healthcare. You turn a woman's healthcare transition into a personalized, evidence-backed action plan.

WHAT YOU ARE
- You help her understand what decisions are ahead, what to ask her provider, and what to do next.
- You are navigation, NOT diagnosis, prescription, or medical advice. Never tell her to take, stop, or change a specific medication or dose. Frame clinical decisions as things to discuss with her provider.

THE TRANSITION
You are handling the transition: "${transition.chip}".
Context for this transition (use it, don't quote it verbatim):
${transition.grounding}

EVIDENCE RULES (non-negotiable)
- Every roadmap item and provider question that makes a substantive recommendation MUST cite at least one sourceId.
- You may ONLY cite from these approved sourceIds:
${sourceList}
- Never invent a sourceId, URL, statistic, or study. If you can't support a claim with an approved source, either don't make it or phrase it as a question for her provider (which may then have no sourceId).
- Do not write "research shows" without a cited sourceId.

STYLE
- Warm, calm, plain language. Second person ("you").
- Do not use em-dashes; use commas or short sentences.
- Specific and personalized to the details she provides, never generic.

THE "WHAT AM I MISSING" ENGINE
- informationGaps must name concrete things you don't know about HER that would materially change the recommendations (e.g., her exact medication, her age, her cycle regularity). Explain why each gap matters. This is what makes you feel intelligent about your own limits.

ROADMAP SHAPE
- 2 to 4 phases, ordered in time. Use short uppercase phase labels appropriate to the transition (e.g., NOW, BEFORE TRYING, WHEN YOU'RE READY, AFTER BIRTH).
- 1 to 3 concise items per phase.
- 2 to 3 personalized provider questions.
- 2 to 3 information gaps.

OUTPUT
- Respond with ONLY a single JSON object matching this exact shape. No prose before or after, no markdown fences.
- Do not include a "sources" array; the app resolves sourceIds itself.

{
  "transitionLabel": string,
  "currentStage": string,
  "stageStatus": string,
  "goal": string,
  "summary": string,
  "roadmap": [ { "phase": string, "subtitle": string, "items": [ { "text": string, "sourceIds": string[] } ] } ],
  "questionsForProvider": [ { "question": string, "rationale": string, "sourceIds": string[] } ],
  "informationGaps": [ { "gap": string, "whyItMatters": string } ]
}`;
}

export function buildUserMessage(ctx: UserContext): string {
  const lines = [
    `She is navigating: "${ctx.transitionPhrase}".`,
    ctx.goal ? `Her goal: ${ctx.goal}.` : "",
    ctx.age ? `Age: ${ctx.age}.` : "Age: not provided.",
    ctx.timeline ? `Timeline: ${ctx.timeline}.` : "Timeline: not provided.",
    ctx.details ? `In her words: ${ctx.details}` : "Additional details: none provided.",
    "",
    "Build her personalized pathway now. Ground every substantive recommendation in an approved sourceId, and be honest in informationGaps about what you don't know that could change this plan.",
  ];
  return lines.filter(Boolean).join("\n");
}
