"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "WORKDAY \u00D7 FLOWTARIS",
    headline: "INTEGRATION THAT\\nHOLDS UP IN THE\\nREAL WORLD.",
    subtitle: "Enterprise integration across Workday HCM,\\nFinance, and surrounding systems.",
    tags: ["WORKDAY EXTEND", "INTEGRATION CLOUD", "EIB"]
  },
  heroVisual: {
    topTitle: "WORKDAY \u00D7 FLOWTARIS",
    topBoxes: ["HCM", "FINANCE"],
    midText: "INTEGRATION",
    bottomBoxes: ["ERP", "DATA"]
  },
  allianceProfile: {
    label: "ALLIANCE PROFILE",
    type: "WORKDAY ECOSYSTEM",
    specialization: "HCM \u00B7 FINANCE \u00B7 INTEGRATION",
    delivery: "IMPLEMENTATION \u00B7 INTEGRATION \u00B7 ENGINEERING"
  },
  jointValue: {
    label: "THE JOINT VALUE",
    statement1: "WORKDAY IS THE SYSTEM OF RECORD.",
    statement2: "FLOWTARIS MAKES THE SURROUNDING\\nSYSTEMS WORK WITH IT.",
    blocks: [
      { title: "HCM", desc: "Employee Lifecycle Integration" },
      { title: "FINANCE", desc: "Financial Data Integration" },
      { title: "ENTERPRISE", desc: "ERP \u00B7 CRM\\nData Platforms\\nCustom Systems" }
    ]
  },
  whereWeFit: {
    label: "WHERE FLOWTARIS FITS",
    topHeading: "WORKDAY",
    topItems: ["HCM", "FINANCE", "EXTEND", "INTEGRATION CLOUD", "EIB"],
    midHeading: "FLOWTARIS",
    midItems: ["Integration Engineering", "Application Engineering", "Data Engineering", "Enterprise Architecture"],
    bottomHeading: "ENTERPRISE LANDSCAPE",
    bottomItems: ["ERP", "CRM", "Data Platforms", "Custom Applications", "External Systems"]
  },
  workdayEngineering: {
    heading: "WORKDAY ENGINEERING",
    items: [
      { num: "01", title: "WORKDAY EXTEND", tag: "EXTEND \u2192", desc: "When the requirement belongs inside the Workday ecosystem.", subtext: "Use Workday Extend where the experience and logic belong close to the Workday platform." },
      { num: "02", title: "INTEGRATION CLOUD", tag: "INTEGRATION CLOUD \u2192", desc: "When systems need to exchange information reliably.", subtext: "Integration patterns designed around enterprise data movement, orchestration, and operational reliability." },
      { num: "03", title: "EIB", tag: "EIB \u2192", desc: "When the integration pattern calls for Workday's established business-process tooling.", subtext: "Choose the appropriate Workday-native integration mechanism instead of forcing every problem into the same pattern." }
    ]
  },
  decisionFramework: {
    label: "WHICH PATTERN FITS?",
    rows: [
      { req: "Extend the Workday experience", ans: "WORKDAY EXTEND" },
      { req: "Move data between systems", ans: "INTEGRATION CLOUD" },
      { req: "Standard Workday integration", ans: "EIB" },
      { req: "Complex enterprise integration", ans: "ARCHITECTURE REVIEW" },
      { req: "Custom application requirement", ans: "APPLICATION ENGINEERING" }
    ]
  },
  commonLandscapes: {
    label: "COMMON LANDSCAPES",
    blocks: [
      { title: "WORKDAY HCM", items: ["Payroll", "Identity", "CRM", "Data Platform"] },
      { title: "WORKDAY FINANCE", items: ["ERP", "Procurement", "Billing", "Analytics"] },
      { title: "WORKDAY + ENTERPRISE", items: ["Legacy Systems", "Custom Applications", "Data Warehouse", "Integration Layer"] }
    ]
  },
  howWeWork: {
    label: "HOW WE WORK",
    items: [
      { num: "01", text: "Your Workday implementation is working -- but the systems around it are becoming the bottleneck." },
      { num: "02", text: "The question isn't whether Workday can integrate with the system. It's which integration pattern makes sense for the operating model." },
      { num: "03", text: "Before adding another integration, let's map what belongs in Workday, what belongs outside it, and where the boundary should sit." }
    ]
  },
  decisionLogs: {
    label: "HOW WE ENGINEER WORKDAY.",
    description: "Read the decisions behind the implementations.",
    cta: "READ DECISIONS \u2192",
    link: "/judgment"
  },
  specialists: []
};

export default function WorkdayAlliancePage() {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  
  // Specialists logic
  const [filter, setFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      
      const { data: record } = await supabase.from("page_content").select("content").eq("id", "alliance_workday").single();
      
      // Fallback: If alliance_workday is missing, we might still have specialists in workday_specialists
      let specLegacy: any[] = [];
      const { data: specRecord } = await supabase.from("page_content").select("content").eq("id", "workday_specialists").single();
      if (specRecord?.content?.specialists) {
        specLegacy = specRecord.content.specialists;
      }
      
      if (record?.content) {
        setData({ ...DEFAULT_DATA, ...record.content, specialists: record.content.specialists || specLegacy });
      } else {
        setData({ ...DEFAULT_DATA, specialists: specLegacy });
      }
      
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

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>;
  }

  const filteredSpecialists = filter === "ALL" ? data.specialists : (data.specialists || []).filter((s:any) => s.specialty === filter);

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/leverage" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; LEVERAGE</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ WORKDAY ALLIANCE</span>
      </div>

      {/* Alliance Hero */}
      <section className="section ev-hero" style={{ paddingTop: '120px' }}>
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px' }}>
          {formatText(data.hero.headline)}
        </h1>
        <p className="card-description ev-subtitle" style={{ maxWidth: '600px', marginTop: '24px' }}>
          {formatText(data.hero.subtitle)}
        </p>
        
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '48px' }}>
          {(data.hero.tags || []).map((tag: string, i: number) => (
            <span key={i} className="trust-body" style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>{tag}</span>
          ))}
        </div>
      </section>

      {/* Hero Visual: Enterprise Architecture */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="ev-panel" style={{ padding: '64px', backgroundColor: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="card-heading" style={{ fontSize: '1.5rem', marginBottom: '32px' }}>{data.heroVisual.topTitle}</span>
          
          <div style={{ display: 'flex', gap: '64px', marginBottom: '24px' }}>
            {(data.heroVisual.topBoxes || []).map((b: string, i: number) => (
              <span key={i} className="trust-body" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{b}</span>
            ))}
          </div>
          
          <span style={{ fontSize: '2rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>&darr;</span>
          
          <span className="section-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '24px' }}>{data.heroVisual.midText}</span>
          
          <span style={{ fontSize: '2rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>&darr;</span>
          
          <div style={{ display: 'flex', gap: '64px' }}>
            {(data.heroVisual.bottomBoxes || []).map((b: string, i: number) => (
              <span key={i} className="trust-body" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Status / Alliance Profile */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.allianceProfile.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>
            <span className="trust-body" style={{ fontWeight: 500 }}>PARTNER TYPE</span>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>{data.allianceProfile.type}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>
            <span className="trust-body" style={{ fontWeight: 500 }}>SPECIALIZATION</span>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>{data.allianceProfile.specialization}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>
            <span className="trust-body" style={{ fontWeight: 500 }}>DELIVERY MODEL</span>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>{data.allianceProfile.delivery}</span>
          </div>
        </div>
      </section>

      {/* The Joint Value */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{data.jointValue.label}</h2>
        <div style={{ marginBottom: '64px' }}>
          <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{formatText(data.jointValue.statement1)}</h3>
          <h3 className="section-heading" style={{ fontSize: '2.5rem', color: 'var(--color-text-secondary)' }}>{formatText(data.jointValue.statement2)}</h3>
        </div>
        
        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {(data.jointValue.blocks || []).map((block: any) => (
            <div key={block.title} className="trust-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
              <h4 className="card-heading" style={{ marginBottom: '16px', fontSize: '1.25rem' }}>{block.title}</h4>
              <p className="trust-body" style={{ flexGrow: 1, whiteSpace: 'pre-line', marginBottom: '32px' }}>{formatText(block.desc)}</p>
              <span style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>&rarr;</span>
            </div>
          ))}
        </div>
      </section>

      {/* Where Flowtaris Fits */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{data.whereWeFit.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '64px', border: '1px solid var(--color-structural)', backgroundColor: 'var(--color-surface)', maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span className="section-heading" style={{ display: 'block', marginBottom: '24px', letterSpacing: '0.1em' }}>{data.whereWeFit.topHeading}</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {(data.whereWeFit.topItems || []).map((sys: string) => (
                <span key={sys} className="trust-body" style={{ padding: '8px 16px', border: '1px solid var(--color-structural)', backgroundColor: 'var(--color-bg)', fontSize: '0.875rem' }}>{sys}</span>
              ))}
            </div>
          </div>
          
          <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>
          
          <div style={{ width: '100%', padding: '32px', border: '2px solid var(--color-accent)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
            <span className="card-heading" style={{ letterSpacing: '0.1em', marginBottom: '16px', display: 'block' }}>{data.whereWeFit.midHeading}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(data.whereWeFit.midItems || []).map((sys: string) => (
                <span key={sys} className="trust-body">{sys}</span>
              ))}
            </div>
          </div>

          <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>&darr;</span>

          <div style={{ width: '100%', padding: '32px', border: '1px solid var(--color-structural)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
            <span className="section-heading" style={{ display: 'block', marginBottom: '24px', letterSpacing: '0.1em' }}>{data.whereWeFit.bottomHeading}</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {(data.whereWeFit.bottomItems || []).map((sys: string) => (
                <span key={sys} className="trust-body" style={{ padding: '8px 16px', border: '1px solid var(--color-structural)', backgroundColor: 'var(--color-surface)', fontSize: '0.875rem' }}>{sys}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Workday Engineering */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.workdayEngineering.heading}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {(data.workdayEngineering.items || []).map((cap: any) => (
            <div key={cap.num} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px', borderBottom: '1px solid var(--color-structural)', maxWidth: '800px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{cap.num}</span>
              <h3 className="section-heading" style={{ fontSize: '2rem', margin: 0 }}>{cap.title}</h3>
              <p className="trust-body" style={{ fontSize: '1.25rem', margin: '8px 0 0 0', color: 'var(--color-text-primary)' }}>{cap.desc}</p>
              <span className="card-heading" style={{ margin: '16px 0', fontSize: '0.875rem', letterSpacing: '0.05em' }}>{cap.tag}</span>
              <p className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>{cap.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Framework */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.decisionFramework.label}</h2>
        <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
          <table className="ev-table" style={{ minWidth: '600px', width: '100%', maxWidth: '900px' }}>
            <thead>
              <tr>
                <th className="ev-th" style={{ textAlign: 'left', width: '50%' }}>REQUIREMENT</th>
                <th className="ev-th" style={{ textAlign: 'left' }}>START HERE</th>
              </tr>
            </thead>
            <tbody>
              {(data.decisionFramework.rows || []).map((row: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td" style={{ fontSize: '1.125rem' }}>{row.req}</td>
                  <td className="ev-td card-heading" style={{ color: 'var(--color-text-secondary)' }}>{row.ans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Landscapes */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{data.commonLandscapes.label}</h2>
        
        <div className="trust-grid">
          {(data.commonLandscapes.blocks || []).map((landscape: any) => (
            <div key={landscape.title} className="ev-panel" style={{ padding: '48px', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="card-heading" style={{ marginBottom: '24px', letterSpacing: '0.05em' }}>{landscape.title}</h3>
              <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '24px' }}>&darr;</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(landscape.items || []).map((item: string) => (
                  <li key={item} className="trust-body">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.howWeWork.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px', maxWidth: '800px' }}>
          {(data.howWeWork.items || []).map((step: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <span className="section-heading" style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', marginTop: '-4px' }}>{step.num}</span>
              <p className="trust-body" style={{ fontSize: '1.25rem', margin: 0 }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Logs (Evidence) */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <span className="section-label" style={{ marginBottom: '32px', display: 'block' }}>RELATED JUDGMENT</span>
        
        <div className="ev-panel" style={{ padding: '64px', backgroundColor: 'var(--color-surface)', maxWidth: '800px' }}>
          <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '16px' }}>{formatText(data.decisionLogs.label)}</h2>
          <p className="trust-body" style={{ fontSize: '1.125rem', marginBottom: '32px', maxWidth: '600px', color: 'var(--color-text-secondary)' }}>
            {formatText(data.decisionLogs.description)}
          </p>
          <Link href={data.decisionLogs.link || "#"} className="judgment-cta">{data.decisionLogs.cta}</Link>
        </div>
      </section>

      {/* Workday Specialists Grid */}
      {data.specialists && data.specialists.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '16px' }}>WORKDAY SPECIALISTS</h2>
                <p className="card-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
                  A directory of engineers and consultants specializing in the Workday ecosystem. Available for contract or direct engagement.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {["ALL", "INTEGRATION", "EXTEND", "HCM", "FINANCE", "DATA"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className="trust-body"
                    style={{ 
                      padding: '8px 16px', 
                      background: filter === cat ? 'var(--color-text-primary)' : 'var(--color-bg)',
                      color: filter === cat ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                      border: '1px solid var(--color-structural)',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {filteredSpecialists.map((spec: any) => (
                <div key={spec.id} className="ev-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h3 className="section-heading" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{spec.name}</h3>
                      <span className="card-heading" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{spec.specialty}</span>
                    </div>
                    <span className="trust-body" style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid var(--color-structural)' }}>{spec.location}</span>
                  </div>
                  
                  <p className="trust-body" style={{ flexGrow: 1, marginBottom: '32px', fontSize: '0.9375rem' }}>
                    {spec.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleCopy(spec.id.toString(), spec.id)}
                      className="judgment-cta" 
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-text-primary)', color: 'var(--color-text-primary)', cursor: 'pointer' }}
                    >
                      {copiedId === spec.id ? 'COPIED!' : 'COPY ID'}
                    </button>
                    <Link href={`/contact?id=${spec.id}`} className="card-heading" style={{ textDecoration: 'none' }}>ENGAGE &rarr;</Link>
                  </div>
                </div>
              ))}
              
              {filteredSpecialists.length === 0 && (
                <div className="ev-panel" style={{ padding: '64px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  <p className="trust-body">No specialists found matching this criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Opportunity CTA */}
      <section className="section ev-access-section" style={{ borderTop: 'none' }}>
        <div className="ev-access-inner">
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
            OPERATING WORKDAY?
          </h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }}>
            Tell us where the platform ends<br />
            and the engineering problem begins.
          </p>
          <Link href="/contact" className="judgment-cta">START A CONVERSATION &rarr;</Link>
        </div>
      </section>

      {/* Related Alliances */}
      <section className="section">
        <div className="dl-prev-next-inner">
          <div className="dl-nav-link dl-nav-prev" style={{ flex: 1 }}>
            <span className="dl-nav-direction">OTHER STRATEGIC ALLIANCES</span>
            <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
              <Link href="/leverage/netsuite" className="card-heading" style={{ textDecoration: 'none' }}>NETSUITE &rarr;</Link>
              <Link href="/leverage/coupa" className="card-heading" style={{ textDecoration: 'none' }}>COUPA &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
