import { useGameStore } from '../store/useGameStore'

const DAYS_IN_WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

function getSessionColor(count: number): string {
  if (count === 0) return '#ffffff19'
  if (count === 1) return '#4ade8066'
  if (count === 2) return '#4ade80b3'
  return '#4ade80'
}

export default function HistoryView() {
  const sessionsCompleted = useGameStore((s) => s.sessionsCompleted)
  const streak = useGameStore((s) => s.streak)
  const totalFocusMinutes = useGameStore((s) => s.totalFocusMinutes)
  const sessionLog = useGameStore((s) => s.sessionLog ?? [])
  const todaySessions = useGameStore((s) => s.todaySessions)

  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)

  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = today.getDay()
  // Days back to Monday (Monday = 1)
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  // Get Monday of this week
  const mondayThisWeek = new Date(today)
  mondayThisWeek.setDate(mondayThisWeek.getDate() - daysToMonday)

  // Get Monday 11 weeks ago
  const startMonday = new Date(mondayThisWeek)
  startMonday.setDate(startMonday.getDate() - 11 * 7)

  // Create 12 weeks × 7 days (84 days total)
  const last84Days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(startMonday)
    d.setDate(d.getDate() + i)
    return d
  })

  const getSessionCount = (date: Date): number => {
    const dateKey = date.toISOString().slice(0, 10)
    if (dateKey === todayKey) return todaySessions
    const record = sessionLog.find(r => r.date === dateKey)
    return record?.sessions ?? 0
  }

  const weeks = Array.from({ length: 12 }, (_, weekIdx) =>
    last84Days.slice(weekIdx * 7, (weekIdx + 1) * 7)
  )

  return (
    <div className="flex flex-col py-8 px-6 max-w-lg mx-auto w-full gap-8">
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-white">Historique</h1>
        <p className="font-inter text-sm text-white/60">Suivi de tes sessions de focus</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="font-inter text-xs text-white/60 mb-1">Sessions</p>
          <p className="font-fredoka text-3xl font-bold text-accent-green">{sessionsCompleted}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="font-inter text-xs text-white/60 mb-1">Streak</p>
          <p className="font-fredoka text-3xl font-bold text-accent-green">{streak}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="font-inter text-xs text-white/60 mb-1">Total</p>
          <p className="font-fredoka text-lg font-bold text-accent-green">{formatDuration(totalFocusMinutes)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-fredoka text-lg font-semibold text-white">12 dernières semaines</h2>

        <div className="flex gap-1 overflow-x-auto pb-2">
          <div className="flex flex-col gap-1">
            <div className="h-6" />
            {DAYS_IN_WEEK.map((day, i) => (
              <div
                key={i}
                className="w-6 h-6 flex items-center justify-center font-inter text-xs text-white/50"
              >
                {day}
              </div>
            ))}
          </div>

          {weeks.map((week, weekIdx) => {
            const firstInWeek = week[0]
            // Show month label if it's the first week or if the month changed
            const isNewMonth = weekIdx === 0 || weeks[weekIdx - 1][0].getMonth() !== firstInWeek.getMonth()
            const monthLabel = isNewMonth ? MONTHS[firstInWeek.getMonth()] : ''

            return (
              <div key={weekIdx} className="flex flex-col gap-1">
                {monthLabel && (
                  <div className="h-6 flex items-center justify-center">
                    <span className="font-inter text-xs font-semibold text-white/60">{monthLabel}</span>
                  </div>
                )}
                {!monthLabel && <div className="h-6" />}
                {week.map((date, dayIdx) => {
                  const count = getSessionCount(date)
                  const isToday =
                    date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)

                  return (
                    <div
                      key={dayIdx}
                      className={`w-6 h-6 rounded transition-all ${
                        isToday ? 'ring-2 ring-white/60' : ''
                      }`}
                      style={{ background: getSessionColor(count) }}
                      title={`${date.toLocaleDateString('fr-FR')}: ${count} session${count !== 1 ? 's' : ''}`}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="flex gap-4 font-inter text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: '#ffffff19' }}
            />
            <span>Aucune</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: '#4ade8066' }}
            />
            <span>1</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: '#4ade80b3' }}
            />
            <span>2</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: '#4ade80' }}
            />
            <span>3+</span>
          </div>
        </div>
      </div>
    </div>
  )
}
