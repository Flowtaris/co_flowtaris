"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const DEFAULT_DATA = {
  latestJudgment: {
    title: "LATEST JUDGMENT",
    viewAllText: "VIEW ALL \u2192",
    viewAllLink: "/judgment",
    date: "MAR 15, 2026",
    tags: "CEO \u00B7 STRATEGY \u00B7 PRICING",
    headline: "WHY WE MOVED FROM\\nT&M TO OUTCOME-BASED PRICING",
    description: "Clients wanted certainty. We wanted alignment. Here's the decision we made \u2014 and what happened next.",
    quote: '"Price for the outcome, not the hour."',
    ctaText: "READ DECISION \u2192",
    ctaLink: "/judgment/pricing"
  },
  featuredLogs: [
    { id: "1", date: "FEB 03, 2026", tags: "CTO \u00B7 TECH \u00B7 CRISIS", title: "THE NETSUITE API CRISIS", ctaText: "READ \u2192", ctaLink: "/judgment/netsuite" },
    { id: "2", date: "JAN 10, 2026", tags: "COO \u00B7 HIRING \u00B7 CULTURE", title: "WHY WE HIRED A PRINCIPAL\\nBEFORE WE NEEDED ONE", ctaText: "READ \u2192", ctaLink: "/judgment/hiring" }
  ],
  whatWeBelieve: {
    label: "WHAT WE BELIEVE",
    quote: '"Revenue that costs your culture\\nis expensive revenue."',
    attribution: "\u2014 Decision Log",
    ctaText: "EXPLORE ALL PRINCIPLES \u2192",
    ctaLink: "/principles"
  },
  trustStatement: {
    headline: "WE WRITE DOWN THE DECISIONS.",
    subheadline: "Not because transparency sounds good.\\nBecause decisions are where the work actually happens.",
    body: "Every Decision Log records the context,\\nthe choice, the alternatives rejected,\\nand the outcome."
  },
  finalCta: {
    headline: "HAVE A COMPLEX PROBLEM?",
    subheadline: "Start with how we think.",
    primaryText: "READ OUR JUDGMENT \u2192",
    primaryLink: "#judgment",
    secondaryText: "TALK TO FLOWTARIS \u2192",
    secondaryLink: "/contact"
  }
};

export default function HomeSectionsEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState("latestJudgment");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?id=home_sections`);
      const { data: records } = await res.json();
      if (records?.[0]?.content) {
        setData({ ...DEFAULT_DATA, ...records[0].content });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [site]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const update = (category: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const addLog = () => {
    setData((prev: any) => ({
      ...prev,
      featuredLogs: [...prev.featuredLogs, { id: `log_${Date.now()}`, date: "NEW DATE", tags: "TAG1 · TAG2", title: "NEW LOG", ctaText: "READ →", ctaLink: "#" }]
    }));
  };

  const removeLog = (index: number) => {
    setData((prev: any) => {
      const newLogs = [...prev.featuredLogs];
      newLogs.splice(index, 1);
      return { ...prev, featuredLogs: newLogs };
    });
  };

  const updateLog = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const newLogs = [...prev.featuredLogs];
      newLogs[index] = { ...newLogs[index], [key]: value };
      return { ...prev, featuredLogs: newLogs };
    });
  };

  async function handleSave() {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: { id: "home_sections", content: data }
        })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) {
      setSaveStatus({ type: "error", message: "Error saving: " + e.message });
    }
    setIsSaving(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>Homepage Content Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            background: "#10B981", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6,
            fontWeight: 500, fontSize: 14, cursor: isSaving ? "wait" : "pointer", opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saveStatus && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: saveStatus.type === "success" ? "#ECFDF5" : "#FEF2F2", color: saveStatus.type === "success" ? "#065F46" : "#991B1B", border: `1px solid ${saveStatus.type === "success" ? "#A7F3D0" : "#FECACA"}` }}>
          {saveStatus.message}
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, borderBottom: "1px solid #E5E7EB", paddingBottom: 16 }}>
        {["latestJudgment", "featuredLogs", "whatWeBelieve", "trustStatement", "finalCta"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: "8px 16px", background: activeTab === tab ? "#111827" : "#F3F4F6", color: activeTab === tab ? "#fff" : "#4B5563", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}
          >
            {tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* LATEST JUDGMENT */}
      {activeTab === "latestJudgment" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Latest Judgment Section</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Section Title</label>
              <input value={data.latestJudgment?.title || ""} onChange={e => update("latestJudgment", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>View All CTA Text</label>
                <input value={data.latestJudgment?.viewAllText || ""} onChange={e => update("latestJudgment", "viewAllText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>View All Link</label>
                <input value={data.latestJudgment?.viewAllLink || ""} onChange={e => update("latestJudgment", "viewAllLink", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Date</label>
              <input value={data.latestJudgment?.date || ""} onChange={e => update("latestJudgment", "date", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Tags</label>
              <input value={data.latestJudgment?.tags || ""} onChange={e => update("latestJudgment", "tags", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Headline</label>
              <textarea value={data.latestJudgment?.headline || ""} onChange={e => update("latestJudgment", "headline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Description</label>
              <textarea value={data.latestJudgment?.description || ""} onChange={e => update("latestJudgment", "description", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Quote / Principle</label>
              <input value={data.latestJudgment?.quote || ""} onChange={e => update("latestJudgment", "quote", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Read CTA Text</label>
              <input value={data.latestJudgment?.ctaText || ""} onChange={e => update("latestJudgment", "ctaText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Read CTA Link</label>
              <input value={data.latestJudgment?.ctaLink || ""} onChange={e => update("latestJudgment", "ctaLink", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
          </div>
        </div>
      )}

      {/* FEATURED LOGS */}
      {activeTab === "featuredLogs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(data.featuredLogs || []).map((log: any, index: number) => (
            <div key={log.id || index} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #E5E7EB", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ paddingTop: 8, color: "#9CA3AF" }}><GripVertical size={20} /></div>
              
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>Date</label>
                  <input value={log.date || ""} onChange={e => updateLog(index, "date", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>Tags</label>
                  <input value={log.tags || ""} onChange={e => updateLog(index, "tags", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>Title (\\n for line breaks)</label>
                  <textarea value={log.title || ""} onChange={e => updateLog(index, "title", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>CTA Text</label>
                  <input value={log.ctaText || ""} onChange={e => updateLog(index, "ctaText", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>CTA Link</label>
                  <input value={log.ctaLink || ""} onChange={e => updateLog(index, "ctaLink", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 }} />
                </div>
              </div>

              <button onClick={() => removeLog(index)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button onClick={addLog} style={{ background: "#F3F4F6", color: "#374151", border: "1px dashed #D1D5DB", padding: 24, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 500, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <Plus size={20} /> Add Featured Log
          </button>
        </div>
      )}

      {/* WHAT WE BELIEVE */}
      {activeTab === "whatWeBelieve" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>What We Believe Section</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Section Label</label>
              <input value={data.whatWeBelieve?.label || ""} onChange={e => update("whatWeBelieve", "label", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Large Quote</label>
              <textarea value={data.whatWeBelieve?.quote || ""} onChange={e => update("whatWeBelieve", "quote", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Attribution</label>
              <input value={data.whatWeBelieve?.attribution || ""} onChange={e => update("whatWeBelieve", "attribution", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>CTA Text</label>
                <input value={data.whatWeBelieve?.ctaText || ""} onChange={e => update("whatWeBelieve", "ctaText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>CTA Link</label>
                <input value={data.whatWeBelieve?.ctaLink || ""} onChange={e => update("whatWeBelieve", "ctaLink", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRUST STATEMENT */}
      {activeTab === "trustStatement" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Trust Statement (We write down decisions)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Headline</label>
              <input value={data.trustStatement?.headline || ""} onChange={e => update("trustStatement", "headline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Subheadline</label>
              <textarea value={data.trustStatement?.subheadline || ""} onChange={e => update("trustStatement", "subheadline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Body Text</label>
              <textarea value={data.trustStatement?.body || ""} onChange={e => update("trustStatement", "body", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
            </div>
          </div>
        </div>
      )}

      {/* FINAL CTA */}
      {activeTab === "finalCta" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Final Call To Action (Bottom of page)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Headline</label>
              <input value={data.finalCta?.headline || ""} onChange={e => update("finalCta", "headline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Subheadline</label>
              <input value={data.finalCta?.subheadline || ""} onChange={e => update("finalCta", "subheadline", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Primary Button Text</label>
                <input value={data.finalCta?.primaryText || ""} onChange={e => update("finalCta", "primaryText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Primary Button Link</label>
                <input value={data.finalCta?.primaryLink || ""} onChange={e => update("finalCta", "primaryLink", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Secondary Button Text</label>
                <input value={data.finalCta?.secondaryText || ""} onChange={e => update("finalCta", "secondaryText", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Secondary Button Link</label>
                <input value={data.finalCta?.secondaryLink || ""} onChange={e => update("finalCta", "secondaryLink", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
