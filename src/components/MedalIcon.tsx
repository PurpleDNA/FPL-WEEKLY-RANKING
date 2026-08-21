// Companion to CrownIcon, in the same line-art hand: two ribbon straps and a
// plain disc. Colour comes from the caller, so one icon serves silver and
// bronze. No inner detail — it would turn to mush at 20px.
const MedalIcon = ({ className }: { className?: string }) => (
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
    <path d="M7.4 3.2 L10.7 10" />
    <path d="M16.6 3.2 L13.3 10" />
    <circle cx="12" cy="15.1" r="5" />
  </svg>
);

export default MedalIcon;
