# HerNext — 3-minute demo script

Have `npm run dev` running at http://localhost:3000. Offline demo mode is fine; if you
have an `ANTHROPIC_API_KEY` set, the plan is generated live by Claude.

### 0:00 — The problem (landing page)

> "Women's healthcare doesn't happen in neat categories."

Point at the strip: PCOS → fertility → pregnancy → postpartum → contraception → fertility.

> "Most digital health products are built around one stage. But women move between stages."

### 0:20 — Introduce HerNext

Click **Build my path**. On step 1, click **▶ Run the demo scenario** (31, PCOS, on
contraception, wants pregnancy in ~12 months).

> "You don't pick a condition from a menu. You say what's changing. The engine
> identifies the transition."

### 0:40 — The AI builds the pathway

The loading steps narrate the agent: identify transition → retrieve sources → generate
pathway → check gaps → cite. Land on the result:

- **Pathway map**: PCOS → Preconception (you are here) → Trying → Pregnancy
- **Roadmap**: NOW / BEFORE TRYING / WHEN YOU'RE READY

> "It's navigation, not diagnosis. It never prescribes."

### 1:10 — The wow feature: questions for your doctor

Scroll to **Questions for your provider**. Read one aloud:

> "Given my PCOS and that I want to start trying in about a year, which parts of my
> current treatment plan should we review before then?"

> "Not 'what is PCOS.' This is personalized to her situation."

### 1:30 — What am I missing

Scroll to **What we don't know**.

> "The agent knows its own limits. It names the gaps that could change the plan, like
> her exact contraceptive method or whether her cycles are regular, and why each one
> matters."

### 1:50 — Show the platform

Scroll to the bottom card: **The same engine, a different transition.** Click
**Pregnancy → Postpartum →**. The exact same engine produces a completely different
pathway (postpartum warning signs, mental health, birth spacing).

Optionally click one more (**Contraception → Pregnancy planning**).

> "This isn't a PCOS app. It's a women's-health transition platform."

### 2:10 — The business (Strato VC)

> "We start with one wedge: PCOS → fertility planning. Then we expand along the journey:
> contraception, pregnancy, postpartum, fertility again, perimenopause."
>
> "Business models: B2C premium navigation, B2B for women's-health providers, and
> employer benefits. We don't have to build them today. We've shown the engine that
> makes the expansion credible."

### 2:35 — Close

> "HerNext doesn't replace your doctor. It makes sure you walk into the conversation
> knowing what comes next."
>
> "Because women's healthcare isn't one destination. It's a journey between stages."

---

**If a judge asks "is this just ChatGPT with a UI?"** — Two answers: (1) the evidence
layer constrains the model to cite only curated, reputable sources, and the server
resolves every citation, so it can't hallucinate references. (2) the information-gaps
tool makes it reason about what it doesn't know, which a generic chatbot won't do.
