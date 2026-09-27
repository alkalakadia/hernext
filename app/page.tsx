import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <Link href="/" className="brand">
            Her<span className="dot">Next</span>
          </Link>
          <span>
            <Link href="/business" className="nav-link" style={{ marginRight: 20 }}>
              For employers
            </Link>
            <Link href="/journey" className="nav-link">
              Start my journey →
            </Link>
          </span>
        </nav>

        <section className="hero">
          <span className="eyebrow">AI transition engine for women's health</span>
          <h1>
            Navigate <em>what's next</em>.
          </h1>
          <p className="lede">
            Women's healthcare doesn't happen in neat categories. HerNext turns a
            healthcare transition into a personalized, evidence-backed action plan:
            what's ahead, what to ask your provider, and what to do now.
          </p>
          <Link href="/journey" className="btn btn-primary">
            Build my path
          </Link>
        </section>

        <section className="strip">
          <h3>Most products are built around one stage. Women move between them.</h3>
          <p>The same engine follows the whole journey.</p>
          <div className="flow">
            <span className="node">PCOS</span>
            <span className="arrow">→</span>
            <span className="node">Fertility</span>
            <span className="arrow">→</span>
            <span className="node">Pregnancy</span>
            <span className="arrow">→</span>
            <span className="node">Postpartum</span>
            <span className="arrow">→</span>
            <span className="node">Contraception</span>
            <span className="arrow">→</span>
            <span className="node">Fertility again</span>
          </div>
        </section>

        <h2 className="section-title">Why it feels different</h2>
        <div className="pillars">
          <div className="pillar">
            <h4>It finds the transition</h4>
            <p>
              You don't pick a condition from a menu. You say what's changing in your
              life, and the engine identifies the transition you're actually in.
            </p>
          </div>
          <div className="pillar">
            <h4>It knows what it doesn't know</h4>
            <p>
              HerNext names the gaps in your situation that could change the plan, so
              you walk into your appointment aware of them.
            </p>
          </div>
          <div className="pillar">
            <h4>Every recommendation is cited</h4>
            <p>
              Guidance links to reputable sources like ACOG, CDC, NHS, and WHO. Never
              "research shows" without the evidence behind it.
            </p>
          </div>
        </div>

        <div className="strip" style={{ marginTop: 30 }}>
          <h3>It doesn't replace your doctor.</h3>
          <p style={{ marginBottom: 0 }}>
            It makes sure you walk into the conversation knowing what comes next,
            because women's healthcare isn't one destination. It's a journey between
            stages.
          </p>
        </div>

        <footer className="footer">
          <span>HerNext — navigation, not medical advice.</span>
          <span>Demonstrating the engine first on PCOS → Fertility.</span>
        </footer>
      </div>
    </main>
  );
}
