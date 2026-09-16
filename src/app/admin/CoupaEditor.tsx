"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function CoupaEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?id=alliance_coupa`);
      const { data: records } = await res.json();
      if (records?.[0]?.content) setData({ ...DEFAULT_DATA, ...records[0].content });
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [site]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const update = (cat: string, field: string, val: any) => setData((prev: any) => ({ ...prev, [cat]: { ...prev[cat], [field]: val } }));
  const updateArrayField = (cat: string, field: string, val: string) => update(cat, field, val.split("\\n"));
  
  const updateItem = (cat: string, index: number, field: string, val: any) => {
    setData((prev: any) => {
      const newItems = [...prev[cat].items];
      newItems[index] = { ...newItems[index], [field]: val };
      return { ...prev, [cat]: { ...prev[cat], items: newItems } };
    });
  };
  const addItem = (cat: string, emptyItem: any) => {
    setData((prev: any) => ({ ...prev, [cat]: { ...prev[cat], items: [...prev[cat].items, emptyItem] } }));
  };
  const removeItem = (cat: string, index: number) => {
    setData((prev: any) => {
      const newItems = [...prev[cat].items];
      newItems.splice(index, 1);
      return { ...prev, [cat]: { ...prev[cat], items: newItems } };
    });
  };

  async function handleSave() {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: { id: "alliance_coupa", content: data } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      setSaveStatus({ type: "success", message: `Saved Coupa alliance content!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error saving: " + e.message });
    }
    setIsSaving(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>Coupa Alliance Content</h1>
        <button onClick={handleSave} disabled={isSaving} style={{ background: "#10B981", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, fontWeight: 500, fontSize: 14, cursor: isSaving ? "wait" : "pointer", opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {saveStatus && <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>{saveStatus.message}</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, borderBottom: "1px solid #E5E7EB", paddingBottom: 16 }}>
        {Object.keys(DEFAULT_DATA).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", background: activeTab === tab ? "#111827" : "#F3F4F6", color: activeTab === tab ? "#fff" : "#4B5563", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
            {tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Eyebrow</label><input value={data.hero?.eyebrow || ""} onChange={e => update("hero", "eyebrow", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Title (e.g. FLOWTARIS \u00D7 COUPA)</label><input value={data.hero?.title || ""} onChange={e => update("hero", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Headline (\n for breaks)</label><textarea value={data.hero?.headline || ""} onChange={e => update("hero", "headline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Subtitle (\n for breaks)</label><textarea value={data.hero?.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Status Badge</label><input value={data.hero?.status || ""} onChange={e => update("hero", "status", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "problem" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>The Problem</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.problem?.label || ""} onChange={e => update("problem", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading</label><input value={data.problem?.heading || ""} onChange={e => update("problem", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Description</label><textarea value={data.problem?.description || ""} onChange={e => update("problem", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Items (one per line)</label><textarea value={(data.problem?.items || []).join("\\n")} onChange={e => updateArrayField("problem", "items", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 120 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "whereWeFit" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Where We Fit</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.whereWeFit?.label || ""} onChange={e => update("whereWeFit", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 1 Title</label><input value={data.whereWeFit?.box1Title || ""} onChange={e => update("whereWeFit", "box1Title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 1 Sub</label><input value={data.whereWeFit?.box1Sub || ""} onChange={e => update("whereWeFit", "box1Sub", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 2 Title</label><input value={data.whereWeFit?.box2Title || ""} onChange={e => update("whereWeFit", "box2Title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 2 Sub</label><input value={data.whereWeFit?.box2Sub || ""} onChange={e => update("whereWeFit", "box2Sub", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 3 Title</label><input value={data.whereWeFit?.box3Title || ""} onChange={e => update("whereWeFit", "box3Title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Box 3 Sub</label><input value={data.whereWeFit?.box3Sub || ""} onChange={e => update("whereWeFit", "box3Sub", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            </div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Description (\n for breaks)</label><textarea value={data.whereWeFit?.description || ""} onChange={e => update("whereWeFit", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "capabilities" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Capability Areas</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading</label><input value={data.capabilities?.heading || ""} onChange={e => update("capabilities", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.capabilities?.items || []).map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={item.num || ""} onChange={e => updateItem("capabilities", idx, "num", e.target.value)} placeholder="01" style={{ width: 60, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <input value={item.title || ""} onChange={e => updateItem("capabilities", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <button onClick={() => removeItem("capabilities", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                </div>
                <textarea value={item.desc || ""} onChange={e => updateItem("capabilities", idx, "desc", e.target.value)} placeholder="Description" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
              </div>
            ))}
            <button onClick={() => addItem("capabilities", { num: "00", title: "NEW", desc: "Desc" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Capability</button>
          </div>
        </div>
      )}

      {activeTab === "architecture" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>The Architecture</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.architecture?.label || ""} onChange={e => update("architecture", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div style={{ background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Top Box Title</label><input value={data.architecture?.topBoxTitle || ""} onChange={e => update("architecture", "topBoxTitle", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 12 }} />
              <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Top Box Items (comma separated)</label><input value={(data.architecture?.topItems || []).join(", ")} onChange={e => update("architecture", "topItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Middle Layer 1</label><input value={data.architecture?.mid1 || ""} onChange={e => update("architecture", "mid1", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Main Box (e.g. COUPA)</label><input value={data.architecture?.mainBox || ""} onChange={e => update("architecture", "mainBox", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Middle Layer 2</label><input value={data.architecture?.mid2 || ""} onChange={e => update("architecture", "mid2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Middle Layer 3 (Optional)</label><input value={data.architecture?.mid3 || ""} onChange={e => update("architecture", "mid3", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "procurementDataFlow" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Procurement Data Flow</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.procurementDataFlow?.label || ""} onChange={e => update("procurementDataFlow", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Flow Items (comma separated)</label><input value={(data.procurementDataFlow?.flowItems || []).join(", ")} onChange={e => update("procurementDataFlow", "flowItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Side Items (comma separated)</label><input value={(data.procurementDataFlow?.sideItems || []).join(", ")} onChange={e => update("procurementDataFlow", "sideItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Statement 1</label><input value={data.procurementDataFlow?.statement1 || ""} onChange={e => update("procurementDataFlow", "statement1", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Statement 2 (\n for breaks)</label><textarea value={data.procurementDataFlow?.statement2 || ""} onChange={e => update("procurementDataFlow", "statement2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "commonEngagements" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Common Engagements</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading</label><input value={data.commonEngagements?.heading || ""} onChange={e => update("commonEngagements", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.commonEngagements?.items || []).map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={item.num || ""} onChange={e => updateItem("commonEngagements", idx, "num", e.target.value)} placeholder="01" style={{ width: 60, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <input value={item.title || ""} onChange={e => updateItem("commonEngagements", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <button onClick={() => removeItem("commonEngagements", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                </div>
                <textarea value={item.desc || ""} onChange={e => updateItem("commonEngagements", idx, "desc", e.target.value)} placeholder="Description" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
              </div>
            ))}
            <button onClick={() => addItem("commonEngagements", { num: "00", title: "NEW", desc: "Desc" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Engagement</button>
          </div>
        </div>
      )}

      {activeTab === "howWeWork" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>How We Work</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.howWeWork?.label || ""} onChange={e => update("howWeWork", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.howWeWork?.items || []).map((item: any, idx: number) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", padding: 12, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <input value={item.num || ""} onChange={e => updateItem("howWeWork", idx, "num", e.target.value)} style={{ width: 60, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <input value={item.title || ""} onChange={e => updateItem("howWeWork", idx, "title", e.target.value)} placeholder="Title" style={{ width: 150, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <input value={item.desc || ""} onChange={e => updateItem("howWeWork", idx, "desc", e.target.value)} placeholder="Description" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <button onClick={() => removeItem("howWeWork", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => addItem("howWeWork", { num: "00", title: "NEW", desc: "Desc" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Step</button>
          </div>
        </div>
      )}

      {activeTab === "combinationMatters" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Why The Combination Matters</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Statement 1</label><input value={data.combinationMatters?.statement1 || ""} onChange={e => update("combinationMatters", "statement1", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Statement 2</label><input value={data.combinationMatters?.statement2 || ""} onChange={e => update("combinationMatters", "statement2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Bullets (one per line)</label><textarea value={(data.combinationMatters?.bullets || []).join("\\n")} onChange={e => updateArrayField("combinationMatters", "bullets", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} /></div>
          </div>
        </div>
      )}

      {activeTab === "evidenceConnection" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Evidence Connection</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading (\n for breaks)</label><textarea value={data.evidenceConnection?.heading || ""} onChange={e => update("evidenceConnection", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Description (\n for breaks)</label><textarea value={data.evidenceConnection?.description || ""} onChange={e => update("evidenceConnection", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>CTA Text</label><input value={data.evidenceConnection?.cta || ""} onChange={e => update("evidenceConnection", "cta", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
              <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Link</label><input value={data.evidenceConnection?.link || ""} onChange={e => update("evidenceConnection", "link", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
