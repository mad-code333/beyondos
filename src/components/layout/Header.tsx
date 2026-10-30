"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#work", label: "Selected work" },
  { href: "/#approach", label: "Our approach" },
  { href: "/#insights", label: "Insights" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  function closeAll() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <Link href="/" onClick={closeAll} className="wordmark" aria-label="Beyond OS home">
        <span className="brand-icon">b</span>
        beyond
        <span className="os">OS</span>
      </Link>

      <nav aria-label="Main navigation" className={menuOpen ? "open" : undefined}>
        {links.map((link) => {
          const active =
            link.href === "/services"
              ? servicesActive
              : link.href === "/"
                ? pathname === "/"
                : false;
          return (
            <Link
              key={link.href}
              href={link.href}
              data-nav={link.label.toLowerCase()}
              onClick={closeAll}
              className={cn(active && "active")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/#contact" className="nav-cta" onClick={closeAll}>
        Let&apos;s talk <span>↗</span>
      </Link>

      <button
        type="button"
        className="menu-button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-[70px] z-50 rounded-[15px] border border-white/20 bg-[rgba(20,20,20,0.98)] p-5 shadow-[0_30px_60px_#000] backdrop-blur-[20px] max-[1100px]:block hidden"
          >
            <div className="grid gap-3">
              {links.map((link) => {
                const active =
                  link.href === "/services"
                    ? servicesActive
                    : link.href === "/"
                      ? pathname === "/"
                      : false;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAll}
                    className={cn(
                      "rounded-xl px-1 py-2 text-[15px] text-[#ecece6]",
                      active && "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
