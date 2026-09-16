import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

export default async function ContactPage() {
  let res: any = null;
  if (supabase) {
    try {
      const { data } = await supabase.from("page_content").select("content").eq("id", "contact").single();
      res = data;
    } catch (e) {}
  }
  
  const content = res?.content;
  const data = content ? {
    hero: { ...DEFAULT_DATA.hero, ...(content.hero || {}) },
    routingPrinciple: content.routingPrinciple || DEFAULT_DATA.routingPrinciple,
    routingBlocks: content.routingBlocks || DEFAULT_DATA.routingBlocks,
    corporate: { ...DEFAULT_DATA.corporate, ...(content.corporate || {}) },
    microEditorial: { ...DEFAULT_DATA.microEditorial, ...(content.microEditorial || {}) }
  } : DEFAULT_DATA;

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; HOME</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ CONTACT</span>
      </div>

      {/* Minimal Hero */}
      <section className="section ev-hero" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px', fontSize: '3.5rem', margin: '16px 0' }} dangerouslySetInnerHTML={{ __html: (data.hero.title || "").replace(/\n/g, '<br />') }}></h1>
        <p className="card-description ev-subtitle" style={{ maxWidth: '600px', marginTop: '32px' }} dangerouslySetInnerHTML={{ __html: (data.hero.subtitle || "").replace(/\n/g, '<br />') }}></p>
      </section>

      {/* Routing Principle */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '64px' }}>
        <div style={{ borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)', padding: '32px 0' }}>
          <h2 className="card-heading" style={{ margin: 0, letterSpacing: '0.05em', color: 'var(--color-text-primary)' }} dangerouslySetInnerHTML={{ __html: (data.routingPrinciple || "").replace(/\n/g, '<br />') }}></h2>
        </div>
      </section>

      {/* Contact Routing Blocks */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '64px' }}>
        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {(data.routingBlocks || []).map((block: any, i: number) => (
            <div key={i} className="ev-panel" style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
              <span className="section-label" style={{ marginBottom: '16px' }}>{block.num}</span>
              <h3 className="section-heading" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{block.title}</h3>
              <p className="trust-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', minHeight: '48px' }} dangerouslySetInnerHTML={{ __html: (block.desc || "").replace(/\n/g, '<br />') }}></p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                <span className="section-label" style={{ fontSize: '0.75rem', margin: 0 }}>EMAIL</span>
                <a href={block.emailLink || `mailto:${block.email}`} className="card-heading" style={{ textDecoration: 'none' }}>{block.email}</a>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <span className="trust-body" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{block.footerText || "\u00A0"}</span>
                {block.ctaLink?.startsWith("/") ? (
                  <Link href={block.ctaLink} className="judgment-cta">{block.cta}</Link>
                ) : (
                  <a href={block.ctaLink || "#"} className="judgment-cta">{block.cta}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Information & Verified Channels */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-heading" style={{ fontSize: '1.125rem' }}>{data.corporate.title}</span>
            <div className="trust-body" style={{ color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: (data.corporate.address || "").replace(/\n/g, '<br />') }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="section-label">{data.corporate.socialLabel}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(data.corporate.socials || []).map((social: any, i: number) => (
                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="card-heading" style={{ textDecoration: 'none' }}>{social.name}</a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Why This Works (Micro Editorial) */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
          {data.microEditorial.heading}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {(data.microEditorial.lines || []).map((line: any, i: number) => (
            <p key={i} className="trust-body" style={{ fontSize: '1.25rem', margin: 0, color: line.highlight ? 'var(--color-accent)' : 'inherit' }}>
              {line.text}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
