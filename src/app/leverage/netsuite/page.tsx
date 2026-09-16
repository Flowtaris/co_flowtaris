"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "STRATEGIC ALLIANCE",
    title: "FLOWTARIS \u00D7 NETSUITE",
    headline: "ENTERPRISE SYSTEMS\\nWITHOUT THE\\nIMPLEMENTATION\\nBLIND SPOTS.",
    subtitle: "Architecture, integration and engineering\\ncapability around NetSuite environments.",
    status: "[ STRATEGIC CAPABILITY ]"
  },
  problem: {
    label: "THE PROBLEM",
    heading: "NETSUITE ISN'T THE HARD PART.",
    description: "The difficult work begins around it.",
    items: ["Integrations.", "Data movement.", "Legacy systems.", "Business processes.", "Customization.", "Operational reliability."]
  },
  whereWeFit: {
    label: "WHERE WE ADD CAPABILITY",
    box1Title: "NETSUITE", box1Sub: "ERP PLATFORM",
    box2Title: "FLOWTARIS", box2Sub: "ENGINEERING",
    box3Title: "INTEGRATED", box3Sub: "ENTERPRISE SYSTEM",
    description: "Flowtaris works around the platform layer where\\narchitecture, integration and engineering decisions\\ndetermine whether the implementation remains\\nmaintainable after launch."
  },
  capabilities: {
    heading: "CAPABILITY AREAS",
    items: [
      { num: "01", title: "ARCHITECTURE", desc: "Design the surrounding system so NetSuite doesn't become an isolated enterprise island." },
      { num: "02", title: "INTEGRATION", desc: "Connect NetSuite with the systems, data and workflows around it." },
      { num: "03", title: "DATA", desc: "Create reliable movement, transformation and governance across enterprise data." },
      { num: "04", title: "ENGINEERING", desc: "Build the custom services and technical components the platform alone doesn't provide." }
    ]
  },
  architecture: {
    label: "THE ARCHITECTURE",
    topBoxTitle: "BUSINESS SYSTEMS",
    topItems: ["CRM", "E-COMMERCE", "PAYMENTS", "DATA"],
    mid1: "INTEGRATION LAYER",
    mainBox: "NETSUITE",
    mid2: "DATA / ANALYTICS"
  },
  howWeWork: {
    label: "HOW WE WORK",
    items: [
      { num: "01", title: "DISCOVER", desc: "Understand the existing enterprise landscape." },
      { num: "02", title: "ARCHITECT", desc: "Define the target state, interfaces and boundaries." },
      { num: "03", title: "INTEGRATE", desc: "Connect NetSuite to the surrounding systems." },
      { num: "04", title: "ENGINEER", desc: "Build what the platform doesn't provide." },
      { num: "05", title: "OPERATE", desc: "Monitor, improve and maintain the system." }
    ]
  },
  decisionLogs: {
    label: "DECISION LOGS",
    heading: "HOW WE ENGINEER NETSUITE.",
    description: "Read the decisions behind the implementations.",
    items: [
      { date: "FEB 03, 2026", tags: "CTO \u00B7 TECH \u00B7 CRISIS", title: "THE NETSUITE API CRISIS", cta: "READ DECISION \u2192", link: "/judgment/netsuite" }
    ]
  }
};

export default function NetSuiteAlliancePage() {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      const { data: record } = await supabase.from("page_content").select("content").eq("id", "alliance_netsuite").single();
      if (record?.content) setData({ ...DEFAULT_DATA, ...record.content });
      setLoading(false);
    }
    fetchData();
  }, []);

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split(/\\n|\n/).map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>;
  }

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/leverage" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; LEVERAGE</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ STRATEGIC ALLIANCES / NETSUITE</span>
      </div>

      {/* Alliance Hero */}
      <section className="section ev-hero" style={{ paddingTop: '120px' }}>
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px' }}>
          {data.hero.title}
        </h1>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginTop: '24px', marginBottom: '24px', maxWidth: '800px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.hero.headline)}
        </h2>
        <p className="card-description ev-subtitle">
          {formatText(data.hero.subtitle)}
        </p>
        <div className="ev-stats" style={{ gap: '64px', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="ev-stat">PARTNERSHIP STATUS</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-accent)', letterSpacing: '0.05em' }}>{data.hero.status}</span>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <span className="section-label" style={{ marginBottom: '48px', display: 'block' }}>{data.problem.label}</span>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '24px' }}>{formatText(data.problem.heading)}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '48px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.problem.description)}
        </p>

        <ul className="trust-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none' }}>
          {(data.problem.items || []).map((item: string, i: number) => (
            <li key={i} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-structural)', maxWidth: '600px' }}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Where Flowtaris Fits */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.whereWeFit.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="card-heading" style={{ textTransform: 'uppercase', fontSize: '1.25rem' }}>{data.whereWeFit.box1Title}</span>
            <span className="trust-body">{data.whereWeFit.box1Sub}</span>
          </div>
          <span style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>+</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="card-heading" style={{ textTransform: 'uppercase', fontSize: '1.25rem' }}>{data.whereWeFit.box2Title}</span>
            <span className="trust-body">{data.whereWeFit.box2Sub}</span>
          </div>
          <span style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }}>&darr;</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="card-heading" style={{ textTransform: 'uppercase', fontSize: '1.25rem' }}>{data.whereWeFit.box3Title}</span>
            <span className="trust-body">{data.whereWeFit.box3Sub}</span>
          </div>
        </div>

        <p className="card-description" style={{ maxWidth: '700px' }}>
          {formatText(data.whereWeFit.description)}
        </p>
      </section>

      {/* Capability Areas */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.capabilities.heading}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {(data.capabilities.items || []).map((cap: any, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px', borderBottom: '1px solid var(--color-structural)', maxWidth: '800px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{cap.num}</span>
              <h3 className="section-heading" style={{ fontSize: '2rem', margin: 0 }}>{cap.title}</h3>
              <p className="trust-body" style={{ fontSize: '1.25rem', margin: '8px 0 16px 0' }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Architecture */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{data.architecture.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '64px', border: '1px solid var(--color-structural)', backgroundColor: 'var(--color-surface)', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span className="card-heading" style={{ display: 'block', marginBottom: '24px', letterSpacing: '0.1em' }}>{data.architecture.topBoxTitle}</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {(data.architecture.topItems || []).map((sys: string, i: number) => (
                <span key={i} className="trust-body" style={{ padding: '8px 24px', border: '1px solid var(--color-structural)', backgroundColor: 'var(--color-bg)' }}>{sys}</span>
              ))}
            </div>
          </div>
          
          <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>
          
          <div style={{ width: '100%', padding: '24px', border: '1px solid var(--color-structural)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
            <span className="card-heading" style={{ letterSpacing: '0.1em' }}>{data.architecture.mid1}</span>
          </div>

          <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>

          <div style={{ width: '100%', padding: '32px', border: '2px solid var(--color-accent)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
            <span className="section-heading" style={{ margin: 0, letterSpacing: '0.1em' }}>{data.architecture.mainBox}</span>
          </div>

          <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>

          <div style={{ width: '100%', padding: '24px', border: '1px solid var(--color-structural)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
            <span className="card-heading" style={{ letterSpacing: '0.1em' }}>{data.architecture.mid2}</span>
          </div>
        </div>
      </section>

      {/* Delivery Model */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.howWeWork.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.howWeWork.items || []).map((step: any, i: number, arr: any[]) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: i < arr.length - 1 ? '16px' : '0' }}>
              <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>
                <span style={{ color: 'var(--color-accent)', marginRight: '16px' }}>{step.num}</span>
                {step.title}
              </span>
              <p className="trust-body">{step.desc}</p>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', marginTop: '8px' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

            { title: "CUSTOM ENGINEERING", desc: "Build services around the platform where needed." }
          ].map((uc) => (
            <div key={uc.title} className="trust-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
              <h3 className="card-heading" style={{ marginBottom: '16px' }}>{uc.title}</h3>
              <p className="trust-body" style={{ flexGrow: 1, marginBottom: '32px' }}>{uc.desc}</p>
              <span style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>&rarr;</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why The Combination Matters */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div className="ev-panel" style={{ padding: '84px' }}>
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px', maxWidth: '800px' }}>
            THE PLATFORM PROVIDES THE CORE.
          </h2>
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px', maxWidth: '800px', color: 'var(--color-text-secondary)' }}>
            ENGINEERING MAKES THE CORE<br />FIT THE BUSINESS.
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px' }}>
            <p className="trust-body" style={{ fontSize: '1.25rem' }}>
              NetSuite provides the enterprise platform.
            </p>
            <p className="trust-body" style={{ fontSize: '1.25rem' }}>
              Flowtaris provides the engineering capability around it.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence Connection */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>IMPLEMENTATION IS ONLY HALF<br />THE QUESTION.</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '48px', color: 'var(--color-text-secondary)' }}>
          HOW DO YOU KNOW THE SYSTEM<br />WILL BE OPERATED WELL?
        </p>

        <Link href="/evidence" className="judgment-cta" style={{ marginBottom: '48px', display: 'inline-block' }}>EXPLORE OUR EVIDENCE &rarr;</Link>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <Link href="/evidence/security" className="card-heading" style={{ textDecoration: 'none', borderBottom: '1px solid var(--color-text-primary)', paddingBottom: '4px' }}>SECURITY</Link>
          <Link href="/evidence/legal" className="card-heading" style={{ textDecoration: 'none', borderBottom: '1px solid var(--color-text-primary)', paddingBottom: '4px' }}>LEGAL</Link>
          <Link href="/evidence/operations" className="card-heading" style={{ textDecoration: 'none', borderBottom: '1px solid var(--color-text-primary)', paddingBottom: '4px' }}>OPERATIONS</Link>
        </div>
      </section>

      {/* Related Judgment */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <span className="section-label" style={{ marginBottom: '32px', display: 'block' }}>RELATED JUDGMENT</span>
        
        <div className="ev-panel" style={{ padding: '64px', backgroundColor: 'var(--color-surface)', maxWidth: '800px' }}>
          <h3 className="section-heading" style={{ fontSize: '2rem', marginBottom: '16px' }}>THE NETSUITE CRISIS</h3>
          <p className="trust-body" style={{ fontSize: '1.125rem', marginBottom: '32px', maxWidth: '600px' }}>
            What happened when a platform-level change<br />affected downstream systems.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <span className="section-label" style={{ margin: 0 }}>CTO &middot; TECH &middot; CRISIS</span>
          </div>
          <Link href="/judgment" className="judgment-cta">READ DECISION &rarr;</Link>
        </div>
      </section>

      {/* Partner Verification */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h3 className="section-label" style={{ marginBottom: '32px' }}>PARTNERSHIP</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>
            <span className="trust-body" style={{ fontWeight: 500 }}>RELATIONSHIP</span>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>[ CAPABILITY ]</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>
            <span className="trust-body" style={{ fontWeight: 500 }}>LAST REVIEWED</span>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>[ DATE ]</span>
          </div>
          <Link href="#" className="judgment-cta" style={{ alignSelf: 'flex-start' }}>PARTNER INFORMATION &rarr;</Link>
        </div>
      </section>

      {/* Opportunity CTA */}
      <section className="section ev-access-section" style={{ borderTop: 'none' }}>
        <div className="ev-access-inner">
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
            WORKING AROUND NETSUITE?
          </h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }}>
            Tell us where the platform ends<br />
            and the engineering problem begins.
          </p>
          <Link href="#" className="judgment-cta">START A CONVERSATION &rarr;</Link>
        </div>
      </section>

      {/* Related Alliances */}
      <section className="section">
        <div className="dl-prev-next-inner">
          <div className="dl-nav-link dl-nav-prev" style={{ flex: 1 }}>
            <span className="dl-nav-direction">OTHER STRATEGIC ALLIANCES</span>
            <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
              <Link href="/leverage/coupa" className="card-heading" style={{ textDecoration: 'none' }}>COUPA &rarr;</Link>
              <Link href="/leverage/workday" className="card-heading" style={{ textDecoration: 'none' }}>WORKDAY &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
