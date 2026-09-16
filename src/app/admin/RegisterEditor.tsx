"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "DEAL REGISTRATION",
    title: "REGISTER THE\\nOPPORTUNITY.",
    subtitle: "Give us enough context to route the opportunity\\nto the right Flowtaris team."
  },
  sidebar: {
    title: "BEFORE YOU START",
    desc: "Make sure you have all the necessary information about the client, the opportunity, and the competitive landscape. Incomplete registrations may be delayed.",
    contactLabel: "Need assistance?",
    contactEmail: "partners@flowtaris.com"
  },
  success: {
    title: "OPPORTUNITY REGISTERED.",
    desc: "We've received the opportunity details.",
    desc2: "We'll route the opportunity to the appropriate\\nFlowtaris team and follow up using the information\\nprovided.",
    cta: "\u2190 BACK TO LEVERAGE"
  },
  consent: {
    text: "I confirm that I am authorized to submit\\nthis opportunity on behalf of my organization.",
    cta: "REGISTER OPPORTUNITY \u2192",
    ctaLoading: "REGISTERING...",
    disclaimer: "Your submission is used to evaluate and route\\nthe opportunity."
  },
  sections: [
    {
      id: "s1",
      title: "01 \u2014 YOUR INFORMATION",
      desc: "",
      fields: [
        { id: "name", label: "NAME *", type: "text", required: true },
        { id: "email", label: "WORK EMAIL *", type: "email", required: true },
        { id: "company", label: "COMPANY *", type: "text", required: true },
        { id: "partner-type", label: "PARTNER TYPE *", type: "select", required: true, options: ["Technology Partner", "Consulting Partner", "Referral Partner", "Platform Partner", "Other"] }
      ]
    },
    {
      id: "s2",
      title: "02 \u2014 OPPORTUNITY",
      desc: "",
      fields: [
        { id: "client-company", label: "CLIENT / COMPANY *", type: "text", required: true },
        { id: "opportunity-name", label: "OPPORTUNITY NAME *", type: "text", required: true },
        { id: "platform", label: "PLATFORM *", type: "text", required: true },
        { id: "opportunity-type", label: "OPPORTUNITY TYPE *", type: "text", required: true },
        { id: "timeline", label: "EXPECTED TIMELINE *", type: "text", required: true }
      ]
    },
    {
      id: "s3",
      title: "03 \u2014 WHAT IS THE OPPORTUNITY?",
      desc: "Tell us what the client is trying to accomplish.",
      fields: [
        { id: "opportunity-summary", label: "Summary (What problem? What platform? Where does Flowtaris fit?) *", type: "textarea", required: true }
      ]
    },
    {
      id: "s4",
      title: "04 \u2014 COMMERCIAL CONTEXT",
      desc: "",
      fields: [
        { id: "opp-size", label: "ESTIMATED OPPORTUNITY SIZE (OPTIONAL)", type: "select", required: false, options: ["Under $50k", "$50k - $150k", "$150k - $500k", "$500k+"] },
        { id: "decision-stage", label: "DECISION STAGE *", type: "select", required: true, options: ["Discovery", "Evaluation", "Proposal/Contracting"] },
        { id: "competitive-situation", label: "COMPETITIVE SITUATION *", type: "select", required: true, options: ["Sole Source", "Competitive Process", "Unknown"] },
        { id: "decision-date", label: "EXPECTED DECISION DATE *", type: "date", required: true }
      ]
    },
    {
      id: "s5",
      title: "05 \u2014 WHERE DO YOU NEED FLOWTARIS?",
      desc: "",
      fields: [
        { id: "capabilities", label: "Capabilities Needed", type: "checkbox_group", required: false, options: ["Architecture", "Platform Engineering", "Integration", "Data Engineering", "AI / Automation", "Application Engineering", "Other"] }
      ]
    },
    {
      id: "s6",
      title: "06 \u2014 ADDITIONAL CONTEXT",
      desc: "",
      fields: [
        { id: "additional", label: "ANYTHING ELSE WE SHOULD KNOW? (OPTIONAL)", type: "textarea", required: false }
      ]
    }
  ]
};

export default function RegisterEditor({ site }: { site: string }) {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?id=register`);
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

  const updateSection = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const addSection = () => {
    setData((prev: any) => ({
      ...prev,
      sections: [...prev.sections, { id: `s${Date.now()}`, title: "NEW SECTION", desc: "", fields: [] }]
    }));
  };

  const removeSection = (index: number) => {
    setData((prev: any) => {
      const newSections = [...prev.sections];
      newSections.splice(index, 1);
      return { ...prev, sections: newSections };
    });
  };

  const addField = (sectionIndex: number) => {
    setData((prev: any) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].fields.push({ id: `f${Date.now()}`, label: "NEW FIELD", type: "text", required: false });
      return { ...prev, sections: newSections };
    });
  };

  const updateField = (sectionIndex: number, fieldIndex: number, key: string, value: any) => {
    setData((prev: any) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].fields[fieldIndex] = { ...newSections[sectionIndex].fields[fieldIndex], [key]: value };
      return { ...prev, sections: newSections };
    });
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    setData((prev: any) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].fields.splice(fieldIndex, 1);
      return { ...prev, sections: newSections };
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
          record: { id: "register", content: data }
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
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>Register Page Settings</h1>
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
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid #E5E7EB", paddingBottom: 16 }}>
        {["hero", "form", "sidebar", "success"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: "8px 16px", background: activeTab === tab ? "#111827" : "#F3F4F6", color: activeTab === tab ? "#fff" : "#4B5563", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeTab === "hero" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Eyebrow</label>
              <input value={data.hero?.eyebrow || ""} onChange={e => update("hero", "eyebrow", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Title (Use \\n for line breaks)</label>
              <textarea value={data.hero?.title || ""} onChange={e => update("hero", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Subtitle</label>
              <textarea value={data.hero?.subtitle || ""} onChange={e => update("hero", "subtitle", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR TAB */}
      {activeTab === "sidebar" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Sidebar Content</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Title</label>
              <input value={data.sidebar?.title || ""} onChange={e => update("sidebar", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Description</label>
              <textarea value={data.sidebar?.desc || ""} onChange={e => update("sidebar", "desc", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 80 }} />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Contact Label</label>
                <input value={data.sidebar?.contactLabel || ""} onChange={e => update("sidebar", "contactLabel", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Contact Email</label>
                <input value={data.sidebar?.contactEmail || ""} onChange={e => update("sidebar", "contactEmail", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TAB */}
      {activeTab === "success" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Success Screen & Consent</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, borderBottom: "1px solid #E5E7EB", paddingBottom: 8 }}>Success Screen</h3>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Title</label>
              <input value={data.success?.title || ""} onChange={e => update("success", "title", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Top Description</label>
              <input value={data.success?.desc || ""} onChange={e => update("success", "desc", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Bottom Description</label>
              <textarea value={data.success?.desc2 || ""} onChange={e => update("success", "desc2", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Back Button CTA</label>
              <input value={data.success?.cta || ""} onChange={e => update("success", "cta", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, borderBottom: "1px solid #E5E7EB", paddingBottom: 8 }}>Consent & Submit Button</h3>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Checkbox Text</label>
              <textarea value={data.consent?.text || ""} onChange={e => update("consent", "text", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Submit CTA</label>
                <input value={data.consent?.cta || ""} onChange={e => update("consent", "cta", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Submit Loading CTA</label>
                <input value={data.consent?.ctaLoading || ""} onChange={e => update("consent", "ctaLoading", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Privacy Disclaimer</label>
              <textarea value={data.consent?.disclaimer || ""} onChange={e => update("consent", "disclaimer", e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6, minHeight: 60 }} />
            </div>
          </div>
        </div>
      )}

      {/* FORM BUILDER TAB */}
      {activeTab === "form" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {(data.sections || []).map((section: any, sIndex: number) => (
            <div key={section.id || sIndex} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ flex: 1, paddingRight: 24 }}>
                  <input
                    value={section.title || ""}
                    onChange={e => updateSection(sIndex, "title", e.target.value)}
                    placeholder="Section Title (e.g. 01 - YOUR INFORMATION)"
                    style={{ width: "100%", fontSize: 16, fontWeight: 600, padding: 8, border: "1px solid transparent", borderBottom: "1px solid #E5E7EB", marginBottom: 8 }}
                  />
                  <input
                    value={section.desc || ""}
                    onChange={e => updateSection(sIndex, "desc", e.target.value)}
                    placeholder="Optional Description"
                    style={{ width: "100%", fontSize: 13, color: "#6B7280", padding: 8, border: "1px solid transparent", borderBottom: "1px solid #E5E7EB" }}
                  />
                </div>
                <button onClick={() => removeSection(sIndex)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
                  <Trash2 size={14} /> Remove Section
                </button>
              </div>

              <div style={{ paddingLeft: 16, borderLeft: "2px solid #E5E7EB" }}>
                {(section.fields || []).map((field: any, fIndex: number) => (
                  <div key={field.id || fIndex} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#F9FAFB", padding: 16, borderRadius: 8, marginBottom: 12, border: "1px solid #E5E7EB" }}>
                    <div style={{ paddingTop: 8, color: "#9CA3AF" }}><GripVertical size={16} /></div>
                    
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 2 }}>
                          <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Label</label>
                          <input value={field.label || ""} onChange={e => updateField(sIndex, fIndex, "label", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13 }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Type</label>
                          <select value={field.type || "text"} onChange={e => updateField(sIndex, fIndex, "type", e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, background: "#fff" }}>
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="date">Date</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Dropdown (Select)</option>
                            <option value="checkbox_group">Checkbox Group</option>
                          </select>
                        </div>
                        <div style={{ width: 100, display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                            <input type="checkbox" checked={field.required || false} onChange={e => updateField(sIndex, fIndex, "required", e.target.checked)} />
                            Required
                          </label>
                        </div>
                        <div style={{ width: 80, display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                          <button onClick={() => removeField(sIndex, fIndex)} style={{ background: "transparent", color: "#B91C1C", border: "none", cursor: "pointer", padding: 4 }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Options input for Select/Checkbox Groups */}
                      {["select", "checkbox_group"].includes(field.type) && (
                        <div>
                          <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Options (comma separated)</label>
                          <input 
                            value={(field.options || []).join(", ")} 
                            onChange={e => updateField(sIndex, fIndex, "options", e.target.value.split(",").map((s: string) => s.trim()))} 
                            placeholder="Option 1, Option 2, Option 3"
                            style={{ width: "100%", padding: 8, border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13 }} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={() => addField(sIndex)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: "#2563EB", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, padding: "8px 0" }}>
                  <Plus size={16} /> Add Field
                </button>
              </div>
            </div>
          ))}

          <button onClick={addSection} style={{ background: "#F3F4F6", color: "#374151", border: "1px dashed #D1D5DB", padding: 24, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 500, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <Plus size={20} /> Add New Section
          </button>
        </div>
      )}

    </div>
  );
}
