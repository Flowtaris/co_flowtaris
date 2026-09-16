import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "QUESTIONNAIRE CENTER",
    title: "START WITH THE\nANSWERS.",
    subtitle: "Pre-filled information for the teams responsible\nfor evaluating Flowtaris.",
    body: "Security. Privacy. Technical. Vendor.",
    stats: ["04 QUESTIONNAIRES", "XLSX FORMAT"]
  },
  introduction: {
    heading: "YOU SHOULDN'T HAVE TO ASK US\nTHE SAME QUESTIONS WE'VE ALREADY ANSWERED.",
    lines: [
      "We've organized the information commonly requested\nduring technical, security and procurement review.",
      "Download the relevant workbook,\nreview the answers and send us anything that requires\nadditional clarification."
    ]
  },
  questionnaires: [
    { num: "01", title: "SECURITY", desc: "Controls, infrastructure, access, monitoring, incident response and security practices.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "02", title: "DATA PRIVACY", desc: "Data processing, privacy, subprocessors and related obligations.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "03", title: "VENDOR", desc: "Company information, commercial structure, insurance, governance and operational details.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" },
    { num: "04", title: "TECHNICAL", desc: "Architecture, integrations, deployment, reliability and technical operations.", meta: "XLSX · PRE-FILLED", cta: "DOWNLOAD QUESTIONNAIRE →", href: "#" }
  ],
  howItWorks: {
    label: "HOW IT WORKS",
    steps: [
      { num: "01", title: "DOWNLOAD", desc: "Choose the questionnaire relevant to your review." },
      { num: "02", title: "REVIEW", desc: "Use the pre-filled answers as your starting point." },
      { num: "03", title: "CLARIFY", desc: "Send us anything that requires additional information." },
      { num: "04", title: "PROCEED", desc: "Continue the evaluation without repeating the basics." }
    ]
  },
  documentControl: {
    label: "DOCUMENT CONTROL",
    headers: ["QUESTIONNAIRE", "VERSION", "LAST UPDATED"],
    documents: [
      { name: "Security", version: "v1.0", updated: "MAR 2026" },
      { name: "Data Privacy", version: "v1.0", updated: "MAR 2026" },
      { name: "Vendor", version: "v1.0", updated: "MAR 2026" },
      { name: "Technical", version: "v1.0", updated: "MAR 2026" }
    ],
    footer: "All questionnaires are maintained from the\nsame underlying Flowtaris evidence set."
  },
  relatedEvidence: {
    heading: "THE ANSWERS HAVE SOURCES.",
    categories: [
      { title: "SECURITY", links: [{ label: "Security Policies", href: "/evidence/security" }, { label: "Incident Response", href: "/evidence/security" }, { label: "Business Continuity", href: "/evidence/security" }] },
      { title: "DATA PRIVACY", links: [{ label: "DPA", href: "/evidence/legal" }, { label: "Privacy Policy", href: "/evidence/legal" }, { label: "Subprocessor List", href: "/evidence/legal" }] },
      { title: "VENDOR", links: [{ label: "Corporate Information", href: "/evidence/legal" }, { label: "Insurance", href: "/evidence/legal" }, { label: "Commercial Agreements", href: "/evidence/legal" }] },
      { title: "TECHNICAL", links: [{ label: "Architecture", href: "/evidence/operations" }, { label: "Operations", href: "/evidence/operations" }, { label: "Recovery", href: "/evidence/operations" }] }
    ],
    cta: "EXPLORE EVIDENCE CENTER →",
    ctaLink: "/evidence"
  },
  customQuestionnaire: {
    heading: "YOUR QUESTIONNAIRE ISN'T HERE?",
    desc: "Send it to us.\nWe'll tell you which existing evidence answers the\nquestions and identify anything that requires\nadditional clarification.",
    placeholder: "WORK EMAIL",
    cta: "SUBMIT QUESTIONNAIRE →"
  },
  operatingPrinciple: {
    heading: "PROCUREMENT SHOULD TEST THE BUSINESS,\nNOT TEST YOUR PATIENCE.",
    lines: [
      "The goal of this center is simple:",
      "less repetition,\nfaster evaluation,\nbetter questions."
    ]
  },
  deepNav: {
    prevLabel: "OPERATIONS",
    prevLink: "/evidence/operations",
    nextLabel: "NEXT",
    nextTitle: "EVIDENCE CENTER →",
    nextLink: "/evidence"
  }
};

export default async function QuestionnaireCenterPage() {
  let res: any = null;
  if (supabase) {
    try {
      const { data } = await supabase.from("page_content").select("content").eq("id", "questionnaire").single();
      res = data;
    } catch (e) {}
  }
  
  const content = res?.content;
  const data = content ? {
    hero: { ...DEFAULT_DATA.hero, ...(content.hero || {}) },
    introduction: { ...DEFAULT_DATA.introduction, ...(content.introduction || {}) },
    questionnaires: content.questionnaires || DEFAULT_DATA.questionnaires,
    howItWorks: { ...DEFAULT_DATA.howItWorks, ...(content.howItWorks || {}) },
    documentControl: { ...DEFAULT_DATA.documentControl, ...(content.documentControl || {}) },
    relatedEvidence: { ...DEFAULT_DATA.relatedEvidence, ...(content.relatedEvidence || {}) },
    customQuestionnaire: { ...DEFAULT_DATA.customQuestionnaire, ...(content.customQuestionnaire || {}) },
    operatingPrinciple: { ...DEFAULT_DATA.operatingPrinciple, ...(content.operatingPrinciple || {}) },
    deepNav: { ...DEFAULT_DATA.deepNav, ...(content.deepNav || {}) }
  } : DEFAULT_DATA;

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/evidence" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; EVIDENCE</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ QUESTIONNAIRE</span>
      </div>

      {/* Questionnaire Hero */}
      <section className="section ev-hero">
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" dangerouslySetInnerHTML={{ __html: (data.hero.title || "").replace(/\n/g, '<br />') }}></h1>
        <p className="card-description ev-subtitle" dangerouslySetInnerHTML={{ __html: (data.hero.subtitle || "").replace(/\n/g, '<br />') }}></p>
        <p className="trust-body" style={{ marginBottom: '48px', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: (data.hero.body || "").replace(/\n/g, '<br />') }}></p>
        <div className="ev-stats" style={{ gap: '64px', justifyContent: 'flex-start' }}>
          {(data.hero.stats || []).map((stat: string, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="ev-stat">{stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px', maxWidth: '800px' }} dangerouslySetInnerHTML={{ __html: (data.introduction.heading || "").replace(/\n/g, '<br />') }}></h2>
        {(data.introduction.lines || []).map((line: string, i: number) => (
          <p key={i} className="trust-body" style={{ maxWidth: '600px', marginBottom: i === 0 ? '24px' : '0' }} dangerouslySetInnerHTML={{ __html: (line || "").replace(/\n/g, '<br />') }}></p>
        ))}
      </section>

      {/* Questionnaire Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="trust-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {(data.questionnaires || []).map((q: any, i: number) => (
            <div key={i} className="trust-card" style={{ padding: '64px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>{q.num}</span>
              <h3 className="card-heading" style={{ textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.5rem' }}>{q.title}</h3>
              <p className="trust-body" style={{ flexGrow: 1, marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (q.desc || "").replace(/\n/g, '<br />') }}></p>
              <span className="section-label" style={{ marginBottom: '16px' }}>{q.meta}</span>
              <Link href={q.href || "#"} className="judgment-cta">{q.cta || "DOWNLOAD QUESTIONNAIRE →"}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.howItWorks.label}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
          {(data.howItWorks.steps || []).map((step: any, i: number, arr: any[]) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: i < arr.length - 1 ? '16px' : '0' }}>
              <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>
                <span style={{ color: 'var(--color-accent)', marginRight: '16px' }}>{step.num}</span>
                {step.title}
              </span>
              <p className="trust-body">{step.desc}</p>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', marginTop: '8px' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Document Control */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.documentControl.label}</h2>
        <div className="ev-table-container">
          <table className="ev-table" style={{ marginBottom: '32px' }}>
            <thead>
              <tr>
                <th className="ev-th">{data.documentControl.headers?.[0] || "QUESTIONNAIRE"}</th>
                <th className="ev-th">{data.documentControl.headers?.[1] || "VERSION"}</th>
                <th className="ev-th" style={{ textAlign: 'right' }}>{data.documentControl.headers?.[2] || "LAST UPDATED"}</th>
              </tr>
            </thead>
            <tbody>
              {(data.documentControl.documents || []).map((doc: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{doc.name}</td>
                  <td className="ev-td">{doc.version}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>{doc.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="trust-body" style={{ color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: (data.documentControl.footer || "").replace(/\n/g, '<br />') }}></p>
      </section>

      {/* Related Evidence */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.relatedEvidence.heading}</h2>
        
        <div className="trust-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '64px' }}>
          {(data.relatedEvidence.categories || []).map((cat: any, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label">{cat.title}</span>
              {(cat.links || []).map((link: any, j: number) => (
                <Link key={j} href={link.href} className="trust-body" style={{ fontWeight: 500 }}>&rarr; {link.label}</Link>
              ))}
            </div>
          ))}
        </div>
        
        <Link href={data.relatedEvidence.ctaLink} className="judgment-cta">{data.relatedEvidence.cta}</Link>
      </section>

      {/* Need A Custom Questionnaire? */}
      <section className="section ev-access-section">
        <div className="ev-access-inner">
          <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '16px' }}>{data.customQuestionnaire.heading}</h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (data.customQuestionnaire.desc || "").replace(/\n/g, '<br />') }}></p>
          <form className="ev-access-form" onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="ev-access-input-group" style={{ flexDirection: 'column', border: 'none', gap: '24px' }}>
              <div style={{ display: 'flex', border: '1px solid var(--color-structural)' }}>
                <input 
                  type="email" 
                  className="ev-access-input" 
                  placeholder={data.customQuestionnaire.placeholder} 
                  required 
                />
              </div>
              <button type="submit" className="judgment-cta" style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {data.customQuestionnaire.cta}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Operating Principle */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '32px', maxWidth: '1000px' }} dangerouslySetInnerHTML={{ __html: (data.operatingPrinciple.heading || "").replace(/\n/g, '<br />') }}></h2>
        {(data.operatingPrinciple.lines || []).map((line: string, i: number) => (
          <p key={i} className="card-description" style={{ maxWidth: '700px' }} dangerouslySetInnerHTML={{ __html: (line || "").replace(/\n/g, '<br />') }}></p>
        ))}
      </section>

      {/* Deep Page Navigation */}
      <section className="section">
        <div className="dl-prev-next-inner">
          <Link href={data.deepNav.prevLink} className="dl-nav-link dl-nav-prev">
            <span className="dl-nav-direction">&larr; {data.deepNav.prevLabel}</span>
          </Link>
          <Link href={data.deepNav.nextLink} className="dl-nav-link dl-nav-next">
            <span className="dl-nav-direction">{data.deepNav.nextLabel}</span>
            <span className="dl-nav-title">{data.deepNav.nextTitle}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
