import Link from "next/link"

const sections = [
  { label: "Hero", href: "/admin/co/hero", desc: "Hero section  main landing banner" },
  { label: "Judgment", href: "/admin/co/judgment", desc: "Judgment page content" },
  { label: "Judgment Slugs", href: "/admin/co/judgment-slugs", desc: "Individual judgment entries" },
  { label: "Leverage", href: "/admin/co/leverage", desc: "Leverage model and alliances" },
  { label: "Principles", href: "/admin/co/principles", desc: "Operating principles" },
  { label: "Resources", href: "/admin/co/resources", desc: "Resource library" },
  { label: "Trust", href: "/admin/co/trust", desc: "Trust infrastructure" },
  { label: "Workday", href: "/admin/co/workday", desc: "Workday integration section" },
]

export default function CoDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", padding: "40px 32px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/admin" style={{ fontSize: 13, color: "#475569", textDecoration: "none", fontWeight: 500 }}>
            ? Back to Hub
          </Link>
        </div>
        <div style={{ marginBottom: 32 }}>
          <span style={{ background: "#F1F5F9", color: "#334155", fontSize: 11, fontWeight: 700, borderRadius: 4, padding: "4px 10px", letterSpacing: "0.1em" }}>TRUST</span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", marginTop: 8, marginBottom: 6 }}>Flowtaris.co Admin</h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>Edit all sections of the trust infrastructure domain.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {sections.map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", padding: "20px 22px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 15, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.desc}</div>
                <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: "#475569" }}>Edit ?</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
