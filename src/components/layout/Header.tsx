"use client";

import Link from "next/link";
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

const links = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Selected work" },
  { href: "/#approach", label: "Our approach" },
  { href: "/#ecosystem", label: "Ecosystem" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  function closeAll() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

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
    <header className="site-header">
      <Link href="/" onClick={closeAll} className="wordmark" aria-label="Beyond OS home">
        <span className="brand-icon">b</span>
        beyond
        <span className="os">os</span>
      </Link>

      <nav aria-label="Main navigation" className={menuOpen ? "open" : undefined}>
        <Link
          href="/"
          data-nav="home"
          onClick={closeAll}
          className={cn(pathname === "/" && !servicesActive && "active")}
        >
          Home
        </Link>

        <div className="nav-drop" ref={dropRef}>
          <button
            type="button"
            aria-expanded={servicesOpen}
            aria-controls="servicesMenu"
            className={cn(servicesActive && "active")}
            onClick={() => setServicesOpen((value) => !value)}
          >
            Services <span>⌄</span>
          </button>
          <div className="dropdown" id="servicesMenu" hidden={!servicesOpen}>
            <span className="mono">WHAT WE BUILD</span>
            {serviceItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeAll}>
                {item.label}
                <small>{item.note}</small>
              </Link>
            ))}
          </div>
        </div>

        {links.slice(1).map((link) => (
          <Link key={link.href} href={link.href} onClick={closeAll}>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/#contact" className="nav-cta" onClick={closeAll}>
        Get in touch <span>↗</span>
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
              <p className="mobile-nav-label">Services</p>
              {serviceItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
              {links.slice(1).map((link) => (
                <Link key={link.href} href={link.href} onClick={closeAll}>
                  {link.label}
                </Link>
              ))}
              <Link href="/#contact" onClick={closeAll} className="mobile-nav-cta">
                Get in touch ↗
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
