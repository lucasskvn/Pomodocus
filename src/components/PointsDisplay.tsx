import { useGameStore } from '../store/useGameStore'

export default function PointsDisplay() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const coins = useGameStore((s) => s.coins)

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0a1219] border-b border-white/10">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⚡</span>
        <span className="font-fredoka text-lg font-semibold text-accent-green">
          {docuPoints} pts
        </span>
      </div>

      <span className="font-fredoka text-xl font-bold text-white tracking-wide">
        PomoDocus
      </span>

      <div className="flex items-center gap-1.5">
        <span className="text-lg">🪙</span>
        <span className="font-fredoka text-lg font-semibold text-accent-amber">
          {coins.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
