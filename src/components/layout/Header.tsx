"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Selected work" },
  { href: "/#approach", label: "Our approach" },
  { href: "/#insights", label: "Insights" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  function closeAll() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]">
      <div className="relative flex h-[72px] items-center justify-between px-5 md:px-8 lg:px-10">
        <Link href="/" onClick={closeAll} className="relative z-10 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#f4f4f1] text-[15px] font-semibold leading-none text-[#111]">
            b
          </span>
          <span className="text-[15px] font-medium tracking-[-0.03em] text-[#f4f4f1]">
            beyond <span className="font-normal text-[#8d8d88]">OS</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] text-[#a3a39e] lg:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((value) => !value)}
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              Services
              <Chevron className={cn("transition", servicesOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {servicesOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-20 w-64 -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-2xl">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        onClick={closeAll}
                        className="block rounded-xl px-3 py-2.5 transition hover:bg-white/5"
                      >
                        <span className="block text-[13px] text-[#f4f4f1]">{service.name}</span>
                        <span className="block text-[11px] text-[#8a8a86]">{service.navLabel}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {links.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#f4f4f1] px-4 py-2 text-[13px] font-medium text-[#161616] transition hover:bg-white"
          >
            Let&apos;s talk
            <Arrow />
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Open navigation"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[14px] text-[#f4f4f1] lg:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0a0a] lg:hidden"
          >
            <Container className="grid gap-1 py-4">
              <Link href="/" onClick={closeAll} className="rounded-xl px-3 py-3 text-[15px] text-[#d8d8d4]">
                Home
              </Link>
              <p className="px-3 pt-2 text-[11px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                Services
              </p>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={closeAll}
                  className="rounded-xl px-3 py-2.5 text-[15px] text-[#f4f4f1]"
                >
                  {service.name}
                </Link>
              ))}
              {links.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className="rounded-xl px-3 py-3 text-[15px] text-[#d8d8d4]"
                >
                  {link.label}
                </Link>
              ))}
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 10.5 10.5 3.5M5.5 3.5h5v5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
