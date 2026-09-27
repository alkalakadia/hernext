"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TRANSITIONS, getTransition } from "@/lib/transitions";
import type { Pathway, UserContext } from "@/lib/types";
import PathwayView from "@/components/PathwayView";

type Step = "select" | "details" | "loading" | "result";

const LOADING_STEPS = [
  "Identifying your life stage and transition…",
  "Retrieving trusted medical sources…",
  "Generating your personalized pathway…",
  "Checking what we don't know about your situation…",
  "Citing every recommendation…",
];

export default function Journey() {
  const [step, setStep] = useState<Step>("select");
  const [selectedId, setSelectedId] = useState<string>("");
  const [goal, setGoal] = useState("");
  const [age, setAge] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const loadingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const selected = getTransition(selectedId);

  useEffect(() => {
    return () => {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
    };
  }, []);

  function chooseTransition(id: string) {
    setSelectedId(id);
    const t = getTransition(id);
    if (t && t.goalSuggestions[0]) setGoal(t.goalSuggestions[0]);
    setStep("details");
  }

  // One-click demo scenario from the pitch: 31, PCOS, on contraception, ~12 months.
  function runDemoScenario() {
    setSelectedId("pcos-fertility");
    setGoal("Prepare for pregnancy");
    setAge("31");
    setTimeline("about 12 months");
    setDetails(
      "I have PCOS and I'm currently using contraception. I want to try for pregnancy in about a year but I'm not sure what I should be doing now."
    );
    submit({
      transitionId: "pcos-fertility",
      transitionPhrase: "I have PCOS and I'm thinking about getting pregnant",
      goal: "Prepare for pregnancy",
      age: "31",
      timeline: "about 12 months",
      details:
        "I have PCOS and I'm currently using contraception. I want to try for pregnancy in about a year but I'm not sure what I should be doing now.",
    });
  }

  async function submit(ctx: UserContext) {
    setError("");
    setPathway(null);
    setStep("loading");
    setLoadingStep(0);
    if (loadingTimer.current) clearInterval(loadingTimer.current);
    loadingTimer.current = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 1400);

    try {
      const res = await fetch("/api/pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctx),
      });
      const data = await res.json();
      if (loadingTimer.current) clearInterval(loadingTimer.current);
      if (!res.ok || !data.pathway) {
        throw new Error(data.error || "Something went wrong.");
      }
      setPathway(data.pathway);
      setStep("result");
    } catch (e: any) {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
      setError(e.message || "Something went wrong.");
      setStep("details");
    }
  }

  function submitFromForm() {
    if (!selected) return;
    submit({
      transitionId: selected.id,
      transitionPhrase: selected.whatsChanging,
      goal: goal || selected.goalSuggestions[0] || "",
      age,
      timeline,
      details,
    });
  }

  // Switch transitions from the result view (the "this is a platform" moment).
  function switchTransition(id: string) {
    const t = getTransition(id);
    if (!t) return;
    setSelectedId(id);
    setGoal(t.goalSuggestions[0] || "");
    submit({
      transitionId: t.id,
      transitionPhrase: t.whatsChanging,
      goal: t.goalSuggestions[0] || "",
      age: "",
      timeline: "",
      details: "",
    });
  }

  return (
    <main>
      <div className="wrap-narrow">
        <nav className="nav">
          <Link href="/" className="brand">
            Her<span className="dot">Next</span>
          </Link>
          {step !== "select" && step !== "loading" && (
            <button
              className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => {
                setStep("select");
                setPathway(null);
              }}
            >
              ← Start over
            </button>
          )}
        </nav>

        {/* STEP 1 — What's changing */}
        {step === "select" && (
          <section className="stepper">
            <div className="step-label">Step 1 of 2</div>
            <h2 className="step-q">What's changing in your life?</h2>
            <p className="step-hint">
              Not a condition to look up. A transition to navigate. Pick the one that
              fits best.
            </p>
            <div className="options">
              {TRANSITIONS.map((t) => (
                <button
                  key={t.id}
                  className={`option ${selectedId === t.id ? "selected" : ""}`}
                  onClick={() => chooseTransition(t.id)}
                >
                  <span className="o-main">{t.whatsChanging}</span>
                  <span className={`o-chip ${t.status === "preview" ? "preview" : ""}`}>
                    {t.status === "preview" ? "Preview" : t.chip}
                  </span>
                </button>
              ))}
            </div>
            <div className="row-actions">
              <span className="mode-note">
                The engine identifies the transition, then builds the plan.
              </span>
              <button className="btn btn-ghost" onClick={runDemoScenario}>
                ▶ Run the demo scenario
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 — Details */}
        {step === "details" && selected && (
          <section className="stepper">
            <div className="step-label">Step 2 of 2</div>
            <h2 className="step-q">Tell us a little more.</h2>
            <p className="step-hint">
              Navigating: <strong>{selected.whatsChanging}</strong>. The more you share,
              the more personalized and the more honest the plan is about what it can't
              know.
            </p>

            <div className="field">
              <label>What's your goal?</label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Prepare for pregnancy"
              />
              <div className="chips">
                {selected.goalSuggestions.map((g) => (
                  <button
                    key={g}
                    className={`chip-btn ${goal === g ? "active" : ""}`}
                    onClick={() => setGoal(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Age (optional)</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 31"
              />
            </div>

            <div className="field">
              <label>Timeline (optional)</label>
              <input
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. about 12 months"
              />
            </div>

            <div className="field">
              <label>Anything else? (optional)</label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Conditions, medications, current birth control, or anything on your mind."
              />
            </div>

            {error && (
              <p style={{ color: "var(--berry-deep)", fontSize: 14 }}>{error}</p>
            )}

            <div className="row-actions">
              <button className="btn btn-ghost" onClick={() => setStep("select")}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={submitFromForm}>
                Build my path
              </button>
            </div>
          </section>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <section className="loading">
            <div className="spinner" />
            <div className="pulse">Building your path…</div>
            <div className="steps-live">{LOADING_STEPS[loadingStep]}</div>
          </section>
        )}
      </div>

      {/* RESULT — wider container */}
      {step === "result" && pathway && selected && (
        <div className="wrap">
          <PathwayView
            pathway={pathway}
            stages={selected.stages}
            youAreHere={selected.youAreHere}
          />

          <div className="replatform">
            <h3>The same engine, a different transition.</h3>
            <p>
              This isn't a PCOS app. Switch the transition and watch the engine build a
              new pathway from the same machinery.
            </p>
            <div className="flow" style={{ marginTop: 14 }}>
              {TRANSITIONS.filter((t) => t.id !== selected.id)
                .slice(0, 4)
                .map((t) => (
                  <button
                    key={t.id}
                    className="chip-btn"
                    onClick={() => switchTransition(t.id)}
                  >
                    {t.chip} →
                  </button>
                ))}
            </div>
          </div>

          <footer className="footer">
            <span>HerNext — navigation, not medical advice.</span>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </footer>
        </div>
      )}
    </main>
  );
}
