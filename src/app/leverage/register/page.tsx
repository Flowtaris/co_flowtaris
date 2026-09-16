import { supabase } from "@/lib/supabase";
import RegisterClient from "./RegisterClient";

const DEFAULT_DATA = {
  hero: {
    eyebrow: "DEAL REGISTRATION",
    title: "REGISTER THE\\nOPPORTUNITY.",
    subtitle: "Give us enough context to route the opportunity\\nto the right Flowtaris team."
  },
  sidebar: {
    title: "BEFORE YOU START",
    desc: "Make sure you have all the necessary information about the client, the opportunity, and the competitive landscape. Incomplete registrations may be delayed.",
    contactLabel: "Need assistance?",
    contactEmail: "partners@flowtaris.com"
  },
  success: {
    title: "OPPORTUNITY REGISTERED.",
    desc: "We've received the opportunity details.",
    desc2: "We'll route the opportunity to the appropriate\\nFlowtaris team and follow up using the information\\nprovided.",
    cta: "\u2190 BACK TO LEVERAGE"
  },
  consent: {
    text: "I confirm that I am authorized to submit\\nthis opportunity on behalf of my organization.",
    cta: "REGISTER OPPORTUNITY \u2192",
    ctaLoading: "REGISTERING...",
    disclaimer: "Your submission is used to evaluate and route\\nthe opportunity."
  },
  sections: [
    {
      id: "s1",
      title: "01 \u2014 YOUR INFORMATION",
      desc: "",
      fields: [
        { id: "name", label: "NAME *", type: "text", required: true },
        { id: "email", label: "WORK EMAIL *", type: "email", required: true },
        { id: "company", label: "COMPANY *", type: "text", required: true },
        { id: "partner-type", label: "PARTNER TYPE *", type: "select", required: true, options: ["Technology Partner", "Consulting Partner", "Referral Partner", "Platform Partner", "Other"] }
      ]
    },
    {
      id: "s2",
      title: "02 \u2014 OPPORTUNITY",
      desc: "",
      fields: [
        { id: "client-company", label: "CLIENT / COMPANY *", type: "text", required: true },
        { id: "opportunity-name", label: "OPPORTUNITY NAME *", type: "text", required: true },
        { id: "platform", label: "PLATFORM *", type: "text", required: true },
        { id: "opportunity-type", label: "OPPORTUNITY TYPE *", type: "text", required: true },
        { id: "timeline", label: "EXPECTED TIMELINE *", type: "text", required: true }
      ]
    },
    {
      id: "s3",
      title: "03 \u2014 WHAT IS THE OPPORTUNITY?",
      desc: "Tell us what the client is trying to accomplish.",
      fields: [
        { id: "opportunity-summary", label: "Summary (What problem? What platform? Where does Flowtaris fit?) *", type: "textarea", required: true }
      ]
    },
    {
      id: "s4",
      title: "04 \u2014 COMMERCIAL CONTEXT",
      desc: "",
      fields: [
        { id: "opp-size", label: "ESTIMATED OPPORTUNITY SIZE (OPTIONAL)", type: "select", required: false, options: ["Under $50k", "$50k - $150k", "$150k - $500k", "$500k+"] },
        { id: "decision-stage", label: "DECISION STAGE *", type: "select", required: true, options: ["Discovery", "Evaluation", "Proposal/Contracting"] },
        { id: "competitive-situation", label: "COMPETITIVE SITUATION *", type: "select", required: true, options: ["Sole Source", "Competitive Process", "Unknown"] },
        { id: "decision-date", label: "EXPECTED DECISION DATE *", type: "date", required: true }
      ]
    },
    {
      id: "s5",
      title: "05 \u2014 WHERE DO YOU NEED FLOWTARIS?",
      desc: "",
      fields: [
        { id: "capabilities", label: "Capabilities Needed", type: "checkbox_group", required: false, options: ["Architecture", "Platform Engineering", "Integration", "Data Engineering", "AI / Automation", "Application Engineering", "Other"] }
      ]
    },
    {
      id: "s6",
      title: "06 \u2014 ADDITIONAL CONTEXT",
      desc: "",
      fields: [
        { id: "additional", label: "ANYTHING ELSE WE SHOULD KNOW? (OPTIONAL)", type: "textarea", required: false }
      ]
    }
  ]
};

export default async function DealRegistrationPage() {
  let res: any = null;
  if (supabase) {
    try {
      const { data } = await supabase.from("page_content").select("content").eq("id", "register").single();
      res = data;
    } catch (e) {}
  }
  
  const content = res?.content;
  const data = content ? {
    hero: { ...DEFAULT_DATA.hero, ...(content.hero || {}) },
    sidebar: { ...DEFAULT_DATA.sidebar, ...(content.sidebar || {}) },
    success: { ...DEFAULT_DATA.success, ...(content.success || {}) },
    consent: { ...DEFAULT_DATA.consent, ...(content.consent || {}) },
    sections: content.sections || DEFAULT_DATA.sections,
  } : DEFAULT_DATA;

  return <RegisterClient data={data} />;
}
