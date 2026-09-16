"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  hero: { eyebrow: "EVIDENCE", title: "HOW WE OPERATE.", subtitle: "The documents behind the claims.\nSecurity. Governance. Operations.", body: "Everything procurement needs to understand before the conversation starts.", stats: ["10+ DOCUMENTS", "03 CATEGORIES"] },
  categories: ["SECURITY", "LEGAL", "OPERATIONS", "QUESTIONNAIRE"],
  panels: [
    { id: "security", num: "01", title: "SECURITY", desc: "The controls, policies and practices that protect\nclient systems and information.", docs: ["SOC 2", "INFORMATION SECURITY POLICY", "INCIDENT RESPONSE", "BUSINESS CONTINUITY"], cta: "EXPLORE SECURITY →" },
    { id: "legal", num: "02", title: "LEGAL", desc: "The agreements, policies and governance material\nbehind our commercial relationships.", docs: ["MSA", "DPA", "SUBPROCESSORS", "INSURANCE"], cta: "EXPLORE LEGAL →" },
    { id: "operations", num: "03", title: "OPERATIONS", desc: "How we deliver, support and recover\nwhen things don't go according to plan.", docs: ["SLA", "RTO / RPO", "CHANGE MANAGEMENT", "ESCALATION"], cta: "EXPLORE OPERATIONS →" }
  ],
  library: { title: "DOCUMENT LIBRARY", colDocument: "DOCUMENT", colType: "TYPE", colUpdated: "UPDATED", colAction: "ACTION", documents: [
    { name: "SOC 2 REPORT", type: "PDF", updated: "MAR 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Information Security Policy", type: "PDF", updated: "FEB 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Incident Response Plan", type: "PDF", updated: "FEB 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Business Continuity Plan", type: "PDF", updated: "JAN 2026", category: "OPERATIONS", url: "#", cta: "DOWNLOAD →" },
    { name: "Subprocessor List", type: "PDF", updated: "JAN 2026", category: "LEGAL", url: "#", cta: "DOWNLOAD →" },
    { name: "Cyber Insurance Certificate", type: "PDF", updated: "DEC 2025", category: "LEGAL", url: "#", cta: "DOWNLOAD →" },
    { name: "Data Processing Agreement", type: "PDF", updated: "DEC 2025", category: "LEGAL", url: "#", cta: "DOWNLOAD →" }
  ] },
  questionnaire: { label: "PROCUREMENT QUESTIONNAIRE", title: "DON'T SEND US YOUR QUESTIONNAIRE FIRST.\nSTART WITH OURS.", desc: "We've pre-filled the information procurement teams\nusually need before a technical conversation.", items: [
    { name: "SECURITY QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "DATA PRIVACY QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "VENDOR QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "TECHNICAL QUESTIONNAIRE", type: "XLSX", href: "#" }
  ] },
  protectedAccess: { label: "REQUEST DOCUMENT", desc: "Some documents contain information intended\nfor verified business contacts.", cta: "SEND ACCESS LINK →" },
  transparency: { label: "CLAIMS SHOULD HAVE DOCUMENTS BEHIND THEM.", content: ["If we say we have a control,\nthere should be evidence of the control.", "If we say we have a process,\nthere should be a process you can inspect."] },
  bridge: { text1: "JUDGMENT TELLS YOU WHAT WE BELIEVE.", text2: "EVIDENCE SHOWS YOU HOW WE OPERATE.", cta: "← READ OUR DECISIONS", href: "/judgment/", steps: [{ title: "JUDGMENT", desc: "How we think" }, { title: "EVIDENCE", desc: "How we operate" }, { title: "LEVERAGE", desc: "How we scale" }] },
  finalCta: { title: "NEED SOMETHING THAT ISN'T HERE?", desc: "Ask us directly.", cta: "CONTACT FLOWTARIS →", href: "/contact" }
};

export default function EvidenceEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=evidence`);
        const { data: resData } = await res.json();
        if (resData && resData.length > 0 && resData[0].content) {
          const content = resData[0].content;
          setData({
            hero: { ...DEFAULT_DATA.hero, ...(content?.hero || {}) },
            categories: content?.categories || DEFAULT_DATA.categories,
            panels: content?.panels || DEFAULT_DATA.panels,
            library: { ...DEFAULT_DATA.library, ...(content?.library || {}) },
            questionnaire: { ...DEFAULT_DATA.questionnaire, ...(content?.questionnaire || {}) },
            protectedAccess: { ...DEFAULT_DATA.protectedAccess, ...(content?.protectedAccess || {}) },
            transparency: { ...DEFAULT_DATA.transparency, ...(content?.transparency || {}) },
            bridge: { ...DEFAULT_DATA.bridge, ...(content?.bridge || {}) },
            finalCta: { ...DEFAULT_DATA.finalCta, ...(content?.finalCta || {}) }
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
        body: JSON.stringify({ table: "page_content", record: { id: "evidence", content: data, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error: " + e.message });
    }
  }

  const update = (section: string, key: string, value: any) => {
    setData((p: any) => ({ ...p, [section]: { ...p[section], [key]: value } }));
  };
  const updateRoot = (key: string, value: any) => {
    setData((p: any) => ({ ...p, [key]: value }));
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Evidence Page Content</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Hero */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
        <input value={data.hero.eyebrow || ""} onChange={e => update("hero", "eyebrow", e.target.value)} placeholder="Eyebrow" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.hero.title || ""} onChange={e => update("hero", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.hero.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} placeholder="Subtitle" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.hero.body || ""} onChange={e => update("hero", "body", e.target.value)} placeholder="Body" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <input value={(data.hero.stats || []).join(", ")} onChange={e => update("hero", "stats", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Stats (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>

      {/* Categories Nav */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Navigation Categories</h2>
        <input value={(data.categories || []).join(", ")} onChange={e => updateRoot("categories", e.target.value.split(",").map((s:string) => s.trim()))} placeholder="Categories (comma separated)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>

      {/* Editorial Panels */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Editorial Panels</h2>
        {(data.panels || []).map((panel: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 16, border: "1px solid #E5E7EB", padding: 16, borderRadius: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={panel.num || ""} onChange={e => { const arr = [...data.panels]; arr[i].num = e.target.value; updateRoot("panels", arr); }} placeholder="No." style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 60 }} />
                <input value={panel.id || ""} onChange={e => { const arr = [...data.panels]; arr[i].id = e.target.value; updateRoot("panels", arr); }} placeholder="ID" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 120 }} />
                <input value={panel.title || ""} onChange={e => { const arr = [...data.panels]; arr[i].title = e.target.value; updateRoot("panels", arr); }} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              </div>
              <textarea value={panel.desc || ""} onChange={e => { const arr = [...data.panels]; arr[i].desc = e.target.value; updateRoot("panels", arr); }} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, height: 60 }} />
              <input value={(panel.docs || []).join(", ")} onChange={e => { const arr = [...data.panels]; arr[i].docs = e.target.value.split(",").map((s:string) => s.trim()); updateRoot("panels", arr); }} placeholder="Documents (comma separated)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={panel.cta || ""} onChange={e => { const arr = [...data.panels]; arr[i].cta = e.target.value; updateRoot("panels", arr); }} placeholder="CTA Text" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <button onClick={() => { const arr = [...data.panels]; arr.splice(i, 1); updateRoot("panels", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", alignSelf: "flex-start" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.panels || []), { id: "", num: "", title: "", desc: "", docs: [], cta: "" }]; updateRoot("panels", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add Panel</button>
      </div>

      {/* Document Library */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Document Library</h2>
        <input value={data.library.title || ""} onChange={e => update("library", "title", e.target.value)} placeholder="Section Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Column Names</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          <input value={data.library.colDocument || ""} onChange={e => update("library", "colDocument", e.target.value)} placeholder="Col 1 (DOCUMENT)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.library.colType || ""} onChange={e => update("library", "colType", e.target.value)} placeholder="Col 2 (TYPE)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.library.colUpdated || ""} onChange={e => update("library", "colUpdated", e.target.value)} placeholder="Col 3 (UPDATED)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.library.colAction || ""} onChange={e => update("library", "colAction", e.target.value)} placeholder="Col 4 (ACTION)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Documents</h3>
        {(data.library.documents || []).map((doc: any, i: number) => (
          <div key={i} style={{ border: "1px solid #E5E7EB", padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 8 }}>
              <input value={doc.name || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].name = e.target.value; update("library", "documents", arr); }} placeholder="Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={doc.type || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].type = e.target.value; update("library", "documents", arr); }} placeholder="Type (e.g. PDF)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={doc.updated || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].updated = e.target.value; update("library", "documents", arr); }} placeholder="Updated (e.g. MAR 2026)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={doc.category || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].category = e.target.value; update("library", "documents", arr); }} placeholder="Category" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <button onClick={() => { const arr = [...data.library.documents]; arr.splice(i, 1); update("library", "documents", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={doc.cta || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].cta = e.target.value; update("library", "documents", arr); }} placeholder="CTA Text (e.g. DOWNLOAD →)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              <input value={doc.url || ""} onChange={e => { const arr = [...data.library.documents]; arr[i].url = e.target.value; update("library", "documents", arr); }} placeholder="URL (e.g. https://...)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 2 }} />
            </div>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.library.documents || []), { name: "", type: "", updated: "", category: "", url: "", cta: "DOWNLOAD →" }]; update("library", "documents", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Document</button>
      </div>

      {/* Questionnaire */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Questionnaire Center</h2>
        <input value={data.questionnaire.label || ""} onChange={e => update("questionnaire", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.questionnaire.title || ""} onChange={e => update("questionnaire", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.questionnaire.desc || ""} onChange={e => update("questionnaire", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16, height: 60 }} />
        
        {(data.questionnaire.items || []).map((q: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr auto", gap: 8, marginBottom: 8 }}>
            <input value={q.name || ""} onChange={e => { const arr = [...data.questionnaire.items]; arr[i].name = e.target.value; update("questionnaire", "items", arr); }} placeholder="Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={q.type || ""} onChange={e => { const arr = [...data.questionnaire.items]; arr[i].type = e.target.value; update("questionnaire", "items", arr); }} placeholder="Type (e.g. XLSX)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={q.href || ""} onChange={e => { const arr = [...data.questionnaire.items]; arr[i].href = e.target.value; update("questionnaire", "items", arr); }} placeholder="Link" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <button onClick={() => { const arr = [...data.questionnaire.items]; arr.splice(i, 1); update("questionnaire", "items", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.questionnaire.items || []), { name: "", type: "", href: "" }]; update("questionnaire", "items", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Item</button>
      </div>

      {/* Protected Access */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Protected Access</h2>
        <input value={data.protectedAccess.label || ""} onChange={e => update("protectedAccess", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.protectedAccess.desc || ""} onChange={e => update("protectedAccess", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <input value={data.protectedAccess.cta || ""} onChange={e => update("protectedAccess", "cta", e.target.value)} placeholder="CTA" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
      </div>

      {/* Transparency Statement */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Transparency Statement</h2>
        <input value={data.transparency.label || ""} onChange={e => update("transparency", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <label style={{ fontSize: 13, fontWeight: 500 }}>Content Paragraphs (one per line)</label>
        <textarea value={(data.transparency.content || []).join("\\n")} onChange={e => update("transparency", "content", e.target.value.split("\\n"))} placeholder="Content" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 120, marginTop: 4 }} />
      </div>

      {/* Bridge */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Judgment Bridge</h2>
        <input value={data.bridge.text1 || ""} onChange={e => update("bridge", "text1", e.target.value)} placeholder="Text 1" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <input value={data.bridge.text2 || ""} onChange={e => update("bridge", "text2", e.target.value)} placeholder="Text 2" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={data.bridge.cta || ""} onChange={e => update("bridge", "cta", e.target.value)} placeholder="CTA Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.bridge.href || ""} onChange={e => update("bridge", "href", e.target.value)} placeholder="CTA Link" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Architecture Diagram Steps</h3>
        {(data.bridge.steps || []).map((step: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 8 }}>
            <input value={step.title || ""} onChange={e => { const arr = [...data.bridge.steps]; arr[i].title = e.target.value; update("bridge", "steps", arr); }} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={step.desc || ""} onChange={e => { const arr = [...data.bridge.steps]; arr[i].desc = e.target.value; update("bridge", "steps", arr); }} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <button onClick={() => { const arr = [...data.bridge.steps]; arr.splice(i, 1); update("bridge", "steps", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.bridge.steps || []), { title: "", desc: "" }]; update("bridge", "steps", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Step</button>
      </div>

      {/* Final CTA */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Final CTA</h2>
        <textarea value={data.finalCta.title || ""} onChange={e => update("finalCta", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.finalCta.desc || ""} onChange={e => update("finalCta", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input value={data.finalCta.cta || ""} onChange={e => update("finalCta", "cta", e.target.value)} placeholder="CTA Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <input value={data.finalCta.href || ""} onChange={e => update("finalCta", "href", e.target.value)} placeholder="CTA Link" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
        </div>
      </div>

    </div>
  );
}
