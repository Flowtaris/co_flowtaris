"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";

export default function JudgmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("ALL");
  const [activeAuthor, setActiveAuthor] = useState("AUTHOR / ALL");
  const [activeYear, setActiveYear] = useState("YEAR / ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  
  const [decisionLogs, setDecisionLogs] = useState<any[]>([]);
  const [judgmentContent, setJudgmentContent] = useState<any>({
    title: "HOW WE THINK.",
    subtitle: "Written by the people making the decisions.",
    description: "Decisions made under pressure.\\nWhat we chose. What we rejected.\\nWhat happened next.",
    bridgeTitle: "THE DECISIONS BECOME PRINCIPLES.",
    bridgeSubtitle: "Repeated judgment becomes an operating system.",
    bridgeCtaText: "EXPLORE PRINCIPLES →",
    bridgeCtaLink: "/principles"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/content/co?table=page_content&id=judgment');
        const { data } = await res.json();
        const content = data && data.length > 0 ? data[0].content : null;

        if (content) {
          setJudgmentContent({
            title: content.title || "HOW WE THINK.",
            subtitle: content.subtitle || "Written by the people making the decisions.",
            description: content.description || "Decisions made under pressure.\\nWhat we chose. What we rejected.\\nWhat happened next.",
            bridgeTitle: content.bridgeTitle || "THE DECISIONS BECOME PRINCIPLES.",
            bridgeSubtitle: content.bridgeSubtitle || "Repeated judgment becomes an operating system.",
            bridgeCtaText: content.bridgeCtaText || "EXPLORE PRINCIPLES →",
            bridgeCtaLink: content.bridgeCtaLink || "/principles"
          });
          if (content.logs) {
            setDecisionLogs(content.logs);
          }
        } else {
          // Fallback default logs if not found
          setDecisionLogs([
            { id: "01", date: "15 MAR 2026", author: "CEO", tags: ["STRATEGY", "PRICING"], title: "WHY WE MOVED FROM\nT&M TO OUTCOME-BASED PRICING", excerpt: "Clients wanted certainty. We wanted alignment.\nHere's the model that works for both -- and the\nthree clients who said no.", principle: "Price for the outcome, not the hour.", href: "/judgment/pricing" },
            { id: "02", date: "03 FEB 2026", author: "CTO", tags: ["TECH", "CRISIS"], title: "THE NETSUITE 2024.2 API CRISIS", excerpt: "47 clients. Six weeks. One platform change\nthat couldn't wait.", principle: "Platform risk is our risk. We absorb it.", href: "/judgment/netsuite" },
            { id: "03", date: "10 JAN 2026", author: "COO", tags: ["HIRING", "CULTURE"], title: "WHY WE HIRED A PRINCIPAL\nBEFORE WE NEEDED ONE", excerpt: "Capacity planning isn't about today's utilization.\nIt's about tomorrow's risk.", principle: "Hire for the crisis, not the comfort.", href: "/judgment/hiring" }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const formatText = (text: any) => {
    if (!text) return null;
    if (typeof text !== 'string') {
      if (text.statement) return text.statement; // Handle principle object
      return JSON.stringify(text);
    }
    return text.split(/\\n|\n/).map((line: string, i: number, arr: string[]) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  const availableTags = useMemo(() => ["ALL", ...Array.from(new Set(decisionLogs.flatMap(log => log.tags || [])))], [decisionLogs]);
  const availableAuthors = useMemo(() => ["AUTHOR / ALL", ...Array.from(new Set(decisionLogs.map(log => log.author).filter(Boolean)))], [decisionLogs]);
  const availableYears = ["YEAR / ALL", "YEAR / 2026"];

  // Filter logic
  const filteredLogs = decisionLogs.filter((log) => {
    // 1. Search filter
    const principleText = typeof log.principle === 'string' ? log.principle : (log.principle?.statement || "");
    const matchesSearch = 
      searchQuery === "" || 
      (log.title && log.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.excerpt && log.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (principleText.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Tag filter
    const matchesTag = activeTag === "ALL" || log.tags.includes(activeTag);

    // 3. Author filter
    const matchesAuthor = activeAuthor === "AUTHOR / ALL" || log.author === activeAuthor;

    // 4. Year filter
    // All our current logs are 2026. If we extract year from date: "15 MAR 2026"
    const matchesYear = activeYear === "YEAR / ALL" || log.date.includes("2026");

    return matchesSearch && matchesTag && matchesAuthor && matchesYear;
  });

  const displayedLogs = filteredLogs.slice(0, visibleCount);

  return (
    <>
      {/* 1. Page Introduction */}
      <section className="section hero">
        <span className="eyebrow">JUDGMENT</span>
        <h1 className="hero-headline" style={{ fontSize: "5rem", marginBottom: "24px" }}>{formatText(judgmentContent.title)}</h1>
        <div className="hero-supporting" style={{ color: "var(--color-text-primary)", fontSize: "1.5rem", marginBottom: "16px" }}>
          {formatText(judgmentContent.subtitle)}
        </div>
        <div className="hero-supporting" style={{ fontSize: "1.125rem", maxWidth: "500px", marginBottom: "48px" }}>
          {formatText(judgmentContent.description)}
        </div>
        <div className="judgment-meta" style={{ width: "100%", justifyContent: "space-between", borderTop: "1px solid var(--color-structural)", paddingTop: "24px", marginBottom: 0 }}>
          <span>{filteredLogs.length < 10 ? `0${filteredLogs.length}` : filteredLogs.length} LOGS</span>
          <span>2026</span>
        </div>
      </section>

      {/* 2. Search + Filter System */}
      <section className="section judgment-filters-section">
        <div className="judgment-filters">
          <div className="filter-search-wrap">
            <input
              type="text"
              className="filter-search"
              placeholder="Search decisions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(10);
              }}
              aria-label="Search decisions"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-tags">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag ${activeTag === tag ? "active" : ""}`}
                  onClick={() => {
                    setActiveTag(tag);
                    setVisibleCount(10);
                  }}
                  aria-pressed={activeTag === tag}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="filter-dropdowns">
              <select 
                className="filter-select"
                value={activeAuthor}
                onChange={(e) => {
                  setActiveAuthor(e.target.value);
                  setVisibleCount(10);
                }}
                aria-label="Filter by author"
              >
                {availableAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
              
              <select 
                className="filter-select"
                value={activeYear}
                onChange={(e) => {
                  setActiveYear(e.target.value);
                  setVisibleCount(10);
                }}
                aria-label="Filter by year"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Results Header & Archive */}
      <section className="section">
        <div className="results-header">
          <span>DECISION LOGS</span>
          <span>{filteredLogs.length < 10 ? `0${filteredLogs.length}` : filteredLogs.length} RESULTS</span>
        </div>
        
        <div className="decision-archive">
          {displayedLogs.map((log, index) => (
            <div key={log.id} className={`decision-record ${index === 0 ? "featured" : ""}`}>
              <div className="judgment-meta">
                <span>{log.date}</span>
                <span className="judgment-tags">{log.author} &middot; {(log.tags || []).join(" \u00B7 ")}</span>
              </div>
              <h2 className="judgment-title section-heading" style={{ maxWidth: index === 0 ? "none" : "800px" }}>{formatText(log.title)}</h2>
              <div className="judgment-desc" style={{ whiteSpace: "normal", maxWidth: index === 0 ? "700px" : "600px", fontSize: index === 0 ? "1.5rem" : "1.125rem" }}>
                {log.excerpt ? formatText(log.excerpt) : "See details in decision log."}
              </div>
              <div className="judgment-principle">
                {formatText(log.principle)}
              </div>
              <a href={log.href} className="judgment-cta" style={{ alignSelf: "flex-start", marginTop: "8px" }}>READ DECISION &rarr;</a>
            </div>
          ))}
          {filteredLogs.length === 0 && !loading && (
            <div className="decision-record" style={{ textAlign: "center", padding: "64px" }}>
              <div className="judgment-desc" style={{ margin: "0 auto 24px" }}>No decisions match your current filters.</div>
              <button 
                className="judgment-cta" 
                style={{ background: "transparent", border: "none", cursor: "pointer", alignSelf: "center", borderBottom: "1px solid var(--color-text-primary)" }}
                onClick={() => {
                  setSearchQuery("");
                  setActiveTag("ALL");
                  setActiveAuthor("AUTHOR / ALL");
                  setActiveYear("YEAR / 2026");
                  setVisibleCount(10);
                }}
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
          {loading && (
            <div className="decision-record" style={{ textAlign: "center", padding: "64px" }}>
              <div className="judgment-desc" style={{ margin: "0 auto 24px" }}>Loading logs...</div>
            </div>
          )}
        </div>
        
        {/* Load More */}
        {visibleCount < filteredLogs.length && (
          <div className="load-more-section">
            <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 10)}>
              LOAD 10 MORE <span className="arrow">&darr;</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. Principles Bridge */}
      <section className="section final-cta" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 className="cta-headline section-heading">{judgmentContent.bridgeTitle}</h2>
        <div className="cta-subheadline">{judgmentContent.bridgeSubtitle}</div>
        <a href={judgmentContent.bridgeCtaLink} className="judgment-cta">{judgmentContent.bridgeCtaText}</a>
      </section>
    </>
  );
}
