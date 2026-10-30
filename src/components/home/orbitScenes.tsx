import type { ReactElement } from "react";
import type { ServiceSlug } from "@/content/services";

function MetalDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}metal`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#bcbcbc" />
        <stop offset=".2" stopColor="#555" />
        <stop offset=".5" stopColor="#222" />
        <stop offset=".75" stopColor="#444" />
        <stop offset="1" stopColor="#999" />
      </linearGradient>
      <linearGradient id={`${id}dark`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#343434" />
        <stop offset=".55" stopColor="#111" />
        <stop offset="1" stopColor="#202020" />
      </linearGradient>
      <linearGradient id={`${id}shine`}>
        <stop stopColor="#ddd" />
        <stop offset=".4" stopColor="#666" />
        <stop offset=".7" stopColor="#aaa" />
        <stop offset="1" stopColor="#333" />
      </linearGradient>
    </defs>
  );
}

function CrmScene({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 640 620" aria-hidden="true">
      <MetalDefs id={id} />
      <g fill="none" stroke="#ffffff24">
        <path d="M140 190L320 300L490 155M160 435L320 300L500 415" />
        <circle cx="320" cy="300" r="185" strokeDasharray="2 9" />
        <ellipse cx="320" cy="300" rx="240" ry="90" transform="rotate(-22 320 300)" />
      </g>
      <g transform="translate(246 228) rotate(-12 75 75)">
        <rect width="150" height="150" rx="36" fill={`url(#${id}metal)`} stroke="#ffffff80" />
        <circle cx="75" cy="59" r="22" fill="#111" stroke="#aaa" />
        <path d="M35 113Q35 81 75 81Q115 81 115 113" fill="#151515" stroke="#aaa" />
      </g>
      {[
        [50, 118, -8, "GUEST PROFILE"],
        [395, 100, 8, "NEW ENQUIRY"],
        [40, 370, -8, "CONVERSATION"],
        [405, 365, 8, "NEXT STEP"],
      ].map(([x, y, rot, label]) => (
        <g key={String(label)} transform={`translate(${x} ${y}) rotate(${rot} 85 50)`}>
          <rect width="175" height="95" rx="12" fill={`url(#${id}dark)`} stroke="#ffffff4a" />
          <circle cx="27" cy="29" r="9" fill="#888" />
          <rect x="48" y="23" width="95" height="5" rx="2" fill="#aaa" />
          <rect x="48" y="35" width="66" height="3" rx="1" fill="#555" />
          <text x="18" y="75" fill="#aaa" fontSize="8" fontFamily="monospace">
            {label}
          </text>
          <circle cx="150" cy="72" r="4" fill="#ccc" />
        </g>
      ))}
    </svg>
  );
}

function OmsScene({ id }: { id: string }) {
  const tables = [
    [95, 230],
    [215, 160],
    [325, 235],
    [220, 310],
  ] as const;
  return (
    <svg viewBox="0 0 640 620" aria-hidden="true">
      <MetalDefs id={id} />
      <g transform="translate(80 110)">
        <path d="M0 255L215 125L465 265L245 400Z" fill={`url(#${id}dark)`} stroke="#ffffff35" />
        <path d="M0 255V280L245 425L465 290V265L245 400Z" fill="#121212" stroke="#ffffff20" />
        {tables.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <path
              d={`M${cx - 38} ${cy}v20q38 34 76 0v-20`}
              fill={`url(#${id}metal)`}
              stroke="#ffffff40"
            />
            <ellipse cx={cx} cy={cy} rx="38" ry="22" fill={`url(#${id}metal)`} stroke="#ddd9" />
            <circle cx={cx} cy={cy} r="5" fill="#333" />
            <ellipse cx={cx - 50} cy={cy + 25} rx="10" ry="6" fill="#666" />
            <ellipse cx={cx + 50} cy={cy - 25} rx="10" ry="6" fill="#888" />
          </g>
        ))}
        <g transform="translate(305 12) rotate(8)">
          <rect width="144" height="145" rx="10" fill={`url(#${id}dark)`} stroke="#ffffff70" />
          <text x="16" y="28" fill="#ddd" fontSize="10" fontFamily="monospace">
            TABLE / 04
          </text>
          <path d="M16 40H128M16 61H98M16 78H118M16 95H91" stroke="#888" strokeWidth="3" />
          <rect x="16" y="115" width="110" height="15" rx="4" fill="#bdbdbd" />
        </g>
      </g>
    </svg>
  );
}

function HmsScene({ id }: { id: string }) {
  const leftWindows = [145, 215, 285, 355].flatMap((y) =>
    [45, 85, 125].map((x) => ({ x, y, lit: x === 85 && y === 215 })),
  );
  const rightWindows = [130, 200, 270, 340].flatMap((y) =>
    [210, 248, 286].map((x) => ({ x, y })),
  );
  return (
    <svg viewBox="0 0 640 620" aria-hidden="true">
      <MetalDefs id={id} />
      <g transform="translate(140 80)">
        <path d="M-65 380L165 245L405 385L175 520Z" fill={`url(#${id}dark)`} stroke="#ffffff24" />
        <path d="M20 100L180 10L180 355L20 450Z" fill={`url(#${id}metal)`} stroke="#ffffff70" />
        <path d="M180 10L340 105V450L180 355Z" fill={`url(#${id}dark)`} stroke="#ffffff50" />
        <path d="M20 100L180 10L340 105L180 198Z" fill={`url(#${id}shine)`} stroke="#ccc" />
        {leftWindows.map((w) => (
          <path
            key={`l${w.x}${w.y}`}
            d={`M${w.x} ${w.y}l20 -11v32l-20 12Z`}
            fill={w.lit ? "#e4e4e4" : "#333"}
            stroke="#ddd5"
          />
        ))}
        {rightWindows.map((w) => (
          <path
            key={`r${w.x}${w.y}`}
            d={`M${w.x} ${w.y}l20 12v32l-20 -12Z`}
            fill="#777"
            stroke="#ddd3"
          />
        ))}
        <path d="M80 377V315L120 292V354" fill="#111" stroke="#ddd7" />
        <g transform="translate(-75 245) rotate(-8)">
          <rect width="148" height="83" rx="10" fill={`url(#${id}dark)`} stroke="#fff6" />
          <text x="14" y="26" fill="#ddd" fontSize="10" fontFamily="monospace">
            ROOM / 201
          </text>
          <path d="M14 41H130" stroke="#666" />
          <text x="14" y="64" fill="#aaa" fontSize="8" fontFamily="monospace">
            READY FOR ARRIVAL
          </text>
        </g>
      </g>
    </svg>
  );
}

function WebScene({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 640 620" aria-hidden="true">
      <MetalDefs id={id} />
      <g transform="translate(80 130) rotate(-10 240 180)">
        <rect x="45" y="-45" width="430" height="300" rx="15" fill={`url(#${id}dark)`} stroke="#ffffff35" />
        <rect x="22" y="-22" width="430" height="300" rx="15" fill={`url(#${id}dark)`} stroke="#ffffff50" />
        <rect width="430" height="300" rx="15" fill={`url(#${id}metal)`} stroke="#ffffff80" />
        <path d="M0 35H430" stroke="#fff5" />
        <circle cx="18" cy="18" r="3" fill="#ccc" />
        <circle cx="30" cy="18" r="3" fill="#888" />
        <circle cx="42" cy="18" r="3" fill="#555" />
        <rect x="18" y="53" width="394" height="225" rx="5" fill="#161616" />
        <text x="38" y="83" fill="#aaa" fontSize="8" fontFamily="monospace" letterSpacing="2">
          STILL HOUSE
        </text>
        <text x="38" y="137" fill="#eee" fontSize="28" fontFamily="Georgia">
          A sense
        </text>
        <text x="38" y="169" fill="#eee" fontSize="28" fontFamily="Georgia">
          of place.
        </text>
        <rect x="38" y="194" width="97" height="25" rx="13" fill="#ccc" />
        <path d="M275 258V150a53 53 0 0 1 106 0v108" fill={`url(#${id}metal)`} stroke="#fff6" />
        <path d="M288 258V152a40 40 0 0 1 80 0v106" fill="#333" stroke="#aaa" />
      </g>
    </svg>
  );
}

function GrowthScene({ id }: { id: string }) {
  const bars = [
    [65, 85],
    [165, 155],
    [265, 230],
    [365, 300],
  ] as const;
  return (
    <svg viewBox="0 0 640 620" aria-hidden="true">
      <MetalDefs id={id} />
      <g transform="translate(65 85)">
        <path d="M0 350L240 210L500 360L260 500Z" fill={`url(#${id}dark)`} stroke="#fff3" />
        {bars.map(([x, h]) => {
          const top = 330 - h;
          return (
            <g key={x}>
              <path
                d={`M${x} ${330}v-${h}l45 25v${h}Z`}
                fill={`url(#${id}metal)`}
                stroke="#ffffff60"
              />
              <path
                d={`M${x + 45} ${355}l35 -20v-${h}l-35 20Z`}
                fill={`url(#${id}dark)`}
                stroke="#fff4"
              />
              <path
                d={`M${x} ${top}l35 -20l45 25l-35 20Z`}
                fill={`url(#${id}shine)`}
                stroke="#ccc7"
              />
            </g>
          );
        })}
        <path d="M20 255Q190 250 380 20M310 25L380 20L370 90" fill="none" stroke="#ddd" strokeWidth="4" />
        <circle cx="60" cy="380" r="6" fill="#ccc" />
        <path d="M60 380L250 485L465 365" fill="none" stroke="#ffffff40" strokeDasharray="3 7" />
      </g>
    </svg>
  );
}

const scenes: Record<ServiceSlug, (id: string) => ReactElement> = {
  crm: (id) => <CrmScene id={id} />,
  oms: (id) => <OmsScene id={id} />,
  hms: (id) => <HmsScene id={id} />,
  web: (id) => <WebScene id={id} />,
  growth: (id) => <GrowthScene id={id} />,
};

export function OrbitScene({ slug, prefix }: { slug: ServiceSlug; prefix: string }) {
  return scenes[slug](prefix);
}
