"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "OPERATIONS",
    title: "HOW THE WORK\\nACTUALLY RUNS.",
    subtitle: "Delivery, support, escalation, change management\\nand recovery \u2014 documented before they're needed.",
    stats: {
      count: "05 OPERATING AREAS",
      lastReviewedLabel: "LAST REVIEWED",
      lastReviewedDate: "MAR 2026"
    }
  },
  operatingModel: {
    label: "THE OPERATING MODEL",
    steps: [
      { num: "01", title: "DISCOVER", desc: "Understand the problem, constraints and desired outcome." },
      { num: "02", title: "DESIGN", desc: "Define the architecture, delivery approach and responsibilities." },
      { num: "03", title: "DELIVER", desc: "Build, test and release against the agreed scope." },
      { num: "04", title: "OPERATE", desc: "Monitor, support and continuously improve." },
      { num: "05", title: "REVIEW", desc: "Measure outcomes, risks and required changes." }
    ]
  },
  serviceOperations: {
    num: "01",
    title: "SERVICE OPERATIONS",
    desc: "What happens when the system\\nis already in production?",
    blocks: [
      { title: "SUPPORT", desc: "Defined support channels and escalation paths." },
      { title: "MONITORING", desc: "Operational health and relevant system signals." },
      { title: "ESCALATION", desc: "Defined path from operational issue to leadership when required." }
    ],
    ctaText: "VIEW OPERATIONS RUNBOOK \u2192",
    ctaLink: "#"
  },
  serviceCommitments: {
    label: "SERVICE COMMITMENTS",
    slaLabel: "SERVICE LEVEL AGREEMENT",
    slaCta: "VIEW SLA \u2192",
    slaLink: "#",
    tiers: [
      { tier: "STANDARD", response: "[DEFINED]", availability: "[DEFINED]" },
      { tier: "PRIORITY", response: "[DEFINED]", availability: "[DEFINED]" },
      { tier: "CRITICAL", response: "[DEFINED]", availability: "[DEFINED]" }
    ]
  },
  incidentEscalation: {
    title: "WHEN SOMETHING BREAKS",
    desc: "The escalation path should not depend on\\nfinding the right person at the right moment.",
    steps: ["DETECT", "TRIAGE", "INCIDENT OWNER", "TECHNICAL ESCALATION", "LEADERSHIP", "CLIENT COMMUNICATION"]
  },
  recovery: {
    title: "RECOVERY",
    rto: { title: "RTO", label: "RECOVERY TIME OBJECTIVE", desc: "How quickly the service is expected\\nto be restored.", value: "[ VALUE ]" },
    rpo: { title: "RPO", label: "RECOVERY POINT OBJECTIVE", desc: "How much data loss is acceptable\\nwithin the defined recovery model.", value: "[ VALUE ]" },
    ctas: [
      { text: "RECOVERY RUNBOOK \u2192", link: "#" },
      { text: "BUSINESS CONTINUITY PLAN \u2192", link: "#" }
    ]
  },
  changeManagement: {
    label: "CHANGE MANAGEMENT",
    title: "NOT EVERY CHANGE IS A\\nTECHNICAL DECISION.",
    descTop: "Some changes affect:",
    factors: ["cost", "risk", "reliability", "delivery timelines", "client commitments"],
    descBottom: "So changes are evaluated as business decisions,\\nnot simply implementation tasks.",
    steps: ["REQUEST", "ASSESS", "IMPACT", "APPROVE", "IMPLEMENT", "VERIFY", "DOCUMENT"]
  },
  runbookLibrary: {
    label: "RUNBOOK LIBRARY",
    documents: [
      { name: "Incident Response", type: "PDF", link: "#" },
      { name: "Business Continuity", type: "PDF", link: "#" },
      { name: "Service Escalation", type: "PDF", link: "#" },
      { name: "Change Management", type: "PDF", link: "#" },
      { name: "Release Management", type: "PDF", link: "#" },
      { name: "Operational Recovery", type: "PDF", link: "#" }
    ]
  },
  healthMonitoring: {
    label: "HEALTH MONITORING",
    title: "WE WATCH THE SYSTEMS\\nTHAT MATTER.",
    desc: "Operational monitoring provides visibility\\ninto system health, service degradation\\nand incidents.",
    areas: ["APPLICATION HEALTH", "INFRASTRUCTURE", "DEPENDENCIES", "CRITICAL SERVICES", "INCIDENT STATE"],
    cta: "INCIDENT RESPONSE POLICY \u2192",
    link: "#"
  },
  operationalDocuments: {
    label: "OPERATIONAL DOCUMENTS",
    documents: [
      { name: "Service Level Agreement", updated: "MAR 2026", link: "#" },
      { name: "Business Continuity Plan", updated: "MAR 2026", link: "#" },
      { name: "Incident Response Plan", updated: "MAR 2026", link: "#" },
      { name: "Change Management Policy", updated: "FEB 2026", link: "#" },
      { name: "Escalation Runbook", updated: "FEB 2026", link: "#" },
      { name: "Recovery Runbook", updated: "JAN 2026", link: "#" }
    ]
  },
  operatingPrinciple: {
    title: "OPERATIONS SHOULD NOT DEPEND\\nON HEROICS.",
    desc: "If the process only works when the right person\\nhappens to be online, the process isn't finished."
  }
};

export default function OperationsDossierPage() {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      const { data: record } = await supabase.from("page_content").select("content").eq("id", "evidence_operations").single();
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
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ OPERATIONS</span>
      </div>

      {/* Operations Hero */}
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
            <span className="ev-stat">{data.hero.stats.count}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="ev-stat">{data.hero.stats.lastReviewedLabel}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{data.hero.stats.lastReviewedDate}</span>
          </div>
        </div>
      </section>

      {/* Operating Model */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.operatingModel.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.operatingModel.steps || []).map((step: any, i: number, arr: any[]) => (
            <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: i < arr.length - 1 ? '16px' : '0' }}>
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

      {/* Service Operations */}
      <section className="section">
        <div className="ev-panel" style={{ padding: '64px' }}>
          <span className="ev-panel-num">{data.serviceOperations.num}</span>
          <h2 className="ev-panel-title">{data.serviceOperations.title}</h2>
          <p className="ev-panel-desc" style={{ marginBottom: '64px' }}>
            {formatText(data.serviceOperations.desc)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', marginBottom: '48px' }}>
            {(data.serviceOperations.blocks || []).map((block: any, i: number) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '250px' }}>
                <span className="card-heading" style={{ textTransform: 'uppercase' }}>{block.title}</span>
                <span className="trust-body">{block.desc}</span>
              </div>
            ))}
          </div>
          <Link href={data.serviceOperations.ctaLink || "#"} className="judgment-cta">{data.serviceOperations.ctaText}</Link>
        </div>
      </section>

      {/* SLA & Service Commitments */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.serviceCommitments.label}</h2>
        <div className="ev-table-container">
          <table className="ev-table" style={{ marginBottom: '32px' }}>
            <thead>
              <tr>
                <th className="ev-th">SERVICE TIER</th>
                <th className="ev-th">RESPONSE</th>
                <th className="ev-th" style={{ textAlign: 'right' }}>AVAILABILITY</th>
              </tr>
            </thead>
            <tbody>
              {(data.serviceCommitments.tiers || []).map((row: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{row.tier}</td>
                  <td className="ev-td">{row.response}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>{row.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '16px' }}>
          <span className="section-label" style={{ marginBottom: 0 }}>{data.serviceCommitments.slaLabel}</span>
          <Link href={data.serviceCommitments.slaLink || "#"} className="judgment-cta" style={{ marginLeft: '16px' }}>{data.serviceCommitments.slaCta}</Link>
        </div>
      </section>

      {/* Incident Escalation */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{data.incidentEscalation.title}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '64px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.incidentEscalation.desc)}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.incidentEscalation.steps || []).map((step: string, i: number, arr: any[]) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* RTO / RPO */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.recovery.title}</h2>
        
        <div className="trust-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
          <div className="trust-card" style={{ padding: '48px' }}>
            <h3 className="card-heading" style={{ marginBottom: '8px', fontSize: '2rem' }}>{data.recovery.rto.title}</h3>
            <span className="section-label">{data.recovery.rto.label}</span>
            <p className="trust-body" style={{ marginBottom: '32px', marginTop: '16px' }}>
              {formatText(data.recovery.rto.desc)}
            </p>
            <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-accent)' }}>{data.recovery.rto.value}</span>
          </div>
          <div className="trust-card" style={{ padding: '48px' }}>
            <h3 className="card-heading" style={{ marginBottom: '8px', fontSize: '2rem' }}>{data.recovery.rpo.title}</h3>
            <span className="section-label">{data.recovery.rpo.label}</span>
            <p className="trust-body" style={{ marginBottom: '32px', marginTop: '16px' }}>
              {formatText(data.recovery.rpo.desc)}
            </p>
            <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-accent)' }}>{data.recovery.rpo.value}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {(data.recovery.ctas || []).map((cta: any, i: number) => (
             <Link key={i} href={cta.link || "#"} className="judgment-cta">{cta.text}</Link>
          ))}
        </div>
      </section>

      {/* Change Management */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '32px' }}>{data.changeManagement.label}</h2>
        <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
          {formatText(data.changeManagement.title)}
        </h3>
        <p className="trust-body" style={{ marginBottom: '16px', maxWidth: '600px' }}>
          {data.changeManagement.descTop}
        </p>
        <ul className="trust-body" style={{ margin: '0 0 32px 0', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(data.changeManagement.factors || []).map((factor: string, i: number) => (
             <li key={i}>{factor}</li>
          ))}
        </ul>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '64px', color: 'var(--color-text-secondary)' }}>
          {formatText(data.changeManagement.descBottom)}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.changeManagement.steps || []).map((step: string, i: number, arr: any[]) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Runbook Library */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.runbookLibrary.label}</h2>
        <div className="ev-table-container">
          <table className="ev-table">
            <thead>
              <tr>
                <th className="ev-th">RUNBOOK</th>
                <th className="ev-th">TYPE</th>
                <th className="ev-th" style={{ textAlign: 'right' }}>ACCESS</th>
              </tr>
            </thead>
            <tbody>
              {(data.runbookLibrary.documents || []).map((doc: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{doc.name}</td>
                  <td className="ev-td">{doc.type}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>
                    <Link href={doc.link || "#"} className="judgment-cta ev-dl-link">VIEW &rarr;</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Health Monitoring */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '32px' }}>{data.healthMonitoring.label}</h2>
        <h3 className="section-heading" style={{ fontSize: '3rem', marginBottom: '24px', maxWidth: '900px' }}>
          {formatText(data.healthMonitoring.title)}
        </h3>
        <p className="card-description" style={{ maxWidth: '700px', marginBottom: '64px' }}>
          {formatText(data.healthMonitoring.desc)}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }}>
          {(data.healthMonitoring.areas || []).map((area: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }}>&mdash;</span>
              <span className="card-heading" style={{ fontSize: '1.25rem', textTransform: 'uppercase' }}>{area}</span>
            </div>
          ))}
        </div>

        <Link href={data.healthMonitoring.link || "#"} className="judgment-cta">{data.healthMonitoring.cta}</Link>
      </section>

      {/* Operational Documents */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.operationalDocuments.label}</h2>
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
              {(data.operationalDocuments.documents || []).map((doc: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{doc.name}</td>
                  <td className="ev-td">{doc.updated}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>
                    <Link href={doc.link || "#"} className="judgment-cta ev-dl-link">VIEW &rarr;</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Operating Principle */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '32px', maxWidth: '900px' }}>
          {formatText(data.operatingPrinciple.title)}
        </h2>
        <p className="card-description" style={{ maxWidth: '700px' }}>
          {formatText(data.operatingPrinciple.desc)}
        </p>
      </section>

      {/* Deep Page Navigation */}
      <section className="section">
        <div className="dl-prev-next-inner">
          <Link href="/evidence/legal" className="dl-nav-link dl-nav-prev">
            <span className="dl-nav-direction">&larr; LEGAL</span>
          </Link>
          <Link href="/evidence/#questionnaire" className="dl-nav-link dl-nav-next">
            <span className="dl-nav-direction">NEXT</span>
            <span className="dl-nav-title">QUESTIONNAIRE &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
