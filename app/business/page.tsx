"use client";

import { useState } from "react";
import Link from "next/link";

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

export default function Business() {
  const [employees, setEmployees] = useState(5000);
  const [pmpm, setPmpm] = useState(2); // fee per female employee per month
  const [valuePerMember, setValuePerMember] = useState(1200); // cost avoided per navigated member/yr

  const transitionRate = 0.15; // share in a reproductive transition per year
  const navigated = Math.round(employees * transitionRate);
  const grossValue = navigated * valuePerMember;
  const annualFee = employees * pmpm * 12;
  const netValue = grossValue - annualFee;
  const roi = annualFee > 0 ? grossValue / annualFee : 0;

  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <Link href="/" className="brand">
            Her<span className="dot">Next</span>
          </Link>
          <span>
            <Link href="/journey" className="nav-link" style={{ marginRight: 20 }}>
              Product demo
            </Link>
            <Link href="/business" className="nav-link">
              For employers
            </Link>
          </span>
        </nav>

        <section className="biz-hero">
          <span className="eyebrow">The venture case</span>
          <h1>
            The <em>navigation layer</em> for women's health.
          </h1>
          <p className="lede">
            Point solutions own one stage. HerNext owns the connective tissue between all of
            them, and we monetize where the money already flows: employers and health plans
            paying to keep women in the right care at the right time.
          </p>
        </section>

        {/* Why they pay */}
        <section className="biz-section">
          <h2>Who pays, and why</h2>
          <p className="sub">
            Consumers won't pay for information. Benefits buyers pay for outcomes and
            retention. So we sell B2B2C, per member per month.
          </p>
          <div className="who-grid">
            <div className="who-card">
              <div className="tag">Primary buyer</div>
              <h4>Employers & health plans</h4>
              <p>
                A maternity averages $18K+; a NICU stay can exceed $100K; a mistimed fertility
                path burns cycles and money. Navigation that prevents missed preconception
                windows and routes to the right care at the right time is measurable cost
                avoidance, plus retention of female talent and a real DEI story.
              </p>
            </div>
            <div className="who-card">
              <div className="tag">Second buyer</div>
              <h4>Providers & clinics</h4>
              <p>
                Patients arrive prepared with the right questions, so visits are shorter and
                higher value, no-shows drop, and quality scores improve. We save the scarcest
                resource in medicine: clinician time.
              </p>
            </div>
            <div className="who-card">
              <div className="tag">The wedge</div>
              <h4>PCOS → fertility</h4>
              <p>
                One in ten women has PCOS, and it sits right before the most expensive,
                highest-stakes decisions. We land on this wedge, prove engagement, then expand
                across the whole reproductive lifecycle on the same contract.
              </p>
            </div>
          </div>
        </section>

        {/* ROI calculator */}
        <section className="biz-section">
          <h2>What it's worth to a buyer</h2>
          <p className="sub">Move the sliders. These are illustrative, deliberately conservative assumptions.</p>
          <div className="calc">
            <div className="calc-grid">
              <div className="calc-inputs">
                <div className="cin">
                  <label>
                    Female employees (18–45) <b>{employees.toLocaleString()}</b>
                  </label>
                  <input
                    type="range"
                    min={500}
                    max={50000}
                    step={500}
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                  />
                </div>
                <div className="cin">
                  <label>
                    Value / cost avoided per navigated member / yr <b>${valuePerMember.toLocaleString()}</b>
                  </label>
                  <input
                    type="range"
                    min={400}
                    max={3000}
                    step={100}
                    value={valuePerMember}
                    onChange={(e) => setValuePerMember(Number(e.target.value))}
                  />
                </div>
                <div className="cin">
                  <label>
                    HerNext fee (per female employee / month) <b>${pmpm}</b>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={pmpm}
                    onChange={(e) => setPmpm(Number(e.target.value))}
                  />
                </div>
                <p className="calc-note">
                  Assumes ~15% of covered women are in a reproductive transition each year
                  ({navigated.toLocaleString()} navigated members). Cost figures are
                  illustrative and drawn from public ranges for maternity, NICU, and fertility
                  spend.
                </p>
              </div>
              <div className="calc-out">
                <div className="big">{roi.toFixed(1)}×</div>
                <div className="biglabel">return on the benefit spend</div>
                <div className="stat-row">
                  <span>Members navigated / yr</span>
                  <span>{navigated.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span>Gross value created</span>
                  <span>{money(grossValue)}</span>
                </div>
                <div className="stat-row">
                  <span>HerNext annual fee</span>
                  <span>{money(annualFee)}</span>
                </div>
                <div className="stat-row">
                  <span>Net value to buyer</span>
                  <span>{money(netValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Model */}
        <section className="biz-section">
          <h2>Business model</h2>
          <p className="sub">Recurring PMPM, expanding coverage per account over time.</p>
          <div className="model-tiers">
            <div className="tier">
              <div className="tname">Navigate</div>
              <div className="tprice">
                $2 <small>/ female employee / mo</small>
              </div>
              <ul>
                <li>Full transition engine</li>
                <li>Evidence-cited pathways</li>
                <li>Appointment prep</li>
              </ul>
            </div>
            <div className="tier feature">
              <div className="tname">Navigate + Continuity</div>
              <div className="tprice">
                $4 <small>/ female employee / mo</small>
              </div>
              <ul>
                <li>Everything in Navigate</li>
                <li>Longitudinal profile across stages</li>
                <li>Proactive re-engagement</li>
                <li>Aggregate engagement reporting</li>
              </ul>
            </div>
            <div className="tier">
              <div className="tname">Health plan / provider</div>
              <div className="tprice">
                Custom
              </div>
              <ul>
                <li>Population dashboards</li>
                <li>Care-routing integrations</li>
                <li>Quality-measure reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Moat */}
        <section className="biz-section">
          <h2>Why it compounds (the moat)</h2>
          <p className="sub">A one-shot generator has no retention. A companion that follows the whole journey does.</p>
          <div className="moat-list">
            <div className="moat">
              <b>Longitudinal profile.</b>{" "}
              <span>
                She enters her situation once. It carries across PCOS → pregnancy → postpartum
                → contraception → again. Every stage deepens the profile and the switching
                cost. (Try “advance to next stage” in the live demo.)
              </span>
            </div>
            <div className="moat">
              <b>Re-engagement across a decade.</b>{" "}
              <span>
                Reproductive life spans ~30 years. We have a reason to reach back out at every
                transition, so a single acquisition becomes years of LTV, not one session.
              </span>
            </div>
            <div className="moat">
              <b>Evidence graph.</b>{" "}
              <span>
                A curated, cited source layer the model is constrained to, so it can't
                hallucinate. That trust is hard to copy and is what makes a clinician
                comfortable with it in the loop.
              </span>
            </div>
            <div className="moat">
              <b>Cross-stage data.</b>{" "}
              <span>
                No point solution sees the whole arc. We do, which makes our routing and
                outcome reporting structurally better over time.
              </span>
            </div>
          </div>
        </section>

        {/* Comps */}
        <section className="biz-section">
          <h2>The category is proven, and fragmented</h2>
          <p className="sub">Billions already flow here, but through single-stage point solutions.</p>
          <div className="comp-grid">
            <div className="comp-card">
              <div className="name">Progyny</div>
              <div className="val">Public, ~$2B category</div>
              <div className="note">Fertility benefits via employers. One stage.</div>
            </div>
            <div className="comp-card">
              <div className="name">Maven Clinic</div>
              <div className="val">~$1.7B private</div>
              <div className="note">Maternity & family. Adjacent, still stage-bound.</div>
            </div>
            <div className="comp-card">
              <div className="name">Carrot / Kindbody</div>
              <div className="val">Well-funded</div>
              <div className="note">Fertility-led. Each owns a slice, not the arc.</div>
            </div>
          </div>
          <p className="sub" style={{ marginTop: 18 }}>
            They validated employer willingness to pay. None of them own the navigation layer
            <em> between</em> stages. That's the open lane.
          </p>
        </section>

        {/* Market */}
        <section className="biz-section">
          <h2>Market</h2>
          <div className="tam-row">
            <div className="tam">
              <div className="n">~65M</div>
              <div className="l">US women of reproductive age</div>
            </div>
            <div className="tam">
              <div className="n">$1B+</div>
              <div className="l">Serviceable: covered lives at $2–4 PMPM</div>
            </div>
            <div className="tam">
              <div className="n">30 yrs</div>
              <div className="l">Reproductive lifespan we re-engage across</div>
            </div>
          </div>
        </section>

        <section className="strip" style={{ marginTop: 20 }}>
          <h3>We built an AI transition engine. We're demonstrating it first on PCOS → fertility.</h3>
          <p style={{ marginBottom: 0 }}>
            The other transitions prove the engine scales, and the continuity between them is
            the business.
          </p>
        </section>

        <div style={{ textAlign: "center", margin: "36px 0" }}>
          <Link href="/journey" className="btn btn-primary">
            See the live product
          </Link>
        </div>

        <footer className="footer">
          <span>HerNext — the navigation layer for women's health.</span>
          <Link href="/" className="nav-link">
            Home
          </Link>
        </footer>
      </div>
    </main>
  );
}
