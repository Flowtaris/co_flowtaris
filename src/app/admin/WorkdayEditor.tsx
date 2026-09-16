"use client";

import { useState, useEffect } from "react";

export default function WorkdayEditor({ site }: { site: string }) {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [newSpecialist, setNewSpecialist] = useState({ name: "", role: "", specialty: "", certs: "", link: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=workday_specialists`);
        const { data } = await res.json();
        if (data && data.length > 0 && data[0].content?.specialists) {
          setSpecialists(data[0].content.specialists);
        } else {
          setSpecialists([]);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchData();
  }, [site]);

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  async function saveSpecialists(updated: any[]) {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "page_content", record: { id: "workday_specialists", content: { specialists: updated }, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSpecialists(updated);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) { setSaveStatus({ type: "error", message: "Error: " + e.message }); }
  }

  function addSpecialist() {
    setSaveStatus(null);
    if (!newSpecialist.name || !newSpecialist.role || !newSpecialist.specialty) { setSaveStatus({ type: "error", message: "Please enter at least name, role, and specialty." }); return; }
    saveSpecialists([...specialists, { ...newSpecialist, id: Date.now().toString() }]);
    setNewSpecialist({ name: "", role: "", specialty: "", certs: "", link: "" });
  }

  function deleteSpecialist(id: string) {
    setSaveStatus(null);
    saveSpecialists(specialists.filter(s => s.id !== id));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Workday Specialists</h1>

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
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Add New Specialist</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Name</label><input type="text" value={newSpecialist.name} onChange={(e) => setNewSpecialist({...newSpecialist, name: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Role</label><input type="text" value={newSpecialist.role} onChange={(e) => setNewSpecialist({...newSpecialist, role: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Specialty (e.g. HCM, FINANCE)</label><input type="text" value={newSpecialist.specialty} onChange={(e) => setNewSpecialist({...newSpecialist, specialty: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Certifications</label><input type="text" value={newSpecialist.certs} onChange={(e) => setNewSpecialist({...newSpecialist, certs: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
          <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Profile Link (slug)</label><input type="text" value={newSpecialist.link} onChange={(e) => setNewSpecialist({...newSpecialist, link: e.target.value})} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} /></div>
        </div>
        <button onClick={addSpecialist} style={{ background: "#10B981", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Add Specialist</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Manage Existing Specialists</h2>
        </div>
        {specialists.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>No specialists have been added yet.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {specialists.map((s, idx) => (
              <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: idx < specialists.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                <div>
                  <div style={{ fontWeight: 500, color: "#111827", marginBottom: 4 }}>{s.name} ({s.specialty})</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{s.role} &middot; {s.certs}</div>
                </div>
                <button onClick={() => deleteSpecialist(s.id)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
