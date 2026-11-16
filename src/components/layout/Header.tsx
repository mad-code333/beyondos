"use client";

import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const serviceItems = [
  {
    href: "/services/crm",
    label: "CRM",
    note: "Every relationship, remembered.",
  },
  {
    href: "/services/oms",
    label: "Restaurant OMS",
    note: "Every order, in sync.",
  },
  {
    href: "/services/hms",
    label: "Hotel HMS",
    note: "Every stay, connected.",
  },
  {
    href: "/services/web",
    label: "Web Development",
    note: "A front door, worth staying for.",
  },
  {
    href: "/services/growth",
    label: "Digital Growth",
    note: "The right guest, a clear reason.",
  },
];

// Each link points at a section on the home page, in page order.
const sectionLinks = [
  { id: "pricing", label: "Pricing" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "insights", label: "Insights" },
  { id: "faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const currentSection = pathname === "/" ? activeSection : null;
  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  function closeAll() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

  // Sticky header: show the glass bar once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav link of the home section currently in view.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = sectionLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const onScroll = () => {
      const marker = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      const last = sections[sections.length - 1];
      if (current === last.id && last.getBoundingClientRect().bottom < marker) current = null;
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!dropRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={cn("site-header", scrolled && "is-scrolled")}>
      <Link href="/" onClick={closeAll} className="wordmark" aria-label="BeyondOS home">
        <BrandMark />
        BeyondOS
      </Link>

      <nav aria-label="Main navigation" className={menuOpen ? "open" : undefined}>
        <Link
          href="/"
          data-nav="home"
          onClick={closeAll}
          className={cn(pathname === "/" && !currentSection && "active")}
        >
          Home
        </Link>

        <div className="nav-drop" ref={dropRef}>
          <button
            type="button"
            aria-expanded={servicesOpen}
            aria-controls="servicesMenu"
            className={cn(servicesActive && "active", servicesOpen && "open")}
            onClick={() => setServicesOpen((value) => !value)}
          >
            Services
            <span className="nav-chevron" aria-hidden="true">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1.25L5 4.75L9 1.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div className="dropdown" id="servicesMenu" hidden={!servicesOpen}>
            <span className="dropdown-kicker mono">WHAT WE BUILD</span>
            {serviceItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeAll}>
                <span className="drop-label">{item.label}</span>
                <span className="drop-note">{item.note}</span>
              </Link>
            ))}
          </div>
        </div>

        {sectionLinks.map((link) => (
          <Link
            key={link.id}
            href={`/#${link.id}`}
            onClick={closeAll}
            aria-current={currentSection === link.id ? "location" : undefined}
            className={cn(currentSection === link.id && "active")}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/#contact" className="nav-cta" onClick={closeAll}>
        Let&apos;s talk <span>↗︎</span>
      </Link>

      <button
        type="button"
        className="menu-button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => {
          setMenuOpen((value) => !value);
          setServicesOpen(false);
        }}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mobile-nav-panel"
          >
            <div className="grid gap-1">
              <Link href="/" onClick={closeAll} className={cn(pathname === "/" && "active")}>
                Home
              </Link>
              <p className="mobile-nav-label">What we build</p>
              {serviceItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll} className="mobile-service-link">
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </Link>
              ))}
              {sectionLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  onClick={closeAll}
                  className={cn(currentSection === link.id && "active")}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/#contact" onClick={closeAll} className="mobile-nav-cta">
                Let&apos;s talk ↗︎
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
