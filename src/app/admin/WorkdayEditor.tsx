"use client";

import { useState, useEffect, useCallback } from "react";

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
  specialists: [] // The existing workday_specialists will be merged here
};

export default function WorkdayEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?id=alliance_workday`);
      const { data: records } = await res.json();
      
      // Also fetch legacy specialists just in case it's in workday_specialists
      const specRes = await fetch(`/api/content/${site}?id=workday_specialists`);
      const { data: specRecords } = await specRes.json();
      const legacySpecialists = specRecords?.[0]?.content?.specialists || [];
      
      if (records?.[0]?.content) {
        setData({ ...DEFAULT_DATA, ...records[0].content, specialists: records[0].content.specialists || legacySpecialists });
      } else {
        setData({ ...DEFAULT_DATA, specialists: legacySpecialists });
      }
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
      const targetArray = prev[cat].items || prev[cat].blocks || prev[cat].rows;
      const newItems = [...targetArray];
      newItems[index] = { ...newItems[index], [field]: val };
      return { ...prev, [cat]: { ...prev[cat], [prev[cat].items ? "items" : prev[cat].blocks ? "blocks" : "rows"]: newItems } };
    });
  };
  const addItem = (cat: string, emptyItem: any) => {
    setData((prev: any) => {
      const targetField = prev[cat].items ? "items" : prev[cat].blocks ? "blocks" : "rows";
      return { ...prev, [cat]: { ...prev[cat], [targetField]: [...prev[cat][targetField], emptyItem] } };
    });
  };
  const removeItem = (cat: string, index: number) => {
    setData((prev: any) => {
      const targetField = prev[cat].items ? "items" : prev[cat].blocks ? "blocks" : "rows";
      const newItems = [...prev[cat][targetField]];
      newItems.splice(index, 1);
      return { ...prev, [cat]: { ...prev[cat], [targetField]: newItems } };
    });
  };
  
  const updateSpecialist = (index: number, field: string, val: any) => {
    setData((prev: any) => {
      const newSpecs = [...prev.specialists];
      newSpecs[index] = { ...newSpecs[index], [field]: val };
      return { ...prev, specialists: newSpecs };
    });
  };
  const addSpecialist = () => {
    setData((prev: any) => ({ ...prev, specialists: [...prev.specialists, { id: Date.now(), name: "NEW", specialty: "Specialty", description: "Desc", location: "Location" }] }));
  };
  const removeSpecialist = (index: number) => {
    setData((prev: any) => {
      const newSpecs = [...prev.specialists];
      newSpecs.splice(index, 1);
      return { ...prev, specialists: newSpecs };
    });
  };

  async function handleSave() {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: { id: "alliance_workday", content: data } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      // Save specialists to workday_specialists too for backward compatibility if needed, or just keep it unified
      await fetch(`/api/content/${site}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: { id: "workday_specialists", content: { specialists: data.specialists } } })
      });

      setSaveStatus({ type: "success", message: `Saved Workday alliance content!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error saving: " + e.message });
    }
    setIsSaving(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>Workday Alliance Content</h1>
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
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Headline (\n for breaks)</label><textarea value={data.hero?.headline || ""} onChange={e => update("hero", "headline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Subtitle (\n for breaks)</label><textarea value={data.hero?.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Tags (comma separated)</label><input value={(data.hero?.tags || []).join(", ")} onChange={e => update("hero", "tags", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} /></div>
          </div>
        </div>
      )}

      {/* Skipping repetitive boilerplate for other tabs to save space, but they function the same as Netsuite/Coupa */}
      {/* For brevity, I'll include just a generic JSON editor fallback for the other sections if you want, but I'll write them out. */}
      {activeTab === "heroVisual" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Visual</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input value={data.heroVisual?.topTitle || ""} onChange={e => update("heroVisual", "topTitle", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Top Title" />
            <input value={(data.heroVisual?.topBoxes || []).join(", ")} onChange={e => update("heroVisual", "topBoxes", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Top Boxes (comma separated)" />
            <input value={data.heroVisual?.midText || ""} onChange={e => update("heroVisual", "midText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Middle Text" />
            <input value={(data.heroVisual?.bottomBoxes || []).join(", ")} onChange={e => update("heroVisual", "bottomBoxes", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Bottom Boxes (comma separated)" />
          </div>
        </div>
      )}

      {activeTab === "allianceProfile" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Alliance Profile</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input value={data.allianceProfile?.label || ""} onChange={e => update("allianceProfile", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Label" />
            <input value={data.allianceProfile?.type || ""} onChange={e => update("allianceProfile", "type", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Partner Type" />
            <input value={data.allianceProfile?.specialization || ""} onChange={e => update("allianceProfile", "specialization", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Specialization" />
            <input value={data.allianceProfile?.delivery || ""} onChange={e => update("allianceProfile", "delivery", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Delivery Model" />
          </div>
        </div>
      )}

      {activeTab === "jointValue" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>The Joint Value</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input value={data.jointValue?.label || ""} onChange={e => update("jointValue", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Label" />
            <input value={data.jointValue?.statement1 || ""} onChange={e => update("jointValue", "statement1", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Statement 1" />
            <textarea value={data.jointValue?.statement2 || ""} onChange={e => update("jointValue", "statement2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Statement 2 (\n for breaks)" />
            
            {(data.jointValue?.blocks || []).map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={item.title || ""} onChange={e => updateItem("jointValue", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <button onClick={() => removeItem("jointValue", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                </div>
                <textarea value={item.desc || ""} onChange={e => updateItem("jointValue", idx, "desc", e.target.value)} placeholder="Description (\n for breaks)" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            ))}
            <button onClick={() => addItem("jointValue", { title: "NEW", desc: "Desc" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Block</button>
          </div>
        </div>
      )}

      {activeTab === "whereWeFit" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Where Flowtaris Fits</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input value={data.whereWeFit?.label || ""} onChange={e => update("whereWeFit", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Label" />
            <input value={data.whereWeFit?.topHeading || ""} onChange={e => update("whereWeFit", "topHeading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Top Heading" />
            <input value={(data.whereWeFit?.topItems || []).join(", ")} onChange={e => update("whereWeFit", "topItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Top Items (comma separated)" />
            <input value={data.whereWeFit?.midHeading || ""} onChange={e => update("whereWeFit", "midHeading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Mid Heading" />
            <input value={(data.whereWeFit?.midItems || []).join(", ")} onChange={e => update("whereWeFit", "midItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Mid Items (comma separated)" />
            <input value={data.whereWeFit?.bottomHeading || ""} onChange={e => update("whereWeFit", "bottomHeading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Bottom Heading" />
            <input value={(data.whereWeFit?.bottomItems || []).join(", ")} onChange={e => update("whereWeFit", "bottomItems", e.target.value.split(",").map((s:string)=>s.trim()))} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Bottom Items (comma separated)" />
          </div>
        </div>
      )}

      {activeTab === "workdayEngineering" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Workday Engineering</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Heading</label><input value={data.workdayEngineering?.heading || ""} onChange={e => update("workdayEngineering", "heading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.workdayEngineering?.items || []).map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={item.num || ""} onChange={e => updateItem("workdayEngineering", idx, "num", e.target.value)} placeholder="01" style={{ width: 60, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <input value={item.title || ""} onChange={e => updateItem("workdayEngineering", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <input value={item.tag || ""} onChange={e => updateItem("workdayEngineering", idx, "tag", e.target.value)} placeholder="Tag" style={{ width: 120, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <button onClick={() => removeItem("workdayEngineering", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                </div>
                <textarea value={item.desc || ""} onChange={e => updateItem("workdayEngineering", idx, "desc", e.target.value)} placeholder="Description" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 8 }} />
                <textarea value={item.subtext || ""} onChange={e => updateItem("workdayEngineering", idx, "subtext", e.target.value)} placeholder="Subtext" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            ))}
            <button onClick={() => addItem("workdayEngineering", { num: "00", title: "NEW", tag: "TAG", desc: "Desc", subtext: "Subtext" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Item</button>
          </div>
        </div>
      )}

      {activeTab === "decisionFramework" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Which Pattern Fits? (Decision Framework)</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.decisionFramework?.label || ""} onChange={e => update("decisionFramework", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.decisionFramework?.rows || []).map((row: any, idx: number) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={row.req || ""} onChange={e => updateItem("decisionFramework", idx, "req", e.target.value)} placeholder="Requirement" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <input value={row.ans || ""} onChange={e => updateItem("decisionFramework", idx, "ans", e.target.value)} placeholder="Answer" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <button onClick={() => removeItem("decisionFramework", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => addItem("decisionFramework", { req: "Req", ans: "Ans" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Row</button>
          </div>
        </div>
      )}

      {activeTab === "commonLandscapes" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Common Landscapes</h2>
          <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Label</label><input value={data.commonLandscapes?.label || ""} onChange={e => update("commonLandscapes", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, marginBottom: 24 }} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.commonLandscapes?.blocks || []).map((block: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={block.title || ""} onChange={e => updateItem("commonLandscapes", idx, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                  <button onClick={() => removeItem("commonLandscapes", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
                </div>
                <textarea value={(block.items || []).join("\\n")} onChange={e => updateItem("commonLandscapes", idx, "items", e.target.value.split("\\n"))} placeholder="Items (\n for breaks)" style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
              </div>
            ))}
            <button onClick={() => addItem("commonLandscapes", { title: "NEW", items: ["Item 1"] })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Landscape</button>
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
                <input value={item.text || ""} onChange={e => updateItem("howWeWork", idx, "text", e.target.value)} placeholder="Text" style={{ flex: 1, padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                <button onClick={() => removeItem("howWeWork", idx)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => addItem("howWeWork", { num: "00", text: "Text" })} style={{ padding: 12, background: "#E5E7EB", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add Step</button>
          </div>
        </div>
      )}
      
      {activeTab === "decisionLogs" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Decision Logs (Evidence)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input value={data.decisionLogs?.label || ""} onChange={e => update("decisionLogs", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Label" />
            <input value={data.decisionLogs?.description || ""} onChange={e => update("decisionLogs", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Description" />
            <input value={data.decisionLogs?.cta || ""} onChange={e => update("decisionLogs", "cta", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="CTA" />
            <input value={data.decisionLogs?.link || ""} onChange={e => update("decisionLogs", "link", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} placeholder="Link" />
          </div>
        </div>
      )}

      {activeTab === "specialists" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Workday Specialists</h2>
          <p style={{ color: "#6B7280", marginBottom: 24, fontSize: 15 }}>Manage the directory of Workday engineers and consultants.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.specialists.map((spec: any, idx: number) => (
              <div key={idx} style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                  <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Name</label><input type="text" value={spec.name || ""} onChange={(e) => updateSpecialist(idx, "name", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Specialty</label><input type="text" value={spec.specialty || ""} onChange={(e) => updateSpecialist(idx, "specialty", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Description</label><textarea value={spec.description || ""} onChange={(e) => updateSpecialist(idx, "description", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 60 }} /></div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}><label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Location</label><input type="text" value={spec.location || ""} onChange={(e) => updateSpecialist(idx, "location", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <button onClick={() => removeSpecialist(idx)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "10px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={addSpecialist} style={{ background: "#E5E7EB", color: "#374151", padding: "12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>+ Add Specialist</button>
          </div>
        </div>
      )}
    </div>
  );
}
