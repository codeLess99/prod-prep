export default function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 36 24" width="36" height="24" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 6} y={20 - (i + 1) * 3.2} width="4" height={(i + 1) * 3.2 + 1} rx="1" fill={`var(--w${i + 1})`} />
        ))}
      </svg>
      <span>PM Prep Tracker</span>
    </span>
  )
}
