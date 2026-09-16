"use client";

import { useState, useEffect } from "react";

export default function JudgmentSlugsEditor({ site }: { site: string }) {
  const [decisionLogs, setDecisionLogs] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [slugData, setSlugData] = useState<any>(null);
  const [isSlugLoading, setIsSlugLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=judgment`);
        const { data } = await res.json();
        if (data && data.length > 0 && data[0].content?.logs) {
          setDecisionLogs(data[0].content.logs);
        } else {
          setDecisionLogs([]);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchLogs();
  }, [site]);

  async function loadSlugContent(slug: string) {
    if (!slug) { setSelectedSlug(""); setSlugData(null); return; }
    setSelectedSlug(slug);
    setIsSlugLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?table=page_content&id=judgment_slug_${slug}`);
      const { data } = await res.json();
      if (data && data.length > 0 && data[0].content) {
        setSlugData(data[0].content);
      } else {
        setSlugData({
          category: "DECISION LOG", tags: ["TAG1", "TAG2"], title: "TITLE", excerpt: "EXCERPT",
          author: "AUTHOR", authorFull: "Full Name", role: "Role", date: "DATE", readTime: "5 MIN READ",
          context: ["Paragraph 1", "Paragraph 2"],
          decision: { main: "Main decision", supporting: "Supporting details" },
          alternativesRejected: [{ number: "01", title: "Alt 1", reason: "Reason 1" }],
          outcome: { timeframe: "Timeframe:", metrics: [{ value: "100", label: "Metric" }], caveats: ["Caveat 1"] },
          principle: { statement: "PRINCIPLE", category: "Category" },
          authorNote: "Note", relatedDecisions: [], previousDecision: null, nextDecision: null
        });
      }
    } catch (e) {
      console.error(e);
    }
    setIsSlugLoading(false);
  }

  const updateSlugData = (key: string, value: any) => setSlugData((prev: any) => ({ ...prev, [key]: value }));
  const updateNestedSlugData = (parent: string, key: string, value: any) => setSlugData((prev: any) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
  const updateArrayField = (key: string, value: string) => setSlugData((prev: any) => ({ ...prev, [key]: value.split("\n") }));
  const updateAlternative = (index: number, key: string, value: string) => {
    setSlugData((prev: any) => {
      const newAlts = [...(prev.alternativesRejected || [])];
      if (!newAlts[index]) newAlts[index] = { number: "", title: "", reason: "" };
      newAlts[index] = { ...newAlts[index], [key]: value };
      return { ...prev, alternativesRejected: newAlts };
    });
  };
  const updateMetric = (index: number, key: string, value: string) => {
    setSlugData((prev: any) => {
      const newMetrics = [...(prev.outcome?.metrics || [])];
      if (!newMetrics[index]) newMetrics[index] = { value: "", label: "" };
      newMetrics[index] = { ...newMetrics[index], [key]: value };
      return { ...prev, outcome: { ...prev.outcome, metrics: newMetrics } };
    });
  };

  const removeAlternative = (index: number) => {
    setSlugData((prev: any) => {
      const newAlts = [...(prev.alternativesRejected || [])];
      newAlts.splice(index, 1);
      return { ...prev, alternativesRejected: newAlts };
    });
  };

  const removeMetric = (index: number) => {
    setSlugData((prev: any) => {
      const newMetrics = [...(prev.outcome?.metrics || [])];
      newMetrics.splice(index, 1);
      return { ...prev, outcome: { ...prev.outcome, metrics: newMetrics } };
    });
  };

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) { const timer = setTimeout(() => setSaveStatus(null), 4000); return () => clearTimeout(timer); } return undefined;
  }, [saveStatus]);

  async function saveSlugContent() {
    if (!selectedSlug || !slugData) return;
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: { id: `judgment_slug_${selectedSlug}`, content: slugData, updated_at: new Date().toISOString() }
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Slug content saved successfully to flowtaris.${site}!` });
    } catch (e: any) { 
      setSaveStatus({ type: "error", message: "Error saving: " + e.message }); 
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Judgment Slugs Content</h1>
      
      {/* Save Status Banner */}
      {saveStatus && (
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 14,
          fontWeight: 500,
          background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2",
          color: saveStatus.type === "success" ? "#065F46" : "#991B1B",
          border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}`,
        }}>
          {saveStatus.message}
        </div>
      )}

      <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 15 }}>Edit the detailed content for individual decision logs here.</p>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", marginBottom: 32 }}>
        {!selectedSlug ? (
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Select Log to Edit</label>
            <select value={selectedSlug} onChange={(e) => loadSlugContent(e.target.value)} style={{ width: "100%", maxWidth: 400, background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }}>
              <option value="">-- Select a Log --</option>
              {decisionLogs.map((log: any) => {
                const slug = log.href ? log.href.split('/').pop() : log.id;
                return <option key={slug} value={slug}>{log.title}</option>;
              })}
            </select>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>Editing: {slugData?.title || selectedSlug}</h2>
            </div>
            <button onClick={() => setSelectedSlug("")} style={{ background: "#F3F4F6", color: "#374151", padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>&larr; Back to Selection</button>
          </div>
        )}

        {selectedSlug && (
          <>
            {isSlugLoading ? (
              <div style={{ padding: 20, color: "#6B7280" }}>Loading...</div>
            ) : slugData && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 24 }}>
                {/* Basic Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Category</label><input type="text" value={slugData.category || ""} onChange={(e) => updateSlugData("category", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Tags (comma separated)</label><input type="text" value={(slugData.tags || []).join(", ")} onChange={(e) => updateSlugData("tags", e.target.value.split(",").map((s: string) => s.trim()))} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Title (Use \n for line breaks)</label><input type="text" value={slugData.title || ""} onChange={(e) => updateSlugData("title", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Excerpt</label><textarea value={slugData.excerpt || ""} onChange={(e) => updateSlugData("excerpt", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 80 }} /></div>
                </div>

                {/* Author Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ gridColumn: "1 / -1", fontSize: 16, margin: 0, fontWeight: 600 }}>Author Info</h3>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Author (Short)</label><input type="text" value={slugData.author || ""} onChange={(e) => updateSlugData("author", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Author (Full Name)</label><input type="text" value={slugData.authorFull || ""} onChange={(e) => updateSlugData("authorFull", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Role</label><input type="text" value={slugData.role || ""} onChange={(e) => updateSlugData("role", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Date</label><input type="text" value={slugData.date || ""} onChange={(e) => updateSlugData("date", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Read Time</label><input type="text" value={slugData.readTime || ""} onChange={(e) => updateSlugData("readTime", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                </div>

                {/* Context */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Context (one paragraph per line)</label>
                  <textarea value={(slugData.context || []).join("\n")} onChange={(e) => updateArrayField("context", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 120 }} />
                </div>

                {/* The Decision */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, margin: 0, fontWeight: 600 }}>The Decision</h3>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Main</label><input type="text" value={slugData.decision?.main || ""} onChange={(e) => updateNestedSlugData("decision", "main", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Supporting</label><textarea value={slugData.decision?.supporting || ""} onChange={(e) => updateNestedSlugData("decision", "supporting", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 80 }} /></div>
                </div>

                {/* Alternatives */}
                <div style={{ background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, margin: "0 0 16px 0", fontWeight: 600 }}>Alternatives Rejected</h3>
                  {(slugData.alternativesRejected || []).map((alt: any, idx: number) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input placeholder="No." value={alt.number || ""} onChange={(e) => updateAlternative(idx, "number", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #D1D5DB" }} />
                      <input placeholder="Title" value={alt.title || ""} onChange={(e) => updateAlternative(idx, "title", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #D1D5DB" }} />
                      <input placeholder="Reason" value={alt.reason || ""} onChange={(e) => updateAlternative(idx, "reason", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #D1D5DB" }} />
                      <button onClick={() => removeAlternative(idx)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }} title="Remove Alternative">✕</button>
                    </div>
                  ))}
                  <button onClick={() => setSlugData((prev: any) => ({ ...prev, alternativesRejected: [...(prev.alternativesRejected || []), { number: "", title: "", reason: "" }] }))} style={{ padding: "6px 12px", background: "#E5E7EB", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginTop: 8 }}>+ Add Alternative</button>
                </div>

                {/* Outcome */}
                <div style={{ background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, margin: "0 0 16px 0", fontWeight: 600 }}>Outcome</h3>
                  <div style={{ marginBottom: 12 }}><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Timeframe</label><input type="text" value={slugData.outcome?.timeframe || ""} onChange={(e) => updateNestedSlugData("outcome", "timeframe", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Metrics</label>
                    {(slugData.outcome?.metrics || []).map((metric: any, idx: number) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <input placeholder="Value" value={metric.value || ""} onChange={(e) => updateMetric(idx, "value", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #D1D5DB" }} />
                        <input placeholder="Label" value={metric.label || ""} onChange={(e) => updateMetric(idx, "label", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #D1D5DB" }} />
                        <button onClick={() => removeMetric(idx)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }} title="Remove Metric">✕</button>
                      </div>
                    ))}
                    <button onClick={() => setSlugData((prev: any) => ({ ...prev, outcome: { ...prev.outcome, metrics: [...(prev.outcome?.metrics || []), { value: "", label: "" }] } }))} style={{ padding: "6px 12px", background: "#E5E7EB", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginTop: 8 }}>+ Add Metric</button>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Caveats (one per line)</label>
                    <textarea value={(slugData.outcome?.caveats || []).join("\n")} onChange={(e) => updateNestedSlugData("outcome", "caveats", e.target.value.split("\n"))} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 80 }} />
                  </div>
                </div>

                {/* Principle & Author Note */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, margin: 0, fontWeight: 600 }}>Principle & Author Note</h3>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Principle Statement</label><textarea value={slugData.principle?.statement || ""} onChange={(e) => updateNestedSlugData("principle", "statement", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 80 }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Principle Category</label><input type="text" value={slugData.principle?.category || ""} onChange={(e) => updateNestedSlugData("principle", "category", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB" }} /></div>
                  <div><label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Author Note</label><textarea value={slugData.authorNote || ""} onChange={(e) => updateSlugData("authorNote", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #D1D5DB", height: 80 }} /></div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 16, marginTop: 24, borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>
              <button onClick={saveSlugContent} disabled={isSlugLoading} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Save Slug Content</button>
              <button onClick={() => setSelectedSlug("")} style={{ background: "#F3F4F6", color: "#374151", padding: "10px 24px", border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>&larr; Back to Selection</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
