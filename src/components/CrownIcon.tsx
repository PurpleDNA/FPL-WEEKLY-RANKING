// Line-art crown traced from public/crown_icon.avif: three points each capped
// with a small open ring, sitting on a shallow detached band. Kept wide and
// low like the source; stroke is a touch heavier so it holds together at 20px.
const CrownIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="5.9" r="1" />
    <circle cx="2.75" cy="9.15" r="1" />
    <circle cx="21.3" cy="9.15" r="1" />
    <path d="M6.05 16.7 L3.8 10.4 Q5.65 16.2 12 7.7 Q18.35 16.2 20.05 10.35 L17.8 16.45" />
    <ellipse cx="11.95" cy="17.75" rx="5.85" ry="1.1" />
  </svg>
);

export default CrownIcon;
