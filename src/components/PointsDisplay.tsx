import { useGameStore } from '../store/useGameStore'

export default function PointsDisplay() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const coins = useGameStore((s) => s.coins)
  const cheat = useGameStore((s) => s.cheat)

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0a1219] border-b border-white/10">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⚡</span>
        <span className="font-fredoka text-lg font-semibold text-accent-green">
          {docuPoints} pts
        </span>
      </div>

      <button
        onClick={cheat}
        className="px-3 py-1 rounded-full border border-white/10 text-white/30 font-inter text-xs hover:border-accent-green/40 hover:text-accent-green/60 transition-colors"
        title="+999 pts / +9999 🪙"
      >
        🦴 cheat
      </button>

      <div className="flex items-center gap-1.5">
        <span className="text-lg">🪙</span>
        <span className="font-fredoka text-lg font-semibold text-accent-amber">
          {coins.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
