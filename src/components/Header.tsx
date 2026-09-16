"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [headerLogo, setHeaderLogo] = useState("FLOWTARIS");

  useEffect(() => {
    async function fetchHeader() {
      try {
        const { data } = await supabase.from("page_content").select("content").eq("id", "home").single();
        if (data?.content) {
          if (data.content.headerLinks) setLinks(data.content.headerLinks);
          else setLinks([
            { label: "JUDGMENT", url: "/judgment" },
            { label: "EVIDENCE", url: "/evidence" },
            { label: "LEVERAGE", url: "/leverage" },
            { label: "PRINCIPLES", url: "/principles" },
            { label: "CONTACT →", url: "/contact" }
          ]);
          
          if (data.content.headerLogo) setHeaderLogo(data.content.headerLogo);
        } else {
          setLinks([
            { label: "JUDGMENT", url: "/judgment" },
            { label: "EVIDENCE", url: "/evidence" },
            { label: "LEVERAGE", url: "/leverage" },
            { label: "PRINCIPLES", url: "/principles" },
            { label: "CONTACT →", url: "/contact" }
          ]);
        }
      } catch {
        setLinks([
          { label: "JUDGMENT", url: "/judgment" },
          { label: "EVIDENCE", url: "/evidence" },
          { label: "LEVERAGE", url: "/leverage" },
          { label: "PRINCIPLES", url: "/principles" },
          { label: "CONTACT →", url: "/contact" }
        ]);
      }
    }
    fetchHeader();
  }, []);

  // Helper to determine if a link is active
  // We consider it active if the pathname starts with the link's href 
  // (e.g. /judgment/pricing is active under /judgment)
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" onClick={closeMenu}>{headerLogo}</Link>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          {links.length > 0 ? links.map((link, i) => {
            const isContact = link.label.toLowerCase().includes("contact");
            return (
              <Link 
                key={i}
                href={link.url}
                className={`${isContact ? "contact-link " : ""}${isActive(link.url) ? "active-nav" : ""}`.trim()}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            )
          }) : (
            <>
              <Link href="/judgment" className={isActive("/judgment") ? "active-nav" : ""} onClick={closeMenu}>JUDGMENT</Link>
              <Link href="/evidence" className={isActive("/evidence") ? "active-nav" : ""} onClick={closeMenu}>EVIDENCE</Link>
              <Link href="/leverage" className={isActive("/leverage") ? "active-nav" : ""} onClick={closeMenu}>LEVERAGE</Link>
              <Link href="/principles" className={isActive("/principles") ? "active-nav" : ""} onClick={closeMenu}>PRINCIPLES</Link>
              <Link href="/contact" className={`contact-link ${isActive("/contact") ? "active-nav" : ""}`.trim()} onClick={closeMenu}>CONTACT &rarr;</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
