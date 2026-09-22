export function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={up ? { transform: 'rotate(-90deg)' } : undefined}
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
export function Brand() {
  return (
    <span className="brand" aria-label="MonDex">
      <span>M</span>
      <img src="/assets/orbit.svg" alt="" width="24" height="24" />
      <span>
        n<span className="brand-accent">Dex</span>
      </span>
    </span>
  );
}
