"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PrinciplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");

  const [decisionLogs, setDecisionLogs] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch principles page content
      let pageRes: any = null;
      if (supabase) {
        const { data } = await supabase.from("page_content").select("content").eq("id", "principles").single();
        pageRes = data;
      }
      if (pageRes?.content) {
        setPageData(pageRes.content);
      } else {
        setPageData({
          hero: { eyebrow: "PRINCIPLES", title: "WHAT WE BELIEVE\nAFTER MAKING THE\nDECISION.", subtitle: "Principles extracted from the decisions we've actually made.", stats: ["08 PRINCIPLES", "05 YEARS", "UPDATED AUTOMATICALLY"] },
          intro: { title: "THESE AREN'T BRAND VALUES.", subtitle: "They're conclusions.", body: "Each principle came from a decision:\nsomething we chose,\nsomething we rejected,\nand something we learned." },
          relationship: { steps: [{ label: "DECISION", color: "default" }, { label: "OUTCOME", color: "default" }, { label: "PRINCIPLE", color: "accent" }, { label: "FUTURE DECISIONS", color: "default" }], footer1: "A principle isn't written first.", footer2: "It is earned through a decision." },
          evolved: { title: "HOW THE PRINCIPLES EVOLVED", years: ["2019", "2020", "2022", "2023", "2024"] },
          explore: { title: "EXPLORE PRINCIPLES", categories: ["CRISIS", "CULTURE", "STRATEGY", "TECH"] },
          featured: { label: "FEATURED PRINCIPLE" },
          indexSection: { title: "PRINCIPLES" },
          judgmentConnection: { title: "EVERY PRINCIPLE HAS A HISTORY.", desc: "READ THE DECISIONS\nTHAT CREATED THEM.", cta: "EXPLORE JUDGMENT →" },
          evidenceConnection: { title: "PRINCIPLES → DECISIONS → EVIDENCE", steps: [{ label: "What we believe", color: "default" }, { label: "What we decided", color: "default" }, { label: "How we operate", color: "accent" }], cta: "EXPLORE EVIDENCE →" },
          closing: { title: "PRINCIPLES AREN'T PROMISES.", desc: "THEY'RE THE PATTERNS WE KEEP\nAFTER THE DECISION IS MADE." }
        });
      }

      // Fetch logs
      let logsRes: any = null;
      if (supabase) {
        const { data } = await supabase.from("page_content").select("content").eq("id", "judgment").single();
        logsRes = data;
      }
      if (logsRes?.content?.logs) {
        setDecisionLogs(logsRes.content.logs);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const principles = useMemo(() => {
    return decisionLogs.map(log => {
      const yearMatch = log.date?.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : "Unknown";
      
      return {
        id: log.slug,
        statement: log.principle?.statement?.replace(/\n/g, " ") || "",
        category: log.principle?.category?.toUpperCase() || "UNKNOWN",
        sourceTitle: log.title?.replace(/\n/g, " ") || "",
        sourceSlug: log.slug,
        year: year,
        outcome: log.outcome?.metrics?.map((m: any) => `${m.value} ${m.label}`).join(" \u00B7 ") || log.outcome?.timeframe || "",
        isHidden: log.isHidden === true
      };
    }).filter(p => p.statement !== "" && !p.isHidden); // remove if no principle or hidden
  }, [decisionLogs]);

  const totalCount = principles.length;
  
  const years = useMemo(() => {
    return pageData?.evolved?.years || [];
  }, [pageData]);
  
  const yearSpan = years.length > 1 ? parseInt(years[years.length - 1]) - parseInt(years[0]) : (years.length === 1 ? 1 : 0);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(principles.map(p => p.category))).sort();
    return ["ALL", ...uniqueCats];
  }, [principles]);

  const filteredPrinciples = principles.filter(p => {
    const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchYear = selectedYear === "ALL" || p.year === selectedYear;
    return matchCat && matchYear;
  });

  const featuredPrinciple = useMemo(() => {
    if (!principles || principles.length === 0) return null;
    if (pageData?.featured?.principleSlug) {
      const found = principles.find(p => p.sourceSlug === pageData.featured.principleSlug);
      if (found) return found;
    }
    return principles[0];
  }, [principles, pageData]);

  if (loading || !pageData) {
    return <div style={{ paddingTop: '120px', padding: '40px' }}>Loading...</div>;
  }

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/judgment" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; JUDGMENT</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ PRINCIPLES</span>
      </div>

      {/* Hero */}
      <section className="section ev-hero" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <span className="eyebrow">{pageData.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px', fontSize: '4rem', margin: '16px 0 32px 0' }} dangerouslySetInnerHTML={{ __html: (pageData.hero.title || "").replace(/\n/g, '<br />') }}></h1>
        <p className="card-description ev-subtitle" style={{ maxWidth: '600px', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (pageData.hero.subtitle || "").replace(/\n/g, '<br />') }}></p>

        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', borderTop: '1px solid var(--color-structural)', paddingTop: '32px' }}>
          {(pageData.hero.stats || []).map((stat: string, idx: number, arr: any[]) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="trust-body" style={{ fontWeight: 500, letterSpacing: '0.05em', color: idx === arr.length - 1 ? 'var(--color-accent)' : 'inherit' }}>
                {stat}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '64px', borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>{pageData.intro.title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="trust-body" style={{ fontSize: '1.5rem', margin: 0 }}>{pageData.intro.subtitle}</p>
          <p className="trust-body" style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: 0 }} dangerouslySetInnerHTML={{ __html: (pageData.intro.body || "").replace(/\n/g, '<br />') }}></p>
        </div>
      </section>

      {/* Principle / Decision Relationship */}
      <section className="section" style={{ paddingBottom: '64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '64px', backgroundColor: 'var(--color-surface)', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          
          {(pageData.relationship.steps || []).map((step: any, idx: number, arr: any[]) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <span className="card-heading" style={{ letterSpacing: '0.1em', color: step.color === 'accent' ? 'var(--color-accent)' : 'inherit' }}>{step.label}</span>
              {idx < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)' }}>&darr;</span>}
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--color-structural)', width: '100%', marginTop: '32px', paddingTop: '32px' }}>
            <p className="trust-body" style={{ fontSize: '1.25rem', margin: 0 }}>{pageData.relationship.footer1}</p>
            <p className="trust-body" style={{ fontSize: '1.25rem', margin: '8px 0 0 0', color: 'var(--color-text-secondary)' }}>{pageData.relationship.footer2}</p>
          </div>
        </div>
      </section>

      {/* How the Principles Evolved (Timeline) */}
      {years.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)', paddingBottom: '64px' }}>
          <h2 className="section-label" style={{ marginBottom: '48px' }}>{pageData.evolved.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', overflowX: 'auto', paddingBottom: '16px' }}>
            <button 
              onClick={() => setSelectedYear("ALL")}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: selectedYear === "ALL" ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              className="card-heading"
            >
              {pageData?.evolved?.allLabel || "ALL YEARS"}
            </button>
            <span style={{ color: 'var(--color-structural)' }}>&mdash;</span>
            {years.map((year, idx) => (
              <div key={year} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <button 
                  onClick={() => setSelectedYear(year)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: selectedYear === year ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  className="card-heading"
                >
                  {year}
                </button>
                {idx < years.length - 1 && <span style={{ color: 'var(--color-structural)' }}>&mdash;</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explore Principles Filter */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', paddingBottom: '32px' }}>
        <h2 className="section-label" style={{ marginBottom: '32px' }}>{pageData.explore.title}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="card-heading"
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 4px 0',
                cursor: 'pointer',
                color: selectedCategory === cat ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                borderBottom: selectedCategory === cat ? '1px solid var(--color-text-primary)' : '1px solid transparent'
              }}
            >
              {cat === "ALL" ? (pageData?.explore?.allLabel || "ALL") : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Principle */}
      {featuredPrinciple && selectedCategory === "ALL" && selectedYear === "ALL" && (
        <section className="section" style={{ paddingBottom: '64px' }}>
          <div className="ev-panel" style={{ padding: '64px', backgroundColor: 'var(--color-surface)' }}>
            <span className="section-label" style={{ marginBottom: '24px', display: 'block' }}>{pageData.featured.label || "FEATURED PRINCIPLE"}</span>
            <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px', maxWidth: '800px' }}>
              {featuredPrinciple.statement}
            </h3>
            <p className="trust-body" style={{ fontSize: '1.25rem', marginBottom: '48px', maxWidth: '600px' }}>
              {pageData.featured.outcomeLabel || "A decision driven by the outcome:"}<br />
              <span style={{ color: 'var(--color-text-secondary)' }}>{featuredPrinciple.outcome}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="section-label" style={{ fontSize: '0.75rem', margin: 0 }}>{pageData.featured.originLabel || "ORIGIN"}</span>
              <span className="card-heading" style={{ color: 'var(--color-text-secondary)' }}>
                {featuredPrinciple.sourceTitle.toUpperCase()} &middot; {featuredPrinciple.year}
              </span>
              <Link href={`/judgment/${featuredPrinciple.sourceSlug}`} className="judgment-cta" style={{ marginTop: '16px' }}>
                {pageData.featured.cta || "READ THE DECISION →"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Principle Index */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '64px' }}>{pageData.indexSection.title}</h2>
        
        {filteredPrinciples.length === 0 ? (
          <p className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>{pageData?.indexSection?.emptyText || "No principles match this filter."}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {categories.filter(c => c !== "ALL" && (selectedCategory === "ALL" || selectedCategory === c)).map(cat => {
              const catPrinciples = filteredPrinciples.filter(p => p.category === cat);
              if (catPrinciples.length === 0) return null;

              return (
                <div key={cat} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px', marginBottom: '32px' }}>
                    <span className="card-heading" style={{ letterSpacing: '0.1em' }}>
                      {cat} &middot; {String(catPrinciples.length).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {catPrinciples.map((p, idx) => (
                      <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className="section-heading" style={{ fontSize: '2rem', maxWidth: '800px', margin: 0 }}>
                          {p.statement}
                        </h3>
                        
                        {/* The interactive expansion area */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className="section-label" style={{ fontSize: '0.75rem', margin: 0 }}>ORIGIN DECISION</span>
                            <span className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>{p.sourceTitle}</span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className="section-label" style={{ fontSize: '0.75rem', margin: 0 }}>YEAR</span>
                            <span className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>{p.year}</span>
                          </div>

                          <Link href={`/judgment/${p.sourceSlug}`} className="judgment-cta" style={{ marginLeft: 'auto' }}>
                            READ DECISION &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Decision Log Connection */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{pageData.judgmentConnection.title}</h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '48px', color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: (pageData.judgmentConnection.desc || "").replace(/\n/g, '<br />') }}></p>
        <Link href="/judgment" className="judgment-cta">{pageData.judgmentConnection.cta}</Link>
      </section>

      {/* Evidence Connection */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{pageData.evidenceConnection.title}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }}>
          {(pageData.evidenceConnection.steps || []).map((step: any, idx: number, arr: any[]) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <span className="card-heading" style={{ fontSize: '1.25rem', color: step.color === 'accent' ? 'var(--color-accent)' : 'inherit' }}>{step.label}</span>
              {idx < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.5rem' }}>&darr;</span>}
            </div>
          ))}
        </div>
        
        <Link href="/evidence" className="judgment-cta">{pageData.evidenceConnection.cta}</Link>
      </section>

      {/* Closing Statement */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div className="ev-panel" style={{ padding: '64px' }}>
          <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '32px' }}>
            {pageData.closing.title}
          </h2>
          <p className="trust-body" style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', margin: 0 }} dangerouslySetInnerHTML={{ __html: (pageData.closing.desc || "").replace(/\n/g, '<br />') }}></p>
        </div>
      </section>
    </>
  );
}
