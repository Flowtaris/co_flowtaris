"use client";

import { useState, useEffect } from "react";

export default function JudgmentEditor({ site }: { site: string }) {
  const [judgmentTitle, setJudgmentTitle] = useState("");
  const [judgmentSubtitle, setJudgmentSubtitle] = useState("");
  const [judgmentDescription, setJudgmentDescription] = useState("");
  const [decisionLogs, setDecisionLogs] = useState<any[]>([]);
  const [newLog, setNewLog] = useState({ date: "", author: "", tags: "", title: "", excerpt: "", principle: "", href: "" });
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=judgment`);
        const { data, message } = await res.json();
        if (data && data.length > 0 && data[0].content) {
          setJudgmentTitle(data[0].content.title || "");
          setJudgmentSubtitle(data[0].content.subtitle || "");
          setJudgmentDescription(data[0].content.description || "");
          setDecisionLogs(data[0].content.logs || []);
        } else {
          if (message) console.warn(message);
          setJudgmentTitle("HOW WE THINK.");
          setJudgmentSubtitle("Written by the people making the decisions.");
          setJudgmentDescription("Decisions made under pressure.\\nWhat we chose. What we rejected.\\nWhat happened next.");
          setDecisionLogs([]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [site]);

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) { const timer = setTimeout(() => setSaveStatus(null), 4000); return () => clearTimeout(timer); } return undefined;
  }, [saveStatus]);

  async function saveJudgmentContent() {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: { id: "judgment", content: { title: judgmentTitle, subtitle: judgmentSubtitle, description: judgmentDescription, logs: decisionLogs }, updated_at: new Date().toISOString() }
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const { error } = await res.json();
      if (error) setSaveStatus({ type: "error", message: "Error saving: " + error });
      else setSaveStatus({ type: "success", message: `Judgment content saved to flowtaris.${site}!` });
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Network error while saving." });
    }
  }

  async function saveDecisionLogs(updatedLogs: any[]) {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: { id: "judgment", content: { title: judgmentTitle, subtitle: judgmentSubtitle, description: judgmentDescription, logs: updatedLogs }, updated_at: new Date().toISOString() }
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const { error } = await res.json();
      if (error) setSaveStatus({ type: "error", message: "Error saving logs: " + error });
      else {
        setDecisionLogs(updatedLogs);
        setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
      }
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Network error while saving." });
    }
  }

  function addDecisionLog() {
    if (!newLog.title || !newLog.excerpt) { alert("Please enter at least a title and an excerpt."); return; }
    const tagsArray = newLog.tags.split(",").map(t => t.trim()).filter(Boolean);
    let updated;
    if (editingLogId) {
      updated = decisionLogs.map(s => s.id === editingLogId ? { ...newLog, tags: tagsArray, id: editingLogId } : s);
      setEditingLogId(null);
    } else {
      updated = [...decisionLogs, { ...newLog, tags: tagsArray, id: Date.now().toString() }];
    }
    saveDecisionLogs(updated);
    setNewLog({ date: "", author: "", tags: "", title: "", excerpt: "", principle: "", href: "" });
  }

  function editDecisionLog(log: any) {
    setNewLog({
      date: log.date || "", author: log.author || "",
      tags: Array.isArray(log.tags) ? log.tags.join(", ") : (log.tags || ""),
      title: log.title || "", excerpt: log.excerpt || "", principle: log.principle || "", href: log.href || ""
    });
    setEditingLogId(log.id);
  }

  function deleteDecisionLog(id: string) {
    saveDecisionLogs(decisionLogs.filter(s => s.id !== id));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Judgment Logs</h1>
      
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

      {/* Hero Content */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Judgment Page Hero</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Title</label>
          <input type="text" value={judgmentTitle} onChange={(e) => setJudgmentTitle(e.target.value)} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Subtitle</label>
          <input type="text" value={judgmentSubtitle} onChange={(e) => setJudgmentSubtitle(e.target.value)} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Description (Use \n for new lines)</label>
          <textarea value={judgmentDescription} onChange={(e) => setJudgmentDescription(e.target.value)} style={{ width: "100%", height: 80, background: "#F9FAFB", border: "1px solid #D1D5DB", padding: 16, borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
        </div>
        <button onClick={saveJudgmentContent} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Save Hero Content</button>
      </div>

      {/* Add/Edit Log */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingLogId ? "Edit Decision Log" : "Add New Decision Log"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Title</label><input type="text" value={newLog.title} onChange={(e) => setNewLog({...newLog, title: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Author</label><input type="text" value={newLog.author} onChange={(e) => setNewLog({...newLog, author: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Date (e.g. 15 MAR 2026)</label><input type="text" value={newLog.date} onChange={(e) => setNewLog({...newLog, date: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Tags (comma separated)</label><input type="text" value={newLog.tags} onChange={(e) => setNewLog({...newLog, tags: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Excerpt (Use \n for new lines)</label><textarea value={newLog.excerpt} onChange={(e) => setNewLog({...newLog, excerpt: e.target.value})} style={{ width: "100%", height: 80, background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14, resize: "vertical" }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Principle</label><input type="text" value={newLog.principle} onChange={(e) => setNewLog({...newLog, principle: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Link (href)</label><input type="text" value={newLog.href} onChange={(e) => setNewLog({...newLog, href: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={addDecisionLog} style={{ background: "#10B981", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>{editingLogId ? "Update Decision Log" : "Add Decision Log"}</button>
          {editingLogId && (
            <button onClick={() => { setEditingLogId(null); setNewLog({ date: "", author: "", tags: "", title: "", excerpt: "", principle: "", href: "" }); }} style={{ background: "#F3F4F6", color: "#374151", padding: "10px 24px", border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Cancel</button>
          )}
        </div>
      </div>

      {/* Logs List */}
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Manage Existing Logs</h2>
        </div>
        {decisionLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>No decision logs have been added yet.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {decisionLogs.map((log, idx) => (
              <li key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: idx < decisionLogs.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                <div>
                  <div style={{ fontWeight: 500, color: "#111827", marginBottom: 4 }}>{log.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{log.author} &middot; {log.date} &middot; {(log.tags || []).join(", ")}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => editDecisionLog(log)} style={{ background: "#E0F2FE", color: "#0369A1", padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Edit</button>
                  <button onClick={() => deleteDecisionLog(log.id)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
