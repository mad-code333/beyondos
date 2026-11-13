import { BrandMark } from "@/components/layout/BrandMark";
import "./logo-showcase.css";

type LogoItem = {
  id: string;
  label: string;
  /** Logo file (shown greyscale), the Beyond mark, or a short glyph for tools without a local logo file. */
  art: { src: string } | { mark: "beyond" | "globe" } | { glyph: string };
};

const LOGOS: LogoItem[] = [
  { id: "resend", label: "Resend", art: { glyph: "R" } },
  { id: "claude", label: "Claude", art: { src: "/media/logos/claude-symbol.png" } },
  { id: "figma", label: "Figma", art: { src: "/media/logos/figma.svg" } },
  { id: "vercel", label: "Vercel", art: { src: "/media/logos/vercel.svg" } },
  { id: "beyond-os", label: "Beyond OS", art: { mark: "beyond" } },
  { id: "framer", label: "Framer Motion", art: { src: "/media/logos/framer.svg" } },
  { id: "typescript", label: "TypeScript", art: { src: "/media/logos/typescript-tile.svg" } },
  { id: "postgresql", label: "PostgreSQL", art: { glyph: "Pg" } },
  { id: "cloudflare", label: "Cloudflare", art: { src: "/media/logos/cloudflare.svg" } },
  { id: "nextjs", label: "Next.js", art: { src: "/media/logos/nextjs.svg" } },
  { id: "whatsapp", label: "WhatsApp", art: { src: "/media/logos/whatsapp.svg" } },
  { id: "google", label: "Google", art: { src: "/media/logos/google.svg" } },
  { id: "zod", label: "Zod", art: { glyph: "Z" } },
  { id: "next-intl", label: "next-intl", art: { mark: "globe" } },
];

function GlobeMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5s1.3-6.8 3.9-9.5Z" />
    </svg>
  );
}

function LogoArt({ art }: { art: LogoItem["art"] }) {
  if ("src" in art) {
    return <img src={art.src} alt="" width={52} height={52} draggable={false} decoding="async" loading="lazy" />;
  }
  if ("glyph" in art) return <span className="tech-glyph">{art.glyph}</span>;
  return art.mark === "beyond" ? <BrandMark className="tech-svg" /> : <GlobeMark />;
}

function TechRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="tech-row" aria-hidden={duplicate || undefined}>
      {LOGOS.map((item) => (
        <div
          key={item.id}
          className={`tech-tile tech-tile--${item.id}`}
          role={duplicate ? undefined : "img"}
          aria-label={duplicate ? undefined : item.label}
          title={item.label}
        >
          <span className="tech-art">
            <LogoArt art={item.art} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function LogoShowcase() {
  return (
    <section className="logo-showcase" aria-label="Platforms and integrations">
      <div className="tech-ecosystem">
        <p className="tech-caption">
          <span aria-hidden="true" />
          Our technology ecosystem
          <span aria-hidden="true" />
        </p>
        <div className="tech-wall" role="group" aria-label="Technologies in our toolkit">
          {/* Two identical rows; the track moves by exactly one row width, so the loop has no seam. */}
          <div className="tech-track">
            <TechRow />
            <TechRow duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
