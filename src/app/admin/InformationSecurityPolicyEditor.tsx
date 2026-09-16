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
  ]
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

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
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
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Title</label>
            <input value={data.title} onChange={e => update("title", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Category</label>
            <input value={data.category} onChange={e => update("category", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Version</label>
            <input value={data.version} onChange={e => update("version", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Status</label>
            <input value={data.status} onChange={e => update("status", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Last Reviewed</label>
            <input value={data.lastReviewed} onChange={e => update("lastReviewed", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Owner</label>
            <input value={data.owner} onChange={e => update("owner", e.target.value)} style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%" }} />
          </div>
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
      
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>This is a subset of fields for demonstration</h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>Since this document has many lists (history, tableOfContents, relatedEvidence), they are stored in JSON. The content is editable directly in Supabase for advanced structure.</p>
      </div>

    </div>
  );
}
