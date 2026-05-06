interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoAnkylosaurus({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1
  const fl = frame === 1 ? 16 : frame === 2 ? -16 : 0
  const fr = frame === 1 ? -16 : frame === 2 ? 16 : 0
  const bl = frame === 1 ? -14 : frame === 2 ? 14 : 0
  const br = frame === 1 ? 14 : frame === 2 ? -14 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Tail */}
        <path d="M 18 50 Q 10 48 7 53 Q 6 57 10 56 Q 15 53 18 51" fill="#7a5020" stroke="#4a3010" strokeWidth="1.5"/>

        {/* Wide armored body */}
        <ellipse cx="35" cy="50" rx="22" ry="13" fill="#8b5e28" stroke="#4a3010" strokeWidth="1.5"/>
        {/* Armor ridge on top */}
        <ellipse cx="35" cy="44" rx="20" ry="6" fill="#9b6e38" stroke="#4a3010" strokeWidth="1"/>
        {/* Hexagonal armor plates */}
        {[24, 30, 36, 42, 48].map((x, i) => (
          <polygon key={i}
            points={`${x},40 ${x+4},38 ${x+6},41 ${x+4},44 ${x},44 ${x-2},41`}
            fill={i % 2 === 0 ? '#6a4018' : '#7a5020'} stroke="#4a3010" strokeWidth="0.8"/>
        ))}
        {[27, 33, 39, 45].map((x, i) => (
          <polygon key={i}
            points={`${x},44 ${x+4},42 ${x+6},45 ${x+4},48 ${x},48 ${x-2},45`}
            fill={i % 2 === 0 ? '#7a5020' : '#8b5e28'} stroke="#4a3010" strokeWidth="0.8"/>
        ))}

        {/* Neck — very short */}
        <path d="M 50 44 Q 54 40 56 37" stroke="#8b5e28" strokeWidth="7" strokeLinecap="round" fill="none"/>

        {/* Head — flat, wide */}
        <ellipse cx="58" cy="35" rx="8" ry="6" fill="#8b5e28" stroke="#4a3010" strokeWidth="1.5"/>
        <path d="M 62 37 Q 70 37 69 39 Q 65 41 62 39 Z" fill="#9b6e38" stroke="#4a3010" strokeWidth="1"/>
        <circle cx="60" cy="32" r="2.5" fill="white" stroke="#4a3010" strokeWidth="0.8"/>
        <circle cx="60.5" cy="32" r="1.5" fill="#6a4018"/>
        <circle cx="60.5" cy="32" r="0.8" fill="#111"/>
        <circle cx="61" cy="31.5" r="0.4" fill="white"/>
        {/* Armor on head */}
        <path d="M 54 34 Q 58 30 62 34" fill="none" stroke="#4a3010" strokeWidth="1" opacity="0.5"/>

        {/* Stubby legs */}
        <g transform={`rotate(${bl}, 22, 60)`}>
          <line x1="22" y1="60" x2="22" y2="70" stroke="#6a4018" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="22" cy="71" rx="5" ry="2" fill="#6a4018" stroke="#4a3010" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 30, 60)`}>
          <line x1="30" y1="60" x2="30" y2="70" stroke="#7a5020" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="30" cy="71" rx="5" ry="2" fill="#7a5020" stroke="#4a3010" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fl}, 42, 59)`}>
          <line x1="42" y1="59" x2="42" y2="69" stroke="#6a4018" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="42" cy="70" rx="5" ry="2" fill="#6a4018" stroke="#4a3010" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 50, 59)`}>
          <line x1="50" y1="59" x2="50" y2="69" stroke="#7a5020" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="50" cy="70" rx="5" ry="2" fill="#7a5020" stroke="#4a3010" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
