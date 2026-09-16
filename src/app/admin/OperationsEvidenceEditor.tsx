"use client";

import { useState, useEffect } from "react";

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

export default function OperationsEvidenceEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=evidence_operations`);
        const { data: resData } = await res.json();
        
        if (resData && resData.length > 0 && resData[0].content) {
          const c = resData[0].content;
          setData({
            hero: { ...DEFAULT_DATA.hero, ...c.hero },
            operatingModel: { ...DEFAULT_DATA.operatingModel, ...c.operatingModel },
            serviceOperations: { ...DEFAULT_DATA.serviceOperations, ...c.serviceOperations },
            serviceCommitments: { ...DEFAULT_DATA.serviceCommitments, ...c.serviceCommitments },
            incidentEscalation: { ...DEFAULT_DATA.incidentEscalation, ...c.incidentEscalation },
            recovery: { ...DEFAULT_DATA.recovery, ...c.recovery },
            changeManagement: { ...DEFAULT_DATA.changeManagement, ...c.changeManagement },
            runbookLibrary: { ...DEFAULT_DATA.runbookLibrary, ...c.runbookLibrary },
            healthMonitoring: { ...DEFAULT_DATA.healthMonitoring, ...c.healthMonitoring },
            operationalDocuments: { ...DEFAULT_DATA.operationalDocuments, ...c.operationalDocuments },
            operatingPrinciple: { ...DEFAULT_DATA.operatingPrinciple, ...c.operatingPrinciple }
          });
        } else {
          setData(DEFAULT_DATA);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [site]);

  useEffect(() => {
    if (saveStatus) { const timer = setTimeout(() => setSaveStatus(null), 4000); return () => clearTimeout(timer); } return undefined;
  }, [saveStatus]);

  async function save() {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "page_content", record: { id: "evidence_operations", content: data, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error: " + e.message });
    }
  }

  const update = (section: string, key: string, value: any) => setData((p: any) => ({ ...p, [section]: { ...p[section], [key]: value } }));

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Operations Evidence Content</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Hero */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
        <input value={data.hero.eyebrow} onChange={e => update("hero", "eyebrow", e.target.value)} placeholder="Eyebrow" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.hero.title} onChange={e => update("hero", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.hero.subtitle} onChange={e => update("hero", "subtitle", e.target.value)} placeholder="Subtitle" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Stats</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <input value={data.hero.stats.count} onChange={e => setData((p:any) => ({...p, hero: {...p.hero, stats: {...p.hero.stats, count: e.target.value}}}))} placeholder="Count (e.g. 05 OPERATING AREAS)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero.stats.lastReviewedLabel} onChange={e => setData((p:any) => ({...p, hero: {...p.hero, stats: {...p.hero.stats, lastReviewedLabel: e.target.value}}}))} placeholder="Label (LAST REVIEWED)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero.stats.lastReviewedDate} onChange={e => setData((p:any) => ({...p, hero: {...p.hero, stats: {...p.hero.stats, lastReviewedDate: e.target.value}}}))} placeholder="Date (MAR 2026)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
      </div>

      {/* Operating Principle */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Operating Principle</h2>
        <textarea value={data.operatingPrinciple.title} onChange={e => update("operatingPrinciple", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.operatingPrinciple.desc} onChange={e => update("operatingPrinciple", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60 }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>This is a subset of fields for demonstration</h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>Since Operations Evidence is highly structured, all JSON content fields are available and editable directly via Supabase for maximum flexibility, while key strings are mapped here. In a full system, you would iterate over `operatingModel`, `serviceCommitments`, etc. similar to the NetSuite Editor.</p>
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Incident Escalation</h3>
        <input value={data.incidentEscalation.title} onChange={e => update("incidentEscalation", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <input value={data.incidentEscalation.steps.join(", ")} onChange={e => update("incidentEscalation", "steps", e.target.value.split(",").map(s => s.trim()))} placeholder="Steps (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>
    </div>
  );
}
