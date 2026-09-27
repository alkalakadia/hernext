"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Pathway, Source } from "@/lib/types";
import type { TransitionStage } from "@/lib/transitions";

function Cites({ ids, byId }: { ids: string[]; byId: Map<string, Source> }) {
  const valid = ids.filter((id) => byId.has(id));
  if (valid.length === 0) return null;
  return (
    <span className="cites">
      {valid.map((id) => {
        const s = byId.get(id)!;
        return (
          <a
            key={id}
            className="cite"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${s.org}: ${s.title}`}
          >
            {s.org}
          </a>
        );
      })}
    </span>
  );
}

export default function PathwayView({
  pathway,
  stages,
  youAreHere,
  transitionId,
  onRefine,
}: {
  pathway: Pathway;
  stages: TransitionStage[];
  youAreHere: number;
  transitionId: string;
  onRefine?: (extra: string) => void;
}) {
  const byId = useMemo(
    () => new Map(pathway.sources.map((s) => [s.id, s] as const)),
    [pathway.sources]
  );

  const allItems = useMemo(
    () => pathway.roadmap.flatMap((p) => p.items.map((i) => i.text)),
    [pathway.roadmap]
  );

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [listQ, setListQ] = useState<string[]>([]);
  const [listS, setListS] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<number>(youAreHere);
  const [trayOpen, setTrayOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [refineText, setRefineText] = useState("");
  const refineRef = useRef<HTMLInputElement>(null);
  const storeKey = `hernext:${transitionId}:checked`;

  // Load / persist completion state per transition.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setChecked(new Set(JSON.parse(raw)));
      else setChecked(new Set());
    } catch {
      /* ignore */
    }
  }, [storeKey]);

  function persist(next: Set<string>) {
    setChecked(next);
    try {
      localStorage.setItem(storeKey, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }

  function toggleItem(text: string) {
    const next = new Set(checked);
    if (next.has(text)) next.delete(text);
    else next.add(text);
    persist(next);
  }

  function flash(msg: string) {
    setToast(msg);
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setToast(""), 1800);
  }

  function addToVisit(kind: "q" | "s", text: string) {
    if (kind === "q") {
      if (listQ.includes(text)) {
        setListQ(listQ.filter((t) => t !== text));
      } else {
        setListQ([...listQ, text]);
        flash("Added to your appointment list");
      }
    } else {
      if (listS.includes(text)) {
        setListS(listS.filter((t) => t !== text));
      } else {
        setListS([...listS, text]);
        flash("Added to your appointment list");
      }
    }
  }

  const doneCount = allItems.filter((t) => checked.has(t)).length;
  const total = allItems.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const listCount = listQ.length + listS.length;

  function buildText() {
    let out = `HerNext — ${pathway.transitionLabel}\nMy appointment prep\n\n`;
    if (listQ.length) {
      out += "QUESTIONS TO ASK MY PROVIDER\n";
      listQ.forEach((q) => (out += `  • ${q}\n`));
      out += "\n";
    }
    if (listS.length) {
      out += "THINGS TO DO / DISCUSS\n";
      listS.forEach((s) => (out += `  • ${s}\n`));
      out += "\n";
    }
    out += `— ${pathway.disclaimer}\n`;
    return out;
  }

  async function copyList() {
    try {
      await navigator.clipboard.writeText(buildText());
      flash("Copied to clipboard");
    } catch {
      flash("Copy not available in this browser");
    }
  }

  function printList() {
    const w = window.open("", "_blank", "width=640,height=800");
    if (!w) return;
    const esc = (s: string) => s.replace(/</g, "&lt;");
    const li = (arr: string[]) => arr.map((x) => `<li>${esc(x)}</li>`).join("");
    w.document.write(`<!doctype html><html><head><title>HerNext — appointment prep</title>
      <style>
        body{font-family:Georgia,serif;color:#33212f;max-width:640px;margin:40px auto;padding:0 24px;line-height:1.5;}
        h1{font-size:22px;} h2{font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#8f3350;margin-top:26px;}
        ul{padding-left:20px;} li{margin:8px 0;} .d{margin-top:30px;font-size:12px;color:#9a8791;border-top:1px solid #eee;padding-top:12px;}
      </style></head><body>
      <h1>${esc(pathway.transitionLabel)}</h1>
      <p>My appointment prep — from HerNext</p>
      ${listQ.length ? `<h2>Questions to ask</h2><ul>${li(listQ)}</ul>` : ""}
      ${listS.length ? `<h2>Things to do / discuss</h2><ul>${li(listS)}</ul>` : ""}
      <p class="d">${esc(pathway.disclaimer)}</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  function submitRefine() {
    const t = refineText.trim();
    if (!t || !onRefine) return;
    onRefine(t);
    setRefineText("");
  }

  const captionStage = stages[activeStage];
  const caption =
    activeStage === youAreHere
      ? `You are here: `
      : activeStage < youAreHere
      ? `Earlier stage: `
      : `Ahead of you: `;

  let d = 0; // animation delay counter
  const delay = () => ({ animationDelay: `${(d++ * 0.06).toFixed(2)}s` });

  return (
    <div>
      <div className="result-head reveal" style={delay()}>
        <div className="result-label">Your pathway</div>
        <h1>{pathway.transitionLabel}</h1>
        <p className="result-summary">{pathway.summary}</p>
        <div className="badges">
          <span className="badge stage">You are here: {pathway.currentStage}</span>
          <span className="badge goal">Goal: {pathway.goal}</span>
          <span className="badge prov">
            {pathway.generatedBy === "ai" ? "Generated live by Claude" : "Personalized pathway"}
          </span>
        </div>
      </div>

      {/* Interactive pathway map */}
      <div className="map reveal" style={delay()}>
        <div className="map-track">
          {stages.map((s, i) => {
            const cls = i === youAreHere ? "here" : i < youAreHere ? "past" : "future";
            return (
              <div
                className={`map-node ${cls} ${i === activeStage ? "active" : ""}`}
                key={s.key}
                onClick={() => setActiveStage(i)}
                role="button"
              >
                <div className="youare">{i === youAreHere ? "You are here" : ""}</div>
                <div className="bar" />
                <div className="dot" />
                <div className="name">{s.label}</div>
              </div>
            );
          })}
        </div>
        <div className="map-caption">
          {caption}
          <strong>{captionStage?.label}</strong>
          {activeStage === youAreHere ? ` — ${pathway.stageStatus}` : ""}
        </div>
      </div>

      {/* Roadmap with progress + checkable items */}
      <div className="block reveal" style={delay()}>
        <h2>Your roadmap</h2>
        <p className="sub">Check off what you've done. Tap “ask about this” to add it to your appointment list.</p>

        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-num">
            <span className={doneCount ? "progress-done" : ""}>{doneCount}</span> / {total} done
          </span>
        </div>
        {total > 0 && doneCount === total && (
          <div className="progress-done-msg">
            🎉 You're set to walk into that appointment fully prepared.
          </div>
        )}

        {pathway.roadmap.map((phase, i) => (
          <div className="phase" key={i}>
            <div className="ptag">{phase.phase}</div>
            <div className="psub">{phase.subtitle}</div>
            <ul>
              {phase.items.map((item, j) => {
                const isDone = checked.has(item.text);
                const inList = listS.includes(item.text);
                return (
                  <li key={j} className={isDone ? "item-done" : ""}>
                    <input
                      type="checkbox"
                      className="check"
                      checked={isDone}
                      onChange={() => toggleItem(item.text)}
                      aria-label="Mark done"
                    />
                    <span className="item-body">
                      <span className="item-text">{item.text}</span>
                      <Cites ids={item.sourceIds} byId={byId} />
                      <br />
                      <button
                        className={`additem ${inList ? "added" : ""}`}
                        onClick={() => addToVisit("s", item.text)}
                      >
                        {inList ? "✓ on your list" : "+ ask about this"}
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Provider questions */}
      <div className="block reveal" style={delay()}>
        <h2>Questions for your provider</h2>
        <p className="sub">Generated from your situation. Add the ones you want to bring.</p>
        {pathway.questionsForProvider.map((q, i) => {
          const inList = listQ.includes(q.question);
          return (
            <div className="qcard" key={i}>
              <div className="q">
                “{q.question}”
                <Cites ids={q.sourceIds} byId={byId} />
              </div>
              <div className="why">{q.rationale}</div>
              <button
                className={`q-add ${inList ? "added" : ""}`}
                onClick={() => addToVisit("q", q.question)}
              >
                {inList ? "✓ Added to my visit" : "+ Add to my visit"}
              </button>
            </div>
          );
        })}
      </div>

      {/* What we don't know + refine loop */}
      <div className="block reveal" style={delay()}>
        <div className="gaps">
          <h2>What we don't know</h2>
          <p className="sub">
            These could change your plan. Answer any of them and HerNext will sharpen it live.
          </p>
          {pathway.informationGaps.map((g, i) => (
            <div className="gap" key={i}>
              <div>
                <div className="g">{g.gap}</div>
                <div className="gw">{g.whyItMatters}</div>
              </div>
              {onRefine && (
                <button
                  className="gap-answer"
                  onClick={() => refineRef.current?.focus()}
                >
                  answer this →
                </button>
              )}
            </div>
          ))}

          {onRefine && (
            <div className="refine">
              <label>Sharpen your plan</label>
              <p className="rhint">
                Tell us anything above (your age, birth control, cycle, meds…) and we'll rebuild it.
              </p>
              <div className="rrow">
                <input
                  ref={refineRef}
                  value={refineText}
                  onChange={(e) => setRefineText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitRefine()}
                  placeholder="e.g. I'm 34, on the pill, and my cycles are irregular"
                />
                <button className="btn btn-primary" onClick={submitRefine} disabled={!refineText.trim()}>
                  Update my plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="block reveal" style={delay()}>
        <h2>Sources</h2>
        <p className="sub">Every important recommendation traces back here.</p>
        <div className="sources-list">
          {pathway.sources.map((s) => (
            <a
              className="src"
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="st">
                <span className="src-id">{s.org}</span>
                {s.title}
              </div>
              <div className="sm">
                {s.org} · {s.date}
              </div>
              <div className="sr">{s.relevance}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="disclaimer reveal" style={delay()}>
        {pathway.disclaimer}
      </div>

      {/* Floating appointment-list button */}
      <button className="tray-fab" onClick={() => setTrayOpen(true)}>
        🩺 My appointment list
        {listCount > 0 && <span className="tray-count">{listCount}</span>}
      </button>

      {/* Appointment tray */}
      {trayOpen && (
        <div className="tray-overlay" onClick={() => setTrayOpen(false)}>
          <div className="tray" onClick={(e) => e.stopPropagation()}>
            <div className="tray-head">
              <div>
                <h3>Bring this to your appointment</h3>
                <p className="tsub">{pathway.transitionLabel}</p>
              </div>
              <button className="tray-close" onClick={() => setTrayOpen(false)}>
                ×
              </button>
            </div>

            {listCount === 0 ? (
              <div className="tray-empty">
                Nothing added yet. Use “+ Add to my visit” on a question or “+ ask about
                this” on a step, then come back here to copy or print.
              </div>
            ) : (
              <>
                {listQ.length > 0 && (
                  <div className="tray-group">
                    <h4>Questions to ask</h4>
                    {listQ.map((q, i) => (
                      <div className="tray-item" key={i}>
                        <span>{q}</span>
                        <button className="rm" onClick={() => setListQ(listQ.filter((t) => t !== q))}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {listS.length > 0 && (
                  <div className="tray-group">
                    <h4>Things to do / discuss</h4>
                    {listS.map((s, i) => (
                      <div className="tray-item" key={i}>
                        <span>{s}</span>
                        <button className="rm" onClick={() => setListS(listS.filter((t) => t !== s))}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="tray-actions">
                  <button className="btn btn-primary" onClick={copyList}>
                    Copy list
                  </button>
                  <button className="btn btn-ghost" onClick={printList}>
                    Print / Save PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
