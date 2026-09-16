"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterClient({ data }: { data: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData(e.currentTarget);
      const formData: Record<string, any> = {};
      
      // Extract form fields dynamically based on the form elements
      form.forEach((value, key) => {
        if (!formData[key]) {
          formData[key] = value;
        } else {
          // Handle checkbox groups which may have multiple values for the same key
          if (Array.isArray(formData[key])) {
            formData[key].push(value);
          } else {
            formData[key] = [formData[key], value];
          }
        }
      });

      const res = await fetch("/api/register-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData })
      });

      const result = await res.json();
      if (result.success) {
        setIsSuccess(true);
        setReference(result.reference || `FL-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
        window.scrollTo(0, 0);
      } else {
        alert("There was an error submitting your registration. Please try again or contact us directly.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <section className="section" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="section-heading" style={{ fontSize: '3rem', marginBottom: '24px' }}>{data.success?.title || "OPPORTUNITY REGISTERED."}</h1>
          <p className="trust-body" style={{ fontSize: '1.25rem', marginBottom: '32px' }}>
            {data.success?.desc || "We've received the opportunity details."}
          </p>
          <div style={{ display: 'inline-block', border: '1px solid var(--color-structural)', padding: '16px 32px', marginBottom: '48px' }}>
            <span className="section-label" style={{ margin: 0, display: 'block' }}>REFERENCE</span>
            <span className="card-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.05em' }}>{reference}</span>
          </div>
          <p className="card-description" style={{ maxWidth: '600px', margin: '0 auto 48px auto' }} dangerouslySetInnerHTML={{ __html: (data.success?.desc2 || "").replace(/\\n/g, '<br/>') }} />
          <Link href="/leverage" className="judgment-cta" style={{ display: 'inline-block' }}>
            {data.success?.cta || "\u2190 BACK TO LEVERAGE"}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <>
      {/* Contextual Navigation */}
      <div className="section dl-back-nav" style={{ paddingTop: '24px', paddingBottom: '0' }}>
        <Link href="/leverage" className="view-all" style={{ color: "var(--color-text-secondary)" }}>&larr; LEVERAGE</Link>
        <span className="view-all" style={{ color: "var(--color-text-primary)", marginLeft: '8px' }}>/ DEAL REGISTRATION</span>
      </div>

      {/* Hero */}
      <section className="section ev-hero" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <span className="eyebrow">{data.hero?.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px' }} dangerouslySetInnerHTML={{ __html: (data.hero?.title || "").replace(/\\n/g, '<br/>') }} />
        <p className="card-description ev-subtitle" style={{ maxWidth: '600px', marginTop: '24px' }} dangerouslySetInnerHTML={{ __html: (data.hero?.subtitle || "").replace(/\\n/g, '<br/>') }} />
      </section>

      {/* Main Layout: Form + Sidebar */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', paddingTop: '64px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px' }}>
          
          {/* Left Column: Form */}
          <div style={{ flex: '1 1 600px', maxWidth: '800px' }}>
            <form className="ev-access-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              
              {data.sections?.map((section: any, idx: number) => (
                <div key={section.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h2 className="card-heading" style={{ borderBottom: '1px solid var(--color-structural)', paddingBottom: '16px' }}>{section.title}</h2>
                  {section.desc && (
                    <p className="trust-body" style={{ color: 'var(--color-text-secondary)', margin: '-8px 0 0 0' }}>
                      {section.desc}
                    </p>
                  )}
                  
                  {section.fields?.map((field: any, fIdx: number) => (
                    <div key={field.id || fIdx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <label htmlFor={field.id} className="ev-access-label">{field.label}</label>
                      
                      <div className="ev-access-input-group">
                        {field.type === "textarea" ? (
                          <textarea 
                            id={field.id} 
                            name={field.label}
                            className="ev-access-input" 
                            style={{ minHeight: '120px', resize: 'vertical' }} 
                            required={field.required} 
                          />
                        ) : field.type === "select" ? (
                          <select id={field.id} name={field.label} className="ev-access-input" required={field.required} style={{ appearance: 'none', backgroundColor: 'transparent' }}>
                            <option value="">Select...</option>
                            {field.options?.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "checkbox_group" ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                            {field.options?.map((opt: string) => (
                              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input type="checkbox" name={field.label} value={opt} style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent)' }} />
                                <span className="trust-body">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input 
                            type={field.type || "text"} 
                            id={field.id} 
                            name={field.label}
                            className="ev-access-input" 
                            required={field.required} 
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Consent & Submit */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', borderTop: '1px solid var(--color-structural)', paddingTop: '48px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Consent" required style={{ width: '20px', height: '20px', marginTop: '4px', accentColor: 'var(--color-accent)' }} />
                  <span className="trust-body" dangerouslySetInnerHTML={{ __html: (data.consent?.text || "").replace(/\\n/g, '<br/>') }} />
                </label>

                <button 
                  type="submit" 
                  className="judgment-cta" 
                  style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (data.consent?.ctaLoading || "REGISTERING...") : (data.consent?.cta || "REGISTER OPPORTUNITY \u2192")}
                </button>

                <p className="trust-body" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: (data.consent?.disclaimer || "").replace(/\\n/g, '<br/>') }} />
              </div>

            </form>
          </div>

          {/* Right Column: Sidebar */}
          <div style={{ flex: '0 0 300px', position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '32px', border: '1px solid var(--color-structural)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 className="section-label" style={{ margin: 0 }}>{data.sidebar?.title}</h3>
              <p className="trust-body" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                {data.sidebar?.desc}
              </p>
              <div style={{ borderTop: '1px solid var(--color-structural)', paddingTop: '24px', marginTop: '8px' }}>
                <p className="trust-body" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  {data.sidebar?.contactLabel}
                </p>
                <a href={`mailto:${data.sidebar?.contactEmail}`} className="trust-body" style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  {data.sidebar?.contactEmail}
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
