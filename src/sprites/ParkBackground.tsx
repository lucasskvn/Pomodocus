interface ParkBackgroundProps {
  width: number
  height: number
  skyColor?: string
  groundColor?: string
}

export function ParkBackground({ width, height, skyColor = '#1e3a8a', groundColor = '#2d8a35' }: ParkBackgroundProps) {
  // Lighten the colors for the gradient
  const lightenColor = (color: string, amount: number = 0.2) => {
    const hex = color.replace('#', '')
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount * 255)
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount * 255)
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount * 255)
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyColor}/>
          <stop offset="100%" stopColor={lightenColor(skyColor)}/>
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={groundColor}/>
          <stop offset="40%" stopColor={lightenColor(groundColor, -0.1)}/>
          <stop offset="100%" stopColor={lightenColor(groundColor, -0.3)}/>
        </linearGradient>
        <radialGradient id="pondGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4ab8e8" stopOpacity="0.7"/>
          <stop offset="70%" stopColor="#2090c0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#1060a0" stopOpacity="0.2"/>
        </radialGradient>
        <filter id="softBlur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
      </defs>

      {/* Sky layer */}
      <rect width={width} height={height * 0.35} fill="url(#skyGrad)"/>

      {/* Ground layer */}
      <rect y={height * 0.28} width={width} height={height * 0.72} fill="url(#groundGrad)"/>

      {/* Horizon soft glow */}
      <ellipse cx={width * 0.5} cy={height * 0.3} rx={width * 0.6} ry={height * 0.08}
        fill="#3daa45" opacity="0.3" filter="url(#softBlur)"/>

      {/* Grass patches — varied green tones */}
      <ellipse cx={width * 0.2} cy={height * 0.55} rx={width * 0.12} ry={height * 0.06}
        fill="#3daa45" opacity="0.25"/>
      <ellipse cx={width * 0.7} cy={height * 0.45} rx={width * 0.1} ry={height * 0.05}
        fill="#4abe50" opacity="0.2"/>
      <ellipse cx={width * 0.45} cy={height * 0.7} rx={width * 0.14} ry={height * 0.06}
        fill="#267a28" opacity="0.3"/>

      {/* Pond */}
      <ellipse cx={width * 0.48} cy={height * 0.6} rx={width * 0.09} ry={height * 0.06}
        fill="url(#pondGrad)" stroke="rgba(147,210,255,0.3)" strokeWidth="1.5"/>
      {/* Pond shimmer */}
      <ellipse cx={width * 0.46} cy={height * 0.57} rx={width * 0.03} ry={height * 0.015}
        fill="rgba(255,255,255,0.15)" transform="rotate(-15, 460, 340)"/>
      <text x={width * 0.47} y={height * 0.63} fontSize="18" opacity="0.7">🪷</text>

      {/* Mid-ground rocks */}
      <ellipse cx={width * 0.15} cy={height * 0.52} rx="14" ry="9" fill="#6a6050" opacity="0.6"/>
      <ellipse cx={width * 0.15} cy={height * 0.51} rx="10" ry="5" fill="#8a8068" opacity="0.4"/>
      <ellipse cx={width * 0.78} cy={height * 0.65} rx="10" ry="7" fill="#6a6050" opacity="0.5"/>

      {/* Foreground grass tufts */}
      {Array.from({ length: 20 }).map((_, i) => {
        const gx = (width / 20) * i + Math.sin(i * 2.3) * 20
        const gy = height * 0.88 + Math.sin(i * 1.7) * 10
        return (
          <g key={i} transform={`translate(${gx}, ${gy})`} opacity={0.4 + (i % 3) * 0.1}>
            <path d="M 0 0 Q -3 -12 0 -8 Q 3 -12 0 0" fill="#3daa45"/>
            <path d="M -4 0 Q -7 -10 -4 -6" fill="#2d8a35"/>
            <path d="M 4 0 Q 7 -10 4 -6" fill="#2d8a35"/>
          </g>
        )
      })}

      {/* Front trees (large, saturated) */}
      {[0.03, 0.94].map((rx, i) => {
        const tx = width * rx
        return (
          <g key={i} transform={`translate(${tx}, ${height * 0.55})`} opacity="0.85">
            <rect x="-8" y="0" width="16" height="80" rx="6" fill="#7a4a20"/>
            <ellipse cx="0" cy="-15" rx="36" ry="46" fill="#1e6b28"/>
            <ellipse cx="-6" cy="-25" rx="24" ry="32" fill="#2d8a38" opacity="0.8"/>
            <ellipse cx="8" cy="-10" rx="18" ry="24" fill="#1a5c22" opacity="0.6"/>
          </g>
        )
      })}
      {/* Side trees */}
      <g transform={`translate(${width * 0.13}, ${height * 0.6})`} opacity="0.7">
        <rect x="-6" y="0" width="12" height="60" rx="5" fill="#7a4a20"/>
        <ellipse cx="0" cy="-10" rx="28" ry="36" fill="#236b28"/>
        <ellipse cx="0" cy="-18" rx="18" ry="26" fill="#2d8a35" opacity="0.7"/>
      </g>
      <g transform={`translate(${width * 0.86}, ${height * 0.6})`} opacity="0.7">
        <rect x="-6" y="0" width="12" height="60" rx="5" fill="#7a4a20"/>
        <ellipse cx="0" cy="-10" rx="28" ry="36" fill="#236b28"/>
        <ellipse cx="0" cy="-18" rx="18" ry="26" fill="#2d8a35" opacity="0.7"/>
      </g>

      {/* Dirt path hint */}
      <ellipse cx={width * 0.5} cy={height * 0.68} rx={width * 0.35} ry={height * 0.08}
        fill="rgba(139,100,60,0.08)" filter="url(#softBlur)"/>
    </svg>
  )
}
