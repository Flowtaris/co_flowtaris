"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { supabase } from "@/lib/supabase";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    async function fetchFooter() {
      if (isAdmin) return;
      try {
        if (!supabase) return;
        const { data } = await supabase.from("page_content").select("content").eq("id", "footer").single();
        if (data?.content) {
          setFooterData(data.content);
        }
      } catch (err) {}
    }
    fetchFooter();
  }, [isAdmin]);

  if (isAdmin) {
    return <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0 }}>{children}</main>;
  }

  const footerLogo = footerData?.footerLogo || "FLOWTARIS";
  const col1 = footerData?.footerCol1 || [
    { label: "JUDGMENT", url: "/judgment" },
    { label: "EVIDENCE", url: "/evidence" },
    { label: "LEVERAGE", url: "/leverage" },
    { label: "PRINCIPLES", url: "/principles" },
  ];
  const col2 = footerData?.footerCol2 || [
    { label: "CONTACT", url: "/contact" },
    { label: "LINKEDIN", url: "https://linkedin.com" },
    { label: "X", url: "https://x.com" },
  ];
  const copyright = footerData?.footerCopyright || "© 2026 FLOWTARIS TECHNOLOGIES PVT LTD";

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-logo">{footerLogo}</div>
          <div className="footer-links">
            <nav className="footer-nav-primary">
              {col1.map((link: any, i: number) => (
                <a key={i} href={link.url}>{link.label}</a>
              ))}
            </nav>
            <nav className="footer-nav-secondary">
              {col2.map((link: any, i: number) => (
                <a key={i} href={link.url}>{link.label}</a>
              ))}
            </nav>
          </div>
          <div className="footer-copyright">
            {copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
