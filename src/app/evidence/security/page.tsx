"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "SECURITY",
    title: "HOW WE PROTECT\\nTHE SYSTEMS WE OPERATE.",
    subtitle: "Controls, policies and operating practices\\nbehind the security commitments we make to clients.",
    stats: {
      docCount: "06",
      lastReviewed: "MAR 2026"
    }
  },
  securityAtAGlance: {
    label: "SECURITY AT A GLANCE",
    blocks: [
      { title: "INFORMATION SECURITY", items: ["Policy", "Governance"] },
      { title: "ACCESS CONTROL", items: ["Identity", "Permissions"] },
      { title: "INCIDENT RESPONSE", items: ["Detection", "Escalation"] }
    ]
  },
  securityFramework: {
    label: "SECURITY FRAMEWORK",
    stages: [
      { num: "01", title: "GOVERN", desc: "Security policies, ownership and accountability." },
      { num: "02", title: "PREVENT", desc: "Access controls, infrastructure controls and operational safeguards." },
      { num: "03", title: "DETECT", desc: "Monitoring, logging and incident identification." },
      { num: "04", title: "RESPOND", desc: "Incident response, escalation and communication." },
      { num: "05", title: "RECOVER", desc: "Business continuity and operational recovery." }
    ]
  },
  informationSecurity: {
    num: "01",
    title: "INFORMATION SECURITY",
    desc: "The policies and controls governing how information is handled across Flowtaris systems and operations.",
    policyTitle: "Information Security Policy",
    ownerTitle: "CTO / Security",
    reviewTitle: "Quarterly",
    cta: "VIEW DOCUMENT \u2192",
    link: "/evidence/#library"
  },
  accessControl: {
    title: "ACCESS CONTROL",
    label: "WHO CAN ACCESS WHAT?",
    desc: "Access is governed through defined roles, least-privilege principles and controlled permissions.",
    blocks: [
      { title: "IDENTITY", desc: "Authentication and account ownership" },
      { title: "PERMISSIONS", desc: "Role-based access" },
      { title: "REVIEWS", desc: "Periodic access review" },
      { title: "OFFBOARDING", desc: "Access removal when responsibility ends" }
    ]
  },
  incidentResponse: {
    title: "INCIDENT RESPONSE",
    desc: "WHEN SOMETHING GOES WRONG,\\nTHE RESPONSE SHOULD ALREADY BE DEFINED.",
    steps: ["DETECT", "TRIAGE", "CONTAIN", "REMEDIATE", "COMMUNICATE", "REVIEW"]
  },
  businessContinuity: {
    title: "BUSINESS CONTINUITY",
    desc: "Operational resilience is not a statement.\\nIt is a recovery plan.",
    blocks: [
      { title: "RTO", desc: "Recovery Time Objective" },
      { title: "RPO", desc: "Recovery Point Objective" },
      { title: "RECOVERY", desc: "Operational recovery procedures" }
    ]
  },
  securityDocuments: {
    label: "SECURITY DOCUMENTS",
    documents: [
      { name: "Information Security Policy", updated: "MAR 2026", action: "VIEW", link: "/evidence/#library" },
      { name: "Incident Response Plan", updated: "MAR 2026", action: "VIEW", link: "/evidence/#library" },
      { name: "Business Continuity Plan", updated: "FEB 2026", action: "VIEW", link: "/evidence/#library" },
      { name: "Access Control Policy", updated: "FEB 2026", action: "VIEW", link: "/evidence/#library" },
      { name: "Security Overview", updated: "JAN 2026", action: "VIEW", link: "/evidence/#library" },
      { name: "SOC 2 Report", updated: "--", action: "REQUEST", link: "/evidence/#library" }
    ]
  },
  securityQuestions: {
    title: "LOOKING FOR SOMETHING SPECIFIC?",
    desc: "Security questionnaires, policies and supporting documentation are available through the Evidence Center.",
    cta: "OPEN QUESTIONNAIRE CENTER \u2192",
    link: "/evidence/#questionnaire"
  },
  securityPrinciple: {
    title: "SECURITY IS AN OPERATING PROPERTY,\\nNOT A SALES CLAIM.",
    desc: "See how we make decisions when security and delivery come into conflict.",
    cta: "READ SECURITY-RELATED DECISIONS \u2192",
    link: "/judgment"
  }
};

export default function SecurityDossierPage() {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      const { data: record } = await supabase.from("page_content").select("content").eq("id", "evidence_security").single();
      if (record?.content) {
        setData({ ...DEFAULT_DATA, ...record.content });
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

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>;
  }

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/evidence" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; EVIDENCE</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ SECURITY</span>
      </div>

      {/* Security Hero */}
      <section className="section ev-hero">
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title">
          {formatText(data.hero.title)}
        </h1>
        <p className="card-description ev-subtitle">
          {formatText(data.hero.subtitle)}
        </p>
        <div className="ev-stats" style={{ gap: '64px', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="ev-stat">SECURITY DOCUMENTS</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{data.hero.stats.docCount}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="ev-stat">LAST REVIEWED</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{data.hero.stats.lastReviewed}</span>
          </div>
        </div>
      </section>

      {/* Security At A Glance */}
      <section className="section">
        <h2 className="section-label">{data.securityAtAGlance.label}</h2>
        <div className="trust-grid">
          {(data.securityAtAGlance.blocks || []).map((block: any, i: number) => (
            <div key={i} className="trust-card" style={{ padding: '48px', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="card-heading" style={{ textTransform: 'uppercase', marginBottom: '24px' }}>{block.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(block.items || []).map((item: string) => (
                  <li key={item} className="trust-body">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Security Framework */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.securityFramework.label}</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(data.securityFramework.stages || []).map((stage: any) => (
            <div key={stage.num} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'baseline', padding: '32px 0', borderBottom: '1px solid var(--color-structural)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-accent)', width: '120px' }}>{stage.num} &mdash;</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text-primary)', width: '200px' }}>{stage.title}</span>
              <p className="trust-body" style={{ margin: 0, flex: 1, minWidth: '300px' }}>{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Information Security Panel */}
      <section className="section">
        <div className="ev-panel" style={{ padding: '64px' }}>
          <span className="ev-panel-num">{data.informationSecurity.num}</span>
          <h2 className="ev-panel-title">{data.informationSecurity.title}</h2>
          <p className="ev-panel-desc" style={{ marginBottom: '64px' }}>
            {data.informationSecurity.desc}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', marginBottom: '64px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="section-label" style={{ marginBottom: 0 }}>POLICY</span>
              <span className="trust-body" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{data.informationSecurity.policyTitle}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="section-label" style={{ marginBottom: 0 }}>OWNER</span>
              <span className="trust-body" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{data.informationSecurity.ownerTitle}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="section-label" style={{ marginBottom: 0 }}>REVIEW</span>
              <span className="trust-body" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{data.informationSecurity.reviewTitle}</span>
            </div>
          </div>
          <Link href={data.informationSecurity.link || "#"} className="judgment-cta">{data.informationSecurity.cta}</Link>
        </div>
      </section>

      {/* Access Control */}
      <section className="section">
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{data.accessControl.title}</h2>
        <span className="section-label">{data.accessControl.label}</span>
        <p className="card-description" style={{ maxWidth: '700px', marginBottom: '64px' }}>
          {formatText(data.accessControl.desc)}
        </p>
        
        <div className="trust-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {(data.accessControl.blocks || []).map((item: any) => (
            <div key={item.title} className="trust-card" style={{ padding: '64px' }}>
              <h3 className="card-heading" style={{ textTransform: 'uppercase', marginBottom: '16px' }}>{item.title}</h3>
              <p className="trust-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incident Response */}
      <section className="section">
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{data.incidentResponse.title}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '64px', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
          {formatText(data.incidentResponse.desc)}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.incidentResponse.steps || []).map((step: string, i: number, arr: any[]) => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Business Continuity */}
      <section className="section">
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{data.businessContinuity.title}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '64px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.businessContinuity.desc)}
        </p>

        <div className="trust-grid">
          {(data.businessContinuity.blocks || []).map((item: any) => (
            <div key={item.title} className="trust-card" style={{ padding: '64px' }}>
              <h3 className="card-heading" style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{item.title}</h3>
              <p className="trust-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Documents */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.securityDocuments.label}</h2>
        <div className="ev-table-container">
          <table className="ev-table">
            <thead>
              <tr>
                <th className="ev-th">DOCUMENT</th>
                <th className="ev-th">UPDATED</th>
                <th className="ev-th" style={{ textAlign: 'right' }}>ACCESS</th>
              </tr>
            </thead>
            <tbody>
              {(data.securityDocuments.documents || []).map((doc: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{doc.name}</td>
                  <td className="ev-td">{doc.updated}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>
                    <Link href={doc.link || "#"} className="judgment-cta ev-dl-link">{doc.action} &rarr;</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Document Status */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <span className="section-label" style={{ marginBottom: 0, color: 'var(--color-text-primary)' }}>CURRENT</span>
          <span className="section-label" style={{ marginBottom: 0, color: 'var(--color-accent)' }}>REVIEW DUE</span>
          <span className="section-label" style={{ marginBottom: 0, opacity: 0.6 }}>AVAILABLE ON REQUEST</span>
        </div>
      </section>

      {/* Security Questions */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '24px' }}>{data.securityQuestions.title}</h2>
        <p className="card-description" style={{ maxWidth: '700px', marginBottom: '48px' }}>
          {formatText(data.securityQuestions.desc)}
        </p>
        <Link href={data.securityQuestions.link || "#"} className="judgment-cta">{data.securityQuestions.cta}</Link>
      </section>

      {/* Security Principle */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '32px', maxWidth: '900px' }}>
          {formatText(data.securityPrinciple.title)}
        </h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '48px' }}>
          {formatText(data.securityPrinciple.desc)}
        </p>
        <Link href={data.securityPrinciple.link || "#"} className="judgment-cta">{data.securityPrinciple.cta}</Link>
      </section>

      {/* Back to Evidence */}
      <section className="section">
        <div className="dl-prev-next-inner">
          <Link href="/evidence" className="dl-nav-link dl-nav-prev">
            <span className="dl-nav-direction">&larr; BACK TO EVIDENCE</span>
          </Link>
          <div className="dl-nav-link dl-nav-next">
            <span className="dl-nav-direction">NEXT</span>
            <span className="dl-nav-title">LEGAL &rarr;</span>
          </div>
        </div>
      </section>
    </>
  );
}
