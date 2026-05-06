interface Props { frame: 0 | 1 | 2; flipped?: boolean }

export function DinoBrachiosaurus({ frame, flipped }: Props) {
  const bob = frame === 0 ? 0 : -1.5
  const fl = frame === 1 ? 18 : frame === 2 ? -18 : 0
  const fr = frame === 1 ? -18 : frame === 2 ? 18 : 0
  const bl = frame === 1 ? -16 : frame === 2 ? 16 : 0
  const br = frame === 1 ? 16 : frame === 2 ? -16 : 0
  // Neck sways gently
  const neckSway = frame === 1 ? -3 : frame === 2 ? 3 : 0

  return (
    <svg width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g transform={`translate(0, ${bob})`}>
        {/* Short tail */}
        <path d="M 16 50 Q 10 49 8 53 Q 8 56 11 55 Q 14 53 16 51" fill="#d4b870" stroke="#9a8030" strokeWidth="1.5"/>

        {/* Body — barrel-shaped */}
        <ellipse cx="34" cy="52" rx="22" ry="14" fill="#e8cc88" stroke="#9a8030" strokeWidth="1.5"/>
        <ellipse cx="34" cy="57" rx="14" ry="8" fill="#f5dfa0" opacity="0.45"/>
        {/* Skin texture */}
        <circle cx="26" cy="48" r="2" fill="#d4b870" opacity="0.5"/>
        <circle cx="34" cy="47" r="2" fill="#d4b870" opacity="0.5"/>
        <circle cx="42" cy="50" r="1.5" fill="#d4b870" opacity="0.5"/>

        {/* Long neck — curves with sway */}
        <path d={`M 48 44 Q ${52+neckSway} 32 ${50+neckSway} 20 Q ${48+neckSway} 10 ${46+neckSway} 8`}
          stroke="#e8cc88" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <path d={`M 48 44 Q ${52+neckSway} 32 ${50+neckSway} 20 Q ${48+neckSway} 10 ${46+neckSway} 8`}
          stroke="#9a8030" strokeWidth="11.5" strokeLinecap="round" fill="none" opacity="0.15"/>
        {/* Neck highlight */}
        <path d={`M 48 44 Q ${50+neckSway} 32 ${48+neckSway} 20`}
          stroke="#f5dfa0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* Small head */}
        <ellipse cx={46+neckSway} cy="7" rx="7" ry="5.5" fill="#e8cc88" stroke="#9a8030" strokeWidth="1.5"/>
        <path d={`M ${50+neckSway} 8 Q ${58+neckSway} 8 ${57+neckSway} 10 Q ${54+neckSway} 12 ${50+neckSway} 10 Z`}
          fill="#f5dfa0" stroke="#9a8030" strokeWidth="1"/>
        {/* Nostril */}
        <circle cx={54+neckSway} cy="8" r="1" fill="#9a8030"/>

        {/* Eye */}
        <circle cx={43+neckSway} cy="5" r="2.5" fill="white" stroke="#9a8030" strokeWidth="0.8"/>
        <circle cx={43.5+neckSway} cy="5" r="1.5" fill="#806020"/>
        <circle cx={43.5+neckSway} cy="5" r="0.8" fill="#111"/>
        <circle cx={44+neckSway} cy="4.5" r="0.4" fill="white"/>

        {/* Pillar-like legs */}
        <g transform={`rotate(${bl}, 20, 63)`}>
          <line x1="20" y1="63" x2="20" y2="74" stroke="#c8a860" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="20" cy="75" rx="6" ry="2.5" fill="#c8a860" stroke="#9a8030" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${br}, 30, 63)`}>
          <line x1="30" y1="63" x2="30" y2="74" stroke="#e8cc88" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="30" cy="75" rx="6" ry="2.5" fill="#e8cc88" stroke="#9a8030" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fl}, 42, 62)`}>
          <line x1="42" y1="62" x2="42" y2="73" stroke="#c8a860" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="42" cy="74" rx="6" ry="2.5" fill="#c8a860" stroke="#9a8030" strokeWidth="1"/>
        </g>
        <g transform={`rotate(${fr}, 52, 62)`}>
          <line x1="52" y1="62" x2="52" y2="73" stroke="#e8cc88" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="52" cy="74" rx="6" ry="2.5" fill="#e8cc88" stroke="#9a8030" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  )
}
