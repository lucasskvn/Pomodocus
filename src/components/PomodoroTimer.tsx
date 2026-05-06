import { useEffect, useRef, useState } from 'react'
import { useGameStore, WORK_DURATION, BREAK_DURATION } from '../store/useGameStore'
import { getRemaining, formatTime } from '../utils/gameLogic'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroTimer() {
  const pomodoroPhase = useGameStore((s) => s.pomodoroPhase)
  const timerStartedAt = useGameStore((s) => s.timerStartedAt)
  const remainingAtPause = useGameStore((s) => s.remainingAtPause)
  const sessionsCompleted = useGameStore((s) => s.sessionsCompleted)
  const startTimer = useGameStore((s) => s.startTimer)
  const pauseTimer = useGameStore((s) => s.pauseTimer)
  const resetTimer = useGameStore((s) => s.resetTimer)
  const completePomodoro = useGameStore((s) => s.completePomodoro)
  const completeBreak = useGameStore((s) => s.completeBreak)

  const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION

  const [remaining, setRemaining] = useState(() => {
    if (timerStartedAt !== null) return getRemaining(timerStartedAt, duration)
    if (remainingAtPause !== null) return remainingAtPause
    return duration
  })

  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false

    if (timerStartedAt === null) {
      setRemaining(remainingAtPause ?? duration)
      return
    }

    const tick = () => {
      const r = getRemaining(timerStartedAt, duration)
      setRemaining(r)
      if (r === 0 && !completedRef.current) {
        completedRef.current = true
        if (pomodoroPhase === 'work') completePomodoro()
        else if (pomodoroPhase === 'break') completeBreak()
      }
    }

    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [timerStartedAt, pomodoroPhase, duration, remainingAtPause, completePomodoro, completeBreak])

  const isRunning = timerStartedAt !== null
  const progress = 1 - remaining / duration
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)
  const phaseColor = pomodoroPhase === 'break' ? '#60a5fa' : '#4ade80'
  const phaseLabel =
    pomodoroPhase === 'work' ? 'TRAVAIL' : pomodoroPhase === 'break' ? 'PAUSE' : 'PRÊT'

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center gap-2">
        <span className="text-white/50 font-inter text-sm">Session</span>
        <span className="font-fredoka text-accent-green text-lg font-semibold">
          #{sessionsCompleted + 1}
        </span>
      </div>

      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={RADIUS}
            fill="none"
            stroke="#1e2d3d"
            strokeWidth="8"
          />
          <circle
            cx="80" cy="80" r={RADIUS}
            fill="none"
            stroke={phaseColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-fredoka text-4xl font-bold text-white">
            {formatTime(remaining)}
          </span>
          <span
            className="font-inter text-xs font-semibold tracking-widest mt-1"
            style={{ color: phaseColor }}
          >
            {phaseLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-full border border-white/20 text-white/60 font-inter text-sm hover:border-white/40 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="px-8 py-3 rounded-full font-fredoka text-lg font-semibold transition-opacity hover:opacity-90"
          style={{ background: phaseColor, color: '#0f1923' }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  )
}
