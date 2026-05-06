interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoVelociraptor({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -2
  const ll = frame === 1 ? -30 : frame === 2 ? 30 : 0
  const rl = frame === 1 ? 30 : frame === 2 ? -30 : 0
  // Arms swing opposite to stride
  const armSwing = frame === 1 ? -10 : frame === 2 ? 10 : 0
  // Tail counterbalances
  const tailSwing = frame === 1 ? 5 : frame === 2 ? -5 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Tail — long, stiff, counterbalance */}
        <path d={`M 24 44 Q 14 ${44+tailSwing} 6 ${46+tailSwing}`}
          stroke="#e06020" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d={`M 14 ${43+tailSwing} Q 8 ${42+tailSwing} 4 ${44+tailSwing}`}
          stroke="#e06020" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Tail feathers */}
        <path d={`M 8 ${42+tailSwing} Q 6 ${38+tailSwing} 10 ${40+tailSwing}`}
          fill="#7a30a0" stroke="#5a1a80" strokeWidth="0.8"/>

        {/* Body — lean, forward-leaning */}
        <ellipse cx="34" cy="42" rx="15" ry="10" fill="#e87030" stroke="#a04010" strokeWidth="1.5" transform="rotate(-12, 34, 42)"/>
        <ellipse cx="36" cy="46" rx="9" ry="6" fill="#f09050" opacity="0.4"/>

        {/* Feathers on back */}
        {[28, 33, 38].map((x, i) => {
          const fy = 35 + i * 2
          return <path key={i} d={`M ${x} ${fy} Q ${x-5} ${fy-8} ${x+2} ${fy-4}`}
            fill="#8040b0" stroke="#5a1a80" strokeWidth="0.8"/>
        })}

        {/* Arms — small but visible */}
        <g transform={`rotate(${armSwing}, 44, 40)`}>
          <path d="M 44 40 Q 50 36 54 38 Q 52 42 48 41 Z" fill="#c05820" stroke="#a04010" strokeWidth="1"/>
          <path d="M 52 38 L 55 36" stroke="#a04010" strokeWidth="1" strokeLinecap="round"/>
          <path d="M 52 38 L 54 40" stroke="#a04010" strokeWidth="1" strokeLinecap="round"/>
        </g>

        {/* Neck */}
        <path d="M 44 34 Q 50 26 52 20" stroke="#e87030" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M 44 34 Q 50 26 52 20" stroke="#a04010" strokeWidth="9.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Head */}
        <ellipse cx="54" cy="17" rx="9" ry="7" fill="#e87030" stroke="#a04010" strokeWidth="1.5"/>
        <path d="M 49 19 Q 58 16 66 19 Q 65 23 58 23 Q 50 23 49 19 Z" fill="#e87030" stroke="#a04010" strokeWidth="1.2"/>
        <path d="M 51 20 Q 57 22 64 20" fill="#c05820" stroke="#a04010" strokeWidth="0.8"/>
        {/* Teeth */}
        <path d="M 54 21 L 55 24 L 57 21" fill="white" stroke="#ccc" strokeWidth="0.5"/>
        <path d="M 59 21 L 60 24 L 62 21" fill="white" stroke="#ccc" strokeWidth="0.5"/>
        {/* Feather crest on head */}
        <path d="M 50 12 Q 54 6 58 10 Q 55 14 52 13 Z" fill="#8040b0" stroke="#5a1a80" strokeWidth="1"/>

        {/* Eye */}
        <circle cx="56" cy="14" r="3" fill="white" stroke="#a04010" strokeWidth="1"/>
        <circle cx="56.5" cy="14" r="1.8" fill="#d04010"/>
        <circle cx="56.5" cy="14" r="1" fill="#111"/>
        <circle cx="57.2" cy="13.3" r="0.5" fill="white"/>

        {/* Biped legs with sickle claw */}
        <g transform={`rotate(${ll}, 30, 50)`}>
          <line x1="30" y1="50" x2="28" y2="64" stroke="#c05820" strokeWidth="5" strokeLinecap="round"/>
          <line x1="28" y1="64" x2="26" y2="70" stroke="#c05820" strokeWidth="4" strokeLinecap="round"/>
          {/* Sickle claw */}
          <path d="M 26 70 Q 22 68 24 66" stroke="#a04010" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M 28 70 L 36 70" stroke="#a04010" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        <g transform={`rotate(${rl}, 38, 50)`}>
          <line x1="38" y1="50" x2="36" y2="64" stroke="#e87030" strokeWidth="5" strokeLinecap="round"/>
          <line x1="36" y1="64" x2="34" y2="70" stroke="#e87030" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 34 70 Q 30 68 32 66" stroke="#a04010" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M 36 70 L 44 70" stroke="#a04010" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  )
}
