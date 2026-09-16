"use client";

import { useState, useEffect, useMemo } from "react";

const inputStyle = { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 14, width: "100%", background: "#F9FAFB", color: "#111827" };
const textareaStyle = { ...inputStyle, height: 80, resize: "vertical" as const };
const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 as const, color: "#374151" };
const cardStyle = { background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #E5E7EB", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const sectionTitleStyle = { fontSize: 16, fontWeight: 600 as const, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #E5E7EB" };

export default function PrinciplesEditor({ site }: { site: string }) {
  const [pageData, setPageData] = useState<any>(null);
  const [judgmentData, setJudgmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"principles" | "page">("principles");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [pageRes, judgRes] = await Promise.all([
          fetch(`/api/content/${site}?table=page_content&id=principles`).then(r => r.json()),
          fetch(`/api/content/${site}?table=page_content&id=judgment`).then(r => r.json())
        ]);
        if (pageRes.data && pageRes.data.length > 0 && pageRes.data[0].content) {
          setPageData(pageRes.data[0].content);
        } else {
          setPageData(defaultPageData());
        }
        if (judgRes.data && judgRes.data.length > 0 && judgRes.data[0].content) {
          setJudgmentData(judgRes.data[0].content);
        } else {
          setJudgmentData({ logs: [] });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchAll();
  }, [site]);

  const logs = useMemo(() => (judgmentData?.logs || []), [judgmentData]);
  const principlesLogs = useMemo(() => logs.filter((l: any) => l.principle?.statement), [logs]);

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // --- Save helpers ---
  async function savePageContent() {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "page_content", record: { id: "principles", content: pageData, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) { setSaveStatus({ type: "error", message: "Error: " + e.message }); }
  }

  async function saveJudgmentLogs(updatedLogs: any[]) {
    try {
      const content = { ...judgmentData, logs: updatedLogs };
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "page_content", record: { id: "judgment", content, updated_at: new Date().toISOString() } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setJudgmentData(content);
    } catch (e: any) { 
      setSaveStatus({ type: "error", message: "Error: " + e.message }); 
      throw e; 
    }
  }

  // --- Principle CRUD ---
  function startEdit(idx: number) {
    const log = logs[idx];
    setEditingIdx(idx);
    setDraft({
      slug: log.slug || "",
      title: log.title || "",
      date: log.date || "",
      tags: Array.isArray(log.tags) ? log.tags.join(", ") : "",
      principleStatement: log.principle?.statement || "",
      principleCategory: log.principle?.category || "",
      author: log.author || "",
      isHidden: log.isHidden || false,
    });
  }

  function startAdd() {
    setEditingIdx(-1);
    setDraft({
      slug: "",
      title: "",
      date: "",
      tags: "",
      principleStatement: "",
      principleCategory: "Strategy",
      author: "",
      isHidden: false,
    });
  }

  async function saveDraft() {
    setSaveStatus(null);
    if (!draft.slug || !draft.principleStatement) {
      setSaveStatus({ type: "error", message: "Slug and Principle Statement are required." });
      return;
    }
    const logEntry = {
      id: draft.slug,
      slug: draft.slug,
      title: draft.title,
      date: draft.date,
      tags: draft.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      href: `/judgment/${draft.slug}`,
      author: draft.author,
      principle: {
        statement: draft.principleStatement,
        category: draft.principleCategory,
      },
      isHidden: draft.isHidden,
      outcome: { metrics: [], timeframe: "Outcome realized" },
    };

    let updatedLogs: any[];
    if (editingIdx === -1) {
      // new
      if (logs.some((l: any) => l.slug === draft.slug)) {
        setSaveStatus({ type: "error", message: "A log with this slug already exists." });
        return;
      }
      updatedLogs = [...logs, logEntry];
    } else {
      updatedLogs = logs.map((l: any, i: number) => i === editingIdx ? { ...l, ...logEntry } : l);
    }

    try {
      await saveJudgmentLogs(updatedLogs);

      // Also ensure the slug page exists
      const slugId = `judgment_slug_${draft.slug}`;
      const slugRes = await fetch(`/api/content/${site}?table=page_content&id=${slugId}`);
      const slugJson = await slugRes.json();
      const existing = slugJson.data && slugJson.data.length > 0;
      if (!existing) {
        await fetch(`/api/content/${site}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "page_content",
            record: {
              id: slugId,
              content: {
                category: "DECISION LOG",
                tags: logEntry.tags,
                title: draft.title,
                excerpt: "",
                author: draft.author || "AUTHOR",
                authorFull: "Flowtaris Leadership",
                role: "Leadership",
                date: draft.date,
                readTime: "3 MIN READ",
                context: ["This principle emerged from a specific scenario we encountered."],
                decision: { main: "Decision details pending.", supporting: "" },
                alternativesRejected: [{ number: "01", title: "Status Quo", reason: "Inaction was not an option." }],
                outcome: { metrics: [{ value: "--", label: "Pending" }], timeframe: "--", caveats: [] },
                principle: draft.principleStatement,
              }
            }
          })
        });
      }

      setEditingIdx(null);
      setDraft(null);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e) {
      console.error(e);
    }
  }

  async function deletePrinciple(idx: number) {
    if (!confirm("Remove this principle from the list?")) return;
    setSaveStatus(null);
    const updatedLogs = logs.filter((_: any, i: number) => i !== idx);
    try {
      await saveJudgmentLogs(updatedLogs);
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e) {}
  }

  async function toggleHidePrinciple(idx: number) {
    setSaveStatus(null);
    const updatedLogs = logs.map((l: any, i: number) => i === idx ? { ...l, isHidden: !l.isHidden } : l);
    try {
      await saveJudgmentLogs(updatedLogs);
      setSaveStatus({ type: "success", message: `Visibility updated and saved to flowtaris.${site}!` });
    } catch (e) {}
  }

  // --- Page content helpers ---
  const updatePage = (section: string, key: string, value: any) => {
    setPageData((p: any) => ({ ...p, [section]: { ...p[section], [key]: value } }));
  };
  const updateStep = (section: string, idx: number, key: string, value: string) => {
    setPageData((p: any) => {
      const newSteps = [...p[section].steps];
      newSteps[idx] = { ...newSteps[idx], [key]: value };
      return { ...p, [section]: { ...p[section], steps: newSteps } };
    });
  };
  const addStep = (section: string) => {
    setPageData((p: any) => {
      const newSteps = [...(p[section].steps || []), { label: "", color: "default" }];
      return { ...p, [section]: { ...p[section], steps: newSteps } };
    });
  };
  const removeStep = (section: string, idx: number) => {
    setPageData((p: any) => {
      const newSteps = [...(p[section].steps || [])];
      newSteps.splice(idx, 1);
      return { ...p, [section]: { ...p[section], steps: newSteps } };
    });
  };

  if (loading || !pageData || !judgmentData) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", margin: 0 }}>Principles</h1>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>
            Manage principles extracted from decision logs and page layout content.
          </p>
        </div>
      </div>

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

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #E5E7EB" }}>
        {[
          { id: "principles" as const, label: `Principles (${principlesLogs.length})` },
          { id: "page" as const, label: "Page Content" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: "12px 24px",
              background: "none",
              border: "none",
              borderBottom: activeSection === tab.id ? "2px solid #2563EB" : "2px solid transparent",
              marginBottom: -2,
              color: activeSection === tab.id ? "#2563EB" : "#6B7280",
              fontWeight: activeSection === tab.id ? 600 : 400,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ====== PRINCIPLES TAB ====== */}
      {activeSection === "principles" && (
        <>
          {/* Add button */}
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={startAdd}
              style={{ background: "#2563EB", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}
            >
              + Add New Principle
            </button>
          </div>

          {/* Edit/Add Form */}
          {draft && (
            <div style={{ ...cardStyle, border: "2px solid #2563EB" }}>
              <h2 style={sectionTitleStyle}>{editingIdx === -1 ? "Add New Principle" : "Edit Principle"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Slug (URL path)</label>
                  <input
                    style={inputStyle}
                    value={draft.slug}
                    onChange={e => setDraft({ ...draft, slug: e.target.value })}
                    placeholder="e.g. firing-largest-client"
                    disabled={editingIdx !== -1}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    style={inputStyle}
                    value={draft.principleCategory}
                    onChange={e => setDraft({ ...draft, principleCategory: e.target.value })}
                  >
                    {(pageData.explore.categories || ["Strategy", "Tech", "Crisis", "Hiring", "Culture", "Pricing"]).map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Principle Statement</label>
                <textarea
                  style={textareaStyle}
                  value={draft.principleStatement}
                  onChange={e => setDraft({ ...draft, principleStatement: e.target.value })}
                  placeholder='e.g. "Revenue that costs your culture is expensive revenue."'
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Source Decision Title</label>
                  <input
                    style={inputStyle}
                    value={draft.title}
                    onChange={e => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Why We Fired Our Largest Client"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    style={inputStyle}
                    value={draft.date}
                    onChange={e => setDraft({ ...draft, date: e.target.value })}
                    placeholder="10 MAR 2023"
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input
                    style={inputStyle}
                    value={draft.author}
                    onChange={e => setDraft({ ...draft, author: e.target.value })}
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input
                    style={inputStyle}
                    value={draft.tags}
                    onChange={e => setDraft({ ...draft, tags: e.target.value })}
                    placeholder="CRISIS, CULTURE"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={saveDraft}
                  style={{ background: "#059669", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}
                >
                  {editingIdx === -1 ? "Add Principle" : "Save Changes"}
                </button>
                <button
                  onClick={() => { setEditingIdx(null); setDraft(null); }}
                  style={{ background: "#F3F4F6", color: "#374151", padding: "10px 20px", border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Principles List */}
          {principlesLogs.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
              <p style={{ color: "#9CA3AF", fontSize: 15 }}>No principles found. Add your first principle above.</p>
            </div>
          ) : (
            <div style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 190px", gap: 0, padding: "0 16px 12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                {["#", "Principle", "Category", "Year", "Actions"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                ))}
              </div>
              {logs.map((log: any, idx: number) => {
                if (!log.principle?.statement) return null;
                const yearMatch = log.date?.match(/\d{4}/);
                const year = yearMatch ? yearMatch[0] : "--";
                return (
                  <div
                    key={log.slug || idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 120px 100px 190px",
                      gap: 0,
                      padding: "16px",
                      borderBottom: "1px solid #F3F4F6",
                      alignItems: "center",
                      opacity: log.isHidden ? 0.5 : 1,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>{String(idx + 1).padStart(2, "0")}</span>
                    <div>
                      <div style={{ fontWeight: 500, color: "#111827", fontSize: 14, marginBottom: 2, textDecoration: log.isHidden ? "line-through" : "none" }}>
                        {log.principle.statement.length > 60
                          ? log.principle.statement.substring(0, 60) + "…"
                          : log.principle.statement}
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                        {log.title} · {log.author || "--"} {log.isHidden && <span style={{ color: "#DC2626", fontWeight: 600 }}> (HIDDEN)</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", padding: "4px 8px", borderRadius: 4, textAlign: "center", width: "fit-content" }}>
                      {(log.principle.category || "--").toUpperCase()}
                    </span>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{year}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => toggleHidePrinciple(idx)}
                        style={{ background: log.isHidden ? "#F3F4F6" : "#FEF3C7", color: log.isHidden ? "#6B7280" : "#D97706", padding: "5px 10px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
                      >
                        {log.isHidden ? "Unhide" : "Hide"}
                      </button>
                      <button
                        onClick={() => startEdit(idx)}
                        style={{ background: "#EFF6FF", color: "#2563EB", padding: "5px 10px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePrinciple(idx)}
                        style={{ background: "#FEF2F2", color: "#DC2626", padding: "5px 10px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ====== PAGE CONTENT TAB ====== */}
      {activeSection === "page" && (
        <>
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={savePageContent}
              style={{ background: "#2563EB", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14 }}
            >
              Save Page Content
            </button>
          </div>

          {/* Hero */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Hero Section</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={labelStyle}>Eyebrow</label><input style={inputStyle} value={pageData.hero.eyebrow} onChange={e => updatePage("hero", "eyebrow", e.target.value)} /></div>
              <div><label style={labelStyle}>Title (use \n for line breaks)</label><textarea style={textareaStyle} value={pageData.hero.title} onChange={e => updatePage("hero", "title", e.target.value)} /></div>
              <div><label style={labelStyle}>Subtitle</label><textarea style={textareaStyle} value={pageData.hero.subtitle} onChange={e => updatePage("hero", "subtitle", e.target.value)} /></div>
              <div><label style={labelStyle}>Stats (comma separated)</label><input style={inputStyle} value={(pageData.hero.stats || []).join(", ")} onChange={e => updatePage("hero", "stats", e.target.value.split(",").map(s => s.trim()))} placeholder="08 PRINCIPLES, 05 YEARS, UPDATED AUTOMATICALLY" /></div>
            </div>
          </div>

          {/* Introduction */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Introduction</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={labelStyle}>Title</label><input style={inputStyle} value={pageData.intro.title} onChange={e => updatePage("intro", "title", e.target.value)} /></div>
              <div><label style={labelStyle}>Subtitle</label><input style={inputStyle} value={pageData.intro.subtitle} onChange={e => updatePage("intro", "subtitle", e.target.value)} /></div>
              <div><label style={labelStyle}>Body</label><textarea style={textareaStyle} value={pageData.intro.body} onChange={e => updatePage("intro", "body", e.target.value)} /></div>
            </div>
          </div>

          {/* Relationship Flow */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Principle / Decision Flow</h2>
            {(pageData.relationship.steps || []).map((step: any, i: number) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input style={inputStyle} value={step.label} onChange={e => updateStep("relationship", i, "label", e.target.value)} placeholder="Step Label" />
                <select style={inputStyle} value={step.color} onChange={e => updateStep("relationship", i, "color", e.target.value)}>
                  <option value="default">Default</option>
                  <option value="accent">Accent</option>
                </select>
                <button onClick={() => removeStep("relationship", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }} title="Remove Step">✕</button>
              </div>
            ))}
            <button onClick={() => addStep("relationship")} style={{ padding: "6px 12px", background: "#E5E7EB", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginTop: 4 }}>+ Add Step</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div><label style={labelStyle}>Footer Line 1</label><input style={inputStyle} value={pageData.relationship.footer1} onChange={e => updatePage("relationship", "footer1", e.target.value)} /></div>
              <div><label style={labelStyle}>Footer Line 2</label><input style={inputStyle} value={pageData.relationship.footer2} onChange={e => updatePage("relationship", "footer2", e.target.value)} /></div>
            </div>
          </div>

          {/* Categories Filter Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Categories Filter Section (e.g., EXPLORE PRINCIPLES)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><label style={labelStyle}>Section Title</label><input style={inputStyle} value={pageData.explore.title} onChange={e => updatePage("explore", "title", e.target.value)} placeholder="EXPLORE PRINCIPLES" /></div>
              <div><label style={labelStyle}>&apos;All&apos; Button Label</label><input style={inputStyle} value={pageData.explore.allLabel || "ALL"} onChange={e => updatePage("explore", "allLabel", e.target.value)} placeholder="ALL" /></div>
            </div>
          </div>

          {/* Principle List Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Principle List Section (e.g., PRINCIPLES)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><label style={labelStyle}>Section Title</label><input style={inputStyle} value={pageData.indexSection.title} onChange={e => updatePage("indexSection", "title", e.target.value)} placeholder="PRINCIPLES" /></div>
              <div><label style={labelStyle}>Empty State Text</label><input style={inputStyle} value={pageData.indexSection.emptyText || "No principles match this filter."} onChange={e => updatePage("indexSection", "emptyText", e.target.value)} placeholder="No principles match this filter." /></div>
            </div>
          </div>

          {/* Featured Principle Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Featured Principle Section</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Select Featured Principle</label>
                <select style={inputStyle} value={pageData.featured.principleSlug || ""} onChange={e => updatePage("featured", "principleSlug", e.target.value)}>
                  <option value="">-- Most Recent (Default) --</option>
                  {principlesLogs.map((log: any) => (
                    <option key={log.slug} value={log.slug}>{log.principle.statement.substring(0, 80)}</option>
                  ))}
                </select>
              </div>
              <div><label style={labelStyle}>Section Label</label><input style={inputStyle} value={pageData.featured.label} onChange={e => updatePage("featured", "label", e.target.value)} placeholder="FEATURED PRINCIPLE" /></div>
              <div><label style={labelStyle}>Outcome Prefix Text</label><input style={inputStyle} value={pageData.featured.outcomeLabel || "A decision driven by the outcome:"} onChange={e => updatePage("featured", "outcomeLabel", e.target.value)} placeholder="A decision driven by the outcome:" /></div>
              <div><label style={labelStyle}>Origin Label</label><input style={inputStyle} value={pageData.featured.originLabel || "ORIGIN"} onChange={e => updatePage("featured", "originLabel", e.target.value)} placeholder="ORIGIN" /></div>
              <div><label style={labelStyle}>CTA Text</label><input style={inputStyle} value={pageData.featured.cta || "READ THE DECISION →"} onChange={e => updatePage("featured", "cta", e.target.value)} placeholder="READ THE DECISION →" /></div>
            </div>
          </div>


          {/* Judgment Connection */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Judgment Connection</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={labelStyle}>Title</label><input style={inputStyle} value={pageData.judgmentConnection.title} onChange={e => updatePage("judgmentConnection", "title", e.target.value)} /></div>
              <div><label style={labelStyle}>Description</label><textarea style={textareaStyle} value={pageData.judgmentConnection.desc} onChange={e => updatePage("judgmentConnection", "desc", e.target.value)} /></div>
              <div><label style={labelStyle}>CTA Text</label><input style={inputStyle} value={pageData.judgmentConnection.cta} onChange={e => updatePage("judgmentConnection", "cta", e.target.value)} /></div>
            </div>
          </div>

          {/* Evidence Connection */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Evidence Connection</h2>
            <div><label style={labelStyle}>Title</label><input style={inputStyle} value={pageData.evidenceConnection.title} onChange={e => updatePage("evidenceConnection", "title", e.target.value)} /></div>
            <div style={{ marginTop: 12 }}>
              {(pageData.evidenceConnection.steps || []).map((step: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input style={inputStyle} value={step.label} onChange={e => updateStep("evidenceConnection", i, "label", e.target.value)} placeholder="Step Label" />
                  <select style={inputStyle} value={step.color} onChange={e => updateStep("evidenceConnection", i, "color", e.target.value)}>
                    <option value="default">Default</option>
                    <option value="accent">Accent</option>
                  </select>
                  <button onClick={() => removeStep("evidenceConnection", i)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }} title="Remove Step">✕</button>
                </div>
              ))}
              <button onClick={() => addStep("evidenceConnection")} style={{ padding: "6px 12px", background: "#E5E7EB", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginTop: 4 }}>+ Add Step</button>
            </div>
            <div style={{ marginTop: 12 }}><label style={labelStyle}>CTA Text</label><input style={inputStyle} value={pageData.evidenceConnection.cta} onChange={e => updatePage("evidenceConnection", "cta", e.target.value)} /></div>
          </div>

          {/* Closing */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Closing Statement</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={labelStyle}>Title</label><input style={inputStyle} value={pageData.closing.title} onChange={e => updatePage("closing", "title", e.target.value)} /></div>
              <div><label style={labelStyle}>Description</label><textarea style={textareaStyle} value={pageData.closing.desc} onChange={e => updatePage("closing", "desc", e.target.value)} /></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function defaultPageData() {
  return {
    hero: { eyebrow: "PRINCIPLES", title: "WHAT WE BELIEVE\\nAFTER MAKING THE\\nDECISION.", subtitle: "Principles extracted from the decisions we've actually made.", stats: ["08 PRINCIPLES", "05 YEARS", "UPDATED AUTOMATICALLY"] },
    intro: { title: "THESE AREN'T BRAND VALUES.", subtitle: "They're conclusions.", body: "Each principle came from a decision:\\nsomething we chose,\\nsomething we rejected,\\nand something we learned." },
    relationship: { steps: [{ label: "DECISION", color: "default" }, { label: "OUTCOME", color: "default" }, { label: "PRINCIPLE", color: "accent" }, { label: "FUTURE DECISIONS", color: "default" }], footer1: "A principle isn't written first.", footer2: "It is earned through a decision." },
    evolved: { title: "HOW THE PRINCIPLES EVOLVED", years: ["2019", "2020", "2022", "2023", "2024"], allLabel: "ALL YEARS" },
    explore: { title: "EXPLORE PRINCIPLES", categories: ["CRISIS", "CULTURE", "STRATEGY", "TECH"], allLabel: "ALL" },
    featured: { label: "FEATURED PRINCIPLE", principleSlug: "", outcomeLabel: "A decision driven by the outcome:", originLabel: "ORIGIN", cta: "READ THE DECISION →" },
    indexSection: { title: "PRINCIPLES", emptyText: "No principles match this filter." },
    judgmentConnection: { title: "EVERY PRINCIPLE HAS A HISTORY.", desc: "READ THE DECISIONS\\nTHAT CREATED THEM.", cta: "EXPLORE JUDGMENT →" },
    evidenceConnection: { title: "PRINCIPLES → DECISIONS → EVIDENCE", steps: [{ label: "What we believe", color: "default" }, { label: "What we decided", color: "default" }, { label: "How we operate", color: "accent" }], cta: "EXPLORE EVIDENCE →" },
    closing: { title: "PRINCIPLES AREN'T PROMISES.", desc: "THEY'RE THE PATTERNS WE KEEP\\nAFTER THE DECISION IS MADE." }
  };
}
