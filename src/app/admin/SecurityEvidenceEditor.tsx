"use client";

import { useState, useEffect } from "react";

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

export default function SecurityEvidenceEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=evidence_security`);
        const { data: resData } = await res.json();
        
        if (resData && resData.length > 0 && resData[0].content) {
          const c = resData[0].content;
          setData({
            hero: { ...DEFAULT_DATA.hero, ...c.hero },
            securityAtAGlance: { ...DEFAULT_DATA.securityAtAGlance, ...c.securityAtAGlance },
            securityFramework: { ...DEFAULT_DATA.securityFramework, ...c.securityFramework },
            informationSecurity: { ...DEFAULT_DATA.informationSecurity, ...c.informationSecurity },
            accessControl: { ...DEFAULT_DATA.accessControl, ...c.accessControl },
            incidentResponse: { ...DEFAULT_DATA.incidentResponse, ...c.incidentResponse },
            businessContinuity: { ...DEFAULT_DATA.businessContinuity, ...c.businessContinuity },
            securityDocuments: { ...DEFAULT_DATA.securityDocuments, ...c.securityDocuments },
            securityQuestions: { ...DEFAULT_DATA.securityQuestions, ...c.securityQuestions },
            securityPrinciple: { ...DEFAULT_DATA.securityPrinciple, ...c.securityPrinciple }
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
        body: JSON.stringify({ table: "page_content", record: { id: "evidence_security", content: data, updated_at: new Date().toISOString() } })
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
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Security Evidence Content</h1>
      
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input value={data.hero.stats.docCount} onChange={e => setData((p:any) => ({...p, hero: {...p.hero, stats: {...p.hero.stats, docCount: e.target.value}}}))} placeholder="Doc Count (e.g. 06)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero.stats.lastReviewed} onChange={e => setData((p:any) => ({...p, hero: {...p.hero, stats: {...p.hero.stats, lastReviewed: e.target.value}}}))} placeholder="Date (MAR 2026)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
      </div>

      {/* Principle */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Security Principle</h2>
        <textarea value={data.securityPrinciple.title} onChange={e => update("securityPrinciple", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.securityPrinciple.desc} onChange={e => update("securityPrinciple", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60 }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>This is a subset of fields for demonstration</h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>Since Security Evidence is highly structured, all JSON content fields are available and editable directly via Supabase for maximum flexibility, while key strings are mapped here. In a full system, you would iterate over `securityFramework`, `accessControl`, etc.</p>
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Incident Response Steps</h3>
        <input value={data.incidentResponse.steps.join(", ")} onChange={e => update("incidentResponse", "steps", e.target.value.split(",").map(s => s.trim()))} placeholder="Steps (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>
    </div>
  );
}
