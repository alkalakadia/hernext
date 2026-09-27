import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.HERNEXT_MODEL || "claude-opus-4-8";
const EFFORT = (process.env.HERNEXT_EFFORT || "medium") as "low" | "medium" | "high";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Pull the first plausible JSON object out of a model response, even if the
// model wrapped it in prose or a code fence. Robust across SDK versions.
function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

interface GenerateArgs {
  system: string;
  user: string;
  schema: Record<string, unknown>;
}

// Calls Claude and returns the parsed pathway JSON (unresolved sourceIds).
// Uses adaptive thinking + structured output where the deployed API supports it,
// and always falls back to robust JSON extraction.
export async function generatePathway({ system, user, schema }: GenerateArgs): Promise<any> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const params: Record<string, unknown> = {
    model: MODEL,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: user }],
    // Adaptive thinking: let the model decide how much to reason (Opus 4.7/4.8).
    thinking: { type: "adaptive" },
    // Bound reasoning depth so the demo stays responsive.
    output_config: {
      effort: EFFORT,
      format: {
        type: "json_schema",
        schema,
      },
    },
  };

  const res: any = await (client.messages.create as any)(params);

  const text = (res.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();

  if (!text) throw new Error("Empty response from model.");
  return extractJson(text);
}

export { MODEL };
