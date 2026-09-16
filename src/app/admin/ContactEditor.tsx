"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "CONTACT",
    title: "THE RIGHT DOOR.\nTHE RIGHT PERSON.\nFAST RESPONSE.",
    subtitle: "Tell us what you're trying to accomplish.\nWe'll route it to the person who owns it."
  },
  routingPrinciple: "DON'T SEND A MESSAGE INTO A SHARED INBOX.\nCHOOSE THE DOOR THAT MATCHES WHAT YOU NEED.",
  routingBlocks: [
    { num: "01", title: "NEW BUSINESS & PARTNERSHIPS", desc: "Sales conversations, partnerships,\nstrategic inquiries.", email: "partners@flowtaris.com", emailLink: "mailto:partners@flowtaris.com", footerText: "24-hour SLA", cta: "BOOK 30-MIN →", ctaLink: "/contact" },
    { num: "02", title: "SECURITY & COMPLIANCE", desc: "Questionnaires, audits, incident\nreporting and certifications.", email: "security@flowtaris.com", emailLink: "mailto:security@flowtaris.com", footerText: "4-hour SLA · business days", cta: "UPLOAD QUESTIONNAIRE →", ctaLink: "/evidence/questionnaire" },
    { num: "03", title: "ALLIANCE & CHANNEL", desc: "NetSuite / Coupa / Workday AEs,\ndeal registration and MDF.", email: "alliances@flowtaris.com", emailLink: "mailto:alliances@flowtaris.com", footerText: "", cta: "REGISTER DEAL →", ctaLink: "/leverage/register" },
    { num: "04", title: "MEDIA & ANALYST RELATIONS", desc: "Press, speaking, analyst briefings\nand data requests.", email: "media@flowtaris.com", emailLink: "mailto:media@flowtaris.com", footerText: "", cta: "MEDIA INQUIRY →", ctaLink: "mailto:media@flowtaris.com" },
    { num: "05", title: "TALENT & REFERRALS", desc: "We hire from our network.\nLooking to work with Flowtaris?\nStart by understanding how we think.", email: "talent@flowtaris.com", emailLink: "mailto:talent@flowtaris.com", footerText: "REFERRALS: $10K referral bonus", cta: "READ OUR PRINCIPLES →", ctaLink: "/principles" },
    { num: "06", title: "CORPORATE & INVESTOR", desc: "Strategic conversations, M&A\nand investment inquiries.", email: "strategic@flowtaris.com", emailLink: "mailto:strategic@flowtaris.com", footerText: "", cta: "VIEW EVIDENCE →", ctaLink: "/evidence" }
  ],
  corporate: {
    title: "FLOWTARIS TECHNOLOGIES PVT LTD",
    address: "[ADDRESS]\n[CITY, STATE, PIN]\nINDIA",
    socialLabel: "VERIFIED CHANNELS",
    socials: [
      { name: "LinkedIn", link: "https://linkedin.com" },
      { name: "X / @flowtaris", link: "https://x.com" }
    ]
  },
  microEditorial: {
    heading: "EVERY QUESTION HAS AN OWNER.",
    lines: [
      { text: "Every document has a source.", highlight: false },
      { text: "Every decision has a record.", highlight: false },
      { text: "Every inquiry has a route.", highlight: true }
    ]
  }
};

export default function ContactEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/${site}?table=page_content&id=contact`);
        const { data: resData } = await res.json();
        if (resData && resData.length > 0 && resData[0].content) {
          const content = resData[0].content;
          setData({
            hero: { ...DEFAULT_DATA.hero, ...(content?.hero || {}) },
            routingPrinciple: content?.routingPrinciple || DEFAULT_DATA.routingPrinciple,
            routingBlocks: content?.routingBlocks || DEFAULT_DATA.routingBlocks,
            corporate: { ...DEFAULT_DATA.corporate, ...(content?.corporate || {}) },
            microEditorial: { ...DEFAULT_DATA.microEditorial, ...(content?.microEditorial || {}) }
          });
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
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  async function save() {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "page_content", record: { id: "contact", content: data, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error: " + e.message });
    }
  }

  const update = (section: string, key: string, value: any) => {
    setData((p: any) => ({ ...p, [section]: { ...(p[section] || {}), [key]: value } }));
  };
  const updateRoot = (key: string, value: any) => {
    setData((p: any) => ({ ...p, [key]: value }));
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Contact Page Content</h1>
      
      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      <button onClick={save} style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>Save All Changes</button>

      {/* Hero */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
        <input value={data.hero?.eyebrow || ""} onChange={e => update("hero", "eyebrow", e.target.value)} placeholder="Eyebrow" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.hero?.title || ""} onChange={e => update("hero", "title", e.target.value)} placeholder="Title" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 80 }} />
        <textarea value={data.hero?.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} placeholder="Subtitle" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8, height: 60 }} />
      </div>

      {/* Routing Principle */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Routing Principle</h2>
        <textarea value={data.routingPrinciple || ""} onChange={e => updateRoot("routingPrinciple", e.target.value)} placeholder="Principle Text" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 80 }} />
      </div>

      {/* Routing Blocks */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Contact Routing Blocks</h2>
        {(data.routingBlocks || []).map((block: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24, border: "1px solid #E5E7EB", padding: 24, borderRadius: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input value={block.num || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].num = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="No." style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, width: 60 }} />
              <input value={block.title || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].title = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="Title" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, flex: 1 }} />
              <button onClick={() => { const arr = [...data.routingBlocks]; arr.splice(i, 1); updateRoot("routingBlocks", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕ Delete</button>
            </div>
            <textarea value={block.desc || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].desc = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="Description" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, height: 60 }} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input value={block.email || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].email = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="Email Label (e.g. hello@domain.com)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={block.emailLink || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].emailLink = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="Email Link (e.g. mailto:hello@...)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <input value={block.footerText || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].footerText = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="Footer Text (e.g. SLA)" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={block.cta || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].cta = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="CTA Label" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              <input value={block.ctaLink || ""} onChange={e => { const arr = [...data.routingBlocks]; arr[i].ctaLink = e.target.value; updateRoot("routingBlocks", arr); }} placeholder="CTA Link" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.routingBlocks || []), { num: "", title: "", desc: "", email: "", emailLink: "", footerText: "", cta: "", ctaLink: "" }]; updateRoot("routingBlocks", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>+ Add Routing Block</button>
      </div>

      {/* Corporate Information */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Corporate Information</h2>
        <input value={data.corporate?.title || ""} onChange={e => update("corporate", "title", e.target.value)} placeholder="Company Name" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 8 }} />
        <textarea value={data.corporate?.address || ""} onChange={e => update("corporate", "address", e.target.value)} placeholder="Address" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", height: 80, marginBottom: 16 }} />
        
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Social Channels</h3>
        <input value={data.corporate?.socialLabel || ""} onChange={e => update("corporate", "socialLabel", e.target.value)} placeholder="Social Label (e.g. VERIFIED CHANNELS)" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.corporate?.socials || []).map((social: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 12, marginBottom: 8 }}>
            <input value={social.name || ""} onChange={e => { const arr = [...data.corporate.socials]; arr[i].name = e.target.value; update("corporate", "socials", arr); }} placeholder="Name" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <input value={social.link || ""} onChange={e => { const arr = [...data.corporate.socials]; arr[i].link = e.target.value; update("corporate", "socials", arr); }} placeholder="Link" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <button onClick={() => { const arr = [...data.corporate.socials]; arr.splice(i, 1); update("corporate", "socials", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.corporate?.socials || []), { name: "", link: "" }]; update("corporate", "socials", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Social Channel</button>
      </div>

      {/* Micro Editorial */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Micro Editorial (Footer Area)</h2>
        <input value={data.microEditorial?.heading || ""} onChange={e => update("microEditorial", "heading", e.target.value)} placeholder="Heading" style={{ padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, width: "100%", marginBottom: 16 }} />
        
        {(data.microEditorial?.lines || []).map((line: any, i: number) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, marginBottom: 8, alignItems: "center" }}>
            <input value={line.text || ""} onChange={e => { const arr = [...data.microEditorial.lines]; arr[i].text = e.target.value; update("microEditorial", "lines", arr); }} placeholder="Line Text" style={{ padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={line.highlight} onChange={e => { const arr = [...data.microEditorial.lines]; arr[i].highlight = e.target.checked; update("microEditorial", "lines", arr); }} />
              Highlight Color?
            </label>
            <button onClick={() => { const arr = [...data.microEditorial.lines]; arr.splice(i, 1); update("microEditorial", "lines", arr); }} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => { const arr = [...(data.microEditorial?.lines || []), { text: "", highlight: false }]; update("microEditorial", "lines", arr); }} style={{ background: "#E5E7EB", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 8 }}>+ Add Line</button>
      </div>
    </div>
  );
}
