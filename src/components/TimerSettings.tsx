import { useGameStore } from '../store/useGameStore'
import { workReward, breakReward } from '../utils/gameLogic'

export default function TimerSettings() {
  const workMinutes = useGameStore((s) => s.workMinutes)
  const breakMinutes = useGameStore((s) => s.breakMinutes)
  const pomodoroPhase = useGameStore((s) => s.pomodoroPhase)
  const setWorkMinutes = useGameStore((s) => s.setWorkMinutes)
  const setBreakMinutes = useGameStore((s) => s.setBreakMinutes)

  const isIdle = pomodoroPhase === 'idle'

  return (
    <div className="flex flex-col gap-6 px-3 py-6 justify-center w-full">
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Travail
        </span>
        <span className="font-fredoka text-accent-green text-lg font-bold leading-none">
          {workMinutes} min
        </span>
        <input
          type="range"
          min={5}
          max={90}
          step={5}
          value={workMinutes}
          disabled={!isIdle}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          className="w-full accent-accent-green disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-accent-green">
          +{workReward(workMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Pause
        </span>
        <span className="font-fredoka text-[#60a5fa] text-lg font-bold leading-none">
          {breakMinutes} min
        </span>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={breakMinutes}
          disabled={!isIdle}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-full accent-[#60a5fa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-[#60a5fa]">
          +{breakReward(breakMinutes)} pts
        </span>
      </div>
    </div>
  )
}
