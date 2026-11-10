"use client";

type NodeProps = {
  active: boolean;
  done: boolean;
};

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

export function GeorgiaDiscoverNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="8" y="8" width="104" height="70" rx="12" />
      <path
        className={`eco-svg-land${lit ? " is-on" : ""}`}
        d="M26 50c4-16 13-24 24-26 9-2 15 2 22 1 8-1 15-9 24-4 6 3 11 13 8 21-3 13-15 19-28 21-11 2-19-1-27 2-9 3-17-2-23-15Z"
      />
      <circle className={`eco-svg-pin${lit ? " is-on" : ""}`} cx="44" cy="46" r="2.5" />
      <circle className={`eco-svg-pin${active ? " is-live" : done ? " is-on" : ""}`} cx="68" cy="36" r="4.5" />
      <circle className={`eco-svg-pulse${active ? " is-live" : ""}`} cx="68" cy="36" r="11" />
      <path className={`eco-svg-route${lit ? " is-on" : ""}`} d="M44 46c8-4 16-8 24-10" />
      <path
        className={`eco-svg-fill${lit ? " is-on" : ""}`}
        d="M86 52h10v14H86Zm2-4 5-5 5 5"
        style={{ opacity: lit ? 1 : 0.35 }}
      />
    </svg>
  );
}

export function GeorgiaEnquireNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="18" y="8" width="84" height="70" rx="12" />
      <text className="eco-svg-label" x="28" y="24">
        STAY INQUIRY
      </text>
      <rect className={`eco-svg-field${lit ? " is-on" : ""}`} x="28" y="32" width="64" height="9" rx="3" />
      <text className="eco-svg-micro" x="32" y="39">
        DATES + GUESTS
      </text>
      <rect className={`eco-svg-field${lit ? " is-on" : ""}`} x="28" y="45" width="30" height="8" rx="2" />
      <rect className={`eco-svg-field${lit ? " is-on" : ""}`} x="62" y="45" width="30" height="8" rx="2" />
      <rect className={`eco-svg-cta${active ? " is-live" : done ? " is-on" : ""}`} x="28" y="58" width="64" height="12" rx="6" />
      <text className="eco-svg-cta-text" x="40" y="66.5">
        SEND · WA
      </text>
    </svg>
  );
}

export function GeorgiaReachNode({ active, done }: NodeProps) {
  const lit = active || done;
  return (
    <svg className="eco-node-svg" viewBox="0 0 120 86" aria-hidden="true">
      <rect className="eco-svg-base" x="14" y="10" width="92" height="66" rx="12" />
      <path className={`eco-svg-fill${lit ? " is-on" : ""}`} d="M34 42 60 20l26 22v28H34Z" />
      <path className="eco-svg-ink" d="M34 42 60 20l26 22M40 40v30h40V40" />
      <path className="eco-svg-ink" d="M52 70V50h16v20M42 50h10v10H42Zm26 0h10v10H68Z" />
      <circle className={`eco-svg-pin${active ? " is-live" : done ? " is-on" : ""}`} cx="88" cy="24" r="8" />
      <path className={`eco-svg-check${lit ? " is-on" : ""}`} d="m84.5 24 2.8 2.8 5.5-5.5" />
    </svg>
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
