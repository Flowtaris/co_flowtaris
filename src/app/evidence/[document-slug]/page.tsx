"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

// Mock Data Model to drive the dynamic route
const evidenceData: Record<string, any> = {
  "information-security-policy": {
    slug: "information-security-policy",
    category: "SECURITY",
    title: "INFORMATION SECURITY POLICY",
    version: "1.4",
    lastReviewed: "MARCH 2026",
    status: "CURRENT",
    summary: "The definitive policy governing how information is handled, secured, and classified across all Flowtaris enterprise systems and operations.",
    owner: "CTO / Security",
    reviewCycle: "Quarterly",
    classification: "Public",
    fileSize: "2.4 MB",
    pageCount: 18,
    fileFormat: "PDF",
    hasRealFile: false,
    accessLevel: "PUBLIC",
    tableOfContents: [
      { id: "01", title: "Purpose" },
      { id: "02", title: "Scope" },
      { id: "03", title: "Responsibilities" },
      { id: "04", title: "Access Control" },
      { id: "05", title: "Data Protection" },
      { id: "06", title: "Incident Response" },
      { id: "07", title: "Business Continuity" },
      { id: "08", title: "Review" }
    ],
    relatedEvidence: [
      { slug: "incident-response-plan", title: "INCIDENT RESPONSE PLAN", category: "Security" },
      { slug: "business-continuity-plan", title: "BUSINESS CONTINUITY PLAN", category: "Operations" },
      { slug: "access-control-policy", title: "ACCESS CONTROL POLICY", category: "Security" }
    ],
    relatedDecisions: [
      { slug: "netsuite", title: "THE NETSUITE CRISIS", desc: "A decision about architecture, maintenance and long-term operational risk.", meta: "CTO \u00B7 TECH \u00B7 STRATEGY" }
    ],
    history: [
      { version: "1.4", date: "MAR 2026", change: "Annual review" },
      { version: "1.3", date: "SEP 2025", change: "Policy update" },
      { version: "1.2", date: "MAR 2025", change: "Control revision" },
      { version: "1.1", date: "SEP 2024", change: "Minor update" }
    ],
    previousDocument: null,
    nextDocument: { slug: "incident-response-plan", title: "INCIDENT RESPONSE PLAN" }
  },
  "soc-2-report": {
    slug: "soc-2-report",
    category: "SECURITY",
    title: "SOC 2 TYPE II REPORT",
    version: "2025",
    lastReviewed: "JANUARY 2026",
    status: "RESTRICTED",
    summary: "Independent auditor's report on the security, availability, and confidentiality controls at Flowtaris.",
    owner: "CTO / Security",
    reviewCycle: "Annual",
    classification: "Confidential",
    fileSize: "4.8 MB",
    pageCount: 62,
    fileFormat: "PDF",
    hasRealFile: false,
    accessLevel: "RESTRICTED",
    tableOfContents: [],
    relatedEvidence: [
      { slug: "information-security-policy", title: "INFORMATION SECURITY POLICY", category: "Security" }
    ],
    relatedDecisions: [],
    history: [],
    previousDocument: { slug: "information-security-policy", title: "INFORMATION SECURITY POLICY" },
    nextDocument: null
  }
};

export default function EvidenceDocumentPage() {
  const params = useParams();
  const rawSlug = params?.["document-slug"] as string || "";
  
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeToc, setActiveToc] = useState<string>("01");
  const [zoom, setZoom] = useState<number>(100);
  const [page, setPage] = useState<number>(1);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  useEffect(() => {
    async function fetchDoc() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/co?table=page_content&id=evidence_doc_${rawSlug}`);
        const { data: resData } = await res.json();
        if (resData && resData.length > 0 && resData[0].content) {
          setDoc(resData[0].content);
        } else {
          setDoc(evidenceData[rawSlug] || null);
        }
      } catch (e) {
        setDoc(evidenceData[rawSlug] || null);
      }
      setLoading(false);
    }
    fetchDoc();
  }, [rawSlug]);

  // If no document is found in our mock or database
  if (loading) {
    return (
      <div className="section" style={{ paddingTop: '120px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="section" style={{ paddingTop: '120px', minHeight: '60vh' }}>
        <h1 className="section-heading" style={{ fontSize: '3rem' }}>DOCUMENT NOT FOUND</h1>
        <p className="card-description">The requested evidence could not be found.</p>
        <Link href="/evidence" className="judgment-cta" style={{ marginTop: '32px' }}>&larr; RETURN TO EVIDENCE</Link>
      </div>
    );
  }

  const isRestricted = doc.accessLevel === "RESTRICTED";

  return (
    <>
      {/* Breadcrumb */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/evidence" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; EVIDENCE</Link>
        <span className="view-all" style={{ color: "var(--color-text-secondary)", marginLeft: '8px' }}>/ {doc.category}</span>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ {doc.title}</span>
      </div>

      {/* Document Header */}
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>{doc.category}</span>
        <h1 className="section-heading ev-title" style={{ fontSize: '3.5rem', marginBottom: '16px', maxWidth: '1000px' }}>
          {doc.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span className="trust-body" style={{ fontWeight: 500 }}>Version {doc.version}</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>&middot;</span>
          <span className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>Last reviewed {doc.lastReviewed}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {doc.status === "CURRENT" && (
            <span className="section-label" style={{ margin: 0, color: 'var(--color-text-primary)' }}>CURRENT</span>
          )}
          {doc.status === "RESTRICTED" && (
            <span className="section-label" style={{ margin: 0, color: 'var(--color-accent)' }}>RESTRICTED</span>
          )}
          
          {!isRestricted && (
            <button className="judgment-cta" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
              DOWNLOAD PDF &rarr;
            </button>
          )}
        </div>
      </section>

      {/* Document Summary */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div className="ev-panel" style={{ padding: '48px', backgroundColor: 'var(--color-bg)' }}>
          <span className="section-label" style={{ marginBottom: '24px', display: 'block' }}>ABOUT THIS DOCUMENT</span>
          <p className="trust-body" style={{ fontSize: '1.25rem', maxWidth: '800px', marginBottom: '48px' }}>
            {doc.summary}
          </p>
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>DOCUMENT OWNER</span>
              <span className="card-heading">{doc.owner}</span>
            </div>
            {doc.reviewCycle && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>REVIEW CYCLE</span>
                <span className="card-heading">{doc.reviewCycle}</span>
              </div>
            )}
            {doc.classification && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>CLASSIFICATION</span>
                <span className="card-heading">{doc.classification}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Access Control Intercept for Restricted Documents */}
      {isRestricted ? (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <div className="ev-panel" style={{ padding: '64px', backgroundColor: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>THIS DOCUMENT REQUIRES ACCESS</h2>
            <p className="trust-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '48px', maxWidth: '500px' }}>
              Some evidence is available only to verified business contacts.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <label className="section-label" style={{ margin: 0 }}>WORK EMAIL</label>
                <input type="email" className="ev-access-input" placeholder="name@company.com" />
              </div>
              <button className="judgment-cta" style={{ width: '100%', textAlign: 'center', marginTop: '16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--color-text-primary)' }}>
                REQUEST ACCESS &rarr;
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Document Viewer & TOC (for non-restricted) */
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)', paddingTop: '0', paddingBottom: '64px', paddingLeft: 0, paddingRight: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            
            {/* Desktop TOC (hidden on small screens via standard css patterns if we were to write them, here handled via flex) */}
            {doc.tableOfContents && doc.tableOfContents.length > 0 && (
              <div style={{ width: '100%', maxWidth: '300px', borderRight: '1px solid var(--color-structural)', padding: '64px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <span className="section-label" style={{ marginBottom: 0 }}>CONTENTS</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {doc.tableOfContents.map((t: any) => (
                    <button 
                      key={t.id}
                      onClick={() => setActiveToc(t.id)}
                      style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        alignItems: 'baseline',
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span className="trust-body" style={{ color: activeToc === t.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: activeToc === t.id ? 500 : 400 }}>{t.id}</span>
                      <span className="trust-body" style={{ color: activeToc === t.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: activeToc === t.id ? 500 : 400, borderBottom: activeToc === t.id ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                        {t.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile TOC Accordion (Simple Toggle logic) */}
            <div style={{ width: '100%', padding: '24px', borderBottom: '1px solid var(--color-structural)', display: doc.tableOfContents?.length ? 'block' : 'none' }}>
              <button 
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
                className="section-label"
              >
                CONTENTS {mobileTocOpen ? '▴' : '▾'}
              </button>
              {mobileTocOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                  {doc.tableOfContents.map((t: any) => (
                    <div key={t.id} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                      <span className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>{t.id}</span>
                      <span className="trust-body">{t.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Viewer Area */}
            <div style={{ flex: 1, minWidth: '320px', backgroundColor: '#E7E0D4', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Viewer Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '800px', marginBottom: '24px' }}>
                <span className="trust-body" style={{ fontWeight: 500 }}>PAGE {String(page).padStart(2, '0')} / {String(doc.pageCount).padStart(2, '0')}</span>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span className="trust-body">{zoom}%</span>
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))} style={{ background: 'none', border: '1px solid var(--color-structural)', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&minus;</button>
                  <button onClick={() => setZoom(Math.min(200, zoom + 10))} style={{ background: 'none', border: '1px solid var(--color-structural)', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#43;</button>
                </div>
              </div>

              {/* Fake Document Page */}
              <div style={{ 
                width: '100%', 
                maxWidth: '800px', 
                backgroundColor: '#F8F5EF', 
                minHeight: '800px', 
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                padding: '64px',
                display: 'flex',
                flexDirection: 'column',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease'
              }}>
                <div style={{ borderBottom: '1px solid var(--color-structural)', paddingBottom: '24px', marginBottom: '48px' }}>
                  <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '8px' }}>{doc.title}</h2>
                  <span className="card-heading" style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Flowtaris Technologies Pvt Ltd</span>
                  <span className="trust-body" style={{ display: 'block' }}>Version {doc.version}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 className="card-heading">01 PURPOSE</h3>
                  <p className="trust-body" style={{ color: 'var(--color-text-primary)' }}>
                    {doc.summary}
                  </p>
                  <p className="trust-body" style={{ color: 'var(--color-text-secondary)' }}>
                    [ This is a simulated document viewer environment since an actual source PDF file is not available in the local project repository. ]
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Document Information (Metadata) */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>DOCUMENT INFORMATION</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>DOCUMENT TYPE</span>
            <span className="trust-body" style={{ fontWeight: 500 }}>{doc.category} Policy</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>OWNER</span>
            <span className="trust-body" style={{ fontWeight: 500 }}>{doc.owner}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>VERSION</span>
            <span className="trust-body" style={{ fontWeight: 500 }}>{doc.version}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>LAST REVIEWED</span>
            <span className="trust-body" style={{ fontWeight: 500 }}>{doc.lastReviewed}</span>
          </div>
          {doc.nextReview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>NEXT REVIEW</span>
              <span className="trust-body" style={{ fontWeight: 500 }}>{doc.nextReview}</span>
            </div>
          )}
          {doc.classification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>CLASSIFICATION</span>
              <span className="trust-body" style={{ fontWeight: 500 }}>{doc.classification}</span>
            </div>
          )}
        </div>
      </section>

      {/* Related Evidence */}
      {doc.relatedEvidence && doc.relatedEvidence.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <h2 className="section-label" style={{ marginBottom: '48px' }}>RELATED EVIDENCE</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
            {doc.relatedEvidence.map((rel: any) => (
              <div key={rel.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-structural)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="card-heading">{rel.title}</span>
                  <span className="trust-body" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{rel.category}</span>
                </div>
                <Link href={`/evidence/${rel.slug}`} className="judgment-cta">VIEW &rarr;</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Decisions */}
      {doc.relatedDecisions && doc.relatedDecisions.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <h2 className="section-label" style={{ marginBottom: '48px' }}>RELATED DECISIONS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
            {doc.relatedDecisions.map((dec: any) => (
              <div key={dec.slug} className="ev-panel" style={{ padding: '48px', backgroundColor: 'var(--color-surface)' }}>
                <h3 className="section-heading" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{dec.title}</h3>
                <p className="trust-body" style={{ marginBottom: '24px' }}>{dec.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="section-label" style={{ margin: 0, fontSize: '0.75rem' }}>{dec.meta}</span>
                  <Link href={`/judgment/${dec.slug}`} className="judgment-cta">READ DECISION &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Document History */}
      {doc.history && doc.history.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <h2 className="section-label" style={{ marginBottom: '48px' }}>DOCUMENT HISTORY</h2>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-text-secondary)', paddingBottom: '16px', marginBottom: '16px' }}>
              <span className="section-label" style={{ width: '100px', margin: 0 }}>VERSION</span>
              <span className="section-label" style={{ width: '150px', margin: 0 }}>DATE</span>
              <span className="section-label" style={{ flex: 1, margin: 0 }}>CHANGE</span>
            </div>
            {doc.history.map((h: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--color-structural)' }}>
                <span className="trust-body" style={{ width: '100px' }}>{h.version}</span>
                <span className="trust-body" style={{ width: '150px', color: 'var(--color-text-secondary)' }}>{h.date}</span>
                <span className="trust-body" style={{ flex: 1 }}>{h.change}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Download Area (Only if not restricted) */}
      {!isRestricted && (
        <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
          <div className="ev-panel" style={{ padding: '48px', backgroundColor: 'var(--color-bg)', maxWidth: '800px' }}>
            <h2 className="section-heading" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>NEED THE ORIGINAL FILE?</h2>
            <p className="trust-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
              Download the source document for your records.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-structural)', paddingTop: '24px' }}>
              <span className="trust-body" style={{ fontWeight: 500 }}>
                {doc.fileFormat} &middot; {doc.fileSize} &middot; VERSION {doc.version}
              </span>
              <button className="judgment-cta" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                DOWNLOAD ORIGINAL &rarr;
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Evidence Principle */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', paddingBottom: '64px' }}>
        <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: '32px' }}>
          A CLAIM IS STRONGER<br />WHEN YOU CAN OPEN THE DOCUMENT.
        </h2>
        <Link href="/evidence" className="judgment-cta">EXPLORE THE EVIDENCE CENTER &rarr;</Link>
      </section>

      {/* Previous / Next Navigation */}
      <section className="section">
        <div className="dl-prev-next-inner">
          {doc.previousDocument ? (
            <Link href={`/evidence/${doc.previousDocument.slug}`} className="dl-nav-link dl-nav-prev">
              <span className="dl-nav-direction">&larr; PREVIOUS DOCUMENT</span>
              <span className="dl-nav-title">{doc.previousDocument.title}</span>
            </Link>
          ) : (
            <div className="dl-nav-link dl-nav-prev" style={{ visibility: 'hidden' }}></div>
          )}
          
          {doc.nextDocument ? (
            <Link href={`/evidence/${doc.nextDocument.slug}`} className="dl-nav-link dl-nav-next">
              <span className="dl-nav-direction">NEXT DOCUMENT &rarr;</span>
              <span className="dl-nav-title">{doc.nextDocument.title}</span>
            </Link>
          ) : (
            <div className="dl-nav-link dl-nav-next" style={{ visibility: 'hidden' }}></div>
          )}
        </div>
      </section>
    </>
  );
}
