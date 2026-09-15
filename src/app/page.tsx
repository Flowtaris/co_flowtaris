import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let content: any = {
    eyebrow: "FLOWTARIS",
    heroTitle: "WE DON'T JUST\nDELIVER SYSTEMS.\nWE MAKE THE\nDECISIONS BEHIND THEM\nVISIBLE.",
    heroSubtitle: "Engineering complex systems for companies where reliability, judgment, and execution matter.",
    heroImage: "/hero_image.png",
    ctaText: "EXPLORE OUR JUDGMENT \u2192",
    ctaLink: "#judgment",
  };
  let pdfs: any[] = [];
  let trustContent: any = {
    title: "THREE SYSTEMS OF TRUST",
    systems: [
      { id: "1", heading: "JUDGMENT", description: "How we think.", items: ["Decision logs", "Principles"], ctaText: "EXPLORE \u2192", ctaLink: "#judgment" },
      { id: "2", heading: "EVIDENCE", description: "How we operate.", items: ["Governance", "Security"], ctaText: "EXPLORE \u2192", ctaLink: "#evidence" },
      { id: "3", heading: "LEVERAGE", description: "How we scale.", items: ["Partnerships", "Alliances"], ctaText: "EXPLORE \u2192", ctaLink: "#leverage" }
    ]
  };

  try {
    if (supabase) {
    const { data: contentData } = await supabase.from('page_content').select('content').eq('id', 'home').single();
    if (contentData?.content) {
      content = contentData.content;
    }
    
    const { data: trustData } = await supabase.from('page_content').select('content').eq('id', 'systems_of_trust').single();
    if (trustData?.content) {
      trustContent = trustData.content;
    }
    
    const { data: pdfData } = await supabase.from('pdf_documents').select('*').order('created_at', { ascending: false });
    if (pdfData) {
      pdfs = pdfData;
    }
    }
  } catch (err) {
    console.error("Supabase fetch failed", err);
  }

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split(/\\n|\n/).map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* 5. HERO */}
      <section className="section hero home-hero-layout">
        <div className="hero-content">
          <span className="eyebrow">{content.eyebrow || "FLOWTARIS"}</span>
          <h1 className="hero-headline section-heading">
            {formatText(content.heroTitle)}
          </h1>
          <p className="hero-supporting card-description">
            {formatText(content.heroSubtitle)}
          </p>
          <a href={content.ctaLink || "#judgment"} className="cta-button primary">{content.ctaText || "EXPLORE OUR JUDGMENT \u2192"}</a>
        </div>
        <div className="hero-image-wrapper">
          <Image src={content.heroImage || "/hero_image.png"} alt="Flowtaris Modern Architecture" className="hero-image" width={800} height={600} priority />
        </div>
      </section>

      {/* PDF SECTION */}
      {pdfs.length > 0 && (
        <section className="section" id="resources" style={{ paddingBottom: '6rem' }}>
          <h2 className="section-title section-heading">AVAILABLE RESOURCES</h2>
          <div className="trust-grid">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="trust-card">
                <h3 className="card-heading">{pdf.title}</h3>
                <p className="trust-desc card-description">PDF Document</p>
                <a href={pdf.url} target="_blank" rel="noreferrer" className="trust-cta">VIEW DOCUMENT &rarr;</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. THREE SYSTEMS OF TRUST */}
      <section className="section trust-systems" id="trust">
        <h2 className="section-title section-heading">{trustContent.title || "THREE SYSTEMS OF TRUST"}</h2>
        <div className="trust-grid">
          {(trustContent.systems || []).map((system: any) => (
            <div key={system.id} className="trust-card">
              <h3 className="card-heading">{system.heading}</h3>
              <p className="trust-desc card-description">{system.description}</p>
              {system.items && system.items.length > 0 && (
                <ul className="trust-list">
                  {system.items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              <a href={system.ctaLink} className="trust-cta">{system.ctaText}</a>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST JUDGMENT */}
      <section className="section latest-judgment" id="judgment">
        <div className="section-header">
          <h2 className="section-title section-heading">LATEST JUDGMENT</h2>
          <a href="/judgment" className="view-all">VIEW ALL &rarr;</a>
        </div>
        <hr className="divider" />
        
        <div className="featured-judgment">
          <div className="judgment-meta">
            <span className="judgment-date">MAR 15, 2026</span>
            <span className="judgment-tags">CEO &middot; STRATEGY &middot; PRICING</span>
          </div>
          <h3 className="judgment-title section-heading">
            WHY WE MOVED FROM<br />
            T&M TO OUTCOME-BASED PRICING
          </h3>
          <p className="judgment-desc card-description">
            Clients wanted certainty. We wanted alignment. Here&apos;s the decision we made &mdash; and what happened next.
          </p>
          <div className="judgment-principle">
            &quot;Price for the outcome, not the hour.&quot;
          </div>
          <a href="/judgment/pricing" className="judgment-cta">READ DECISION &rarr;</a>
        </div>
      </section>

      {/* 8. FEATURED DECISION LOGS */}
      <section className="section decision-logs">
        <div className="logs-grid">
          <div className="log-entry">
            <div className="judgment-meta">
              <span className="judgment-date">FEB 03, 2026</span>
              <span className="judgment-tags">CTO &middot; TECH &middot; CRISIS</span>
            </div>
            <h4 className="log-title card-heading">THE NETSUITE API CRISIS</h4>
            <a href="/judgment/netsuite" className="log-cta">READ &rarr;</a>
          </div>
          <div className="log-entry">
            <div className="judgment-meta">
              <span className="judgment-date">JAN 10, 2026</span>
              <span className="judgment-tags">COO &middot; HIRING &middot; CULTURE</span>
            </div>
            <h4 className="log-title card-heading">WHY WE HIRED A PRINCIPAL<br />BEFORE WE NEEDED ONE</h4>
            <a href="/judgment/hiring" className="log-cta">READ &rarr;</a>
          </div>
        </div>
      </section>

      {/* 9. WHAT WE BELIEVE */}
      <section className="section what-we-believe" id="principles">
        <span className="section-label">WHAT WE BELIEVE</span>
        <blockquote className="belief-statement section-heading">
          &quot;Revenue that costs your culture<br />
          is expensive revenue.&quot;
        </blockquote>
        <div className="belief-attribution">&mdash; Decision Log</div>
        <a href="/principles" className="belief-cta">EXPLORE ALL PRINCIPLES &rarr;</a>
      </section>

      {/* 10. TRUST STATEMENT */}
      <section className="section trust-statement">
        <h2 className="trust-headline section-heading">WE WRITE DOWN THE DECISIONS.</h2>
        <p className="trust-subheadline card-description">
          Not because transparency sounds good.<br />
          Because decisions are where the work actually happens.
        </p>
        <p className="trust-body card-description">
          Every Decision Log records the context,<br />
          the choice, the alternatives rejected,<br />
          and the outcome.
        </p>
      </section>

      {/* 11. FINAL CTA */}
      <section className="section final-cta" id="contact">
        <h2 className="cta-headline section-heading">HAVE A COMPLEX PROBLEM?</h2>
        <p className="cta-subheadline card-description">Start with how we think.</p>
        <div className="cta-buttons">
          <a href="#judgment" className="cta-button primary">READ OUR JUDGMENT &rarr;</a>
          <a href="/contact" className="cta-button secondary">TALK TO FLOWTARIS &rarr;</a>
        </div>
      </section>
    </>
  );
}
