import { supabase } from "@/lib/supabase";
import EvidenceClient from "./EvidenceClient";

const DEFAULT_DATA = {
  hero: { eyebrow: "EVIDENCE", title: "HOW WE OPERATE.", subtitle: "The documents behind the claims.\nSecurity. Governance. Operations.", body: "Everything procurement needs to understand before the conversation starts.", stats: ["10+ DOCUMENTS", "03 CATEGORIES"] },
  categories: ["SECURITY", "LEGAL", "OPERATIONS", "QUESTIONNAIRE"],
  panels: [
    { id: "security", num: "01", title: "SECURITY", desc: "The controls, policies and practices that protect\nclient systems and information.", docs: ["SOC 2", "INFORMATION SECURITY POLICY", "INCIDENT RESPONSE", "BUSINESS CONTINUITY"], cta: "EXPLORE SECURITY →", href: "#library" },
    { id: "legal", num: "02", title: "LEGAL", desc: "The agreements, policies and governance material\nbehind our commercial relationships.", docs: ["MSA", "DPA", "SUBPROCESSORS", "INSURANCE"], cta: "EXPLORE LEGAL →", href: "#library" },
    { id: "operations", num: "03", title: "OPERATIONS", desc: "How we deliver, support and recover\nwhen things don't go according to plan.", docs: ["SLA", "RTO / RPO", "CHANGE MANAGEMENT", "ESCALATION"], cta: "EXPLORE OPERATIONS →", href: "#library" }
  ],
  library: { title: "DOCUMENT LIBRARY", colDocument: "DOCUMENT", colType: "TYPE", colUpdated: "UPDATED", colAction: "ACTION", documents: [
    { name: "SOC 2 REPORT", type: "PDF", updated: "MAR 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Information Security Policy", type: "PDF", updated: "FEB 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Incident Response Plan", type: "PDF", updated: "FEB 2026", category: "SECURITY", url: "#", cta: "DOWNLOAD →" },
    { name: "Business Continuity Plan", type: "PDF", updated: "JAN 2026", category: "OPERATIONS", url: "#", cta: "DOWNLOAD →" },
    { name: "Subprocessor List", type: "PDF", updated: "JAN 2026", category: "LEGAL", url: "#", cta: "DOWNLOAD →" },
    { name: "Cyber Insurance Certificate", type: "PDF", updated: "DEC 2025", category: "LEGAL", url: "#", cta: "DOWNLOAD →" },
    { name: "Data Processing Agreement", type: "PDF", updated: "DEC 2025", category: "LEGAL", url: "#", cta: "DOWNLOAD →" }
  ] },
  questionnaire: { label: "PROCUREMENT QUESTIONNAIRE", title: "DON'T SEND US YOUR QUESTIONNAIRE FIRST.\nSTART WITH OURS.", desc: "We've pre-filled the information procurement teams\nusually need before a technical conversation.", items: [
    { name: "SECURITY QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "DATA PRIVACY QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "VENDOR QUESTIONNAIRE", type: "XLSX", href: "#" },
    { name: "TECHNICAL QUESTIONNAIRE", type: "XLSX", href: "#" }
  ] },
  protectedAccess: { label: "REQUEST DOCUMENT", desc: "Some documents contain information intended\nfor verified business contacts.", cta: "SEND ACCESS LINK →" },
  transparency: { label: "CLAIMS SHOULD HAVE DOCUMENTS BEHIND THEM.", content: ["If we say we have a control,\nthere should be evidence of the control.", "If we say we have a process,\nthere should be a process you can inspect."] },
  bridge: { text1: "JUDGMENT TELLS YOU WHAT WE BELIEVE.", text2: "EVIDENCE SHOWS YOU HOW WE OPERATE.", cta: "← READ OUR DECISIONS", href: "/judgment/", steps: [{ title: "JUDGMENT", desc: "How we think" }, { title: "EVIDENCE", desc: "How we operate" }, { title: "LEVERAGE", desc: "How we scale" }] },
  finalCta: { title: "NEED SOMETHING THAT ISN'T HERE?", desc: "Ask us directly.", cta: "CONTACT FLOWTARIS →", href: "/contact" }
};

export default async function EvidencePage() {
  let res: any = null;
  if (supabase) {
    try {
      const { data } = await supabase.from("page_content").select("content").eq("id", "evidence").single();
      res = data;
    } catch (e) {}
  }
  
  const content = res?.content;
  const data = content ? {
    hero: { ...DEFAULT_DATA.hero, ...(content.hero || {}) },
    categories: content.categories || DEFAULT_DATA.categories,
    panels: content.panels || DEFAULT_DATA.panels,
    library: { ...DEFAULT_DATA.library, ...(content.library || {}) },
    questionnaire: { ...DEFAULT_DATA.questionnaire, ...(content.questionnaire || {}) },
    protectedAccess: { ...DEFAULT_DATA.protectedAccess, ...(content.protectedAccess || {}) },
    transparency: { ...DEFAULT_DATA.transparency, ...(content.transparency || {}) },
    bridge: { ...DEFAULT_DATA.bridge, ...(content.bridge || {}) },
    finalCta: { ...DEFAULT_DATA.finalCta, ...(content.finalCta || {}) }
  } : DEFAULT_DATA;

  return <EvidenceClient data={data} />;
}
