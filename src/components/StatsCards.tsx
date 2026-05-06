import { useGameStore } from '../store/useGameStore'
import { formatFocusTime } from '../utils/gameLogic'

export default function StatsCards() {
  const todaySessions = useGameStore((s) => s.todaySessions)
  const streak = useGameStore((s) => s.streak)
  const totalFocusMinutes = useGameStore((s) => s.totalFocusMinutes)

  return (
    <div className="flex flex-col gap-3 w-24">
      <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-2 px-1">
        <span className="text-lg">🍅</span>
        <span className="font-fredoka text-lg font-bold text-white leading-none">{todaySessions}</span>
        <span className="font-inter text-[9px] text-white/50 text-center">aujourd'hui</span>
      </div>
      <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-2 px-1">
        <span className="text-lg">🔥</span>
        <span className="font-fredoka text-lg font-bold text-white leading-none">{streak}</span>
        <span className="font-inter text-[9px] text-white/50">jours</span>
      </div>
      <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-2 px-1">
        <span className="text-lg">⏱</span>
        <span className="font-fredoka text-sm font-bold text-white leading-none">{formatFocusTime(totalFocusMinutes)}</span>
        <span className="font-inter text-[9px] text-white/50">focus</span>
      </div>
    </div>
  )
}
