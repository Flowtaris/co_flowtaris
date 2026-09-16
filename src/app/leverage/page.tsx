import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function LeveragePage() {
  let res: any = null;
  if (supabase) {
    try {
      const { data } = await supabase.from("page_content").select("content").eq("id", "leverage").single();
      res = data;
    } catch (e) {}
  }
  
  const data = res?.content || {
    hero: { eyebrow: "LEVERAGE", title: "HOW WE SCALE\nWITHOUT SCALING\nCOMPLEXITY.", subtitle: "The platforms, partnerships and specialist\nrelationships that extend what Flowtaris\ncan deliver.", stats: ["03 STRATEGIC ALLIANCES", "ACTIVE NETWORK"] },
    leverageModel: { title: "HOW WE CREATE LEVERAGE", items: [{ title: "PLATFORMS", desc: "Technology platforms that allow\nus to solve complex problems faster." }, { title: "PARTNERS", desc: "Strategic relationships that expand\ncapability and reach." }, { title: "PEOPLE", desc: "Specialists who bring depth where\ngeneral capability isn't enough." }] },
    strategicAlliances: { title: "STRATEGIC ALLIANCES", alliances: [{ num: "01", name: "NETSUITE", desc: "ERP implementation, integration and platform engineering.", status: "[ IN DEVELOPMENT ]", cta: "EXPLORE NETSUITE →", href: "/leverage/netsuite" }, { num: "02", name: "COUPA", desc: "Procurement platform engineering, integration and optimization.", status: "[ IN DEVELOPMENT ]", cta: "EXPLORE COUPA →", href: "/leverage/coupa" }, { num: "03", name: "WORKDAY", desc: "Enterprise platform integration, engineering and delivery.", status: "[ IN DEVELOPMENT ]", cta: "EXPLORE WORKDAY →", href: "/leverage/workday" }] },
    partnershipsChange: { title: "PARTNERSHIPS SHOULD CHANGE\nTHE OUTCOME.", subtitle: "Not the logo wall.", withoutLeverage: ["Client problem", "Flowtaris capability", "Limited delivery boundary"], withLeverage: ["Client problem", "Flowtaris", "Strategic platform / partner", "Specialist capability", "Larger solution surface"] },
    capabilityMap: { title: "CAPABILITY MAP", capabilities: [{ name: "Architecture", f: "✓", p: "✓", s: "✕" }, { name: "Integration", f: "✓", p: "✓", s: "✕" }, { name: "Platform Engineering", f: "✓", p: "✓", s: "✕" }, { name: "Data Engineering", f: "✓", p: "✕", s: "✓" }, { name: "ERP", f: "✕", p: "✓", s: "✓" }, { name: "Procurement", f: "✕", p: "✓", s: "✓" }, { name: "AI / Automation", f: "✓", p: "✕", s: "✓" }] },
    partnerRegistration: { label: "PARTNER DEAL REGISTRATION", title: "HAVE AN OPPORTUNITY?", desc: "Register it once.\nWe'll route it to the appropriate Flowtaris\nteam and partner relationship.", cta: "REGISTER AN OPPORTUNITY →" },
    partnerPipeline: { title: "PARTNER PIPELINE", desc: "PIPELINE DATA\nCOMING ONLINE" },
    specialistNetwork: { label: "SPECIALIST NETWORK", title: "WHEN DEPTH MATTERS,\nBRING IN THE RIGHT PERSON.", desc: "A curated network of specialists\nacross platforms, engineering,\ndata and enterprise operations.", cta: "EXPLORE SPECIALISTS →", categories: [{ label: "ERP", items: ["NetSuite", "SAP", "Workday"] }, { label: "DATA", items: ["Data Engineering", "Analytics", "AI"] }, { label: "OPERATIONS", items: ["Transformation", "Architecture", "Program Leadership"] }] },
    flowtarisNetwork: { title: "THE FLOWTARIS NETWORK", domains: [{ ext: ".CO", desc: "TRUST INFRASTRUCTURE" }, { ext: ".COM", desc: "Company / commercial presence" }, { ext: ".AI", desc: "AI systems / intelligence" }, { ext: ".NET", desc: "Client / operational infrastructure" }] },
    operatingPrinciple: "LEVERAGE IS NOT ABOUT DOING MORE.\nIT IS ABOUT MAKING THE SAME\nCAPABILITY REACH FURTHER.",
    finalCta: { title: "HAVE AN OPPORTUNITY\nTHAT NEEDS MORE CAPABILITY?", desc: "Let's determine whether\nthe right leverage already exists.", cta: "REGISTER AN OPPORTUNITY →" }
  };

  return (
    <>
      {/* Leverage Hero */}
      <section className="section ev-hero" style={{ paddingTop: '120px' }}>
        <span className="eyebrow">{data.hero?.eyebrow}</span>
        <h1 className="section-heading ev-title" style={{ maxWidth: '900px' }} dangerouslySetInnerHTML={{ __html: (data.hero?.title || "").replace(/\n/g, '<br />') }}></h1>
        <p className="card-description ev-subtitle" dangerouslySetInnerHTML={{ __html: (data.hero?.subtitle || "").replace(/\n/g, '<br />') }}></p>
        <div className="ev-stats" style={{ gap: '64px', justifyContent: 'flex-start' }}>
          {(data.hero?.stats || []).map((stat: string, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="ev-stat">{stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Leverage Model */}
      <section className="section">
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.leverageModel?.title}</h2>
        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
          {(data.leverageModel?.items || []).map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-structural)', paddingTop: '24px' }}>
              <h3 className="card-heading" style={{ textTransform: 'uppercase', marginBottom: '16px' }}>{item.title}</h3>
              <p className="trust-body" dangerouslySetInnerHTML={{ __html: (item.desc || "").replace(/\n/g, '<br />') }}></p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Alliances */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>{data.strategicAlliances?.title}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {(data.strategicAlliances?.alliances || []).map((alliance: any, i: number) => (
            <div key={i} className="ev-panel" style={{ padding: '64px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{alliance.num}</span>
              <h3 className="section-heading" style={{ fontSize: '2rem', margin: 0 }}>{alliance.name}</h3>
              <p className="trust-body" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: 0 }}>{alliance.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <span className="section-label" style={{ margin: 0 }}>PARTNER STATUS</span>
                <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', color: 'var(--color-accent)' }}>{alliance.status}</span>
              </div>
              <Link href={alliance.href || "#"} className="judgment-cta" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>{alliance.cta || `EXPLORE ${alliance.name} →`}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* What Partnerships Actually Change */}
      <section className="section">
        <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '16px', maxWidth: '800px' }} dangerouslySetInnerHTML={{ __html: (data.partnershipsChange?.title || "").replace(/\n/g, '<br />') }}></h2>
        <p className="card-description" style={{ maxWidth: '600px', marginBottom: '64px', color: 'var(--color-text-secondary)' }}>{data.partnershipsChange?.subtitle}</p>

        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
          {/* Without Leverage */}
          <div style={{ padding: '48px', backgroundColor: 'var(--color-surface)' }}>
            <h3 className="section-label" style={{ marginBottom: '32px' }}>WITHOUT LEVERAGE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
              {(data.partnershipsChange?.withoutLeverage || []).map((step: string, i: number, arr: any[]) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>&darr;</span>}
                </div>
              ))}
            </div>
          </div>

          {/* With Leverage */}
          <div style={{ padding: '48px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}>
            <h3 className="section-label" style={{ marginBottom: '32px', color: 'var(--color-accent)' }}>WITH LEVERAGE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--color-structural)', paddingLeft: '32px', marginLeft: '16px' }}>
              {(data.partnershipsChange?.withLeverage || []).map((step: string, i: number, arr: any[]) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="card-heading" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}>&darr;</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capability Map */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.capabilityMap?.title}</h2>
        <div className="ev-table-container">
          <table className="ev-table" style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th className="ev-th">CAPABILITY</th>
                <th className="ev-th" style={{ textAlign: 'center' }}>FLOWTARIS</th>
                <th className="ev-th" style={{ textAlign: 'center' }}>PARTNER</th>
                <th className="ev-th" style={{ textAlign: 'center' }}>SPECIALIST</th>
              </tr>
            </thead>
            <tbody>
              {(data.capabilityMap?.capabilities || []).map((row: any, i: number) => (
                <tr key={i} className="ev-tr">
                  <td className="ev-td ev-td-name" style={{ fontSize: '1.125rem' }}>{row.name}</td>
                  <td className="ev-td" style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>{row.f}</td>
                  <td className="ev-td" style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>{row.p}</td>
                  <td className="ev-td" style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Partner Deal Registration */}
      <section className="section ev-access-section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <div className="ev-access-inner">
          <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>{data.partnerRegistration?.label}</span>
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{data.partnerRegistration?.title}</h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (data.partnerRegistration?.desc || "").replace(/\n/g, '<br />') }}></p>
          <form className="ev-access-form" action="/register" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
            <div className="ev-access-input-group" style={{ flexDirection: 'column', border: 'none', gap: '24px' }}>
              <div style={{ display: 'flex', border: '1px solid var(--color-structural)' }}>
                <input type="email" className="ev-access-input" placeholder="WORK EMAIL" required />
              </div>
              <button type="submit" className="judgment-cta" style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {data.partnerRegistration?.cta}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Partner Pipeline */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px' }}>{data.partnerPipeline?.title}</h2>
        <div className="ev-panel" style={{ padding: '64px', display: 'inline-block' }}>
          <p className="card-description" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }} dangerouslySetInnerHTML={{ __html: (data.partnerPipeline?.desc || "").replace(/\n/g, '<br />') }}></p>
        </div>
      </section>

      {/* Specialist Network */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '32px' }}>{data.specialistNetwork?.label}</h2>
        <h3 className="section-heading" style={{ fontSize: '3rem', marginBottom: '24px', maxWidth: '900px' }} dangerouslySetInnerHTML={{ __html: (data.specialistNetwork?.title || "").replace(/\n/g, '<br />') }}></h3>
        <p className="card-description" style={{ maxWidth: '700px', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (data.specialistNetwork?.desc || "").replace(/\n/g, '<br />') }}></p>
        <Link href="#" className="judgment-cta" style={{ marginBottom: '64px', display: 'inline-block' }}>{data.specialistNetwork?.cta}</Link>

        <div className="trust-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', borderTop: '1px solid var(--color-structural)', paddingTop: '48px' }}>
          {(data.specialistNetwork?.categories || []).map((cat: any, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label">{cat.label}</span>
              {(cat.items || []).map((item: string, j: number) => (
                <span key={j} className="trust-body" style={{ fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* The Flowtaris Network */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)' }}>
        <h2 className="section-label" style={{ marginBottom: '48px', textAlign: 'center' }}>{data.flowtarisNetwork?.title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', textAlign: 'center' }}>
          {(data.flowtarisNetwork?.domains || []).map((domain: any, i: number, arr: any[]) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span className="section-heading" style={{ fontSize: '3rem', margin: 0 }}>{domain.ext}</span>
                <span className="trust-body" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{domain.desc}</span>
              </div>
              {i < arr.length - 1 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.5rem', marginTop: '32px', display: 'block', textAlign: 'center' }}>&darr;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Operating Principle */}
      <section className="section" style={{ borderTop: '1px solid var(--color-structural)', borderBottom: '1px solid var(--color-structural)' }}>
        <h2 className="section-heading" style={{ fontSize: '3rem', marginBottom: '32px', maxWidth: '1000px' }} dangerouslySetInnerHTML={{ __html: (data.operatingPrinciple || "").replace(/\n/g, '<br />') }}></h2>
      </section>

      {/* Final CTA */}
      <section className="section ev-access-section" style={{ borderTop: 'none' }}>
        <div className="ev-access-inner">
          <h2 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: (data.finalCta?.title || "").replace(/\n/g, '<br />') }}></h2>
          <p className="trust-body ev-access-desc" style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '48px' }} dangerouslySetInnerHTML={{ __html: (data.finalCta?.desc || "").replace(/\n/g, '<br />') }}></p>
          <Link href="#" className="judgment-cta">{data.finalCta?.cta}</Link>
        </div>
      </section>
    </>
  );
}
