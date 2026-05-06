interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoTriceratops({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1.5
  const fl = frame === 1 ? 20 : frame === 2 ? -20 : 0
  const fr = frame === 1 ? -20 : frame === 2 ? 20 : 0
  const bl = frame === 1 ? -18 : frame === 2 ? 18 : 0
  const br = frame === 1 ? 18 : frame === 2 ? -18 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Tail — short */}
        <path d="M 18 47 Q 12 46 9 50 Q 9 53 12 52 Q 16 50 18 49" fill="#5a6e7a" stroke="#3a4e5a" strokeWidth="1.5"/>

        {/* Body — stocky */}
        <ellipse cx="35" cy="47" rx="21" ry="14" fill="#6c8090" stroke="#3a4e5a" strokeWidth="1.5"/>
        <ellipse cx="35" cy="52" rx="13" ry="8" fill="#8aa0b0" opacity="0.4"/>
        <circle cx="28" cy="43" r="2" fill="#5a6e7a" opacity="0.5"/>
        <circle cx="36" cy="42" r="1.5" fill="#5a6e7a" opacity="0.5"/>

        {/* Neck — thick */}
        <path d="M 50 40 Q 55 34 57 29" stroke="#6c8090" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <path d="M 50 40 Q 55 34 57 29" stroke="#3a4e5a" strokeWidth="11.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Frill — distinctive */}
        <ellipse cx="56" cy="24" rx="14" ry="11" fill="#8aa0b8" stroke="#3a4e5a" strokeWidth="1.5"/>
        {/* Frill pattern */}
        {[-4, 0, 4].map((dx, i) => (
          <line key={i} x1={56+dx} y1="14" x2={56+dx} y2="34"
            stroke="#5a6e7a" strokeWidth="0.8" opacity="0.4"/>
        ))}
        <path d="M 44 24 Q 56 16 68 24" fill="#9ab0c0" stroke="#3a4e5a" strokeWidth="1" opacity="0.5"/>

        {/* Head */}
        <ellipse cx="56" cy="28" rx="10" ry="8" fill="#6c8090" stroke="#3a4e5a" strokeWidth="1.5"/>
        <path d="M 61 30 Q 70 30 69 33 Q 65 35 61 33 Z" fill="#8aa0b0" stroke="#3a4e5a" strokeWidth="1"/>

        {/* Three horns */}
        <path d="M 60 20 L 63 10 L 66 21" fill="#e8c830" stroke="#b8980a" strokeWidth="1.2"/>
        <path d="M 55 19 L 57 11 L 59 20" fill="#e8c830" stroke="#b8980a" strokeWidth="1.2"/>
        <path d="M 64 28 L 73 27 L 65 31" fill="#e8d860" stroke="#b8980a" strokeWidth="1.2"/>

        {/* Eye */}
        <circle cx="59" cy="25" r="3" fill="white" stroke="#3a4e5a" strokeWidth="1"/>
        <circle cx="59.5" cy="25" r="1.8" fill="#3a6080"/>
        <circle cx="59.5" cy="25" r="1" fill="#111"/>
        <circle cx="60.2" cy="24.3" r="0.5" fill="white"/>

        {/* Legs */}
        <g transform={`rotate(${bl}, 23, 58)`}>
          <line x1="23" y1="58" x2="23" y2="71" stroke="#5a6e7a" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="23" cy="72" rx="5" ry="2.5" fill="#5a6e7a" stroke="#3a4e5a" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 31, 58)`}>
          <line x1="31" y1="58" x2="31" y2="71" stroke="#6c8090" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="31" cy="72" rx="5" ry="2.5" fill="#6c8090" stroke="#3a4e5a" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fl}, 44, 57)`}>
          <line x1="44" y1="57" x2="44" y2="70" stroke="#5a6e7a" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="44" cy="71" rx="5" ry="2.5" fill="#5a6e7a" stroke="#3a4e5a" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 52, 57)`}>
          <line x1="52" y1="57" x2="52" y2="70" stroke="#6c8090" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="52" cy="71" rx="5" ry="2.5" fill="#6c8090" stroke="#3a4e5a" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
