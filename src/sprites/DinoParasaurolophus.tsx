interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoParasaurolophus({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1.5
  // Quadruped diagonal gait
  const fl = frame === 1 ? 22 : frame === 2 ? -22 : 0
  const fr = frame === 1 ? -22 : frame === 2 ? 22 : 0
  const bl = frame === 1 ? -18 : frame === 2 ? 18 : 0
  const br = frame === 1 ? 18 : frame === 2 ? -18 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>

      <g transform={`translate(0, ${bob})`}>
        {/* Tail */}
        <path d="M 20 44 Q 10 42 6 48 Q 4 52 8 52 Q 12 50 18 46" fill="#5cb85c" stroke="#2d6a2d" strokeWidth="1.5" strokeLinejoin="round"/>

        {/* Body */}
        <ellipse cx="36" cy="44" rx="20" ry="13" fill="#6dcf6d" stroke="#2d6a2d" strokeWidth="1.5"/>
        {/* Belly highlight */}
        <ellipse cx="36" cy="47" rx="13" ry="7" fill="#8fe88f" opacity="0.5"/>
        {/* Skin spots */}
        <circle cx="30" cy="40" r="2" fill="#5cb85c" opacity="0.6"/>
        <circle cx="38" cy="38" r="1.5" fill="#5cb85c" opacity="0.6"/>
        <circle cx="42" cy="43" r="2" fill="#5cb85c" opacity="0.6"/>

        {/* Neck */}
        <path d="M 48 38 Q 54 32 56 26" stroke="#6dcf6d" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M 48 38 Q 54 32 56 26" stroke="#2d6a2d" strokeWidth="9.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Head */}
        <ellipse cx="58" cy="23" rx="10" ry="8" fill="#6dcf6d" stroke="#2d6a2d" strokeWidth="1.5"/>
        {/* Duck bill */}
        <path d="M 62 24 Q 74 23 72 27 Q 68 30 62 27 Z" fill="#8fe88f" stroke="#2d6a2d" strokeWidth="1.2"/>
        {/* Nostril */}
        <circle cx="68" cy="24" r="0.8" fill="#2d6a2d"/>

        {/* Crest */}
        <path d="M 55 16 Q 60 4 65 8 Q 62 18 58 18 Z" fill="#e8801a" stroke="#b35c00" strokeWidth="1.2"/>
        <path d="M 56 18 Q 58 10 62 12 Q 60 20 57 19 Z" fill="#f5a040" opacity="0.5"/>

        {/* Eye */}
        <circle cx="60" cy="20" r="3" fill="white" stroke="#2d6a2d" strokeWidth="1"/>
        <circle cx="61" cy="20" r="1.8" fill="#3a7a3a"/>
        <circle cx="61" cy="20" r="1" fill="#111"/>
        <circle cx="61.8" cy="19.2" r="0.5" fill="white"/>

        {/* Back legs (behind body) */}
        <g transform={`rotate(${bl}, 26, 54)`}>
          <line x1="26" y1="54" x2="26" y2="68" stroke="#4a9a4a" strokeWidth="4.5" strokeLinecap="round"/>
          <ellipse cx="26" cy="69" rx="4" ry="2.5" fill="#4a9a4a" stroke="#2d6a2d" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 32, 54)`}>
          <line x1="32" y1="54" x2="32" y2="68" stroke="#5cb85c" strokeWidth="4.5" strokeLinecap="round"/>
          <ellipse cx="32" cy="69" rx="4" ry="2.5" fill="#5cb85c" stroke="#2d6a2d" strokeWidth="1"/>
        </g>

        {/* Front legs */}
        <g transform={`rotate(${fl}, 44, 52)`}>
          <line x1="44" y1="52" x2="44" y2="66" stroke="#4a9a4a" strokeWidth="4.5" strokeLinecap="round"/>
          <ellipse cx="44" cy="67" rx="4" ry="2.5" fill="#4a9a4a" stroke="#2d6a2d" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 50, 52)`}>
          <line x1="50" y1="52" x2="50" y2="66" stroke="#5cb85c" strokeWidth="4.5" strokeLinecap="round"/>
          <ellipse cx="50" cy="67" rx="4" ry="2.5" fill="#5cb85c" stroke="#2d6a2d" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
