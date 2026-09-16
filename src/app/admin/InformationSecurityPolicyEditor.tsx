"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  slug: "information-security-policy",
  category: "SECURITY",
  title: "INFORMATION SECURITY POLICY",
  version: "1.4",
  lastReviewed: "MARCH 2026",
  status: "CURRENT",
  summary: "The definitive policy governing how information is handled, secured, and classified across all Flowtaris enterprise systems and operations.",
  owner: "CTO / Security",
  reviewCycle: "Quarterly",
  classification: "Public",
  fileSize: "2.4 MB",
  pageCount: 18,
  fileFormat: "PDF",
  hasRealFile: false,
  accessLevel: "PUBLIC",
  tableOfContents: [
    { id: "01", title: "Purpose" },
    { id: "02", title: "Scope" },
    { id: "03", title: "Responsibilities" },
    { id: "04", title: "Access Control" },
    { id: "05", title: "Data Protection" },
    { id: "06", title: "Incident Response" },
    { id: "07", title: "Business Continuity" },
    { id: "08", title: "Review" }
  ],
  relatedEvidence: [
    { slug: "incident-response-plan", title: "INCIDENT RESPONSE PLAN", category: "Security" },
    { slug: "business-continuity-plan", title: "BUSINESS CONTINUITY PLAN", category: "Operations" },
    { slug: "access-control-policy", title: "ACCESS CONTROL POLICY", category: "Security" }
  ],
  relatedDecisions: [
    { slug: "netsuite", title: "THE NETSUITE CRISIS", desc: "A decision about architecture, maintenance and long-term operational risk.", meta: "CTO \u00B7 TECH \u00B7 STRATEGY" }
  ],
  history: [
    { version: "1.4", date: "MAR 2026", change: "Annual review" },
    { version: "1.3", date: "SEP 2025", change: "Policy update" },
    { version: "1.2", date: "MAR 2025", change: "Control revision" },
    { version: "1.1", date: "SEP 2024", change: "Minor update" }
  ],
  previousDocument: { slug: "incident-response-plan", title: "INCIDENT RESPONSE PLAN" },
  nextDocument: { slug: "business-continuity-plan", title: "BUSINESS CONTINUITY PLAN" }
};

export default function InformationSecurityPolicyEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=evidence_doc_information-security-policy`);
        const { data: resData } = await res.json();
        
        if (resData && resData.length > 0 && resData[0].content) {
          setData({ ...DEFAULT_DATA, ...resData[0].content });
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
        body: JSON.stringify({ table: "page_content", record: { id: "evidence_doc_information-security-policy", content: data, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error: " + e.message });
    }
  }

  const update = (key: string, value: any) => setData((p: any) => ({ ...p, [key]: value }));

  // Array updaters
  const updateArrayItem = (arrKey: string, index: number, field: string, value: string) => {
    setData((prev: any) => {
      const arr = [...(prev[arrKey] || [])];
      if (!arr[index]) arr[index] = {};
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrKey]: arr };
    });
  };

  const removeArrayItem = (arrKey: string, index: number) => {
    setData((prev: any) => {
      const arr = [...(prev[arrKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [arrKey]: arr };
    });
  };

  const addArrayItem = (arrKey: string, defaultObj: any) => {
    setData((prev: any) => ({ ...prev, [arrKey]: [...(prev[arrKey] || []), defaultObj] }));
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, paddingBottom: 64 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Information Security Policy Editor</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Header Info */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Document Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Title</label><input value={data.title} onChange={e => update("title", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Category</label><input value={data.category} onChange={e => update("category", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Version</label><input value={data.version} onChange={e => update("version", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Status</label><input value={data.status} onChange={e => update("status", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Last Reviewed</label><input value={data.lastReviewed} onChange={e => update("lastReviewed", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Owner</label><input value={data.owner} onChange={e => update("owner", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Review Cycle</label><input value={data.reviewCycle} onChange={e => update("reviewCycle", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Classification</label><input value={data.classification} onChange={e => update("classification", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>File Size</label><input value={data.fileSize} onChange={e => update("fileSize", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Page Count</label><input value={data.pageCount} type="number" onChange={e => update("pageCount", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>File Format</label><input value={data.fileFormat} onChange={e => update("fileFormat", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} /></div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Access Level</label>
            <select value={data.accessLevel} onChange={e => update("accessLevel", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }}>
              <option value="PUBLIC">PUBLIC</option>
              <option value="RESTRICTED">RESTRICTED</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Summary</h2>
        <textarea value={data.summary} onChange={e => update("summary", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 100 }} />
      </div>

      {/* Table of Contents */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Table of Contents</h2>
        {(data.tableOfContents || []).map((item: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 12, marginBottom: 12 }}>
            <input placeholder="ID (01)" value={item.id} onChange={(e) => updateArrayItem("tableOfContents", i, "id", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <input placeholder="Title" value={item.title} onChange={(e) => updateArrayItem("tableOfContents", i, "title", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <button onClick={() => removeArrayItem("tableOfContents", i)} style={{ padding: 8, background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("tableOfContents", { id: "", title: "" })} style={{ marginTop: 8, background: "#F3F4F6", color: "#374151", padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add Chapter</button>
      </div>

      {/* History */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>History Logs</h2>
        {(data.history || []).map((item: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 12, marginBottom: 12 }}>
            <input placeholder="Version" value={item.version} onChange={(e) => updateArrayItem("history", i, "version", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <input placeholder="Date" value={item.date} onChange={(e) => updateArrayItem("history", i, "date", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <input placeholder="Change Description" value={item.change} onChange={(e) => updateArrayItem("history", i, "change", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <button onClick={() => removeArrayItem("history", i)} style={{ padding: 8, background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("history", { version: "", date: "", change: "" })} style={{ marginTop: 8, background: "#F3F4F6", color: "#374151", padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add History</button>
      </div>

      {/* Related Evidence */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Related Evidence</h2>
        {(data.relatedEvidence || []).map((item: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginBottom: 12 }}>
            <input placeholder="Slug" value={item.slug} onChange={(e) => updateArrayItem("relatedEvidence", i, "slug", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <input placeholder="Title" value={item.title} onChange={(e) => updateArrayItem("relatedEvidence", i, "title", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <input placeholder="Category" value={item.category} onChange={(e) => updateArrayItem("relatedEvidence", i, "category", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
            <button onClick={() => removeArrayItem("relatedEvidence", i)} style={{ padding: 8, background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("relatedEvidence", { slug: "", title: "", category: "" })} style={{ marginTop: 8, background: "#F3F4F6", color: "#374151", padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add Related Evidence</button>
      </div>

      {/* Related Decisions */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Related Decisions</h2>
        {(data.relatedDecisions || []).map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12, padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12 }}>
              <input placeholder="Slug" value={item.slug} onChange={(e) => updateArrayItem("relatedDecisions", i, "slug", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
              <input placeholder="Title" value={item.title} onChange={(e) => updateArrayItem("relatedDecisions", i, "title", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
              <input placeholder="Meta (e.g. CTO · TECH)" value={item.meta} onChange={(e) => updateArrayItem("relatedDecisions", i, "meta", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4 }} />
              <button onClick={() => removeArrayItem("relatedDecisions", i)} style={{ padding: 8, background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
            </div>
            <textarea placeholder="Description" value={item.desc} onChange={(e) => updateArrayItem("relatedDecisions", i, "desc", e.target.value)} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4, width: "100%", height: 60 }} />
          </div>
        ))}
        <button onClick={() => addArrayItem("relatedDecisions", { slug: "", title: "", desc: "", meta: "" })} style={{ marginTop: 8, background: "#F3F4F6", color: "#374151", padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add Related Decision</button>
      </div>

      {/* Prev / Next Nav */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Bottom Navigation</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#4B5563' }}>Previous Document</h3>
            <input placeholder="Slug" value={data.previousDocument?.slug || ""} onChange={e => update("previousDocument", { ...data.previousDocument, slug: e.target.value })} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4, width: "100%", marginBottom: 8 }} />
            <input placeholder="Title" value={data.previousDocument?.title || ""} onChange={e => update("previousDocument", { ...data.previousDocument, title: e.target.value })} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4, width: "100%" }} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#4B5563' }}>Next Document</h3>
            <input placeholder="Slug" value={data.nextDocument?.slug || ""} onChange={e => update("nextDocument", { ...data.nextDocument, slug: e.target.value })} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4, width: "100%", marginBottom: 8 }} />
            <input placeholder="Title" value={data.nextDocument?.title || ""} onChange={e => update("nextDocument", { ...data.nextDocument, title: e.target.value })} style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 4, width: "100%" }} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
