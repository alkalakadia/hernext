import type { Pathway, Source } from "./types";

// ---------------------------------------------------------------------------
// EVIDENCE LAYER
// Curated, reputable sources. The AI is only allowed to cite from this list,
// which is why HerNext never says "research shows..." without a real link.
// ---------------------------------------------------------------------------

export const SOURCES: Record<string, Source> = {
  "cdc-preconception": {
    id: "cdc-preconception",
    title: "Planning for Pregnancy — Preconception Health",
    org: "CDC",
    url: "https://www.cdc.gov/preconception/planning.html",
    date: "Reviewed 2024",
    relevance: "National public-health guidance on what to do before trying to conceive.",
  },
  "cdc-folic-acid": {
    id: "cdc-folic-acid",
    title: "Folic Acid Recommendations",
    org: "CDC",
    url: "https://www.cdc.gov/folic-acid/about/index.html",
    date: "Reviewed 2024",
    relevance: "Start folic acid at least one month before conception to lower neural-tube-defect risk.",
  },
  "acog-prepregnancy": {
    id: "acog-prepregnancy",
    title: "Prepregnancy Counseling (Committee Opinion)",
    org: "ACOG",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/01/prepregnancy-counseling",
    date: "Reaffirmed 2023",
    relevance: "The clinical standard for what to review with a clinician before pregnancy.",
  },
  "acog-pcos": {
    id: "acog-pcos",
    title: "Polycystic Ovary Syndrome (PCOS) FAQ",
    org: "ACOG",
    url: "https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos",
    date: "Reviewed 2023",
    relevance: "How PCOS affects ovulation, fertility, and pregnancy planning.",
  },
  "nhs-pcos": {
    id: "nhs-pcos",
    title: "Polycystic Ovary Syndrome — Overview & Treatment",
    org: "NHS",
    url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/",
    date: "Updated 2022",
    relevance: "Plain-language guidance on PCOS management and getting pregnant with PCOS.",
  },
  "asrm-ovulation": {
    id: "asrm-ovulation",
    title: "Ovulation Detection & Optimizing Natural Fertility",
    org: "ASRM (Reproductive Facts)",
    url: "https://www.reproductivefacts.org/topics/topics-index/ovulation-detection/",
    date: "2023",
    relevance: "How to track ovulation and time intercourse, which matters most with irregular cycles.",
  },
  "asrm-infertility": {
    id: "asrm-infertility",
    title: "When to See a Fertility Specialist",
    org: "ASRM (Reproductive Facts)",
    url: "https://www.reproductivefacts.org/topics/topics-index/when-to-see-a-specialist/",
    date: "2023",
    relevance: "The timelines (12 vs 6 months) and conditions that warrant an earlier evaluation.",
  },
  "acog-immunization": {
    id: "acog-immunization",
    title: "Immunization Before, During, and After Pregnancy",
    org: "ACOG",
    url: "https://www.acog.org/womens-health/faqs/immunization-and-pregnancy",
    date: "Reviewed 2023",
    relevance: "Which vaccines (e.g., MMR, varicella) are best updated before conceiving.",
  },
  "cdc-contraception-return": {
    id: "cdc-contraception-return",
    title: "Contraception & Return to Fertility",
    org: "CDC",
    url: "https://www.cdc.gov/contraception/about/index.html",
    date: "Reviewed 2024",
    relevance: "How quickly fertility returns after stopping different birth-control methods.",
  },
  "cdc-mec": {
    id: "cdc-mec",
    title: "U.S. Medical Eligibility Criteria for Contraceptive Use",
    org: "CDC",
    url: "https://www.cdc.gov/contraception/hcp/usmec/index.html",
    date: "2024",
    relevance: "Which contraceptive methods are appropriate given specific health conditions.",
  },
  "acog-postpartum": {
    id: "acog-postpartum",
    title: "Optimizing Postpartum Care",
    org: "ACOG",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care",
    date: "Reaffirmed 2021",
    relevance: "The postpartum visit should be an ongoing process, ideally starting within 3 weeks.",
  },
  "cdc-hear-her": {
    id: "cdc-hear-her",
    title: "Urgent Maternal Warning Signs (Hear Her)",
    org: "CDC",
    url: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
    date: "Reviewed 2024",
    relevance: "Postpartum symptoms that need same-day medical attention.",
  },
  "acog-postpartum-depression": {
    id: "acog-postpartum-depression",
    title: "Postpartum Depression",
    org: "ACOG",
    url: "https://www.acog.org/womens-health/faqs/postpartum-depression",
    date: "Reviewed 2023",
    relevance: "Screening and support for mood changes after birth.",
  },
  "acog-birth-spacing": {
    id: "acog-birth-spacing",
    title: "Interpregnancy Care & Birth Spacing",
    org: "ACOG",
    url: "https://www.acog.org/clinical/clinical-guidance/obstetric-care-consensus/articles/2019/01/interpregnancy-care",
    date: "2019",
    relevance: "Recommended interval between pregnancies and contraception options while breastfeeding.",
  },
  "who-anc": {
    id: "who-anc",
    title: "Recommendations on Antenatal Care for a Positive Pregnancy Experience",
    org: "WHO",
    url: "https://www.who.int/publications/i/item/9789241549912",
    date: "2016",
    relevance: "Global standard for the number and content of prenatal visits.",
  },
  "nice-menopause": {
    id: "nice-menopause",
    title: "Menopause: Diagnosis and Management (NG23)",
    org: "NICE",
    url: "https://www.nice.org.uk/guidance/ng23",
    date: "Updated 2024",
    relevance: "Evidence-based guidance on perimenopausal symptoms and treatment options.",
  },
  "menopause-society": {
    id: "menopause-society",
    title: "Menopause & Perimenopause Basics",
    org: "The Menopause Society",
    url: "https://www.menopause.org/for-women",
    date: "2023",
    relevance: "What perimenopause is and what changes to expect in the transition.",
  },
};

// ---------------------------------------------------------------------------
// TRANSITION MODEL
// ---------------------------------------------------------------------------

export interface TransitionStage {
  key: string;
  label: string;
}

export interface Transition {
  id: string;
  // What the user picks on the onboarding screen: a life change, not a condition.
  whatsChanging: string;
  chip: string; // short tag shown on the option card
  goalSuggestions: string[];
  // The pathway map nodes; youAreHere marks the highlighted node.
  stages: TransitionStage[];
  youAreHere: number;
  // Which curated sources are relevant to this transition (grounds the AI).
  relevantSourceIds: string[];
  // Extra grounding notes handed to the AI for this specific transition.
  grounding: string;
  // Whether this transition is fully built (demo-ready) or a preview placeholder.
  status: "ready" | "preview";
  // Offline fallback content — used when there is no API key or the call fails.
  demo: Omit<Pathway, "generatedBy">;
}

function resolve(ids: string[]): Source[] {
  return ids.map((id) => SOURCES[id]).filter(Boolean);
}

export const TRANSITIONS: Transition[] = [
  // -------------------------------------------------------------------------
  // 1. PCOS -> Pregnancy planning  (main demo)
  // -------------------------------------------------------------------------
  {
    id: "pcos-fertility",
    whatsChanging: "I have PCOS and I'm thinking about getting pregnant",
    chip: "PCOS → Pregnancy planning",
    goalSuggestions: ["Prepare for pregnancy", "Understand my fertility", "Come off birth control safely"],
    stages: [
      { key: "pcos", label: "PCOS" },
      { key: "preconception", label: "Preconception" },
      { key: "trying", label: "Trying to conceive" },
      { key: "pregnancy", label: "Pregnancy" },
    ],
    youAreHere: 1,
    relevantSourceIds: [
      "acog-pcos",
      "nhs-pcos",
      "cdc-preconception",
      "cdc-folic-acid",
      "acog-prepregnancy",
      "asrm-ovulation",
      "asrm-infertility",
      "acog-immunization",
      "cdc-contraception-return",
    ],
    grounding:
      "PCOS commonly causes irregular or absent ovulation, which is the main way it affects time-to-pregnancy. Preconception steps that matter: starting folic acid before conception, reviewing any current medications for pregnancy safety, updating vaccines, and discussing ovulation and weight/metabolic health. Coming off hormonal contraception does not cause infertility; fertility typically returns quickly, though PCOS-related cycle irregularity may resurface. Note when an earlier fertility evaluation is warranted (e.g., known ovulation problems).",
    status: "ready",
    demo: {
      transitionLabel: "PCOS → Pregnancy Planning",
      currentStage: "Preconception",
      stageStatus: "Preparing",
      goal: "Prepare for pregnancy",
      summary:
        "You're in the preconception window: still preventing pregnancy now, but getting your health and questions lined up so that when you start trying, you start from a strong, informed place.",
      roadmap: [
        {
          phase: "NOW",
          subtitle: "Things to start or discuss with your clinician",
          items: [
            {
              text: "Start a daily folic acid supplement (typically 400 mcg) at least a month before you begin trying.",
              sourceIds: ["cdc-folic-acid", "cdc-preconception"],
            },
            {
              text: "Book a preconception visit to review your PCOS management, medications, and metabolic health.",
              sourceIds: ["acog-prepregnancy", "acog-pcos"],
            },
            {
              text: "Ask whether any vaccines (like MMR or varicella) should be updated before you conceive.",
              sourceIds: ["acog-immunization"],
            },
          ],
        },
        {
          phase: "BEFORE TRYING",
          subtitle: "Topics to review while you're still preventing",
          items: [
            {
              text: "Make a plan for stopping contraception and what to expect as your natural cycle returns.",
              sourceIds: ["cdc-contraception-return"],
            },
            {
              text: "Learn how to track ovulation, since PCOS can make cycles irregular and timing harder to predict.",
              sourceIds: ["asrm-ovulation", "nhs-pcos"],
            },
          ],
        },
        {
          phase: "WHEN YOU'RE READY",
          subtitle: "What changes when you start trying",
          items: [
            {
              text: "Begin timed, regular intercourse and continue folic acid as you move into the trying-to-conceive stage.",
              sourceIds: ["asrm-ovulation", "cdc-preconception"],
            },
            {
              text: "Because PCOS can affect ovulation, ask your clinician when an earlier fertility evaluation would make sense for you.",
              sourceIds: ["asrm-infertility"],
            },
          ],
        },
      ],
      questionsForProvider: [
        {
          question:
            "Given my PCOS and that I want to start trying in about a year, which parts of my current treatment plan should we review before then?",
          rationale: "Some medications and management choices change when pregnancy is the goal.",
          sourceIds: ["acog-pcos", "acog-prepregnancy"],
        },
        {
          question: "How will I know if I'm ovulating, and what tracking method fits my cycles?",
          rationale: "PCOS often causes irregular ovulation, which is the biggest factor in timing.",
          sourceIds: ["asrm-ovulation", "nhs-pcos"],
        },
        {
          question: "At what point, after I start trying, should I come back for a fertility evaluation?",
          rationale: "Known ovulation issues can justify an earlier evaluation than the standard timeline.",
          sourceIds: ["asrm-infertility"],
        },
      ],
      informationGaps: [
        {
          gap: "We don't know which contraceptive method you're using or how long you've been on it.",
          whyItMatters: "Return-to-fertility timelines differ by method, which affects when to stop.",
        },
        {
          gap: "We don't know your current PCOS treatment or whether your cycles are regular.",
          whyItMatters: "This changes how ovulation is tracked and whether earlier support is useful.",
        },
      ],
      sources: resolve([
        "cdc-folic-acid",
        "cdc-preconception",
        "acog-prepregnancy",
        "acog-pcos",
        "acog-immunization",
        "cdc-contraception-return",
        "asrm-ovulation",
        "nhs-pcos",
        "asrm-infertility",
      ]),
      disclaimer:
        "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider, who knows your full history.",
    },
  },

  // -------------------------------------------------------------------------
  // 2. Contraception -> Pregnancy planning
  // -------------------------------------------------------------------------
  {
    id: "contraception-pregnancy",
    whatsChanging: "I'm on birth control and want to start trying",
    chip: "Contraception → Pregnancy planning",
    goalSuggestions: ["Come off birth control safely", "Prepare for pregnancy", "Understand my cycle"],
    stages: [
      { key: "contraception", label: "Contraception" },
      { key: "preconception", label: "Preconception" },
      { key: "trying", label: "Trying to conceive" },
      { key: "pregnancy", label: "Pregnancy" },
    ],
    youAreHere: 1,
    relevantSourceIds: [
      "cdc-contraception-return",
      "cdc-preconception",
      "cdc-folic-acid",
      "acog-prepregnancy",
      "asrm-ovulation",
      "acog-immunization",
      "asrm-infertility",
    ],
    grounding:
      "Fertility generally returns quickly after stopping most contraception; the copper and hormonal IUDs and the implant require a clinician to remove them, and the contraceptive injection can have a longer delay before cycles resume. Folic acid should begin before conception. A preconception visit reviews medications, chronic conditions, and vaccines. Cycle tracking helps time intercourse once contraception stops.",
    status: "ready",
    demo: {
      transitionLabel: "Contraception → Pregnancy Planning",
      currentStage: "Preconception",
      stageStatus: "Preparing",
      goal: "Come off birth control and prepare for pregnancy",
      summary:
        "You're moving from preventing pregnancy to planning for it. The next steps are stopping contraception thoughtfully and getting your health ready before you start trying.",
      roadmap: [
        {
          phase: "NOW",
          subtitle: "Things to start or discuss with your clinician",
          items: [
            {
              text: "Start a daily folic acid supplement at least one month before you begin trying.",
              sourceIds: ["cdc-folic-acid", "cdc-preconception"],
            },
            {
              text: "Book a preconception visit to review medications, health conditions, and vaccines.",
              sourceIds: ["acog-prepregnancy", "acog-immunization"],
            },
          ],
        },
        {
          phase: "BEFORE TRYING",
          subtitle: "Plan how you'll stop contraception",
          items: [
            {
              text: "Ask how fertility returns after your specific method — some (IUD, implant) need removal, and the injection can take longer.",
              sourceIds: ["cdc-contraception-return"],
            },
            {
              text: "Learn to recognize your fertile window so you can time intercourse once you stop.",
              sourceIds: ["asrm-ovulation"],
            },
          ],
        },
        {
          phase: "WHEN YOU'RE READY",
          subtitle: "What changes when you start trying",
          items: [
            {
              text: "Stop contraception per your plan and begin regular, timed intercourse while continuing folic acid.",
              sourceIds: ["cdc-preconception", "asrm-ovulation"],
            },
            {
              text: "Know the standard timeline for seeking a fertility evaluation if pregnancy doesn't happen.",
              sourceIds: ["asrm-infertility"],
            },
          ],
        },
      ],
      questionsForProvider: [
        {
          question: "For the method I'm on, how soon can I expect my fertility to return after stopping?",
          rationale: "This determines when to stop and how long to expect before cycles normalize.",
          sourceIds: ["cdc-contraception-return"],
        },
        {
          question: "Are there any medications or health issues of mine I should address before conceiving?",
          rationale: "Preconception is the ideal time to adjust anything not pregnancy-safe.",
          sourceIds: ["acog-prepregnancy"],
        },
      ],
      informationGaps: [
        {
          gap: "We don't know your exact contraceptive method.",
          whyItMatters: "Return-to-fertility timing and whether you need a removal appointment depend on it.",
        },
        {
          gap: "We don't know your age or how long you plan to wait.",
          whyItMatters: "This affects how proactive to be about fertility evaluation timelines.",
        },
      ],
      sources: resolve([
        "cdc-folic-acid",
        "cdc-preconception",
        "acog-prepregnancy",
        "acog-immunization",
        "cdc-contraception-return",
        "asrm-ovulation",
        "asrm-infertility",
      ]),
      disclaimer:
        "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider, who knows your full history.",
    },
  },

  // -------------------------------------------------------------------------
  // 3. Pregnancy -> Postpartum
  // -------------------------------------------------------------------------
  {
    id: "pregnancy-postpartum",
    whatsChanging: "I'm pregnant and thinking about after the birth",
    chip: "Pregnancy → Postpartum",
    goalSuggestions: ["Prepare for recovery", "Plan postpartum support", "Understand warning signs"],
    stages: [
      { key: "pregnancy", label: "Pregnancy" },
      { key: "birth", label: "Birth" },
      { key: "postpartum", label: "Postpartum" },
      { key: "recovery", label: "Recovery & beyond" },
    ],
    youAreHere: 0,
    relevantSourceIds: [
      "acog-postpartum",
      "cdc-hear-her",
      "acog-postpartum-depression",
      "acog-birth-spacing",
      "who-anc",
    ],
    grounding:
      "Postpartum care should be an ongoing process rather than a single 6-week visit, ideally with contact within the first 3 weeks. Key preparation topics: recognizing urgent maternal warning signs, planning for mood and mental-health support, feeding support, and contraception/birth-spacing decisions. This is navigation for planning, not clinical management of the pregnancy itself.",
    status: "ready",
    demo: {
      transitionLabel: "Pregnancy → Postpartum",
      currentStage: "Pregnancy",
      stageStatus: "Planning ahead",
      goal: "Prepare for postpartum recovery and support",
      summary:
        "You're still pregnant, but the postpartum period is easier when it's planned for in advance — recovery, mental health, feeding, and warning signs are all better handled before birth than after.",
      roadmap: [
        {
          phase: "NOW",
          subtitle: "Set up your postpartum plan while pregnant",
          items: [
            {
              text: "Ask your provider to help you build a postpartum care plan, including an early check-in within the first 3 weeks.",
              sourceIds: ["acog-postpartum"],
            },
            {
              text: "Learn the urgent maternal warning signs so you and your support people know when to seek same-day care.",
              sourceIds: ["cdc-hear-her"],
            },
          ],
        },
        {
          phase: "AFTER BIRTH",
          subtitle: "The first weeks",
          items: [
            {
              text: "Plan for mood and mental-health support, and know that screening for postpartum depression is routine and important.",
              sourceIds: ["acog-postpartum-depression"],
            },
            {
              text: "Line up feeding support (lactation or feeding help) before you need it.",
              sourceIds: ["acog-postpartum"],
            },
          ],
        },
        {
          phase: "LOOKING AHEAD",
          subtitle: "Recovery and future planning",
          items: [
            {
              text: "Discuss contraception and birth spacing, including options that are compatible with breastfeeding.",
              sourceIds: ["acog-birth-spacing"],
            },
          ],
        },
      ],
      questionsForProvider: [
        {
          question: "What should my postpartum check-in schedule look like, and who do I call between visits?",
          rationale: "Postpartum care works best as an ongoing process, not one visit at 6 weeks.",
          sourceIds: ["acog-postpartum"],
        },
        {
          question: "Which symptoms after birth mean I should be seen the same day?",
          rationale: "Knowing urgent warning signs in advance saves critical time.",
          sourceIds: ["cdc-hear-her"],
        },
        {
          question: "What are my contraception options after birth if I'm breastfeeding?",
          rationale: "Birth-spacing and method choice are best decided before delivery.",
          sourceIds: ["acog-birth-spacing"],
        },
      ],
      informationGaps: [
        {
          gap: "We don't know how far along you are or whether this is your first baby.",
          whyItMatters: "Timing and priorities differ across the third trimester and by experience.",
        },
        {
          gap: "We don't know your delivery plan or any pregnancy complications.",
          whyItMatters: "Recovery planning and warning-sign vigilance depend on these details.",
        },
      ],
      sources: resolve([
        "acog-postpartum",
        "cdc-hear-her",
        "acog-postpartum-depression",
        "acog-birth-spacing",
      ]),
      disclaimer:
        "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider, who knows your full history.",
    },
  },

  // -------------------------------------------------------------------------
  // Preview transitions — same engine, lighter content (proves it scales).
  // -------------------------------------------------------------------------
  {
    id: "trying-difficulty",
    whatsChanging: "I've been trying and it hasn't happened yet",
    chip: "Trying → Fertility support",
    goalSuggestions: ["Know when to get help", "Understand my options"],
    stages: [
      { key: "trying", label: "Trying to conceive" },
      { key: "evaluation", label: "Evaluation" },
      { key: "treatment", label: "Treatment options" },
      { key: "pregnancy", label: "Pregnancy" },
    ],
    youAreHere: 0,
    relevantSourceIds: ["asrm-infertility", "asrm-ovulation", "cdc-preconception"],
    grounding:
      "The standard threshold for a fertility evaluation is 12 months of trying (or 6 months if age 35+), and earlier with known risk factors like irregular cycles. This is navigation toward evaluation, not diagnosis.",
    status: "preview",
    demo: {
      transitionLabel: "Trying → Fertility Support",
      currentStage: "Trying to conceive",
      stageStatus: "Considering next steps",
      goal: "Understand when and how to get support",
      summary:
        "This transition is a preview built on the same engine. It points you toward the right timeline for a fertility evaluation.",
      roadmap: [
        {
          phase: "NOW",
          subtitle: "Understand the timeline",
          items: [
            {
              text: "Know the evaluation thresholds: about 12 months of trying, or 6 months if you're 35 or older.",
              sourceIds: ["asrm-infertility"],
            },
            {
              text: "Confirm you're timing intercourse to your fertile window.",
              sourceIds: ["asrm-ovulation"],
            },
          ],
        },
      ],
      questionsForProvider: [
        {
          question: "Based on my age and how long we've been trying, should we start an evaluation now?",
          rationale: "Thresholds shift with age and risk factors.",
          sourceIds: ["asrm-infertility"],
        },
      ],
      informationGaps: [
        {
          gap: "We don't know your age or how long you've been trying.",
          whyItMatters: "Both determine whether an evaluation is recommended yet.",
        },
      ],
      sources: resolve(["asrm-infertility", "asrm-ovulation", "cdc-preconception"]),
      disclaimer:
        "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider.",
    },
  },
  {
    id: "menopause",
    whatsChanging: "I'm noticing changes around menopause",
    chip: "Perimenopause → Menopause",
    goalSuggestions: ["Understand my symptoms", "Learn my options"],
    stages: [
      { key: "perimenopause", label: "Perimenopause" },
      { key: "menopause", label: "Menopause" },
      { key: "postmenopause", label: "Postmenopause" },
    ],
    youAreHere: 0,
    relevantSourceIds: ["nice-menopause", "menopause-society"],
    grounding:
      "Perimenopause is the transition before menopause, marked by cycle and symptom changes. Navigation covers understanding symptoms and knowing that evidence-based treatment options exist to discuss with a clinician.",
    status: "preview",
    demo: {
      transitionLabel: "Perimenopause → Menopause",
      currentStage: "Perimenopause",
      stageStatus: "Understanding the change",
      goal: "Understand what's happening and what my options are",
      summary:
        "This transition is a preview built on the same engine. It helps you make sense of perimenopausal changes and prepare to discuss options.",
      roadmap: [
        {
          phase: "NOW",
          subtitle: "Make sense of the change",
          items: [
            {
              text: "Learn what perimenopause is and which symptoms are commonly part of it.",
              sourceIds: ["menopause-society"],
            },
            {
              text: "Know that evidence-based treatment options exist and can be discussed with a clinician.",
              sourceIds: ["nice-menopause"],
            },
          ],
        },
      ],
      questionsForProvider: [
        {
          question: "Which of my symptoms are likely perimenopausal, and what options do I have to manage them?",
          rationale: "Symptoms overlap with other conditions; a clinician can help sort them out.",
          sourceIds: ["nice-menopause", "menopause-society"],
        },
      ],
      informationGaps: [
        {
          gap: "We don't know your specific symptoms or health history.",
          whyItMatters: "Both shape which options are appropriate to consider.",
        },
      ],
      sources: resolve(["nice-menopause", "menopause-society"]),
      disclaimer:
        "HerNext is a navigation tool, not medical advice or diagnosis. It helps you prepare for the conversation with your healthcare provider.",
    },
  },
];

export function getTransition(id: string): Transition | undefined {
  return TRANSITIONS.find((t) => t.id === id);
}

// Given a set of source IDs, return the resolved source objects (deduped, in order).
export function resolveSources(ids: string[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const s = SOURCES[id];
    if (s) {
      seen.add(id);
      out.push(s);
    }
  }
  return out;
}
