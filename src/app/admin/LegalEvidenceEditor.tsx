"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  slug: "legal",
  category: "LEGAL",
  title: "MASTER SERVICES AGREEMENT",
  version: "2.0",
  lastReviewed: "JANUARY 2026",
  status: "CURRENT",
  summary: "The master agreement governing all commercial relationships and terms of service.",
  owner: "Legal Counsel",
  reviewCycle: "Annual",
  classification: "Public",
  fileSize: "1.2 MB",
  pageCount: 24,
  fileFormat: "PDF",
  hasRealFile: false,
  accessLevel: "PUBLIC",
  tableOfContents: [
    { id: "01", title: "Definitions" },
    { id: "02", title: "Services" },
    { id: "03", title: "Fees & Payment" },
    { id: "04", title: "Confidentiality" },
    { id: "05", title: "Term & Termination" },
    { id: "06", title: "Liability" }
  ],
  relatedEvidence: [
    { slug: "data-processing-agreement", title: "DATA PROCESSING AGREEMENT", category: "Legal" },
    { slug: "subprocessor-list", title: "SUBPROCESSOR LIST", category: "Legal" }
  ],
  relatedDecisions: [],
  history: [
    { version: "2.0", date: "JAN 2026", change: "Comprehensive update" },
    { version: "1.0", date: "JAN 2024", change: "Initial version" }
  ],
  previousDocument: null,
  nextDocument: { slug: "data-processing-agreement", title: "DATA PROCESSING AGREEMENT" }
};

export default function LegalEvidenceEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=evidence_doc_legal`);
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
        body: JSON.stringify({ table: "page_content", record: { id: "evidence_doc_legal", content: data, updated_at: new Date().toISOString() } })
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

  const addArrayItem = (arrKey: string, template: any) => {
    setData((prev: any) => {
      const arr = [...(prev[arrKey] || [])];
      arr.push(template);
      return { ...prev, [arrKey]: arr };
    });
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Legal Evidence Document</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Meta */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Document Meta</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <input value={data.title || ""} onChange={e => update("title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.category || ""} onChange={e => update("category", e.target.value)} placeholder="Category" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.version || ""} onChange={e => update("version", e.target.value)} placeholder="Version" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.lastReviewed || ""} onChange={e => update("lastReviewed", e.target.value)} placeholder="Last Reviewed" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.status || ""} onChange={e => update("status", e.target.value)} placeholder="Status" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.owner || ""} onChange={e => update("owner", e.target.value)} placeholder="Owner" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.reviewCycle || ""} onChange={e => update("reviewCycle", e.target.value)} placeholder="Review Cycle" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.classification || ""} onChange={e => update("classification", e.target.value)} placeholder="Classification" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.fileSize || ""} onChange={e => update("fileSize", e.target.value)} placeholder="File Size" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.pageCount || ""} onChange={e => update("pageCount", parseInt(e.target.value) || 0)} placeholder="Page Count" type="number" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.fileFormat || ""} onChange={e => update("fileFormat", e.target.value)} placeholder="File Format" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
          <input value={data.accessLevel || ""} onChange={e => update("accessLevel", e.target.value)} placeholder="Access Level" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </div>
        <textarea value={data.summary || ""} onChange={e => update("summary", e.target.value)} placeholder="Summary" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginTop: 16, height: 80 }} />
      </div>

      {/* Table of Contents */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Table of Contents</h2>
        {(data.tableOfContents || []).map((toc: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <input value={toc.id || ""} onChange={e => updateArrayItem("tableOfContents", i, "id", e.target.value)} placeholder="ID (e.g. 01)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 80 }} />
            <input value={toc.title || ""} onChange={e => updateArrayItem("tableOfContents", i, "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("tableOfContents", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("tableOfContents", { id: "", title: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Item</button>
      </div>

      {/* History */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Document History</h2>
        {(data.history || []).map((h: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <input value={h.version || ""} onChange={e => updateArrayItem("history", i, "version", e.target.value)} placeholder="Version" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 80 }} />
            <input value={h.date || ""} onChange={e => updateArrayItem("history", i, "date", e.target.value)} placeholder="Date" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 120 }} />
            <input value={h.change || ""} onChange={e => updateArrayItem("history", i, "change", e.target.value)} placeholder="Change Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("history", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("history", { version: "", date: "", change: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add History</button>
      </div>

      {/* Related Evidence */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Related Evidence</h2>
        {(data.relatedEvidence || []).map((rel: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <input value={rel.slug || ""} onChange={e => updateArrayItem("relatedEvidence", i, "slug", e.target.value)} placeholder="Slug" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={rel.title || ""} onChange={e => updateArrayItem("relatedEvidence", i, "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <input value={rel.category || ""} onChange={e => updateArrayItem("relatedEvidence", i, "category", e.target.value)} placeholder="Category" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
            <button onClick={() => removeArrayItem("relatedEvidence", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("relatedEvidence", { slug: "", title: "", category: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Related Evidence</button>
      </div>

      {/* Related Decisions */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Related Decisions</h2>
        {(data.relatedDecisions || []).map((dec: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8, flexDirection: "column", padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <input value={dec.slug || ""} onChange={e => updateArrayItem("relatedDecisions", i, "slug", e.target.value)} placeholder="Slug" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 120 }} />
              <input value={dec.title || ""} onChange={e => updateArrayItem("relatedDecisions", i, "title", e.target.value)} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              <input value={dec.meta || ""} onChange={e => updateArrayItem("relatedDecisions", i, "meta", e.target.value)} placeholder="Meta Tags" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              <button onClick={() => removeArrayItem("relatedDecisions", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
            </div>
            <textarea value={dec.desc || ""} onChange={e => updateArrayItem("relatedDecisions", i, "desc", e.target.value)} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 60 }} />
          </div>
        ))}
        <button onClick={() => addArrayItem("relatedDecisions", { slug: "", title: "", desc: "", meta: "" })} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Related Decision</button>
      </div>

      {/* Navigation */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Bottom Navigation</h2>
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Previous Document</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input value={data.previousDocument?.slug || ""} onChange={e => update("previousDocument", data.previousDocument ? { ...data.previousDocument, slug: e.target.value } : { slug: e.target.value, title: "" })} placeholder="Slug (leave empty to hide)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 200 }} />
          <input value={data.previousDocument?.title || ""} onChange={e => update("previousDocument", data.previousDocument ? { ...data.previousDocument, title: e.target.value } : { slug: "", title: e.target.value })} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <button onClick={() => update("previousDocument", null)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>Clear</button>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Next Document</h3>
        <div style={{ display: "flex", gap: 16 }}>
          <input value={data.nextDocument?.slug || ""} onChange={e => update("nextDocument", data.nextDocument ? { ...data.nextDocument, slug: e.target.value } : { slug: e.target.value, title: "" })} placeholder="Slug (leave empty to hide)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 200 }} />
          <input value={data.nextDocument?.title || ""} onChange={e => update("nextDocument", data.nextDocument ? { ...data.nextDocument, title: e.target.value } : { slug: "", title: e.target.value })} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
          <button onClick={() => update("nextDocument", null)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>Clear</button>
        </div>
      </div>
    </div>
  );
}
