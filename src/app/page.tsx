import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let content: any = {
    eyebrow: "FLOWTARIS",
    heroTitle: "WE DON'T JUST\\nDELIVER SYSTEMS.\\nWE MAKE THE\\nDECISIONS BEHIND THEM\\nVISIBLE.",
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

  let homeSections: any = {
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

  try {
    if (supabase) {
      const { data: contentData } = await supabase.from('page_content').select('content').eq('id', 'home').single();
      if (contentData?.content) content = contentData.content;
      
      const { data: trustData } = await supabase.from('page_content').select('content').eq('id', 'systems_of_trust').single();
      if (trustData?.content) trustContent = trustData.content;
      
      const { data: homeSectionsData } = await supabase.from('page_content').select('content').eq('id', 'home_sections').single();
      if (homeSectionsData?.content) {
        homeSections = { ...homeSections, ...homeSectionsData.content };
      }
      
      const { data: pdfData } = await supabase.from('pdf_documents').select('*').order('created_at', { ascending: false });
      if (pdfData) pdfs = pdfData;
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
          <h2 className="section-title section-heading">{homeSections.latestJudgment.title}</h2>
          <a href={homeSections.latestJudgment.viewAllLink} className="view-all">{homeSections.latestJudgment.viewAllText}</a>
        </div>
        <hr className="divider" />
        
        <div className="featured-judgment">
          <div className="judgment-meta">
            <span className="judgment-date">{homeSections.latestJudgment.date}</span>
            <span className="judgment-tags">{homeSections.latestJudgment.tags}</span>
          </div>
          <h3 className="judgment-title section-heading">
            {formatText(homeSections.latestJudgment.headline)}
          </h3>
          <p className="judgment-desc card-description">
            {formatText(homeSections.latestJudgment.description)}
          </p>
          <div className="judgment-principle">
            {homeSections.latestJudgment.quote}
          </div>
          <a href={homeSections.latestJudgment.ctaLink} className="judgment-cta">{homeSections.latestJudgment.ctaText}</a>
        </div>
      </section>

      {/* 8. FEATURED DECISION LOGS */}
      <section className="section decision-logs">
        <div className="logs-grid">
          {(homeSections.featuredLogs || []).map((log: any, idx: number) => (
            <div key={log.id || idx} className="log-entry">
              <div className="judgment-meta">
                <span className="judgment-date">{log.date}</span>
                <span className="judgment-tags">{log.tags}</span>
              </div>
              <h4 className="log-title card-heading">
                {formatText(log.title)}
              </h4>
              <a href={log.ctaLink} className="log-cta">{log.ctaText}</a>
            </div>
          ))}
        </div>
      </section>

      {/* 9. WHAT WE BELIEVE */}
      <section className="section what-we-believe" id="principles">
        <span className="section-label">{homeSections.whatWeBelieve.label}</span>
        <blockquote className="belief-statement section-heading">
          {formatText(homeSections.whatWeBelieve.quote)}
        </blockquote>
        <div className="belief-attribution">{homeSections.whatWeBelieve.attribution}</div>
        <a href={homeSections.whatWeBelieve.ctaLink} className="belief-cta">{homeSections.whatWeBelieve.ctaText}</a>
      </section>

      {/* 10. TRUST STATEMENT */}
      <section className="section trust-statement">
        <h2 className="trust-headline section-heading">{homeSections.trustStatement.headline}</h2>
        <p className="trust-subheadline card-description">
          {formatText(homeSections.trustStatement.subheadline)}
        </p>
        <p className="trust-body card-description">
          {formatText(homeSections.trustStatement.body)}
        </p>
      </section>

      {/* 11. FINAL CTA */}
      <section className="section final-cta" id="contact">
        <h2 className="cta-headline section-heading">{homeSections.finalCta.headline}</h2>
        <p className="cta-subheadline card-description">{homeSections.finalCta.subheadline}</p>
        <div className="cta-buttons">
          <a href={homeSections.finalCta.primaryLink} className="cta-button primary">{homeSections.finalCta.primaryText}</a>
          <a href={homeSections.finalCta.secondaryLink} className="cta-button secondary">{homeSections.finalCta.secondaryText}</a>
        </div>
      </section>

    </>
  );
}
