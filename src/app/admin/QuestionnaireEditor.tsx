"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "QUESTIONNAIRE CENTER",
    title: "START WITH THE\nANSWERS.",
    subtitle: "Pre-filled information for the teams responsible\nfor evaluating Flowtaris.",
    body: "Security. Privacy. Technical. Vendor.",
    stats: ["04 QUESTIONNAIRES", "XLSX FORMAT"]
  },
  introduction: {
    heading: "YOU SHOULDN'T HAVE TO ASK US\nTHE SAME QUESTIONS WE'VE ALREADY ANSWERED.",
    lines: [
      "We've organized the information commonly requested\nduring technical, security and procurement review.",
      "Download the relevant workbook,\nreview the answers and send us anything that requires\nadditional clarification."
    ]
  },
  questionnaires: [
    { num: "01", title: "SECURITY", desc: "Controls, infrastructure, access, monitoring, incident response and security practices.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "02", title: "DATA PRIVACY", desc: "Data processing, privacy, subprocessors and related obligations.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "03", title: "VENDOR", desc: "Company information, commercial structure, insurance, governance and operational details.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "04", title: "TECHNICAL", desc: "Architecture, integrations, deployment, reliability and technical operations.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" }
  ],
  howItWorks: {
    label: "HOW IT WORKS",
    steps: [
      { num: "01", title: "DOWNLOAD", desc: "Choose the questionnaire relevant to your review." },
      { num: "02", title: "REVIEW", desc: "Use the pre-filled answers as your starting point." },
      { num: "03", title: "CLARIFY", desc: "Send us anything that requires additional information." },
      { num: "04", title: "PROCEED", desc: "Continue the evaluation without repeating the basics." }
    ]
  },
  documentControl: {
    label: "DOCUMENT CONTROL",
    headers: ["QUESTIONNAIRE", "VERSION", "LAST UPDATED"],
    documents: [
      { name: "Security", version: "v1.0", updated: "MAR 2026" },
      { name: "Data Privacy", version: "v1.0", updated: "MAR 2026" },
      { name: "Vendor", version: "v1.0", updated: "MAR 2026" },
      { name: "Technical", version: "v1.0", updated: "MAR 2026" }
    ],
    footer: "All questionnaires are maintained from the\nsame underlying Flowtaris evidence set."
  },
  relatedEvidence: {
    heading: "THE ANSWERS HAVE SOURCES.",
    categories: [
      { title: "SECURITY", links: [{ label: "Security Policies", href: "/evidence/security" }, { label: "Incident Response", href: "/evidence/security" }, { label: "Business Continuity", href: "/evidence/security" }] },
      { title: "DATA PRIVACY", links: [{ label: "DPA", href: "/evidence/legal" }, { label: "Privacy Policy", href: "/evidence/legal" }, { label: "Subprocessor List", href: "/evidence/legal" }] },
      { title: "VENDOR", links: [{ label: "Corporate Information", href: "/evidence/legal" }, { label: "Insurance", href: "/evidence/legal" }, { label: "Commercial Agreements", href: "/evidence/legal" }] },
      { title: "TECHNICAL", links: [{ label: "Architecture", href: "/evidence/operations" }, { label: "Operations", href: "/evidence/operations" }, { label: "Recovery", href: "/evidence/operations" }] }
    ],
    cta: "EXPLORE EVIDENCE CENTER →",
    ctaLink: "/evidence"
  },
  customQuestionnaire: {
    heading: "YOUR QUESTIONNAIRE ISN'T HERE?",
    desc: "Send it to us.\nWe'll tell you which existing evidence answers the\nquestions and identify anything that requires\nadditional clarification.",
    placeholder: "WORK EMAIL",
    cta: "SUBMIT QUESTIONNAIRE →"
  },
  operatingPrinciple: {
    heading: "PROCUREMENT SHOULD TEST THE BUSINESS,\nNOT TEST YOUR PATIENCE.",
    lines: [
      "The goal of this center is simple:",
      "less repetition,\nfaster evaluation,\nbetter questions."
    ]
  },
  deepNav: {
    prevLabel: "OPERATIONS",
    prevLink: "/evidence/operations",
    nextLabel: "NEXT",
    nextTitle: "EVIDENCE CENTER →",
    nextLink: "/evidence"
  }
};

export default function QuestionnaireEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=questionnaire`);
        const { data: resData } = await res.json();
        if (resData && resData.length > 0 && resData[0].content) {
          const content = resData[0].content;
          setData({
            hero: { ...DEFAULT_DATA.hero, ...(content?.hero || {}) },
            introduction: { ...DEFAULT_DATA.introduction, ...(content?.introduction || {}) },
            questionnaires: content?.questionnaires || DEFAULT_DATA.questionnaires,
            howItWorks: { ...DEFAULT_DATA.howItWorks, ...(content?.howItWorks || {}) },
            documentControl: { ...DEFAULT_DATA.documentControl, ...(content?.documentControl || {}) },
            relatedEvidence: { ...DEFAULT_DATA.relatedEvidence, ...(content?.relatedEvidence || {}) },
            customQuestionnaire: { ...DEFAULT_DATA.customQuestionnaire, ...(content?.customQuestionnaire || {}) },
            operatingPrinciple: { ...DEFAULT_DATA.operatingPrinciple, ...(content?.operatingPrinciple || {}) },
            deepNav: { ...DEFAULT_DATA.deepNav, ...(content?.deepNav || {}) }
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
        body: JSON.stringify({ table: "page_content", record: { id: "questionnaire", content: data, updated_at: new Date().toISOString() } })
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
    setData((p: any) => ({ ...p, [section]: { ...(p[section] || {}), [key]: value } }));
  };
  const updateRoot = (key: string, value: any) => {
    setData((p: any) => ({ ...p, [key]: value }));
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Questionnaire Center Content</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Hero */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
        <input value={data.hero?.eyebrow || ""} onChange={e => update("hero", "eyebrow", e.target.value)} placeholder="Eyebrow" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.hero?.title || ""} onChange={e => update("hero", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.hero?.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} placeholder="Subtitle" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.hero?.body || ""} onChange={e => update("hero", "body", e.target.value)} placeholder="Body Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16, height: 60 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Stats</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input value={data.hero?.stats?.[0] || ""} onChange={e => { const arr = [...data.hero.stats]; arr[0] = e.target.value; update("hero", "stats", arr); }} placeholder="Stat 1" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.hero?.stats?.[1] || ""} onChange={e => { const arr = [...data.hero.stats]; arr[1] = e.target.value; update("hero", "stats", arr); }} placeholder="Stat 2" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
      </div>

      {/* Introduction */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Introduction</h2>
        <textarea value={data.introduction?.heading || ""} onChange={e => update("introduction", "heading", e.target.value)} placeholder="Heading" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.introduction?.lines?.[0] || ""} onChange={e => { const arr = [...data.introduction.lines]; arr[0] = e.target.value; update("introduction", "lines", arr); }} placeholder="Paragraph 1" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
        <textarea value={data.introduction?.lines?.[1] || ""} onChange={e => { const arr = [...data.introduction.lines]; arr[1] = e.target.value; update("introduction", "lines", arr); }} placeholder="Paragraph 2" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
      </div>

      {/* Questionnaires */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Questionnaires Grid</h2>
        {(data.questionnaires || []).map((q: any, i: number) => (
          <div key={i} style={{ display: "grid", gap: 12, marginBottom: 16, borderBottom: "1px solid #E5E7EB", paddingBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 12 }}>
              <input value={q.num || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].num = e.target.value; updateRoot("questionnaires", arr); }} placeholder="Num" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={q.title || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].title = e.target.value; updateRoot("questionnaires", arr); }} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={q.meta || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].meta = e.target.value; updateRoot("questionnaires", arr); }} placeholder="Meta (e.g. XLSX)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <textarea value={q.desc || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].desc = e.target.value; updateRoot("questionnaires", arr); }} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, height: 40 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input value={q.cta || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].cta = e.target.value; updateRoot("questionnaires", arr); }} placeholder="CTA Text" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={q.href || ""} onChange={e => { const arr = [...data.questionnaires]; arr[i].href = e.target.value; updateRoot("questionnaires", arr); }} placeholder="CTA Link" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>How It Works</h2>
        <input value={data.howItWorks?.label || ""} onChange={e => update("howItWorks", "label", e.target.value)} placeholder="Section Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        {(data.howItWorks?.steps || []).map((s: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr", gap: 12, marginBottom: 8 }}>
            <input value={s.num || ""} onChange={e => { const arr = [...data.howItWorks.steps]; arr[i].num = e.target.value; update("howItWorks", "steps", arr); }} placeholder="Num" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={s.title || ""} onChange={e => { const arr = [...data.howItWorks.steps]; arr[i].title = e.target.value; update("howItWorks", "steps", arr); }} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={s.desc || ""} onChange={e => { const arr = [...data.howItWorks.steps]; arr[i].desc = e.target.value; update("howItWorks", "steps", arr); }} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          </div>
        ))}
      </div>

      {/* Document Control */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Document Control</h2>
        <input value={data.documentControl?.label || ""} onChange={e => update("documentControl", "label", e.target.value)} placeholder="Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Table Headers</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <input value={data.documentControl?.headers?.[0] || ""} onChange={e => { const arr = [...(data.documentControl.headers || ["", "", ""])]; arr[0] = e.target.value; update("documentControl", "headers", arr); }} placeholder="Header 1 (e.g. QUESTIONNAIRE)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.documentControl?.headers?.[1] || ""} onChange={e => { const arr = [...(data.documentControl.headers || ["", "", ""])]; arr[1] = e.target.value; update("documentControl", "headers", arr); }} placeholder="Header 2 (e.g. VERSION)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.documentControl?.headers?.[2] || ""} onChange={e => { const arr = [...(data.documentControl.headers || ["", "", ""])]; arr[2] = e.target.value; update("documentControl", "headers", arr); }} placeholder="Header 3 (e.g. LAST UPDATED)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Documents</h3>
        {(data.documentControl?.documents || []).map((d: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, marginBottom: 8 }}>
            <input value={d.name || ""} onChange={e => { const arr = [...data.documentControl.documents]; arr[i].name = e.target.value; update("documentControl", "documents", arr); }} placeholder="Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={d.version || ""} onChange={e => { const arr = [...data.documentControl.documents]; arr[i].version = e.target.value; update("documentControl", "documents", arr); }} placeholder="Version" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={d.updated || ""} onChange={e => { const arr = [...data.documentControl.documents]; arr[i].updated = e.target.value; update("documentControl", "documents", arr); }} placeholder="Updated Date" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <button onClick={() => { const arr = [...data.documentControl.documents]; arr.splice(i, 1); update("documentControl", "documents", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.documentControl?.documents || []), { name: "", version: "", updated: "" }]; update("documentControl", "documents", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8, marginBottom: 16 }}>+ Add Document</button>
        <textarea value={data.documentControl?.footer || ""} onChange={e => update("documentControl", "footer", e.target.value)} placeholder="Footer Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60 }} />
      </div>
      
      {/* Related Evidence */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Related Evidence</h2>
        <input value={data.relatedEvidence?.heading || ""} onChange={e => update("relatedEvidence", "heading", e.target.value)} placeholder="Heading" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.relatedEvidence?.categories || []).map((cat: any, i: number) => (
          <div key={i} style={{ marginBottom: 24, border: "1px solid #E5E7EB", padding: 16, borderRadius: 8 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <input value={cat.title || ""} onChange={e => { const arr = [...data.relatedEvidence.categories]; arr[i].title = e.target.value; update("relatedEvidence", "categories", arr); }} placeholder="Category Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              <button onClick={() => { const arr = [...data.relatedEvidence.categories]; arr.splice(i, 1); update("relatedEvidence", "categories", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕ Delete</button>
            </div>
            {(cat.links || []).map((link: any, j: number) => (
              <div key={j} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <input value={link.label || ""} onChange={e => { const arr = [...data.relatedEvidence.categories]; arr[i].links[j].label = e.target.value; update("relatedEvidence", "categories", arr); }} placeholder="Link Label" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
                <input value={link.href || ""} onChange={e => { const arr = [...data.relatedEvidence.categories]; arr[i].links[j].href = e.target.value; update("relatedEvidence", "categories", arr); }} placeholder="Link URL" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
                <button onClick={() => { const arr = [...data.relatedEvidence.categories]; arr[i].links.splice(j, 1); update("relatedEvidence", "categories", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => { const arr = [...data.relatedEvidence.categories]; arr[i].links.push({ label: "", href: "" }); update("relatedEvidence", "categories", arr); }} style={{ background: "#E5E7EB", padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>+ Add Link</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.relatedEvidence?.categories || []), { title: "", links: [] }]; update("relatedEvidence", "categories", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>+ Add Category</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input value={data.relatedEvidence?.cta || ""} onChange={e => update("relatedEvidence", "cta", e.target.value)} placeholder="CTA Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.relatedEvidence?.ctaLink || ""} onChange={e => update("relatedEvidence", "ctaLink", e.target.value)} placeholder="CTA Link" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
      </div>

      {/* Final Sections */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Custom Questionnaire & Operating Principle</h2>
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Custom Questionnaire</h3>
        <input value={data.customQuestionnaire?.heading || ""} onChange={e => update("customQuestionnaire", "heading", e.target.value)} placeholder="Heading" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.customQuestionnaire?.desc || ""} onChange={e => update("customQuestionnaire", "desc", e.target.value)} placeholder="Description" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 80, marginBottom: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <input value={data.customQuestionnaire?.placeholder || ""} onChange={e => update("customQuestionnaire", "placeholder", e.target.value)} placeholder="Input Placeholder (e.g. WORK EMAIL)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.customQuestionnaire?.cta || ""} onChange={e => update("customQuestionnaire", "cta", e.target.value)} placeholder="CTA Label" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Operating Principle</h3>
        <textarea value={data.operatingPrinciple?.heading || ""} onChange={e => update("operatingPrinciple", "heading", e.target.value)} placeholder="Heading" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60, marginBottom: 8 }} />
        <textarea value={data.operatingPrinciple?.lines?.[0] || ""} onChange={e => { const arr = [...data.operatingPrinciple.lines]; arr[0] = e.target.value; update("operatingPrinciple", "lines", arr); }} placeholder="Line 1" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 40 }} />
        <textarea value={data.operatingPrinciple?.lines?.[1] || ""} onChange={e => { const arr = [...data.operatingPrinciple.lines]; arr[1] = e.target.value; update("operatingPrinciple", "lines", arr); }} placeholder="Line 2" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
      </div>

    </div>
  );
}
