interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoTRex({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -2
  // Biped: legs alternate, body leans forward
  const ll = frame === 1 ? -28 : frame === 2 ? 28 : 0
  const rl = frame === 1 ? 28 : frame === 2 ? -28 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>

      <g transform={`translate(0, ${bob})`}>
        {/* Tail — thick at base, tapers */}
        <path d="M 24 46 Q 14 44 8 50 Q 4 56 10 55 Q 16 52 22 48" fill="#7a1010" stroke="#4a0808" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M 24 46 Q 10 42 5 46" stroke="#7a1010" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Body — forward-leaning */}
        <ellipse cx="34" cy="44" rx="16" ry="12" fill="#9b1414" stroke="#4a0808" strokeWidth="1.5" transform="rotate(-8, 34, 44)"/>
        {/* Belly lighter */}
        <ellipse cx="36" cy="48" rx="10" ry="7" fill="#c43030" opacity="0.4"/>
        {/* Scale texture */}
        <circle cx="28" cy="40" r="2" fill="#7a1010" opacity="0.5"/>
        <circle cx="34" cy="38" r="2" fill="#7a1010" opacity="0.5"/>
        <circle cx="40" cy="42" r="1.5" fill="#7a1010" opacity="0.5"/>

        {/* Tiny arms */}
        <path d="M 44 40 Q 50 38 52 42 Q 50 44 46 43 Z" fill="#7a1010" stroke="#4a0808" strokeWidth="1"/>
        <path d="M 50 42 L 53 43" stroke="#4a0808" strokeWidth="1" strokeLinecap="round"/>
        <path d="M 50 42 L 52 45" stroke="#4a0808" strokeWidth="1" strokeLinecap="round"/>

        {/* Neck */}
        <path d="M 44 36 Q 50 28 52 22" stroke="#9b1414" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <path d="M 44 36 Q 50 28 52 22" stroke="#4a0808" strokeWidth="11.5" strokeLinecap="round" fill="none" opacity="0.15"/>

        {/* Head — massive */}
        <ellipse cx="55" cy="18" rx="14" ry="10" fill="#9b1414" stroke="#4a0808" strokeWidth="1.5" transform="rotate(-5, 55, 18)"/>
        {/* Upper jaw */}
        <path d="M 44 20 Q 58 16 70 20 Q 70 24 58 25 Q 44 24 44 20 Z" fill="#9b1414" stroke="#4a0808" strokeWidth="1.2"/>
        {/* Lower jaw open on frame 1/2 */}
        <path d={`M 46 22 Q 58 ${frame !== 0 ? '28' : '26'} 68 22`} fill="#8b2020" stroke="#4a0808" strokeWidth="1.2"/>
        {/* Teeth */}
        <path d="M 50 23 L 51 27 L 53 23" fill="white" stroke="#ccc" strokeWidth="0.5"/>
        <path d="M 56 23 L 57 27 L 59 23" fill="white" stroke="#ccc" strokeWidth="0.5"/>
        <path d="M 62 23 L 63 26 L 65 23" fill="white" stroke="#ccc" strokeWidth="0.5"/>
        {/* Tongue */}
        {frame !== 0 && <path d="M 52 26 Q 57 30 62 26" fill="#d44" stroke="none"/>}

        {/* Eye */}
        <circle cx="57" cy="14" r="3.5" fill="white" stroke="#4a0808" strokeWidth="1"/>
        <circle cx="58" cy="14" r="2.2" fill="#b8860b"/>
        <circle cx="58" cy="14" r="1.2" fill="#111"/>
        <circle cx="58.8" cy="13.2" r="0.6" fill="white"/>
        {/* Brow ridge */}
        <path d="M 53 11 Q 58 10 63 12" stroke="#4a0808" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

        {/* Legs */}
        <g transform={`rotate(${ll}, 32, 54)`}>
          <path d="M 32 54 L 30 68 Q 28 70 34 70 Q 38 70 36 68 L 34 62" fill="#7a1010" stroke="#4a0808" strokeWidth="1.2"/>
          <path d="M 26 70 L 38 70" stroke="#4a0808" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g transform={`rotate(${rl}, 40, 54)`}>
          <path d="M 40 54 L 38 68 Q 36 70 42 70 Q 46 70 44 68 L 42 62" fill="#9b1414" stroke="#4a0808" strokeWidth="1.2"/>
          <path d="M 34 70 L 46 70" stroke="#4a0808" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  )
}
