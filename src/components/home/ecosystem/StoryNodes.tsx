"use client";

import type { MouseEvent } from "react";

type NodeProps = {
  active: boolean;
  done: boolean;
  href?: string;
};

function LearnMoreLink({ href }: { href?: string }) {
  if (!href) {
    return <span className="eco-photo-learn">Learn more →</span>;
  }
  return (
    <a
      className="eco-photo-learn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
    >
      Learn more →
    </a>
  );
}

function CheckRow({
  y,
  label,
  on,
}: {
  y: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect className={`eco-svg-check-box${on ? " is-on" : ""}`} x="18" y={y - 7} width="11" height="11" rx="2" />
      <path className={`eco-svg-check${on ? " is-on" : ""}`} d={`M20.2 ${y - 1.5}l2.6 2.6 4.8-4.8`} />
      <text className="eco-svg-label" x="36" y={y + 2}>
        {label}
      </text>
    </g>
  );
}

export function GeorgiaDiscoverNode({ active, done, href }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-discover-card${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <div className="eco-discover-media" aria-hidden="true" />
      <span className="eco-discover-scrim" aria-hidden="true" />
      <span className="eco-discover-arc" aria-hidden="true" />
      <span className="eco-discover-rim" aria-hidden="true" />
      <div className="eco-photo-copy">
        <strong>Discover Georgia</strong>
        <span>Explore a stay across the country</span>
      </div>
      <LearnMoreLink href={href} />
    </div>
  );
}

export function GeorgiaEnquireNode({ active, done, href }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-enquire-card${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <span className="eco-enquire-glow" aria-hidden="true" />
      <span className="eco-enquire-orbit" aria-hidden="true" />

      <div className="eco-enquire-widget" aria-hidden="true">
        <div className="eco-enquire-field eco-enquire-field--search">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
            <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m15.2 15.2 3.4 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Stay in Tbilisi</span>
          <svg className="eco-enquire-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none">
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="eco-enquire-dates">
          <div className="eco-enquire-field">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
              <rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 3.8v3.2M16 3.8v3.2M4 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span>Check in</span>
          </div>
          <div className="eco-enquire-field">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
              <rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 3.8v3.2M16 3.8v3.2M4 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span>Check out</span>
          </div>
        </div>
        <div className="eco-enquire-send">
          Send inquiry <span aria-hidden="true">→</span>
        </div>
      </div>

      <div className="eco-photo-copy">
        <strong>Send an inquiry</strong>
        <span>WhatsApp, dates &amp; guests</span>
      </div>
      <LearnMoreLink href={href} />
    </div>
  );
}

export function GeorgiaReachNode({ active, done, href }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-reach-card${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <div className="eco-reach-media" aria-hidden="true" />
      <span className="eco-reach-scrim" aria-hidden="true" />
      <span className="eco-reach-rim" aria-hidden="true" />
      <div className="eco-photo-copy">
        <strong>Reach the property</strong>
        <span>Intent received</span>
      </div>
      <LearnMoreLink href={href} />
    </div>
  );
}

export function SupplyListNode({ active, done }: NodeProps) {
  const rows = [
    { y: 26, label: "FOOD", threshold: 0 },
    { y: 42, label: "LINEN", threshold: 1 },
    { y: 58, label: "AMENITIES", threshold: 2 },
  ];
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="10" y="8" width="100" height="70" rx="12" />
      {rows.map((row) => (
        <CheckRow
          key={row.label}
          y={row.y}
          label={row.label}
          on={done || active || row.threshold === 0}
        />
      ))}
      <text className="eco-svg-micro" x="36" y="74">
        + EQUIPMENT
      </text>
    </svg>
  );
}

export function SupplyOrderNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="16" y="8" width="88" height="70" rx="12" />
      <text className="eco-svg-label" x="28" y="26">
        ORDER #4821
      </text>
      <path className={`eco-svg-ink${lit ? " is-on" : ""}`} d="M28 36h64M28 46h44M28 56h54" />
      <rect className={`eco-svg-cta${active ? " is-live" : done ? " is-on" : ""}`} x="28" y="64" width="64" height="6" rx="3" />
    </svg>
  );
}

export function SupplyReceiveNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="12" y="10" width="96" height="66" rx="12" />
      <path
        className={`eco-svg-fill${lit ? " is-on" : ""}`}
        d="M30 50 46 34l16 16v18H30Zm36-4 14-14 14 14v22H66Z"
      />
      <path className="eco-svg-ink" d="M30 50 46 34l16 16M46 34v34M66 46l14-14 14 14M80 32v36" />
      <path className={`eco-svg-check${lit ? " is-on" : ""}`} d="m88 22 5 5 9-9" />
      <circle className={`eco-svg-pin${active ? " is-live" : ""}`} cx="34" cy="24" r="3" />
    </svg>
  );
}

export function OpsGatherNode({ active, done }: NodeProps) {
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="8" y="8" width="104" height="70" rx="12" />
      <CheckRow y={26} label="RESERVATION" on={active || done} />
      <CheckRow y={44} label="GUEST MESSAGE" on={active || done} />
      <CheckRow y={62} label="TEAM TASK" on={active || done} />
    </svg>
  );
}

export function OpsConnectNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="12" y="8" width="96" height="70" rx="12" />
      <circle className={`eco-svg-pin${lit ? " is-on" : ""}`} cx="34" cy="30" r="9" />
      <path className="eco-svg-ink" d="M30 28h8M34 24v8" opacity="0.45" />
      <path className={`eco-svg-field${lit ? " is-on" : ""}`} d="M50 24h46M50 34h34" />
      <rect className={`eco-svg-cta${active ? " is-live" : done ? " is-on" : ""}`} x="24" y="48" width="72" height="20" rx="6" />
      <text className="eco-svg-cta-text" x="36" y="60">
        GUEST RECORD
      </text>
    </svg>
  );
}

export function OpsReadyNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="14" y="8" width="92" height="70" rx="12" />
      <circle className={`eco-svg-pin${lit ? " is-on" : ""}`} cx="42" cy="34" r="12" />
      <path className="eco-svg-ink" d="M42 28c2.8 0 5 2.4 5 5.4 0 4-5 7.6-5 7.6s-5-3.6-5-7.6c0-3 2.2-5.4 5-5.4Z" opacity="0.55" />
      <path className={`eco-svg-check${lit ? " is-on" : ""}`} d="m76 24 5 5 10-10" />
      <rect className={`eco-svg-cta${active ? " is-live" : done ? " is-on" : ""}`} x="28" y="56" width="64" height="12" rx="6" />
      <text className="eco-svg-cta-text" x="46" y="64.5">
        CHECK-IN
      </text>
    </svg>
  );
}
