import "./logo-showcase.css";

type LogoItem =
  | {
      id: string;
      label: string;
      kind: "image";
      src: string;
      width: number;
      height: number;
      className?: string;
    }
  | {
      id: string;
      label: string;
      kind: "wordmark";
      text: string;
    };

const LOGOS: LogoItem[] = [
  {
    id: "claude",
    label: "Claude",
    kind: "image",
    src: "/media/logos/claude-symbol.png",
    width: 36,
    height: 38,
    className: "logo-mark--symbol",
  },
  {
    id: "beyond-os",
    label: "Beyond OS",
    kind: "wordmark",
    text: "beyond os",
  },
  {
    id: "nextjs",
    label: "Next.js",
    kind: "image",
    src: "/next.svg",
    width: 90,
    height: 18,
    className: "logo-mark--invert logo-mark--next",
  },
  {
    id: "vercel",
    label: "Vercel",
    kind: "image",
    src: "/vercel.svg",
    width: 20,
    height: 18,
    className: "logo-mark--icon",
  },
  {
    id: "typescript",
    label: "TypeScript",
    kind: "image",
    src: "/media/logos/typescript.svg",
    width: 26,
    height: 26,
    className: "logo-mark--icon",
  },
  {
    id: "framer",
    label: "Framer Motion",
    kind: "image",
    src: "/media/logos/framer.svg",
    width: 14,
    height: 21,
    className: "logo-mark--icon logo-mark--framer",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Business API",
    kind: "image",
    src: "/media/logos/whatsapp.svg",
    width: 24,
    height: 24,
    className: "logo-mark--icon",
  },
  {
    id: "google",
    label: "Google Business Profile",
    kind: "image",
    src: "/media/logos/google.svg",
    width: 24,
    height: 24,
    className: "logo-mark--icon",
  },
  {
    id: "resend",
    label: "Resend",
    kind: "wordmark",
    text: "Resend",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    kind: "wordmark",
    text: "PostgreSQL",
  },
  {
    id: "zod",
    label: "Zod",
    kind: "wordmark",
    text: "Zod",
  },
  {
    id: "next-intl",
    label: "next-intl",
    kind: "wordmark",
    text: "next-intl",
  },
];

function LogoMark({ item }: { item: LogoItem }) {
  if (item.kind === "wordmark") {
    return (
      <span
        className={`logo-mark logo-mark--word${item.id === "beyond-os" ? " logo-mark--beyond" : ""}`}
      >
        {item.id === "beyond-os" ? (
          <>
            <span className="logo-mark-beyond-icon" aria-hidden="true">
              b
            </span>
            <span className="logo-mark-beyond-text">
              beyond
              <em>os</em>
            </span>
          </>
        ) : (
          item.text
        )}
      </span>
    );
  }

  return (
    <span className={`logo-mark${item.className ? ` ${item.className}` : ""}`}>
      <img
        src={item.src}
        alt=""
        width={item.width}
        height={item.height}
        className="logo-mark-img"
        decoding="async"
        loading="lazy"
      />
    </span>
  );
}

function LogoTrack({ copy }: { copy: number }) {
  return (
    <>
      {LOGOS.map((item) => (
        <div
          key={`${copy}-${item.id}`}
          className="logo-showcase-item"
          role="listitem"
          aria-label={item.label}
          aria-hidden={copy > 0 ? true : undefined}
        >
          <LogoMark item={item} />
        </div>
      ))}
    </>
  );
}

export function LogoShowcase() {
  return (
    <section className="logo-showcase" aria-label="Platforms and integrations">
      <div className="wrap logo-showcase-inner">
        <p className="logo-showcase-kicker mono">
          Built with the platforms hospitality already trusts
        </p>

        <div
          className="logo-showcase-marquee"
          role="list"
          aria-label="Company and platform logos"
        >
          <div className="logo-showcase-track">
            <LogoTrack copy={0} />
            <LogoTrack copy={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
