import { useEffect, useRef, useState } from 'react'
import { useGameStore, WORK_DURATION, BREAK_DURATION } from '../store/useGameStore'
import { getRemaining, formatTime } from '../utils/gameLogic'

const RADIUS = 90
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
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="flex items-center gap-2">
        <span className="text-white/50 font-inter text-sm">Session</span>
        <span className="font-fredoka text-accent-green text-xl font-semibold">
          #{sessionsCompleted + 1}
        </span>
      </div>

      <div className="relative">
        <svg width="260" height="260" viewBox="0 0 260 260">
          {/* Glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx="130" cy="130" r={RADIUS}
            fill="none"
            stroke="#1e2d3d"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="130" cy="130" r={RADIUS}
            fill="none"
            stroke={phaseColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 130 130)"
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-fredoka text-6xl font-bold text-white tracking-tight">
            {formatTime(remaining)}
          </span>
          <span
            className="font-inter text-sm font-semibold tracking-widest mt-2"
            style={{ color: phaseColor }}
          >
            {phaseLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 font-inter text-sm hover:border-white/40 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="px-10 py-4 rounded-full font-fredoka text-xl font-semibold transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: phaseColor, color: '#0f1923' }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  )
}
