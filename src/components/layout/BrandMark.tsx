/** Beyond OS mascot mark: a soft four-lobed head with two eyes over a base line. */
export function BrandMark({ className = "brand-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="20 18 60 72" aria-hidden="true" focusable="false">
      <defs>
        <mask id="brand-mark-eyes">
          <rect x="20" y="18" width="60" height="72" fill="#fff" />
          <rect x="42.5" y="43" width="3.2" height="10" rx="1.6" fill="#000" />
          <rect x="54.3" y="43" width="3.2" height="10" rx="1.6" fill="#000" />
        </mask>
      </defs>
      <g fill="currentColor" mask="url(#brand-mark-eyes)">
        <circle cx="50" cy="36" r="13" />
        <circle cx="37" cy="50" r="12.5" />
        <circle cx="63" cy="50" r="12.5" />
        <circle cx="50" cy="50" r="16" />
        <circle cx="50" cy="61" r="14" />
      </g>
      <rect x="40.5" y="82" width="19" height="4.5" rx="2.25" fill="currentColor" />
    </svg>
  );
}
