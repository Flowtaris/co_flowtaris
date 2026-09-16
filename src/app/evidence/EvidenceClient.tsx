"use client";

import { useState } from "react";
import Link from "next/link";

export default function EvidenceClient({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(data.categories?.[0] || "SECURITY");

  const scrollTo = (id: string) => {
    setActiveTab(id.toUpperCase());
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Hero */}
      <section className="section ev-hero">
        <span className="eyebrow">{data.hero.eyebrow}</span>
        <h1 className="section-heading ev-title" dangerouslySetInnerHTML={{ __html: (data.hero.title || "").replace(/\n/g, '<br />') }}></h1>
        <p className="card-description ev-subtitle" dangerouslySetInnerHTML={{ __html: (data.hero.subtitle || "").replace(/\n/g, '<br />') }}></p>
        <p className="trust-body ev-body" style={{ maxWidth: '600px' }} dangerouslySetInnerHTML={{ __html: (data.hero.body || "").replace(/\n/g, '<br />') }}></p>
        <div className="ev-stats">
          {(data.hero.stats || []).map((stat: string, i: number) => (
            <span key={i} className="ev-stat">{stat}</span>
          ))}
        </div>
      </section>

      {/* 2. Category Navigation */}
      <section className="section ev-nav-section" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <nav className="p-nav">
          {(data.categories || []).map((cat: string) => (
            <button 
              key={cat}
              className={`p-nav-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => scrollTo(cat.toLowerCase())}
            >
              {cat}
            </button>
          ))}
        </nav>
      </section>

      {/* 3. Editorial Panels */}
      <section className="section ev-panels-section">
        {(data.panels || []).map((panel: any, i: number) => (
          <div className="ev-panel" id={panel.id} key={i}>
            <span className="ev-panel-num">{panel.num}</span>
            <h2 className="ev-panel-title">{panel.title}</h2>
            <p className="ev-panel-desc" dangerouslySetInnerHTML={{ __html: (panel.desc || "").replace(/\n/g, '<br />') }}></p>
            <div className="ev-panel-docs">
              {(panel.docs || []).map((doc: string, j: number) => (
                <span key={j}>{doc}</span>
              ))}
            </div>
            <button onClick={() => scrollTo("library")} className="judgment-cta" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {panel.cta}
            </button>
          </div>
        ))}
      </section>

      {/* 4. Document Library */}
      <section className="section ev-library-section" id="library">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.library.title}</h2>
        <div className="ev-table-container">
          <table className="ev-table">
            <thead>
              <tr>
                <th className="ev-th">DOCUMENT</th>
                <th className="ev-th">TYPE</th>
                <th className="ev-th">UPDATED</th>
                <th className="ev-th" style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {(data.library.documents || []).map((doc: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name">{doc.name.toUpperCase()}</td>
                  <td className="ev-td">{doc.type}</td>
                  <td className="ev-td">{doc.updated}</td>
                  <td className="ev-td" style={{ textAlign: 'right' }}>
                    <a href="#" className="judgment-cta ev-dl-link">DOWNLOAD &rarr;</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Questionnaire Center */}
      <section className="section ev-questionnaire-section" id="questionnaire">
        <div className="ev-q-inner">
          <h2 className="section-label">{data.questionnaire.label}</h2>
          <h3 className="section-heading ev-q-title" style={{ maxWidth: '900px', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: (data.questionnaire.title || "").replace(/\n/g, '<br />') }}>
          </h3>
          <p className="card-description ev-q-desc" style={{ maxWidth: '700px', marginBottom: '64px' }} dangerouslySetInnerHTML={{ __html: (data.questionnaire.desc || "").replace(/\n/g, '<br />') }}>
          </p>
          
          <div className="ev-q-grid">
            {(data.questionnaire.items || []).map((q: any, i: number) => (
              <div key={i} className="ev-q-card">
                <span className="ev-q-name">{q.name}</span>
                <span className="ev-q-type">{q.type}</span>
                <a href={q.href} className="judgment-cta ev-dl-link">DOWNLOAD &rarr;</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Protected Document Access */}
      <section className="section ev-access-section">
        <div className="ev-access-inner">
          <h2 className="section-label">{data.protectedAccess.label}</h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (data.protectedAccess.desc || "").replace(/\n/g, '<br />') }}>
          </p>
          <form className="ev-access-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="work-email" className="ev-access-label">WORK EMAIL</label>
            <div className="ev-access-input-group">
              <input 
                type="email" 
                id="work-email" 
                className="ev-access-input" 
                placeholder="procurement@company.com" 
                required 
              />
              <button type="submit" className="judgment-cta ev-access-btn">{data.protectedAccess.cta}</button>
            </div>
          </form>
        </div>
      </section>

      {/* 7. Transparency Statement */}
      <section className="section ev-transparency-section">
        <div className="ev-transparency-inner">
          <h2 className="section-label">{data.transparency.label}</h2>
          <div className="ev-transparency-content">
            {(data.transparency.content || []).map((p: string, i: number) => (
              <p key={i} className="trust-body" dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }}></p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Judgment -> Evidence Bridge */}
      <section className="section ev-bridge-section">
        <div className="ev-bridge-inner">
          <p className="section-heading ev-bridge-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>
            {data.bridge.text1}
          </p>
          <p className="section-heading ev-bridge-text" style={{ fontSize: '2rem', marginBottom: '48px', color: 'var(--color-text-secondary)' }}>
            {data.bridge.text2}
          </p>
          <Link href={data.bridge.href} className="judgment-cta">{data.bridge.cta}</Link>
          
          <div className="ev-architecture-diagram">
            {(data.bridge.steps || []).map((step: any, i: number) => (
              <div key={i} style={{ display: "contents" }}>
                {i > 0 && <div className="ev-arch-arrow">&darr;</div>}
                <div className="ev-arch-step">
                  <span className="ev-arch-title">{step.title}</span>
                  <span className="ev-arch-desc">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="section final-cta" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", borderTop: "1px solid var(--color-structural)" }}>
        <h2 className="cta-headline section-heading" dangerouslySetInnerHTML={{ __html: (data.finalCta.title || "").replace(/\n/g, '<br />') }}></h2>
        <p className="cta-subheadline card-description" dangerouslySetInnerHTML={{ __html: (data.finalCta.desc || "").replace(/\n/g, '<br />') }}></p>
        <Link href={data.finalCta.href} className="judgment-cta">{data.finalCta.cta}</Link>
      </section>
    </>
  );
}
