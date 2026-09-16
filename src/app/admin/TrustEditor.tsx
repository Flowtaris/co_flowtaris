"use client";

import { useState, useEffect } from "react";

export default function TrustEditor({ site }: { site: string }) {
  const [trustTitle, setTrustTitle] = useState("");
  const [trustSystems, setTrustSystems] = useState<any[]>([]);
  const [newSystem, setNewSystem] = useState({ heading: "", description: "", items: "", ctaText: "", ctaLink: "" });
  const [editingSystemId, setEditingSystemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=systems_of_trust`);
        const { data, message } = await res.json();
        if (data && data.length > 0 && data[0].content) {
          setTrustTitle(data[0].content.title || "");
          setTrustSystems(data[0].content.systems || []);
        } else {
          if (message) console.warn(message);
          setTrustTitle("THREE SYSTEMS OF TRUST");
          setTrustSystems([
            { id: "1", heading: "JUDGMENT", description: "How we think.", items: ["Decision logs", "Principles"], ctaText: "EXPLORE →", ctaLink: "#judgment" },
            { id: "2", heading: "EVIDENCE", description: "How we operate.", items: ["Governance", "Security"], ctaText: "EXPLORE →", ctaLink: "#evidence" },
            { id: "3", heading: "LEVERAGE", description: "How we scale.", items: ["Partnerships", "Alliances"], ctaText: "EXPLORE →", ctaLink: "#leverage" }
          ]);
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

  async function saveTrustContent() {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: { id: "systems_of_trust", content: { title: trustTitle, systems: trustSystems }, updated_at: new Date().toISOString() }
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const { error } = await res.json();
      if (error) setSaveStatus({ type: "error", message: "Error saving: " + error });
      else setSaveStatus({ type: "success", message: `Systems of Trust saved to flowtaris.${site}!` });
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Network error while saving." });
    }
  }

  async function saveTrustSystems(updatedSystems: any[]) {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: { id: "systems_of_trust", content: { title: trustTitle, systems: updatedSystems }, updated_at: new Date().toISOString() }
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const { error } = await res.json();
      if (error) setSaveStatus({ type: "error", message: "Error saving: " + error });
      else {
        setTrustSystems(updatedSystems);
        setSaveStatus({ type: "success", message: `System changes saved to flowtaris.${site}!` });
      }
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Network error while saving." });
    }
  }

  function addTrustSystem() {
    if (!newSystem.heading || !newSystem.description) { alert("Please enter at least a heading and description."); return; }
    const itemsArray = newSystem.items.split(",").map(t => t.trim()).filter(Boolean);
    let updated;
    if (editingSystemId) {
      updated = trustSystems.map(s => s.id === editingSystemId ? { ...newSystem, items: itemsArray, id: editingSystemId } : s);
      setEditingSystemId(null);
    } else {
      updated = [...trustSystems, { ...newSystem, items: itemsArray, id: Date.now().toString() }];
    }
    saveTrustSystems(updated);
    setNewSystem({ heading: "", description: "", items: "", ctaText: "", ctaLink: "" });
  }

  function editTrustSystem(system: any) {
    setNewSystem({
      heading: system.heading || "", description: system.description || "",
      items: Array.isArray(system.items) ? system.items.join(", ") : (system.items || ""),
      ctaText: system.ctaText || "", ctaLink: system.ctaLink || ""
    });
    setEditingSystemId(system.id);
  }

  function deleteTrustSystem(id: string) {
    saveTrustSystems(trustSystems.filter(s => s.id !== id));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Systems of Trust</h1>
      
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

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Section Title</h2>
        <div style={{ marginBottom: 16 }}>
          <input type="text" value={trustTitle} onChange={(e) => setTrustTitle(e.target.value)} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
        </div>
        <button onClick={saveTrustContent} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Save Section Title</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingSystemId ? "Edit System" : "Add New System"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Heading</label>
            <input type="text" value={newSystem.heading} onChange={(e) => setNewSystem({...newSystem, heading: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
            <input type="text" value={newSystem.description} onChange={(e) => setNewSystem({...newSystem, description: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Items (comma separated)</label>
            <input type="text" value={newSystem.items} onChange={(e) => setNewSystem({...newSystem, items: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} placeholder="e.g. Decision logs, Principles" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>CTA Text</label>
            <input type="text" value={newSystem.ctaText} onChange={(e) => setNewSystem({...newSystem, ctaText: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} placeholder="e.g. EXPLORE →" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>CTA Link</label>
            <input type="text" value={newSystem.ctaLink} onChange={(e) => setNewSystem({...newSystem, ctaLink: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={addTrustSystem} style={{ background: "#10B981", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>{editingSystemId ? "Update System" : "Add System"}</button>
          {editingSystemId && (
            <button onClick={() => { setEditingSystemId(null); setNewSystem({ heading: "", description: "", items: "", ctaText: "", ctaLink: "" }); }} style={{ background: "#F3F4F6", color: "#374151", padding: "10px 24px", border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Manage Existing Systems</h2>
        </div>
        {trustSystems.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>No systems have been added yet.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {trustSystems.map((system, idx) => (
              <li key={system.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: idx < trustSystems.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                <div>
                  <div style={{ fontWeight: 500, color: "#111827", marginBottom: 4 }}>{system.heading}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{system.description} &middot; {(system.items || []).join(", ")}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => editTrustSystem(system)} style={{ background: "#E0F2FE", color: "#0369A1", padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Edit</button>
                  <button onClick={() => deleteTrustSystem(system.id)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
