"use client";

import { useState, useEffect } from "react";

const DEFAULTS = {
  footerLogo: "FLOWTARIS",
  footerCol1: [
    { label: "JUDGMENT", url: "/judgment" },
    { label: "EVIDENCE", url: "/evidence" },
    { label: "LEVERAGE", url: "/leverage" },
    { label: "PRINCIPLES", url: "/principles" },
  ],
  footerCol2: [
    { label: "CONTACT", url: "/contact" },
    { label: "LINKEDIN", url: "https://linkedin.com" },
    { label: "X", url: "https://x.com" },
  ],
  footerCopyright: "© 2026 FLOWTARIS TECHNOLOGIES PVT LTD"
};

const inputStyle = { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 14, width: "100%", background: "#F9FAFB" };
const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 as const, color: "#374151" };

export default function FooterEditor({ site }: { site: string }) {
  const [footerLogo, setFooterLogo] = useState(DEFAULTS.footerLogo);
  const [footerCol1, setFooterCol1] = useState(DEFAULTS.footerCol1);
  const [footerCol2, setFooterCol2] = useState(DEFAULTS.footerCol2);
  const [footerCopyright, setFooterCopyright] = useState(DEFAULTS.footerCopyright);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchFooter() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=footer`);
        const { data, message } = await res.json();
        if (data && data.length > 0 && data[0].content) {
          setFooterLogo(data[0].content.footerLogo || DEFAULTS.footerLogo);
          setFooterCol1(data[0].content.footerCol1 || DEFAULTS.footerCol1);
          setFooterCol2(data[0].content.footerCol2 || DEFAULTS.footerCol2);
          setFooterCopyright(data[0].content.footerCopyright || DEFAULTS.footerCopyright);
        } else {
          if (message) console.warn(message);
          setFooterLogo(DEFAULTS.footerLogo);
          setFooterCol1(DEFAULTS.footerCol1);
          setFooterCol2(DEFAULTS.footerCol2);
          setFooterCopyright(DEFAULTS.footerCopyright);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchFooter();
  }, [site]);

  async function handleSave() {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "page_content",
          record: {
            id: "footer",
            content: { footerLogo, footerCol1, footerCol2, footerCopyright },
            updated_at: new Date().toISOString(),
          }
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: e.message || "An error occurred" });
    }
    setSaving(false);
  }

  // Navigation link helpers
  const updateLink = (setter: any, list: any[], idx: number, field: string, val: string) => {
    const newLinks = [...list];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    setter(newLinks);
  };
  const removeLink = (setter: any, list: any[], idx: number) => {
    setter(list.filter((_, i) => i !== idx));
  };
  const addLink = (setter: any, list: any[]) => {
    setter([...list, { label: "NEW LINK", url: "/" }]);
  };

  if (loading) return <div style={{ padding: 40, color: "#6B7280" }}>Loading footer content...</div>;

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", margin: 0 }}>Global Footer</h1>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>
            Manage the footer links, logo, and copyright shown on all pages.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer", fontWeight: 500, fontSize: 14 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" }}>Footer Configuration</h2>
        
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Footer Logo Text</label>
          <input type="text" value={footerLogo} onChange={e => setFooterLogo(e.target.value)} style={inputStyle} placeholder="FLOWTARIS" />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Left Column Links</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {footerCol1.map((link, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                <input style={inputStyle} value={link.label} onChange={e => updateLink(setFooterCol1, footerCol1, idx, "label", e.target.value)} placeholder="Button Text" />
                <input style={inputStyle} value={link.url} onChange={e => updateLink(setFooterCol1, footerCol1, idx, "url", e.target.value)} placeholder="URL" />
                <button onClick={() => removeLink(setFooterCol1, footerCol1, idx)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => addLink(setFooterCol1, footerCol1)} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, alignSelf: "flex-start", marginTop: 8 }}>+ Add Link</button>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Right Column Links</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {footerCol2.map((link, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                <input style={inputStyle} value={link.label} onChange={e => updateLink(setFooterCol2, footerCol2, idx, "label", e.target.value)} placeholder="Button Text" />
                <input style={inputStyle} value={link.url} onChange={e => updateLink(setFooterCol2, footerCol2, idx, "url", e.target.value)} placeholder="URL" />
                <button onClick={() => removeLink(setFooterCol2, footerCol2, idx)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => addLink(setFooterCol2, footerCol2)} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, alignSelf: "flex-start", marginTop: 8 }}>+ Add Link</button>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Copyright Text</label>
          <input type="text" value={footerCopyright} onChange={e => setFooterCopyright(e.target.value)} style={inputStyle} />
        </div>
      </div>
    </div>
  );
}
