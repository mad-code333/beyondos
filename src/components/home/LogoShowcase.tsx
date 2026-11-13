import type { CSSProperties } from "react";
import { BrandMark } from "@/components/layout/BrandMark";
import "./logo-showcase.css";

type LogoItem = {
  id: string;
  label: string;
  /** Monochrome silhouette source; rendered as a mask tinted with currentColor. */
  icon?: string | "beyond";
  /** Wide marks (e.g. Cloudflare's cloud) need more room than the square icon box. */
  iconWidth?: number;
};

const LOGOS: LogoItem[] = [
  { id: "claude", label: "Claude", icon: "/media/logos/claude-symbol.png" },
  { id: "beyond-os", label: "Beyond OS", icon: "beyond" },
  { id: "nextjs", label: "Next.js", icon: "/media/logos/nextjs.svg" },
  { id: "vercel", label: "Vercel", icon: "/media/logos/vercel.svg" },
  { id: "typescript", label: "TypeScript", icon: "/media/logos/typescript-mono.svg" },
  { id: "figma", label: "Figma", icon: "/media/logos/figma.svg" },
  { id: "cloudflare", label: "Cloudflare", icon: "/media/logos/cloudflare.svg", iconWidth: 28 },
  { id: "framer", label: "Framer Motion", icon: "/media/logos/framer.svg" },
  { id: "whatsapp", label: "WhatsApp", icon: "/media/logos/whatsapp.svg" },
  { id: "google", label: "Google", icon: "/media/logos/google.svg" },
  { id: "resend", label: "Resend" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "zod", label: "Zod" },
  { id: "next-intl", label: "next-intl" },
];

function LogoIcon({ icon, width }: { icon: string; width?: number }) {
  if (icon === "beyond") return <BrandMark className="logo-strip-icon logo-strip-icon--svg" />;
  return (
    <span
      className="logo-strip-icon"
      style={{ "--logo-icon": `url(${icon})`, width } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function LogoTrack({ copy }: { copy: number }) {
  return (
    <div className="logo-strip-set" aria-hidden={copy > 0 ? true : undefined}>
      {LOGOS.map((item) => (
        <span key={item.id} className="logo-strip-item" role={copy > 0 ? undefined : "listitem"}>
          {item.icon ? <LogoIcon icon={item.icon} width={item.iconWidth} /> : null}
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function LogoShowcase() {
  return (
    <section className="logo-showcase" aria-label="Platforms and integrations">
      <p className="logo-showcase-kicker">Built with the platforms hospitality already trusts</p>

      <div className="logo-showcase-marquee" role="list" aria-label="Platforms we build with">
        {/* Two identical sets, each translated by its own width — the loop never shows a seam. */}
        <div className="logo-showcase-track">
          <LogoTrack copy={0} />
          <LogoTrack copy={1} />
        </div>
      </div>
    </section>
  );
}
