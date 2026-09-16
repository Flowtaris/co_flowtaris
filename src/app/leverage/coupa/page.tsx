"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "STRATEGIC ALLIANCE",
    title: "FLOWTARIS \u00D7 COUPA",
    headline: "PROCUREMENT SYSTEMS\\nTHAT CONNECT\\nBEYOND PROCUREMENT.",
    subtitle: "Engineering, integration and data capability\\naround enterprise procurement environments.",
    status: "[ CAPABILITY ]"
  },
  problem: {
    label: "THE PROBLEM",
    heading: "PROCUREMENT DOESN'T EXIST\\nIN ISOLATION.",
    description: "The difficult engineering work often sits between them.",
    items: ["Supplier data.", "Finance.", "ERP.", "Contracts.", "Approvals.", "Spend intelligence."]
  },
  whereWeFit: {
    label: "WHERE FLOWTARIS FITS",
    box1Title: "COUPA", box1Sub: "Procurement \u00B7 Spend \u00B7 Supplier workflows",
    box2Title: "FLOWTARIS", box2Sub: "Architecture \u00B7 Integration \u00B7 Data \u00B7 Engineering",
    box3Title: "CONNECTED", box3Sub: "PROCUREMENT SYSTEM",
    description: "Flowtaris engineers the systems around the procurement\\nplatform so data, workflows and enterprise applications\\noperate as one environment."
  },
  capabilities: {
    heading: "CAPABILITY AREAS",
    items: [
      { num: "01", title: "PROCUREMENT INTEGRATION", desc: "Connect Coupa with ERP, finance, supplier and surrounding enterprise systems." },
      { num: "02", title: "PROCUREMENT DATA", desc: "Create reliable movement, transformation and governance across procurement data." },
      { num: "03", title: "WORKFLOW ENGINEERING", desc: "Build the services and workflows required around the procurement platform." },
      { num: "04", title: "ENTERPRISE ARCHITECTURE", desc: "Define the boundaries between procurement, finance, ERP, data and business systems." }
    ]
  },
  architecture: {
    label: "THE ARCHITECTURE",
    topBoxTitle: "ENTERPRISE SYSTEMS",
    topItems: ["ERP", "FINANCE", "CONTRACTS", "HR"],
    mid1: "INTEGRATION LAYER",
    mainBox: "COUPA",
    mid2: "PROCUREMENT DATA",
    mid3: "ANALYTICS / AI"
  },
  procurementDataFlow: {
    label: "PROCUREMENT DATA FLOW",
    flowItems: ["SUPPLIER", "PROCUREMENT", "COUPA"],
    sideItems: ["\u2192 ERP", "\u2192 FINANCE", "\u2192 DATA PLATFORM", "\u2192 ANALYTICS"],
    statement1: "THE VALUE ISN'T THE PIPELINE.",
    statement2: "IT'S THE RELIABILITY OF THE\\nDECISIONS THAT DEPEND ON IT."
  },
  commonEngagements: {
    heading: "COMMON ENGAGEMENTS",
    items: [
      { num: "01", title: "COUPA INTEGRATION", desc: "Connect procurement workflows to surrounding enterprise systems." },
      { num: "02", title: "PROCUREMENT DATA", desc: "Build reliable data pipelines for spend and supplier intelligence." },
      { num: "03", title: "ERP / PROCUREMENT ALIGNMENT", desc: "Connect procurement workflows with the financial operating model." },
      { num: "04", title: "PLATFORM MODERNIZATION", desc: "Replace brittle integrations with maintainable architecture." }
    ]
  },
  howWeWork: {
    label: "HOW WE WORK",
    items: [
      { num: "01", title: "ASSESS", desc: "Understand procurement, enterprise systems and constraints." },
      { num: "02", title: "ARCHITECT", desc: "Define the target architecture and integration boundaries." },
      { num: "03", title: "CONNECT", desc: "Build the required integrations and data flows." },
      { num: "04", title: "ENGINEER", desc: "Build the missing technical capabilities around the platform." },
      { num: "05", title: "OPERATE", desc: "Monitor, improve and maintain." }
    ]
  },
  combinationMatters: {
    statement1: "COUPA PROVIDES THE PROCUREMENT PLATFORM.",
    statement2: "FLOWTARIS ENGINEERS THE SYSTEM AROUND IT.",
    bullets: [
      "The result should not be another isolated enterprise application.",
      "It should become part of the operating architecture."
    ]
  },
  evidenceConnection: {
    heading: "THE PLATFORM IS ONLY\\nONE PART OF THE SYSTEM.",
    description: "SEE HOW FLOWTARIS OPERATES\\nTHE SYSTEM AROUND IT.",
    cta: "EXPLORE EVIDENCE \u2192",
    link: "/evidence"
  }
};

export default function CoupaAlliancePage() {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      const { data: record } = await supabase.from("page_content").select("content").eq("id", "alliance_coupa").single();
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
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ STRATEGIC ALLIANCES / COUPA</span>
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
            <span className="ev-stat">CAPABILITY STATUS</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-accent)', letterSpacing: '0.05em' }}>{data.hero.status}</span>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <span className="section-label" style={{ marginBottom: '48px', display: 'block' }}>{data.problem.label}</span>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '24px' }}>
          {formatText(data.problem.heading)}
        </h2>
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

          {data.architecture.mid3 && (
            <>
              <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>
              <div style={{ width: '100%', padding: '24px', border: '1px solid var(--color-structural)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
                <span className="card-heading" style={{ letterSpacing: '0.1em' }}>{data.architecture.mid3}</span>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Procurement Data Flow */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{data.procurementDataFlow.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', paddingBottom: '64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            {(data.procurementDataFlow.flowItems || []).map((item: string, i: number, arr: any[]) => (
              <div key={i} style={{ display: "contents" }}>
                <span className={i === arr.length - 1 ? "section-heading" : "card-heading"} style={i === arr.length - 1 ? { fontSize: '2rem' } : {}}>
                  {item}
                </span>
                {i < arr.length - 1 && <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <span style={{ borderLeft: '1px solid var(--color-structural)', margin: '8px 16px' }}></span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(data.procurementDataFlow.sideItems || []).map((item: string, i: number) => (
                <span key={i} className="card-heading">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="ev-panel" style={{ padding: '64px' }}>
          <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '16px', maxWidth: '800px' }}>
            {data.procurementDataFlow.statement1}
          </h2>
          <h2 className="section-heading" style={{ fontSize: '2rem', color: 'var(--color-text-secondary)' }}>
            {formatText(data.procurementDataFlow.statement2)}
          </h2>
        </div>
      </section>

      {/* Common Engagements */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.commonEngagements.heading}</h2>
        
        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {(data.commonEngagements.items || []).map((uc: any, i: number) => (
            <div key={i} className="trust-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
              <span className="section-label" style={{ marginBottom: '16px' }}>{uc.num}</span>
              <h3 className="card-heading" style={{ marginBottom: '16px' }}>{uc.title}</h3>
              <p className="trust-body" style={{ flexGrow: 1, marginBottom: '32px' }}>{uc.desc}</p>
              <span style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>&rarr;</span>
            </div>
          ))}
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

      {/* Why The Combination Matters */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div className="ev-panel" style={{ padding: '84px' }}>
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px', maxWidth: '800px' }}>
            {data.combinationMatters.statement1}
          </h2>
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px', maxWidth: '800px', color: 'var(--color-text-secondary)' }}>
            {data.combinationMatters.statement2}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px' }}>
            {(data.combinationMatters.bullets || []).map((bullet: string, i: number) => (
              <p key={i} className="trust-body" style={{ fontSize: '1.25rem' }}>
                {bullet}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Connection */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{formatText(data.evidenceConnection.heading)}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '48px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.evidenceConnection.description)}
        </p>
        <Link href={data.evidenceConnection.link || "#"} className="judgment-cta">{data.evidenceConnection.cta}</Link>
      </section>

      {/* Secondary Navigation */}
      <div className="section dl-back-nav" style={{ borderTop: '1px solid var(--color-structural)', marginTop: '64px' }}>
        <Link href="/leverage" className="view-all" style={{ color: "var(--color-text-secondary)", marginRight: '16px' }}>&larr; LEVERAGE</Link>
        <Link href="/leverage/netsuite" className="card-heading" style={{ textDecoration: 'none' }}>NETSUITE &rarr;</Link>
        <span style={{ margin: '0 16px', color: 'var(--color-text-secondary)' }}>|</span>
        <Link href="/leverage/workday" className="card-heading" style={{ textDecoration: 'none' }}>WORKDAY &rarr;</Link>
      </div>
    </>
  );
}
