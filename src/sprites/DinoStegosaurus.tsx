interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoStegosaurus({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1.5
  const fl = frame === 1 ? 20 : frame === 2 ? -20 : 0
  const fr = frame === 1 ? -20 : frame === 2 ? 20 : 0
  const bl = frame === 1 ? -18 : frame === 2 ? 18 : 0
  const br = frame === 1 ? 18 : frame === 2 ? -18 : 0
  const plates = [22, 28, 34, 40, 46]

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Tail with spikes */}
        <path d="M 18 47 Q 10 45 6 51 Q 5 55 9 54 Q 14 51 18 49" fill="#1a5c1a" stroke="#0d3d0d" strokeWidth="1.5"/>
        <line x1="10" y1="49" x2="7" y2="45" stroke="#0d3d0d" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="51" x2="4" y2="47" stroke="#0d3d0d" strokeWidth="2" strokeLinecap="round"/>

        {/* Body */}
        <ellipse cx="34" cy="47" rx="20" ry="14" fill="#236b23" stroke="#0d3d0d" strokeWidth="1.5"/>
        <ellipse cx="34" cy="51" rx="13" ry="8" fill="#3a8a3a" opacity="0.45"/>
        <circle cx="28" cy="43" r="1.8" fill="#1a5c1a" opacity="0.5"/>
        <circle cx="36" cy="42" r="1.5" fill="#1a5c1a" opacity="0.5"/>

        {/* Back plates — sway with walk */}
        {plates.map((x, i) => {
          const h = [12, 17, 20, 17, 11][i]
          const sw = frame !== 0 ? (i % 2 === 0 ? 2 : -2) : 0
          return <path key={i}
            d={`M ${x-4} 41 Q ${x+sw} ${41-h} ${x+4} 41`}
            fill={i % 2 === 0 ? '#d04040' : '#e86060'} stroke="#7a1010" strokeWidth="1.2"/>
        })}

        {/* Neck */}
        <path d="M 48 41 Q 53 37 55 33" stroke="#236b23" strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d="M 48 41 Q 53 37 55 33" stroke="#0d3d0d" strokeWidth="8.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Head — small boxy */}
        <ellipse cx="57" cy="31" rx="7" ry="5" fill="#236b23" stroke="#0d3d0d" strokeWidth="1.5"/>
        <path d="M 61 32 Q 68 32 67 34 Q 64 36 61 34 Z" fill="#3a8a3a" stroke="#0d3d0d" strokeWidth="1"/>
        <circle cx="59" cy="28.5" r="2.5" fill="white" stroke="#0d3d0d" strokeWidth="0.8"/>
        <circle cx="59.5" cy="28.5" r="1.5" fill="#1a5c1a"/>
        <circle cx="59.5" cy="28.5" r="0.8" fill="#111"/>
        <circle cx="60" cy="28" r="0.4" fill="white"/>

        {/* Back legs */}
        <g transform={`rotate(${bl}, 24, 58)`}>
          <line x1="24" y1="58" x2="24" y2="71" stroke="#1a5c1a" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="24" cy="72" rx="5" ry="2.5" fill="#1a5c1a" stroke="#0d3d0d" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 31, 58)`}>
          <line x1="31" y1="58" x2="31" y2="71" stroke="#236b23" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="31" cy="72" rx="5" ry="2.5" fill="#236b23" stroke="#0d3d0d" strokeWidth="1"/>
        </g>

        {/* Front legs */}
        <g transform={`rotate(${fl}, 42, 57)`}>
          <line x1="42" y1="57" x2="42" y2="70" stroke="#1a5c1a" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="42" cy="71" rx="5" ry="2.5" fill="#1a5c1a" stroke="#0d3d0d" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 49, 57)`}>
          <line x1="49" y1="57" x2="49" y2="70" stroke="#236b23" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="49" cy="71" rx="5" ry="2.5" fill="#236b23" stroke="#0d3d0d" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
