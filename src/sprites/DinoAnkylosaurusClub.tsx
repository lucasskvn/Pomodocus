interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoAnkylosaurusClub({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1
  const fl = frame === 1 ? 15 : frame === 2 ? -15 : 0
  const fr = frame === 1 ? -15 : frame === 2 ? 15 : 0
  const bl = frame === 1 ? -13 : frame === 2 ? 13 : 0
  const br = frame === 1 ? 13 : frame === 2 ? -13 : 0
  // Club tail swings opposite to walk
  const clubSwing = frame === 1 ? 8 : frame === 2 ? -8 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Club tail */}
        <path d={`M 18 50 Q 12 ${48 + clubSwing} 8 ${52 + clubSwing}`}
          stroke="#3d5c10" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <circle cx={8} cy={52 + clubSwing} r="6" fill="#4a6e18" stroke="#2a4008" strokeWidth="1.5"/>
        {/* Spikes on club */}
        <line x1={5} y1={48 + clubSwing} x2={3} y2={44 + clubSwing} stroke="#2a4008" strokeWidth="2" strokeLinecap="round"/>
        <line x1={10} y1={47 + clubSwing} x2={10} y2={43 + clubSwing} stroke="#2a4008" strokeWidth="2" strokeLinecap="round"/>

        {/* Body — wide, low, olive */}
        <ellipse cx="36" cy="50" rx="22" ry="13" fill="#4a6e18" stroke="#2a4008" strokeWidth="1.5"/>
        <ellipse cx="36" cy="44" rx="20" ry="6" fill="#5a8020" stroke="#2a4008" strokeWidth="1"/>

        {/* Heavy armor plates */}
        {[24, 30, 36, 42, 48].map((x, i) => (
          <polygon key={i}
            points={`${x},40 ${x+5},37 ${x+7},41 ${x+5},45 ${x},45 ${x-2},41`}
            fill={i % 2 === 0 ? '#3d5c10' : '#4a6e18'} stroke="#2a4008" strokeWidth="0.8"/>
        ))}
        {/* Spikes on back */}
        {[27, 34, 41].map((x, i) => (
          <path key={i} d={`M ${x} 38 L ${x+2} 32 L ${x+4} 38`}
            fill="#5a8020" stroke="#2a4008" strokeWidth="1"/>
        ))}

        {/* Neck */}
        <path d="M 51 43 Q 55 39 57 36" stroke="#4a6e18" strokeWidth="7" strokeLinecap="round" fill="none"/>

        {/* Head */}
        <ellipse cx="59" cy="34" rx="8" ry="6" fill="#4a6e18" stroke="#2a4008" strokeWidth="1.5"/>
        <path d="M 63 36 Q 71 36 70 38 Q 66 40 63 38 Z" fill="#5a8020" stroke="#2a4008" strokeWidth="1"/>
        {/* Armor brow */}
        <path d="M 54 32 Q 59 28 64 32" fill="#3d5c10" stroke="#2a4008" strokeWidth="1"/>
        <circle cx="61" cy="31" r="2.5" fill="white" stroke="#2a4008" strokeWidth="0.8"/>
        <circle cx="61.5" cy="31" r="1.5" fill="#3d5c10"/>
        <circle cx="61.5" cy="31" r="0.8" fill="#111"/>
        <circle cx="62" cy="30.5" r="0.4" fill="white"/>

        {/* Legs */}
        <g transform={`rotate(${bl}, 22, 60)`}>
          <line x1="22" y1="60" x2="22" y2="70" stroke="#3d5c10" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="22" cy="71" rx="5" ry="2" fill="#3d5c10" stroke="#2a4008" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 30, 60)`}>
          <line x1="30" y1="60" x2="30" y2="70" stroke="#4a6e18" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="30" cy="71" rx="5" ry="2" fill="#4a6e18" stroke="#2a4008" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fl}, 44, 59)`}>
          <line x1="44" y1="59" x2="44" y2="69" stroke="#3d5c10" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="44" cy="70" rx="5" ry="2" fill="#3d5c10" stroke="#2a4008" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 52, 59)`}>
          <line x1="52" y1="59" x2="52" y2="69" stroke="#4a6e18" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="52" cy="70" rx="5" ry="2" fill="#4a6e18" stroke="#2a4008" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
