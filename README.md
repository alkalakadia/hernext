# HerNext

**An AI transition engine for women's health.** HerNext turns a woman's healthcare
transition into a personalized, evidence-backed action plan: what decisions are ahead,
what to ask her provider, and what to do next. It is navigation, not diagnosis.

> Built for: Main track (AI / Automation), Women's Health — Closing the Gap, Strato VC — Open Venture.

## The core idea

Most digital health products are built around one stage (a period tracker, a PCOS app,
a pregnancy app). But women move *between* stages: PCOS → fertility → pregnancy →
postpartum → contraception → fertility again. HerNext is the navigation layer across
those transitions. We demonstrate it first on **PCOS → Fertility**; the other
transitions prove the engine scales.

## What the agent does

```
USER CONTEXT → identify transition → retrieve trusted sources →
generate pathway → identify information gaps → generate questions → cite sources
```

Every run produces:

1. **Your roadmap** — ordered phases (NOW / BEFORE TRYING / WHEN YOU'RE READY …)
2. **Questions for your provider** — generated from *her* situation, not generic
3. **What we don't know** — the gaps that could materially change the plan (this is the
   "knows its own limits" feature)
4. **Sources** — every recommendation links to reputable evidence (ACOG, CDC, NHS, WHO,
   ASRM, NICE)

## Evidence layer (non-negotiable)

The AI may **only** cite from a curated source list (`lib/transitions.ts` → `SOURCES`).
The server resolves every `sourceId` the model returns against that list, so HerNext
never invents a citation and never says "research shows" without a real link.

## Run it

```bash
cd hernext
npm install
cp .env.local.example .env.local   # optional — add ANTHROPIC_API_KEY for live AI
npm run dev                         # http://localhost:3000
```

**Offline demo mode:** with no `ANTHROPIC_API_KEY`, HerNext serves richly curated
pathways from the transition database, so the live demo always works even without a
network or key. Add a key to switch to live generation with Claude (Opus 4.8, adaptive
thinking, structured output). If a live call fails, it falls back to the curated pathway
automatically — the demo never breaks.

### Config (`.env.local`)

| Var | Default | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | _(none)_ | Enables live AI generation. Omit for offline demo mode. |
| `HERNEXT_MODEL` | `claude-opus-4-8` | Swap to `claude-sonnet-4-6` for a snappier live demo. |
| `HERNEXT_EFFORT` | `medium` | Reasoning depth: `low` \| `medium` \| `high`. |

## Architecture

```
app/page.tsx            Landing page
app/journey/page.tsx    Onboarding (what's changing → details) + result
app/api/pathway/route.ts  Server route: prompt → Claude → resolve citations → Pathway
lib/transitions.ts      Transition database + curated evidence layer + offline fallbacks
lib/prompt.ts           System prompt, user message, JSON schema (the AI contract)
lib/claude.ts           Anthropic client (adaptive thinking + structured output)
components/PathwayView.tsx  Pathway map, roadmap, questions, gaps, sources
```

## Transitions

Fully built (demo-ready): **PCOS → Pregnancy planning**, **Contraception → Pregnancy
planning**, **Pregnancy → Postpartum**. Preview (same engine, lighter content):
**Trying → Fertility support**, **Perimenopause → Menopause**.

See `DEMO_SCRIPT.md` for the 3-minute run of show.
