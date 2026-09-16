"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "STRATEGIC ALLIANCE",
    title: "FLOWTARIS \u00D7 NETSUITE",
    headline: "ENTERPRISE SYSTEMS\\nWITHOUT THE\\nIMPLEMENTATION\\nBLIND SPOTS.",
    subtitle: "Architecture, integration and engineering\\ncapability around NetSuite environments.",
    status: "[ STRATEGIC CAPABILITY ]"
  },
  problem: {
    label: "THE PROBLEM",
    heading: "NETSUITE ISN'T THE HARD PART.",
    description: "The difficult work begins around it.",
    items: ["Integrations.", "Data movement.", "Legacy systems.", "Business processes.", "Customization.", "Operational reliability."]
  },
  whereWeFit: {
    label: "WHERE WE ADD CAPABILITY",
    box1Title: "NETSUITE", box1Sub: "ERP PLATFORM",
    box2Title: "FLOWTARIS", box2Sub: "ENGINEERING",
    box3Title: "INTEGRATED", box3Sub: "ENTERPRISE SYSTEM",
    description: "Flowtaris works around the platform layer where\\narchitecture, integration and engineering decisions\\ndetermine whether the implementation remains\\nmaintainable after launch."
  },
  capabilities: {
    heading: "CAPABILITY AREAS",
    items: [
      { num: "01", title: "ARCHITECTURE", desc: "Design the surrounding system so NetSuite doesn't become an isolated enterprise island." },
      { num: "02", title: "INTEGRATION", desc: "Connect NetSuite with the systems, data and workflows around it." },
      { num: "03", title: "DATA", desc: "Create reliable movement, transformation and governance across enterprise data." },
      { num: "04", title: "ENGINEERING", desc: "Build the custom services and technical components the platform alone doesn't provide." }
    ]
  },
  architecture: {
    label: "THE ARCHITECTURE",
    topBoxTitle: "BUSINESS SYSTEMS",
    topItems: ["CRM", "E-COMMERCE", "PAYMENTS", "DATA"],
    mid1: "INTEGRATION LAYER",
    mainBox: "NETSUITE",
    mid2: "DATA / ANALYTICS"
  },
  howWeWork: {
    label: "HOW WE WORK",
    items: [
      { num: "01", title: "DISCOVER", desc: "Understand the existing enterprise landscape." },
      { num: "02", "title": "ARCHITECT", desc: "Define the target state, interfaces and boundaries." },
      { num: "03", "title": "INTEGRATE", desc: "Connect NetSuite to the surrounding systems." },
      { num: "04", "title": "ENGINEER", desc: "Build what the platform doesn't provide." },
      { num: "05", "title": "OPERATE", desc: "Monitor, improve and maintain the system." }
    ]
  },
  decisionLogs: {
    label: "DECISION LOGS",
    heading: "HOW WE ENGINEER NETSUITE.",
    description: "Read the decisions behind the implementations.",
    items: [
      { date: "FEB 03, 2026", tags: "CTO \u00B7 TECH \u00B7 CRISIS", title: "THE NETSUITE API CRISIS", cta: "READ DECISION \u2192", link: "/judgment/netsuite" }
    ]
  }
};

export default function NetsuiteEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?id=alliance_netsuite`);
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
        body: JSON.stringify({ record: { id: "alliance_netsuite", content: data } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      setSaveStatus({ type: "success", message: `Saved NetSuite alliance content!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error saving: " + e.message });
    }
    setIsSaving(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>NetSuite Alliance Content</h1>
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
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Title (e.g. FLOWTARIS \u00D7 NETSUITE)</label><input value={data.hero?.title || ""} onChange={e => update("hero", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
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
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Main Box (e.g. NETSUITE)</label><input value={data.architecture?.mainBox || ""} onChange={e => update("architecture", "mainBox", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Middle Layer 2</label><input value={data.architecture?.mid2 || ""} onChange={e => update("architecture", "mid2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
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

      {activeTab === "decisionLogs" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Decision Logs</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.decisionLogs?.label || ""} onChange={e => update("decisionLogs", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading</label><input value={data.decisionLogs?.heading || ""} onChange={e => update("decisionLogs", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Description</label><textarea value={data.decisionLogs?.description || ""} onChange={e => update("decisionLogs", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Featured Logs</label>
              {(data.decisionLogs?.items || []).map((item: any, idx: number) => (
                <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB", marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <input value={item.date || ""} onChange={e => updateItem("decisionLogs", idx, "date", e.target.value)} placeholder="Date" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                    <input value={item.tags || ""} onChange={e => updateItem("decisionLogs", idx, "tags", e.target.value)} placeholder="Tags" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input value={item.title || ""} onChange={e => updateItem("decisionLogs", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={item.cta || ""} onChange={e => updateItem("decisionLogs", idx, "cta", e.target.value)} placeholder="CTA Text" style={{ width: "150px", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                    <input value={item.link || ""} onChange={e => updateItem("decisionLogs", idx, "link", e.target.value)} placeholder="Link" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                    <button onClick={() => removeItem("decisionLogs", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addItem("decisionLogs", { date: "DATE", tags: "TAGS", title: "TITLE", cta: "READ ->", link: "#" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
