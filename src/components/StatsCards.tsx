import { useGameStore } from '../store/useGameStore'
import { formatFocusTime } from '../utils/gameLogic'

export default function StatsCards() {
  const todaySessions = useGameStore((s) => s.todaySessions)
  const streak = useGameStore((s) => s.streak)
  const totalFocusMinutes = useGameStore((s) => s.totalFocusMinutes)

  return (
    <div className="flex gap-3 w-full max-w-sm px-2">
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">🍅</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{todaySessions}</span>
        <span className="font-inter text-[10px] text-white/50 text-center">aujourd'hui</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">🔥</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{streak}</span>
        <span className="font-inter text-[10px] text-white/50">jours</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">⏱</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{formatFocusTime(totalFocusMinutes)}</span>
        <span className="font-inter text-[10px] text-white/50">focus total</span>
      </div>
    </div>
  )
}
