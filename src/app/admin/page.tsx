"use client";

import { useState } from "react";
import Link from "next/link";

// ── Editor Components ──────────────────────────────────────────────
import HeroEditor from "./HeroEditor";
import TrustEditor from "./TrustEditor";
import JudgmentEditor from "./JudgmentEditor";
import JudgmentSlugsEditor from "./JudgmentSlugsEditor";
import PrinciplesEditor from "./PrinciplesEditor";
import LeverageEditor from "./LeverageEditor";
import ResourcesEditor from "./ResourcesEditor";
import WorkdayEditor from "./WorkdayEditor";
import FooterEditor from "./FooterEditor";
import EvidenceEditor from "./EvidenceEditor";
import ContactEditor from "./ContactEditor";
import QuestionnaireEditor from "./QuestionnaireEditor";
import RegisterEditor from "./RegisterEditor";
import HomeSectionsEditor from "./HomeSectionsEditor";

// ── Icons ──────────────────────────────────────────────────────────
import {
  LayoutDashboard,
  Type,
  ShieldCheck,
  FileText,
  Scale,
  MessageSquare,
  ArrowLeft,
  Grid,
  FileBox,
  User,
  Briefcase,
  BookOpen,
} from "lucide-react";

// ── Sidebar Configuration ──────────────────────────────────────────
const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "hero", label: "Homepage & Hero", icon: <Type size={18} /> },
  { id: "hero", label: "Hero (Home)", icon: <LayoutDashboard size={18} /> },
  { id: "home_sections", label: "Homepage Content", icon: <LayoutDashboard size={18} /> },
  { id: "judgment", label: "Judgment Page", icon: <Scale size={18} /> },
  { id: "judgment_slugs", label: "Judgment Slugs", icon: <FileText size={18} /> },
  { id: "principles", label: "Principles", icon: <BookOpen size={18} /> },
  { id: "statement", label: "Trust Statement", icon: <MessageSquare size={18} /> },
  { id: "leverage", label: "Leverage Page", icon: <Grid size={18} /> },
  { id: "register", label: "Deal Registration", icon: <FileText size={18} /> },
  { id: "evidence", label: "Evidence Page", icon: <ShieldCheck size={18} /> },
  { id: "questionnaire", label: "Questionnaire Center", icon: <FileBox size={18} /> },
  { id: "contact", label: "Contact Page", icon: <MessageSquare size={18} /> },
  { id: "resources", label: "PDF Resources", icon: <FileBox size={18} /> },
  { id: "workday", label: "Workday Specialists", icon: <Briefcase size={18} /> },
  { id: "footer", label: "Global Footer", icon: <LayoutDashboard size={18} /> },
];

// ── Dashboard Quick-Links ──────────────────────────────────────────
function DashboardCard({
  icon,
  iconBg,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  actions: { label: string; onClick: () => void }[];
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.5, flex: 1, marginBottom: 24 }}>{description}</p>
      <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            style={{ background: "transparent", border: "none", padding: 0, color: "#2563EB", fontWeight: 500, fontSize: 14, cursor: "pointer" }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────
export default function AdminPage() {
  // ── Navigation State ───────────────────────
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSite, setActiveSite] = useState<"com" | "co" | "ai">("co");

  const SITES = [
    { id: "com", label: "flowtaris.com", color: "#2563EB" },
    { id: "co",  label: "flowtaris.co",  color: "#7C3AED" },
    { id: "ai",  label: "flowtaris.ai",  color: "#059669" },
  ];

  // ── Authenticated Shell ────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F7F6", fontFamily: "sans-serif", color: "#1F2937" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 260, background: "#0B1121", color: "#9CA3AF", display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: 32, height: 32, background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#0B1121", fontWeight: "bold", fontSize: 18 }}>F</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 1 }}>FLOWTARIS</div>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#60A5FA", marginTop: 2 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px",
                background: activeTab === link.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === link.id ? "#fff" : "#9CA3AF",
                border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left",
                fontSize: 14, fontWeight: activeTab === link.id ? 500 : 400, transition: "all 0.2s",
              }}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", textDecoration: "none", fontSize: 14 }}>
            <ArrowLeft size={16} />
            View Public Site
          </Link>
          


          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Admin User</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Super Admin</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0B1121", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 40 }}>

          {/* ── Dashboard Tab ── */}
          {activeTab === "dashboard" && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#111827", marginBottom: 8 }}>Dashboard Overview</h1>
              <p style={{ color: "#6B7280", marginBottom: 40, fontSize: 15 }}>Manage your Flowtaris web presence content from here.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                <DashboardCard icon={<Type size={20} color="#3B82F6" />} iconBg="#EFF6FF" title="Homepage & Hero" description="Edit the global hero text, subtitles, and the main messaging of the site." actions={[{ label: "Manage Hero →", onClick: () => setActiveTab("hero") }]} />
                <DashboardCard icon={<FileBox size={20} color="#8B5CF6" />} iconBg="#F5F3FF" title="PDF Resources" description="Add, update, or remove downloadable PDF documents from the main page." actions={[{ label: "Manage PDFs →", onClick: () => setActiveTab("resources") }]} />
                <DashboardCard icon={<LayoutDashboard size={20} color="#3B82F6" />} iconBg="#EFF6FF" title="Hero Section (Home)" description="Manage the primary H1, sub-headline, and the hero image." actions={[{ label: "Manage Hero →", onClick: () => setActiveTab("hero") }]} />
                <DashboardCard icon={<LayoutDashboard size={20} color="#3B82F6" />} iconBg="#EFF6FF" title="Homepage Content" description="Manage the featured judgment logs, trust statements, and final CTAs on the homepage." actions={[{ label: "Manage Content →", onClick: () => setActiveTab("home_sections") }]} />
                <DashboardCard icon={<Scale size={20} color="#F59E0B" />} iconBg="#FFFBEB" title="Judgment Logs" description="Update the featured decision logs displayed on the homepage." actions={[{ label: "Manage Logs →", onClick: () => setActiveTab("judgment") }]} />
                <DashboardCard icon={<BookOpen size={20} color="#EC4899" />} iconBg="#FDF2F8" title="Principles" description="Manage the principles derived from decision logs and page content." actions={[{ label: "Manage Principles →", onClick: () => setActiveTab("principles") }]} />
                <DashboardCard icon={<Grid size={20} color="#6366F1" />} iconBg="#EEF2FF" title="Leverage Page" description="Manage alliances, partnerships, and the specialist network." actions={[{ label: "Manage Leverage →", onClick: () => setActiveTab("leverage") }]} />
                <DashboardCard icon={<FileText size={20} color="#6366F1" />} iconBg="#EEF2FF" title="Deal Registration" description="Manage the form fields and layout of the partner registration page." actions={[{ label: "Manage Registration →", onClick: () => setActiveTab("register") }]} />
                <DashboardCard icon={<ShieldCheck size={20} color="#10B981" />} iconBg="#ECFDF5" title="Evidence Page" description="Manage evidence documents, questionnaires, and policies." actions={[{ label: "Manage Evidence →", onClick: () => setActiveTab("evidence") }]} />
                <DashboardCard icon={<FileBox size={20} color="#0EA5E9" />} iconBg="#F0F9FF" title="Questionnaire Center" description="Manage pre-filled security and compliance questionnaires." actions={[{ label: "Manage Questionnaires →", onClick: () => setActiveTab("questionnaire") }]} />
                <DashboardCard icon={<MessageSquare size={20} color="#3B82F6" />} iconBg="#EFF6FF" title="Contact Page" description="Manage contact routing blocks, addresses, and corporate info." actions={[{ label: "Manage Contact →", onClick: () => setActiveTab("contact") }]} />
                <DashboardCard icon={<LayoutDashboard size={20} color="#059669" />} iconBg="#D1FAE5" title="Global Footer" description="Manage the footer logo, links, and copyright text." actions={[{ label: "Manage Footer →", onClick: () => setActiveTab("footer") }]} />
              </div>
            </div>
          )}

          {/* ── Section Editors ── */}
          {activeTab === "hero"           && <HeroEditor site={activeSite} />}
          {activeTab === "home_sections"  && <HomeSectionsEditor site={activeSite} />}
          {activeTab === "trust"          && <TrustEditor site={activeSite} />}
          {activeTab === "judgment"       && <JudgmentEditor site={activeSite} />}
          {activeTab === "judgment_slugs" && <JudgmentSlugsEditor site={activeSite} />}
          {activeTab === "principles"     && <PrinciplesEditor site={activeSite} />}
          {activeTab === "leverage"       && <LeverageEditor site={activeSite} />}
          {activeTab === "register"       && <RegisterEditor site={activeSite} />}
          {activeTab === "evidence"       && <EvidenceEditor site={activeSite} />}
          {activeTab === "questionnaire"  && <QuestionnaireEditor site={activeSite} />}
          {activeTab === "contact"        && <ContactEditor site={activeSite} />}
          {activeTab === "resources"      && <ResourcesEditor site={activeSite} />}
          {activeTab === "workday"        && <WorkdayEditor site={activeSite} />}
          {activeTab === "footer"         && <FooterEditor site={activeSite} />}

          {/* ── Placeholder Tabs ── */}
          {activeTab === "statement" && (
            <div style={{ maxWidth: 800 }}>
              <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 24, textTransform: "capitalize" }}>{activeTab.replace("-", " ")}</h1>
              <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "#F3F4F6", marginBottom: 16 }}>
                  <FileBox size={24} color="#9CA3AF" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Section Under Construction</h3>
                <p style={{ color: "#6B7280", maxWidth: 400, margin: "0 auto" }}>This section is ready to be connected to your Supabase schema when you need dynamic content here.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
