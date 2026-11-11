"use client";

import type { MouseEvent } from "react";

type NodeProps = {
  active: boolean;
  done: boolean;
  href?: string;
};

function CardLink({
  href,
  label,
  className = "eco-photo-learn",
  external = true,
}: {
  href?: string;
  label: string;
  className?: string;
  external?: boolean;
}) {
  if (!href) {
    return <span className={className}>{label}</span>;
  }
  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
    >
      {label}
    </a>
  );
}

function LearnMoreLink({ href }: { href?: string }) {
  return <CardLink href={href} label="Learn more →" />;
}

function SupplyStatus({ lit }: { lit: boolean }) {
  return (
    <span className={`eco-supply-status${lit ? " is-on" : ""}`} aria-hidden="true">
      {lit ? (
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
          <circle cx="10" cy="10" r="9" fill="currentColor" />
          <path d="m6.2 10.2 2.4 2.4 5.2-5.2" stroke="#120816" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
          <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
    </span>
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

function SupplyShotCard({
  active,
  done,
  href,
  shot,
  label,
  title,
  caption,
  index,
}: NodeProps & {
  shot: string;
  label: string;
  title: string;
  caption: string;
  index: string;
}) {
  const lit = active || done;
  return (
    <div
      className={`eco-supply-card${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}
      data-shot={label}
    >
      <div className="eco-supply-media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static showcase asset */}
        <img className="eco-supply-shot" src={shot} alt="" draggable={false} />
        <span className="eco-supply-orbit-pulse" />
      </div>
      <span className="eco-supply-index" aria-hidden="true">
        {index}
      </span>
      <SupplyStatus lit={lit} />
      <div className="eco-supply-copy">
        <strong>{title}</strong>
        <span>{caption}</span>
      </div>
      <CardLink className="eco-supply-cta" href={href} label="Explore categories →" external={false} />
    </div>
  );
}

export function SupplyListNode(props: NodeProps) {
  return (
    <SupplyShotCard
      {...props}
      shot="/media/supply-01-art.png"
      label="list"
      index="01"
      title="List what's needed"
      caption="Food · linen · amenities."
    />
  );
}

export function SupplyOrderNode(props: NodeProps) {
  return (
    <SupplyShotCard
      {...props}
      shot="/media/supply-02-art.png"
      label="order"
      index="02"
      title="Place one order"
      caption="Unified procurement."
    />
  );
}

export function SupplyReceiveNode(props: NodeProps) {
  return (
    <SupplyShotCard
      {...props}
      shot="/media/supply-03-art.png"
      label="receive"
      index="03"
      title="Receive supplies"
      caption="Stock ready."
    />
  );
}

function OpsArrowChip() {
  return (
    <span className="eco-ops-go" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
        <path
          d="M8 12h8m0 0-3.2-3.2M16 12l-3.2 3.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function OpsGatherNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-ops-card eco-ops-card--gather${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <span className="eco-ops-orbit eco-ops-orbit--a" aria-hidden="true" />
      <span className="eco-ops-orbit eco-ops-orbit--b" aria-hidden="true" />
      <span className="eco-ops-index" aria-hidden="true">
        01
      </span>
      <div className="eco-ops-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3.5v3.5M16 3.5v3.5M3.5 10h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="7.2" y="13" width="3.2" height="3.2" rx="0.7" fill="currentColor" opacity="0.85" />
        </svg>
      </div>
      <div className="eco-ops-media eco-ops-media--calendar" aria-hidden="true" />
      <div className="eco-ops-copy">
        <strong>Gather stay details</strong>
        <span>Bookings, messages, tasks.</span>
      </div>
      <div className="eco-ops-foot">
        <div className="eco-ops-avatars" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static showcase avatars */}
          <img src="/media/avatars/guest-01.jpg" alt="" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element -- static showcase avatars */}
          <img src="/media/avatars/guest-02.jpg" alt="" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element -- static showcase avatars */}
          <img src="/media/avatars/guest-03.jpg" alt="" draggable={false} />
          <em>+3</em>
        </div>
        <OpsArrowChip />
      </div>
    </div>
  );
}

export function OpsConnectNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-ops-card eco-ops-card--connect${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <span className="eco-ops-spark" aria-hidden="true" />
      <span className="eco-ops-index" aria-hidden="true">
        02
      </span>
      <div className="eco-ops-icon eco-ops-icon--disc" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" />
        </svg>
      </div>
      <div className="eco-ops-media eco-ops-media--profile" aria-hidden="true" />
      <div className="eco-ops-copy">
        <strong>Connect the record</strong>
        <span>HMS, OMS and CRM.</span>
      </div>
      <div className="eco-ops-foot">
        <span className={`eco-ops-sync${active ? " is-live" : lit ? " is-on" : ""}`}>
          <i aria-hidden="true">
            <b />
            <b />
            <b />
            <b />
          </i>
          Syncing data...
        </span>
      </div>
    </div>
  );
}

export function OpsReadyNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <div className={`eco-ops-card eco-ops-card--ready${lit ? " is-lit" : ""}${active ? " is-active" : ""}`}>
      <div className="eco-ops-room" aria-hidden="true" />
      <span className="eco-ops-room-scrim" aria-hidden="true" />
      <span className="eco-ops-index" aria-hidden="true">
        03
      </span>
      <div className="eco-ops-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m8 12.2 2.6 2.6 5.4-5.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="eco-ops-copy">
        <strong>Prepare check-in</strong>
        <span>Guest context ready.</span>
      </div>
      <div className="eco-ops-foot">
        <span className={`eco-ops-ready${lit ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Ready.
        </span>
        <OpsArrowChip />
      </div>
    </div>
  );
}
