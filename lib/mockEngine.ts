import type { Transition } from "./transitions";
import { resolveSources } from "./transitions";
import type {
  InformationGap,
  Pathway,
  ProviderQuestion,
  RoadmapItem,
  UserContext,
} from "./types";

// ---------------------------------------------------------------------------
// MOCK GENERATION ENGINE
// Produces a personalized, evidence-backed pathway WITHOUT calling any API.
// It reads the user's free-text details, age, timeline, and goal, detects
// concrete signals, and weaves them into the roadmap, provider questions, and
// "what we don't know" gaps. Deterministic, always-on, never breaks a demo.
// ---------------------------------------------------------------------------

const FERTILITY_FAMILY = new Set([
  "pcos-fertility",
  "contraception-pregnancy",
  "trying-difficulty",
]);

interface Signals {
  age?: number;
  method?: string; // human-readable label, e.g. "an IUD"
  methodNeedsRemoval?: boolean;
  methodIsInjection?: boolean;
  meds: string[];
  hasSpironolactone: boolean;
  hasRetinoid: boolean;
  hasThyroidMed: boolean;
  hasMentalHealthMed: boolean;
  irregularCycle: boolean;
  regularCycle: boolean;
  conditions: string[]; // e.g. "thyroid", "diabetes"
  weight: boolean;
  smoking: boolean;
  alcohol: boolean;
  takingFolic: boolean;
  tryingMonths?: number;
}

function parseSignals(ctx: UserContext): Signals {
  const text = `${ctx.details || ""} ${ctx.goal || ""} ${ctx.timeline || ""}`.toLowerCase();

  // Age: prefer the age field, else scan the details.
  let age: number | undefined;
  const ageField = parseInt((ctx.age || "").replace(/[^0-9]/g, ""), 10);
  if (!Number.isNaN(ageField) && ageField > 0 && ageField < 100) age = ageField;
  if (age === undefined) {
    const m = text.match(/\b(\d{2})\s*(?:years old|year old|yrs|yo|y\/o)\b/);
    if (m) age = parseInt(m[1], 10);
  }

  // Contraceptive method (check specific patterns first).
  let method: string | undefined;
  let methodNeedsRemoval = false;
  let methodIsInjection = false;
  const methodRules: Array<[RegExp, string, boolean, boolean]> = [
    [/copper iud|paragard|copper coil/, "a copper IUD", true, false],
    [/iud|mirena|kyleena|coil|hormonal coil/, "an IUD", true, false],
    [/implant|nexplanon/, "the implant", true, false],
    [/depo|the shot|contraceptive injection|injection/, "the contraceptive injection", false, true],
    [/patch/, "the contraceptive patch", false, false],
    [/nuvaring|vaginal ring|the ring/, "the vaginal ring", false, false],
    [/mini.?pill|progestogen|progestin.only/, "the progestogen-only pill", false, false],
    [/the pill|combined pill|birth control pill|oral contracepti|bcp|on the pill/, "the pill", false, false],
    [/condom/, "condoms", false, false],
  ];
  for (const [re, label, needsRemoval, isInjection] of methodRules) {
    if (re.test(text)) {
      method = label;
      methodNeedsRemoval = needsRemoval;
      methodIsInjection = isInjection;
      break;
    }
  }
  // "on birth control" / "contraception" with no specific method still counts as a method mention.
  if (!method && /(birth control|contracepti)/.test(text)) {
    method = "birth control";
  }

  // Medications.
  const meds: string[] = [];
  const medRules: Array<[RegExp, string]> = [
    [/metformin/, "metformin"],
    [/letrozole|femara/, "letrozole"],
    [/clomid|clomiphene/, "clomiphene"],
    [/spironolactone|aldactone/, "spironolactone"],
    [/inositol/, "inositol"],
    [/levothyroxine|synthroid|thyroxine/, "levothyroxine"],
    [/isotretinoin|accutane|retinoid/, "isotretinoin"],
    [/ssri|antidepressant|sertraline|fluoxetine|escitalopram|zoloft|lexapro|prozac/, "an antidepressant"],
  ];
  for (const [re, name] of medRules) {
    if (re.test(text)) meds.push(name);
  }

  const conditions: string[] = [];
  if (/thyroid|hypothyroid|hashimoto/.test(text)) conditions.push("a thyroid condition");
  if (/diabet|insulin resist|prediabet/.test(text)) conditions.push("diabetes or insulin resistance");
  if (/high blood pressure|hypertension/.test(text)) conditions.push("high blood pressure");
  if (/endometriosis|endo\b/.test(text)) conditions.push("endometriosis");

  return {
    age,
    method,
    methodNeedsRemoval,
    methodIsInjection,
    meds,
    hasSpironolactone: /spironolactone|aldactone/.test(text),
    hasRetinoid: /isotretinoin|accutane|retinoid/.test(text),
    hasThyroidMed: /levothyroxine|synthroid|thyroxine/.test(text),
    hasMentalHealthMed: /ssri|antidepressant|sertraline|fluoxetine|escitalopram|zoloft|lexapro|prozac/.test(text),
    irregularCycle: /irregular|no period|missed period|skip.*period|absent period|infrequent period/.test(text),
    regularCycle: /regular period|regular cycle|periods are regular/.test(text),
    conditions,
    weight: /weight|bmi|overweight|obes/.test(text),
    smoking: /smoke|smoking|cigarette|vape|vaping/.test(text),
    alcohol: /alcohol|drink|wine|beer|cocktail/.test(text),
    takingFolic: /folic|folate|prenatal vitamin|prenatals/.test(text),
    tryingMonths: (() => {
      const m = text.match(/(\d+)\s*(month|months|year|years)\s*(?:of )?(?:trying|ttc)/);
      if (m) {
        const n = parseInt(m[1], 10);
        return /year/.test(m[2]) ? n * 12 : n;
      }
      const m2 = text.match(/trying (?:for )?(\d+)\s*(month|months|year|years)/);
      if (m2) {
        const n = parseInt(m2[1], 10);
        return /year/.test(m2[2]) ? n * 12 : n;
      }
      return undefined;
    })(),
  };
}

function buildTailoredItems(s: Signals, t: Transition): RoadmapItem[] {
  const items: RoadmapItem[] = [];
  const isFertility = FERTILITY_FAMILY.has(t.id);

  if (s.method && s.method !== "birth control" && isFertility) {
    if (s.methodIsInjection) {
      items.push({
        text: `You mentioned the contraceptive injection. It can take several months longer than other methods for your cycles to return, so build that into your ${
          "timeline"
        }.`,
        sourceIds: ["cdc-contraception-return"],
      });
    } else if (s.methodNeedsRemoval) {
      items.push({
        text: `Because you're using ${s.method}, plan a removal appointment for when you're ready to start trying; fertility can return quickly afterward.`,
        sourceIds: ["cdc-contraception-return"],
      });
    } else {
      items.push({
        text: `Since you're using ${s.method}, ask how soon your fertility returns after stopping so you can time it with your goal.`,
        sourceIds: ["cdc-contraception-return"],
      });
    }
  }

  if (s.hasRetinoid) {
    items.push({
      text: "You mentioned a retinoid like isotretinoin. These must be stopped well before conceiving, so make the timing an early conversation with your clinician.",
      sourceIds: ["acog-prepregnancy"],
    });
  }
  if (s.hasSpironolactone) {
    items.push({
      text: "You mentioned spironolactone. It is generally not used once you're trying to conceive, so this is an important one to review with your clinician before then. This is a discussion point, not a change to make on your own.",
      sourceIds: ["acog-pcos", "acog-prepregnancy"],
    });
  }
  const otherMeds = s.meds.filter(
    (m) => m !== "spironolactone" && m !== "isotretinoin" && m !== "levothyroxine" && m !== "an antidepressant"
  );
  if (otherMeds.length) {
    items.push({
      text: `You mentioned ${otherMeds.join(" and ")}. Ask your clinician how ${
        otherMeds.length > 1 ? "these fit" : "this fits"
      } into your plan for ovulation and pregnancy.`,
      sourceIds: ["acog-pcos"],
    });
  }
  if (s.hasThyroidMed || s.conditions.includes("a thyroid condition")) {
    items.push({
      text: "Thyroid treatment often needs review and a dose adjustment around conception, so flag it before you start trying.",
      sourceIds: ["acog-thyroid"],
    });
  }
  if (s.hasMentalHealthMed) {
    items.push({
      text: "If you take medication for your mental health, ask which options are best continued in pregnancy. Stopping suddenly is not advised.",
      sourceIds: ["acog-mental-health"],
    });
  }
  if (s.conditions.includes("diabetes or insulin resistance")) {
    items.push({
      text: "Getting blood sugar well controlled before conception lowers pregnancy risks, so ask about a preconception target.",
      sourceIds: ["cdc-diabetes-pregnancy"],
    });
  }
  if (s.conditions.includes("high blood pressure")) {
    items.push({
      text: "High blood pressure and its medications are best reviewed before pregnancy, since some need adjusting.",
      sourceIds: ["acog-prepregnancy"],
    });
  }
  if (s.irregularCycle && isFertility) {
    items.push({
      text: "Since your cycles are irregular, ovulation tracking matters more, and it can be worth asking about an earlier fertility check.",
      sourceIds: ["asrm-ovulation", "asrm-infertility"],
    });
  }
  if (s.weight) {
    items.push({
      text: "Weight and metabolic health are a common, sensitive part of PCOS and preconception care. Your clinician can help set realistic, supportive goals.",
      sourceIds: ["acog-weight", "nhs-pcos"],
    });
  }
  if (s.smoking) {
    items.push({
      text: "Stopping smoking before you conceive is one of the highest-impact steps you can take. Ask for support to do it.",
      sourceIds: ["cdc-tobacco"],
    });
  }
  if (s.alcohol) {
    items.push({
      text: "Plan to stop alcohol once you begin trying, since there is no known safe amount in pregnancy.",
      sourceIds: ["cdc-alcohol"],
    });
  }
  if (s.takingFolic) {
    items.push({
      text: "Good, you're already taking folic acid or a prenatal vitamin. Confirm the dose is right for you with your clinician.",
      sourceIds: ["cdc-folic-acid"],
    });
  }
  if (s.age !== undefined && s.age >= 35 && isFertility) {
    items.push({
      text: `At ${s.age}, the usual guidance is to seek a fertility evaluation after about 6 months of trying rather than 12.`,
      sourceIds: ["asrm-infertility"],
    });
  }
  if (s.tryingMonths !== undefined && t.id === "trying-difficulty") {
    const threshold = s.age !== undefined && s.age >= 35 ? 6 : 12;
    if (s.tryingMonths >= threshold) {
      items.push({
        text: `You've been trying for about ${s.tryingMonths} months, which meets the usual threshold for an evaluation. It's reasonable to book one.`,
        sourceIds: ["asrm-infertility"],
      });
    } else {
      items.push({
        text: `You've been trying for about ${s.tryingMonths} months. The usual evaluation threshold is ${threshold} months, so you may not be there yet, but you can still raise concerns now.`,
        sourceIds: ["asrm-infertility"],
      });
    }
  }

  return items.slice(0, 6);
}

function buildTailoredQuestions(s: Signals, ctx: UserContext, t: Transition): ProviderQuestion[] {
  const qs: ProviderQuestion[] = [];
  const isFertility = FERTILITY_FAMILY.has(t.id);

  if (s.method && s.method !== "birth control" && (isFertility || t.id === "postpartum-contraception")) {
    qs.push({
      question: `I'm currently using ${s.method}. How soon after stopping should I expect my fertility to return, and do I need an appointment to stop?`,
      rationale: `Return-to-fertility timing is specific to ${s.method}.`,
      sourceIds: ["cdc-contraception-return"],
    });
  }
  if (s.hasSpironolactone) {
    qs.push({
      question:
        "I take spironolactone for my PCOS. When should I stop it relative to trying to conceive, and is there anything to use instead in the meantime?",
      rationale: "This medication is generally paused before pregnancy, so timing matters.",
      sourceIds: ["acog-pcos", "acog-prepregnancy"],
    });
  }
  if (s.irregularCycle && isFertility) {
    qs.push({
      question: "My cycles are irregular. How will I know when I'm ovulating, and at what point should we investigate?",
      rationale: "Irregular ovulation is the biggest factor in timing and may warrant earlier support.",
      sourceIds: ["asrm-ovulation", "asrm-infertility"],
    });
  }
  if (s.age !== undefined && s.age >= 35 && isFertility) {
    qs.push({
      question: `I'm ${s.age}. Given my age, should we be more proactive about fertility testing?`,
      rationale: "Evaluation timelines shorten with age.",
      sourceIds: ["asrm-infertility"],
    });
  }
  if (ctx.goal && ctx.timeline) {
    qs.push({
      question: `My goal is to ${ctx.goal.toLowerCase()} in ${ctx.timeline}. What should I prioritize in that window?`,
      rationale: "A concrete timeline helps focus the most useful next steps.",
      sourceIds: ["cdc-preconception"],
    });
  }

  return qs.slice(0, 4);
}

// Deeper unknowns that stay valid even after the user has told us the basics,
// so we never contradict what they just shared.
const DEEPER_FERTILITY_GAPS: InformationGap[] = [
  {
    gap: "We don't know about your partner's health or history.",
    whyItMatters: "A full fertility picture includes both partners.",
  },
  {
    gap: "We don't know your pregnancy history.",
    whyItMatters: "Prior pregnancies or losses can change what's recommended.",
  },
  {
    gap: "We don't know your most recent labs or ultrasound results.",
    whyItMatters: "Current results help your clinician tailor the plan to you.",
  },
];

function buildDynamicGaps(s: Signals, t: Transition, base: InformationGap[]): InformationGap[] {
  const isFertility = FERTILITY_FAMILY.has(t.id);

  if (!isFertility) {
    // Non-fertility transitions: use the curated base gaps, dropping the age one
    // if the user actually told us their age.
    const filtered = base.filter((g) => !(s.age !== undefined && /\bage\b/i.test(g.gap)));
    return (filtered.length >= 2 ? filtered : base).slice(0, 3);
  }

  // Fertility family: surface only genuinely-unknown things.
  const primary: InformationGap[] = [];
  if (s.age === undefined) {
    primary.push({
      gap: "We don't know your age.",
      whyItMatters: "Age changes fertility-evaluation timelines (about 12 months vs 6).",
    });
  }
  if (!s.method) {
    primary.push({
      gap: "We don't know your exact contraceptive method.",
      whyItMatters: "Return-to-fertility timing and whether you need a removal visit depend on it.",
    });
  }
  if (!s.irregularCycle && !s.regularCycle) {
    primary.push({
      gap: "We don't know whether your cycles are regular.",
      whyItMatters: "This changes how ovulation is tracked and whether earlier support helps.",
    });
  }
  if (s.meds.length === 0 && s.conditions.length === 0) {
    primary.push({
      gap: "We don't know your current medications or health conditions.",
      whyItMatters: "Some medications and conditions need review or adjustment before pregnancy.",
    });
  }

  // Fill up to 3 with deeper unknowns that never contradict what she shared.
  const out = [...primary];
  for (const g of DEEPER_FERTILITY_GAPS) {
    if (out.length >= 3) break;
    out.push(g);
  }
  return out.slice(0, 3);
}

export function buildMockPathway(t: Transition, ctx: UserContext): Pathway {
  const base: Pathway["roadmap"] = JSON.parse(JSON.stringify(t.demo.roadmap));
  const s = parseSignals(ctx);

  const tailoredItems = buildTailoredItems(s, t);
  const tailoredQs = buildTailoredQuestions(s, ctx, t);

  // Prepend a clearly-personalized phase when we detected anything specific.
  const roadmap = [...base];
  if (tailoredItems.length) {
    roadmap.unshift({
      phase: "TAILORED TO YOU",
      subtitle: "Built from what you shared",
      items: tailoredItems,
    });
  }

  const questions = [...tailoredQs, ...t.demo.questionsForProvider].slice(0, 5);
  const gaps = buildDynamicGaps(s, t, t.demo.informationGaps);

  // Personalized one-line summary.
  const summaryBits: string[] = [];
  if (s.age !== undefined) summaryBits.push(`You're ${s.age}`);
  if (ctx.timeline) summaryBits.push(`aiming for this in ${ctx.timeline}`);
  const lead = summaryBits.length ? `${summaryBits.join(", ")}. ` : "";
  const summary = lead + t.demo.summary;

  // Collect every cited sourceId for the resolved Sources section.
  const allIds: string[] = [];
  for (const phase of roadmap) for (const item of phase.items) allIds.push(...item.sourceIds);
  for (const q of questions) allIds.push(...q.sourceIds);

  return {
    transitionLabel: t.demo.transitionLabel,
    currentStage: t.demo.currentStage,
    stageStatus: t.demo.stageStatus,
    goal: ctx.goal || t.demo.goal,
    summary,
    roadmap,
    questionsForProvider: questions,
    informationGaps: gaps,
    sources: resolveSources(allIds),
    disclaimer: t.demo.disclaimer,
    generatedBy: "demo",
  };
}
