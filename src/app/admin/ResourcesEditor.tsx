"use client";

import { useState, useEffect, useCallback } from "react";

export default function ResourcesEditor({ site }: { site: string }) {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [newPdfTitle, setNewPdfTitle] = useState("");
  const [newPdfUrl, setNewPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${site}?table=pdf_documents`);
      const { data } = await res.json();
      if (data) setPdfs(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [site]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) { const timer = setTimeout(() => setSaveStatus(null), 4000); return () => clearTimeout(timer); } return undefined;
  }, [saveStatus]);

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPdf(true);
    setSaveStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setNewPdfUrl(data.url);
        if (!newPdfTitle) {
          setNewPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
      else setSaveStatus({ type: "error", message: data.error || "Failed to upload PDF" });
    } catch { setSaveStatus({ type: "error", message: "Error uploading PDF" }); }
    finally { setIsUploadingPdf(false); e.target.value = ""; }
  }

  async function addPdf() {
    setSaveStatus(null);
    if (!newPdfTitle || !newPdfUrl) { setSaveStatus({ type: "error", message: "Please enter title and URL for the PDF." }); return; }
    try {
      const res = await fetch(`/api/content/${site}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "pdf_documents", record: { title: newPdfTitle, url: newPdfUrl } })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      setNewPdfTitle(""); setNewPdfUrl(""); fetchData();
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) { setSaveStatus({ type: "error", message: "Error adding PDF: " + e.message }); }
  }

  async function deletePdf(id: string) {
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/content/${site}?table=pdf_documents&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const { error } = await res.json();
      if (error) throw new Error(error);
      fetchData();
      setSaveStatus({ type: "success", message: `Changes are saved to flowtaris.${site}!` });
    } catch (e: any) { setSaveStatus({ type: "error", message: "Error deleting PDF: " + e.message }); }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>PDF Resources</h1>
      
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
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Add New PDF</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>Document Title</label>
            <input type="text" placeholder="e.g. Q3 Architecture Report" value={newPdfTitle} onChange={(e) => setNewPdfTitle(e.target.value)} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#374151" }}>PDF URL or Upload File</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="url" placeholder="https://..." value={newPdfUrl} onChange={(e) => setNewPdfUrl(e.target.value)} style={{ flex: 1, background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "10px 12px", borderRadius: 6, fontSize: 14 }} />
              <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>OR</span>
              <label style={{ cursor: isUploadingPdf ? "wait" : "pointer", background: "#F3F4F6", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#374151", whiteSpace: "nowrap" }}>
                {isUploadingPdf ? "Uploading..." : "Upload PDF"}
                <input type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} disabled={isUploadingPdf} style={{ display: "none" }} />
              </label>
            </div>
          </div>
          <button onClick={addPdf} disabled={isUploadingPdf} style={{ opacity: isUploadingPdf ? 0.7 : 1, height: 42, background: "#10B981", color: "#fff", padding: "0 24px", border: "none", borderRadius: 6, cursor: isUploadingPdf ? "wait" : "pointer", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>Add Document</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Manage Existing Documents</h2>
        </div>
        
        {pdfs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>No PDF documents have been added yet.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {pdfs.map((pdf, idx) => (
              <li key={pdf.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: idx < pdfs.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                  <div style={{ fontWeight: 500, color: "#111827", marginBottom: 4 }}>{pdf.title}</div>
                  <a href={pdf.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#2563EB", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pdf.url}</a>
                </div>
                <div style={{ padding: "0 24px", textAlign: "center", borderLeft: "1px solid #E5E7EB", borderRight: "1px solid #E5E7EB", marginRight: 24 }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#111827", lineHeight: 1 }}>{pdf.downloads || 0}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>Downloads</div>
                </div>
                <button onClick={() => deletePdf(pdf.id)} style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
