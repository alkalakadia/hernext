import { NextResponse } from "next/server";
import { getTransition, resolveSources } from "@/lib/transitions";
import { buildSystemPrompt, buildUserMessage, PATHWAY_SCHEMA } from "@/lib/prompt";
import { generatePathway, hasApiKey } from "@/lib/claude";
import { buildMockPathway } from "@/lib/mockEngine";
import type { Pathway, UserContext } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const DISCLAIMER =
  "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider, who knows your full history.";

// Assemble the final Pathway from the AI's raw JSON, resolving every cited
// sourceId against the curated evidence layer so citations are always real.
function assemble(raw: any): Pathway {
  const roadmap = Array.isArray(raw.roadmap) ? raw.roadmap : [];
  const questions = Array.isArray(raw.questionsForProvider) ? raw.questionsForProvider : [];
  const gaps = Array.isArray(raw.informationGaps) ? raw.informationGaps : [];

  const allIds: string[] = [];
  for (const phase of roadmap) {
    for (const item of phase.items || []) {
      for (const id of item.sourceIds || []) allIds.push(id);
    }
  }
  for (const q of questions) {
    for (const id of q.sourceIds || []) allIds.push(id);
  }

  return {
    transitionLabel: raw.transitionLabel || "",
    currentStage: raw.currentStage || "",
    stageStatus: raw.stageStatus || "",
    goal: raw.goal || "",
    summary: raw.summary || "",
    roadmap,
    questionsForProvider: questions,
    informationGaps: gaps,
    sources: resolveSources(allIds),
    disclaimer: DISCLAIMER,
    generatedBy: "ai",
  };
}

export async function POST(request: Request) {
  let ctx: UserContext;
  try {
    ctx = (await request.json()) as UserContext;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const transition = getTransition(ctx.transitionId);
  if (!transition) {
    return NextResponse.json({ error: "Unknown transition." }, { status: 400 });
  }

  // Personalized, deterministic pathway built from the user's inputs — no API needed.
  const mockPathway: Pathway = buildMockPathway(transition, ctx);

  // No key: serve the personalized mock pathway so the demo always works offline.
  if (!hasApiKey()) {
    return NextResponse.json({ pathway: mockPathway, mode: "demo" });
  }

  try {
    const raw = await generatePathway({
      system: buildSystemPrompt(transition),
      user: buildUserMessage(ctx),
      schema: PATHWAY_SCHEMA as unknown as Record<string, unknown>,
    });
    return NextResponse.json({ pathway: assemble(raw), mode: "ai" });
  } catch (err) {
    console.error("Pathway generation failed, serving personalized fallback:", err);
    // Never fail the demo: fall back to the personalized mock pathway.
    return NextResponse.json({ pathway: mockPathway, mode: "demo-fallback" });
  }
}
