"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "OPERATIONS",
    title: "HOW THE WORK\\nACTUALLY RUNS.",
    subtitle: "Delivery, support, escalation, change management\\nand recovery — documented before they're needed.",
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
    ctaText: "VIEW OPERATIONS RUNBOOK →",
    ctaLink: "#"
  },
  serviceCommitments: {
    label: "SERVICE COMMITMENTS",
    slaLabel: "SERVICE LEVEL AGREEMENT",
    slaCta: "VIEW SLA →",
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
      { text: "RECOVERY RUNBOOK →", link: "#" },
      { text: "BUSINESS CONTINUITY PLAN →", link: "#" }
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
    cta: "INCIDENT RESPONSE POLICY →",
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
  const updateNested = (section: string, nested: string, key: string, value: any) => setData((p: any) => ({ ...p, [section]: { ...p[section], [nested]: { ...p[section][nested], [key]: value } } }));

  const updateArrayItem = (section: string, arrKey: string, index: number, field: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section][arrKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [arrKey]: arr } };
    });
  };

  const removeArrayItem = (section: string, arrKey: string, index: number) => {
    setData((prev: any) => {
      const arr = [...(prev[section][arrKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [section]: { ...prev[section], [arrKey]: arr } };
    });
  };

  const addArrayItem = (section: string, arrKey: string, template: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section][arrKey] || [])];
      arr.push(template);
      return { ...prev, [section]: { ...prev[section], [arrKey]: arr } };
    });
  };

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
          <input value={data.hero.stats.count} onChange={e => updateNested("hero", "stats", "count", e.target.value)} placeholder="Count (e.g. 05 OPERATING AREAS)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero.stats.lastReviewedLabel} onChange={e => updateNested("hero", "stats", "lastReviewedLabel", e.target.value)} placeholder="Label (LAST REVIEWED)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero.stats.lastReviewedDate} onChange={e => updateNested("hero", "stats", "lastReviewedDate", e.target.value)} placeholder="Date (MAR 2026)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
      </div>

      {/* Operating Model */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>The Operating Model</h2>
        <input value={data.operatingModel.label} onChange={e => update("operatingModel", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.operatingModel.steps || []).map((step: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={step.num || ""} onChange={e => updateArrayItem("operatingModel", "steps", i, "num", e.target.value)} placeholder="Num" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 60 }} />
            <input value={step.title || ""} onChange={e => updateArrayItem("operatingModel", "steps", i, "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 140 }} />
            <input value={step.desc || ""} onChange={e => updateArrayItem("operatingModel", "steps", i, "desc", e.target.value)} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("operatingModel", "steps", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("operatingModel", "steps", { num: "", title: "", desc: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Step</button>
      </div>

      {/* Service Operations */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Service Operations</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={data.serviceOperations.num} onChange={e => update("serviceOperations", "num", e.target.value)} placeholder="Num" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: 60 }} />
          <input value={data.serviceOperations.title} onChange={e => update("serviceOperations", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>
        <textarea value={data.serviceOperations.desc} onChange={e => update("serviceOperations", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16, height: 60 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Blocks</h3>
        {(data.serviceOperations.blocks || []).map((block: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={block.title || ""} onChange={e => updateArrayItem("serviceOperations", "blocks", i, "title", e.target.value)} placeholder="Block Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 140 }} />
            <input value={block.desc || ""} onChange={e => updateArrayItem("serviceOperations", "blocks", i, "desc", e.target.value)} placeholder="Block Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("serviceOperations", "blocks", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("serviceOperations", "blocks", { title: "", desc: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8, marginBottom: 16 }}>+ Add Block</button>

        <div style={{ display: "flex", gap: 8 }}>
          <input value={data.serviceOperations.ctaText} onChange={e => update("serviceOperations", "ctaText", e.target.value)} placeholder="CTA Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.serviceOperations.ctaLink} onChange={e => update("serviceOperations", "ctaLink", e.target.value)} placeholder="CTA URL" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>
      </div>

      {/* Service Commitments */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Service Commitments</h2>
        <input value={data.serviceCommitments.label} onChange={e => update("serviceCommitments", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={data.serviceCommitments.slaLabel} onChange={e => update("serviceCommitments", "slaLabel", e.target.value)} placeholder="SLA Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.serviceCommitments.slaCta} onChange={e => update("serviceCommitments", "slaCta", e.target.value)} placeholder="SLA CTA Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.serviceCommitments.slaLink} onChange={e => update("serviceCommitments", "slaLink", e.target.value)} placeholder="SLA CTA URL" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Tiers</h3>
        {(data.serviceCommitments.tiers || []).map((t: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={t.tier || ""} onChange={e => updateArrayItem("serviceCommitments", "tiers", i, "tier", e.target.value)} placeholder="Tier" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={t.response || ""} onChange={e => updateArrayItem("serviceCommitments", "tiers", i, "response", e.target.value)} placeholder="Response Time" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={t.availability || ""} onChange={e => updateArrayItem("serviceCommitments", "tiers", i, "availability", e.target.value)} placeholder="Availability" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("serviceCommitments", "tiers", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("serviceCommitments", "tiers", { tier: "", response: "", availability: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Tier</button>
      </div>

      {/* Incident Escalation */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Incident Escalation</h2>
        <input value={data.incidentEscalation.title} onChange={e => update("incidentEscalation", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.incidentEscalation.desc} onChange={e => update("incidentEscalation", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <input value={(data.incidentEscalation.steps || []).join(", ")} onChange={e => update("incidentEscalation", "steps", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Steps (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>

      {/* Recovery */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recovery (RTO/RPO)</h2>
        <input value={data.recovery.title} onChange={e => update("recovery", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ border: "1px solid #E5E7EB", padding: 16, borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>RTO</h3>
            <input value={data.recovery.rto.title} onChange={e => updateNested("recovery", "rto", "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <input value={data.recovery.rto.label} onChange={e => updateNested("recovery", "rto", "label", e.target.value)} placeholder="Label" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <textarea value={data.recovery.rto.desc} onChange={e => updateNested("recovery", "rto", "desc", e.target.value)} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <input value={data.recovery.rto.value} onChange={e => updateNested("recovery", "rto", "value", e.target.value)} placeholder="Value" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div style={{ border: "1px solid #E5E7EB", padding: 16, borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>RPO</h3>
            <input value={data.recovery.rpo.title} onChange={e => updateNested("recovery", "rpo", "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <input value={data.recovery.rpo.label} onChange={e => updateNested("recovery", "rpo", "label", e.target.value)} placeholder="Label" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <textarea value={data.recovery.rpo.desc} onChange={e => updateNested("recovery", "rpo", "desc", e.target.value)} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
            <input value={data.recovery.rpo.value} onChange={e => updateNested("recovery", "rpo", "value", e.target.value)} placeholder="Value" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Recovery CTAs</h3>
        {(data.recovery.ctas || []).map((cta: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={cta.text || ""} onChange={e => updateArrayItem("recovery", "ctas", i, "text", e.target.value)} placeholder="CTA Text" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={cta.link || ""} onChange={e => updateArrayItem("recovery", "ctas", i, "link", e.target.value)} placeholder="CTA URL" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("recovery", "ctas", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("recovery", "ctas", { text: "", link: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Recovery CTA</button>
      </div>

      {/* Change Management */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Change Management</h2>
        <input value={data.changeManagement.label} onChange={e => update("changeManagement", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.changeManagement.title} onChange={e => update("changeManagement", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.changeManagement.descTop} onChange={e => update("changeManagement", "descTop", e.target.value)} placeholder="Description Top" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <input value={(data.changeManagement.factors || []).join(", ")} onChange={e => update("changeManagement", "factors", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Factors (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.changeManagement.descBottom} onChange={e => update("changeManagement", "descBottom", e.target.value)} placeholder="Description Bottom" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16, height: 60 }} />
        <input value={(data.changeManagement.steps || []).join(", ")} onChange={e => update("changeManagement", "steps", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Steps (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>

      {/* Runbook Library */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Runbook Library</h2>
        <input value={data.runbookLibrary.label} onChange={e => update("runbookLibrary", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.runbookLibrary.documents || []).map((doc: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={doc.name || ""} onChange={e => updateArrayItem("runbookLibrary", "documents", i, "name", e.target.value)} placeholder="Document Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 2 }} />
            <input value={doc.type || ""} onChange={e => updateArrayItem("runbookLibrary", "documents", i, "type", e.target.value)} placeholder="Type" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={doc.link || ""} onChange={e => updateArrayItem("runbookLibrary", "documents", i, "link", e.target.value)} placeholder="URL" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 2 }} />
            <button onClick={() => removeArrayItem("runbookLibrary", "documents", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("runbookLibrary", "documents", { name: "", type: "PDF", link: "#" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Runbook</button>
      </div>

      {/* Health Monitoring */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Health Monitoring</h2>
        <input value={data.healthMonitoring.label} onChange={e => update("healthMonitoring", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.healthMonitoring.title} onChange={e => update("healthMonitoring", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.healthMonitoring.desc} onChange={e => update("healthMonitoring", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <input value={(data.healthMonitoring.areas || []).join(", ")} onChange={e => update("healthMonitoring", "areas", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Areas (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input value={data.healthMonitoring.cta} onChange={e => update("healthMonitoring", "cta", e.target.value)} placeholder="CTA Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.healthMonitoring.link} onChange={e => update("healthMonitoring", "link", e.target.value)} placeholder="CTA URL" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>
      </div>

      {/* Operational Documents */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Operational Documents</h2>
        <input value={data.operationalDocuments.label} onChange={e => update("operationalDocuments", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.operationalDocuments.documents || []).map((doc: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={doc.name || ""} onChange={e => updateArrayItem("operationalDocuments", "documents", i, "name", e.target.value)} placeholder="Document Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 2 }} />
            <input value={doc.updated || ""} onChange={e => updateArrayItem("operationalDocuments", "documents", i, "updated", e.target.value)} placeholder="Updated (e.g. MAR 2026)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={doc.link || ""} onChange={e => updateArrayItem("operationalDocuments", "documents", i, "link", e.target.value)} placeholder="URL" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 2 }} />
            <button onClick={() => removeArrayItem("operationalDocuments", "documents", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("operationalDocuments", "documents", { name: "", updated: "", link: "#" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Document</button>
      </div>

      {/* Operating Principle */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Operating Principle</h2>
        <textarea value={data.operatingPrinciple.title} onChange={e => update("operatingPrinciple", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.operatingPrinciple.desc} onChange={e => update("operatingPrinciple", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60 }} />
      </div>

    </div>
  );
}
