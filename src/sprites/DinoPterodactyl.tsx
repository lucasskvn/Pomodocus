interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoPterodactyl({ frame, flipped }: Props) {
  // Wing flap cycle
  const wingUp   = frame === 0 ? 0  : frame === 1 ? -18 : 10
  const wingDown = frame === 0 ? 0  : frame === 1 ? 10 : -14
  const bodyBob  = frame === 1 ? -4 : frame === 2 ? 2 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bodyBob})`}>

        {/* Left wing (back) */}
        <g transform={`rotate(${wingDown}, 34, 38)`}>
          <path d="M 34 38 Q 18 38 10 48 Q 16 52 28 46 Q 32 42 34 38 Z"
            fill="#6030a0" stroke="#3a1060" strokeWidth="1.2" opacity="0.8"/>
          {/* Wing membrane lines */}
          <line x1="34" y1="38" x2="14" y2="50" stroke="#3a1060" strokeWidth="0.8" opacity="0.5"/>
          <line x1="34" y1="38" x2="18" y2="52" stroke="#3a1060" strokeWidth="0.8" opacity="0.5"/>
        </g>

        {/* Right wing (front) */}
        <g transform={`rotate(${wingUp}, 34, 38)`}>
          <path d="M 34 38 Q 52 36 62 44 Q 58 50 48 46 Q 38 42 34 38 Z"
            fill="#7840c0" stroke="#3a1060" strokeWidth="1.2"/>
          <line x1="34" y1="38" x2="58" y2="46" stroke="#3a1060" strokeWidth="0.8" opacity="0.5"/>
          <line x1="34" y1="38" x2="54" y2="50" stroke="#3a1060" strokeWidth="0.8" opacity="0.5"/>
          {/* Wingtip claw */}
          <circle cx="62" cy="44" r="2" fill="#5020a0" stroke="#3a1060" strokeWidth="1"/>
        </g>

        {/* Body */}
        <ellipse cx="34" cy="38" rx="9" ry="6" fill="#7840c0" stroke="#3a1060" strokeWidth="1.5"/>
        <ellipse cx="34" cy="40" rx="6" ry="4" fill="#9060d0" opacity="0.4"/>

        {/* Diamond tail */}
        <path d="M 25 40 Q 20 42 16 40 Q 20 36 25 38 Z"
          fill="#6030a0" stroke="#3a1060" strokeWidth="1"/>

        {/* Neck */}
        <path d="M 40 33 Q 46 28 48 24" stroke="#7840c0" strokeWidth="6" strokeLinecap="round" fill="none"/>

        {/* Head with crest */}
        <ellipse cx="50" cy="22" rx="9" ry="6" fill="#7840c0" stroke="#3a1060" strokeWidth="1.5"/>
        {/* Beak */}
        <path d="M 54 23 Q 66 21 65 25 Q 60 27 54 25 Z" fill="#a060e0" stroke="#3a1060" strokeWidth="1"/>
        {/* Head crest */}
        <path d="M 46 18 Q 50 10 54 14 Q 52 20 48 19 Z" fill="#9050d0" stroke="#3a1060" strokeWidth="1"/>
        {/* Crest detail */}
        <path d="M 48 17 Q 50 12 53 15" stroke="#b070f0" strokeWidth="1" fill="none" opacity="0.6"/>

        {/* Eye */}
        <circle cx="52" cy="19" r="2.5" fill="white" stroke="#3a1060" strokeWidth="0.8"/>
        <circle cx="52.5" cy="19" r="1.5" fill="#4020a0"/>
        <circle cx="52.5" cy="19" r="0.8" fill="#111"/>
        <circle cx="53" cy="18.5" r="0.4" fill="white"/>

        {/* Small legs dangling */}
        <line x1="30" y1="42" x2="28" y2="50" stroke="#6030a0" strokeWidth="3" strokeLinecap="round"/>
        <line x1="38" y1="42" x2="36" y2="50" stroke="#6030a0" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 24 50 L 32 50" stroke="#3a1060" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M 32 50 L 40 50" stroke="#3a1060" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  )
}
