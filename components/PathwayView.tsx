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
}: {
  pathway: Pathway;
  stages: TransitionStage[];
  youAreHere: number;
}) {
  const byId = new Map(pathway.sources.map((s) => [s.id, s]));

  return (
    <div>
      <div className="result-head">
        <div className="result-label">Your pathway</div>
        <h1>{pathway.transitionLabel}</h1>
        <p className="result-summary">{pathway.summary}</p>
        <div className="badges">
          <span className="badge stage">You are here: {pathway.currentStage}</span>
          <span className="badge goal">Goal: {pathway.goal}</span>
          <span className="badge prov">
            {pathway.generatedBy === "ai" ? "Generated live by Claude" : "Curated demo pathway"}
          </span>
        </div>
      </div>

      {/* Pathway map */}
      <div className="map">
        <div className="map-track">
          {stages.map((s, i) => {
            const cls = i === youAreHere ? "here" : i < youAreHere ? "past" : "future";
            return (
              <div className={`map-node ${cls}`} key={s.key}>
                <div className="youare">{i === youAreHere ? "You are here" : ""}</div>
                <div className="bar" />
                <div className="dot" />
                <div className="name">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap */}
      <div className="block">
        <h2>Your roadmap</h2>
        <p className="sub">Ordered in time. Each step links to its evidence.</p>
        {pathway.roadmap.map((phase, i) => (
          <div className="phase" key={i}>
            <div className="ptag">{phase.phase}</div>
            <div className="psub">{phase.subtitle}</div>
            <ul>
              {phase.items.map((item, j) => (
                <li key={j}>
                  <span className="tick">→</span>
                  <span>
                    {item.text}
                    <Cites ids={item.sourceIds} byId={byId} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Questions for provider */}
      <div className="block">
        <h2>Questions for your provider</h2>
        <p className="sub">Generated from your situation, not a generic list.</p>
        {pathway.questionsForProvider.map((q, i) => (
          <div className="qcard" key={i}>
            <div className="q">
              “{q.question}”
              <Cites ids={q.sourceIds} byId={byId} />
            </div>
            <div className="why">{q.rationale}</div>
          </div>
        ))}
      </div>

      {/* What we don't know */}
      <div className="block">
        <div className="gaps">
          <h2>What we don't know</h2>
          <p className="sub">
            These could materially change your plan. Worth raising with your provider.
          </p>
          {pathway.informationGaps.map((g, i) => (
            <div className="gap" key={i}>
              <div className="g">{g.gap}</div>
              <div className="gw">{g.whyItMatters}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="block">
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

      <div className="disclaimer">{pathway.disclaimer}</div>
    </div>
  );
}
