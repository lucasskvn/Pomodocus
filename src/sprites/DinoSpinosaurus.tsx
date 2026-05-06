interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoSpinosaurus({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -2
  const ll = frame === 1 ? -26 : frame === 2 ? 26 : 0
  const rl = frame === 1 ? 26 : frame === 2 ? -26 : 0
  const sailSway = frame === 1 ? -3 : frame === 2 ? 3 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Tail */}
        <path d="M 22 46 Q 12 44 7 50 Q 5 55 9 54 Q 15 51 20 48" fill="#30c0c0" stroke="#1a8080" strokeWidth="1.5"/>
        <path d="M 12 48 Q 8 44 6 48" stroke="#30c0c0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* Body */}
        <ellipse cx="34" cy="44" rx="17" ry="12" fill="#40d0d0" stroke="#1a8080" strokeWidth="1.5" transform="rotate(-8, 34, 44)"/>
        <ellipse cx="36" cy="48" rx="11" ry="7" fill="#60e0e0" opacity="0.4"/>
        {/* Scales */}
        <circle cx="28" cy="41" r="1.5" fill="#30c0c0" opacity="0.6"/>
        <circle cx="34" cy="40" r="1.5" fill="#30c0c0" opacity="0.6"/>
        <circle cx="40" cy="43" r="1.5" fill="#30c0c0" opacity="0.6"/>

        {/* Sail — spines connected by membrane, sways */}
        <g transform={`rotate(${sailSway}, 36, 38)`}>
          <path d="M 24 38 Q 30 16 36 12 Q 42 16 48 38"
            fill="#ff80cc" stroke="#c040a0" strokeWidth="1.2" opacity="0.85"/>
          {/* Sail spines */}
          {[26, 30, 34, 38, 42, 46].map((x, i) => {
            const sy = [34, 22, 16, 14, 20, 32][i]
            return <line key={i} x1={x} y1="38" x2={x} y2={sy}
              stroke="#c040a0" strokeWidth="1.2"/>
          })}
          {/* Sail highlight */}
          <path d="M 28 36 Q 33 20 36 16 Q 39 20 40 36"
            fill="#ffa0d8" opacity="0.3"/>
        </g>

        {/* Small arms */}
        <path d="M 44 40 Q 50 37 53 40 Q 51 43 47 42 Z" fill="#30c0c0" stroke="#1a8080" strokeWidth="1"/>

        {/* Neck */}
        <path d="M 44 36 Q 50 28 52 22" stroke="#40d0d0" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <path d="M 44 36 Q 50 28 52 22" stroke="#1a8080" strokeWidth="10.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Head — crocodilian snout */}
        <ellipse cx="54" cy="18" rx="12" ry="8" fill="#40d0d0" stroke="#1a8080" strokeWidth="1.5"/>
        <path d="M 44 20 Q 56 17 68 20 Q 68 25 56 26 Q 44 25 44 20 Z" fill="#40d0d0" stroke="#1a8080" strokeWidth="1.2"/>
        <path d="M 46 21 Q 56 24 66 21" fill="#20a0a0" stroke="#1a8080" strokeWidth="0.8"/>
        {/* Nostrils */}
        <circle cx="62" cy="19" r="1" fill="#1a8080"/>
        <circle cx="65" cy="19" r="1" fill="#1a8080"/>

        {/* Eye */}
        <circle cx="55" cy="14" r="3" fill="white" stroke="#1a8080" strokeWidth="1"/>
        <circle cx="55.5" cy="14" r="1.8" fill="#206060"/>
        <circle cx="55.5" cy="14" r="1" fill="#111"/>
        <circle cx="56.2" cy="13.3" r="0.5" fill="white"/>

        {/* Biped legs */}
        <g transform={`rotate(${ll}, 30, 52)`}>
          <line x1="30" y1="52" x2="28" y2="66" stroke="#30c0c0" strokeWidth="5" strokeLinecap="round"/>
          <line x1="28" y1="66" x2="26" y2="71" stroke="#30c0c0" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 22 71 L 32 71" stroke="#1a8080" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g transform={`rotate(${rl}, 38, 52)`}>
          <line x1="38" y1="52" x2="36" y2="66" stroke="#40d0d0" strokeWidth="5" strokeLinecap="round"/>
          <line x1="36" y1="66" x2="34" y2="71" stroke="#40d0d0" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 30 71 L 40 71" stroke="#1a8080" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  )
}
