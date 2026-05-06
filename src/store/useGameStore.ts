import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { DINOSAURS, DINO_MAP } from '../data/dinosaurs'
import { calculatePending, rollRarity, workReward, breakReward, computeSessionStats, type EggType } from '../utils/gameLogic'

export interface DinoInstance {
  id: string
  dinoId: string
  obtainedAt: number
  lastCollectedAt: number
}

const EGG_PRICES: Record<EggType, number> = {
  common: 15,
  rare: 40,
  legendary: 100,
}

interface GameState {
  docuPoints: number
  coins: number
  ownedDinos: DinoInstance[]
  pomodoroPhase: 'work' | 'break' | 'idle'
  timerStartedAt: number | null
  remainingAtPause: number | null
  sessionsCompleted: number
  pendingReveal: DinoInstance | null
  workMinutes: number
  breakMinutes: number
  todaySessions: number
  streak: number
  totalFocusMinutes: number
  lastSessionDate: string
}

interface GameActions {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completePomodoro: () => void
  completeBreak: () => void
  buyEgg: (eggType: EggType) => void
  collectDino: (instanceId: string) => void
  collectAll: () => number
  clearReveal: () => void
  cheat: () => void
  setWorkMinutes: (m: number) => void
  setBreakMinutes: (m: number) => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      docuPoints: 0,
      coins: 0,
      ownedDinos: [],
      pomodoroPhase: 'idle',
      timerStartedAt: null,
      remainingAtPause: null,
      sessionsCompleted: 0,
      pendingReveal: null,
      workMinutes: 25,
      breakMinutes: 5,
      todaySessions: 0,
      streak: 0,
      totalFocusMinutes: 0,
      lastSessionDate: '',

      startTimer: () => {
        const { remainingAtPause, pomodoroPhase, workMinutes, breakMinutes } = get()
        const duration = (pomodoroPhase === 'break' ? breakMinutes : workMinutes) * 60 * 1000
        if (remainingAtPause !== null) {
          set({
            timerStartedAt: Date.now() - (duration - remainingAtPause),
            remainingAtPause: null,
          })
        } else {
          set({
            timerStartedAt: Date.now(),
            pomodoroPhase: pomodoroPhase === 'idle' ? 'work' : pomodoroPhase,
          })
        }
      },

      pauseTimer: () => {
        const { timerStartedAt, pomodoroPhase, workMinutes, breakMinutes } = get()
        if (timerStartedAt === null) return
        const duration = (pomodoroPhase === 'break' ? breakMinutes : workMinutes) * 60 * 1000
        set({
          remainingAtPause: Math.max(0, duration - (Date.now() - timerStartedAt)),
          timerStartedAt: null,
        })
      },

      resetTimer: () => {
        set({ timerStartedAt: null, remainingAtPause: null, pomodoroPhase: 'idle' })
      },

      completePomodoro: () => {
        const { workMinutes, lastSessionDate, streak, todaySessions, totalFocusMinutes } = get()
        const stats = computeSessionStats(lastSessionDate, streak, todaySessions, totalFocusMinutes, workMinutes)
        set((s) => ({
          pomodoroPhase: 'break',
          docuPoints: s.docuPoints + workReward(s.workMinutes),
          sessionsCompleted: s.sessionsCompleted + 1,
          timerStartedAt: Date.now(),
          remainingAtPause: null,
          ...stats,
        }))
      },

      completeBreak: () => {
        set((s) => ({
          pomodoroPhase: 'idle',
          docuPoints: s.docuPoints + breakReward(s.breakMinutes),
          timerStartedAt: null,
          remainingAtPause: null,
        }))
      },

      buyEgg: (eggType: EggType) => {
        const { docuPoints } = get()
        const price = EGG_PRICES[eggType]
        if (docuPoints < price) return

        const rarity = rollRarity(eggType)
        const pool = DINOSAURS.filter((d) => d.rarity === rarity)
        const dino = pool[Math.floor(Math.random() * pool.length)]
        const now = Date.now()
        const instance: DinoInstance = {
          id: uuidv4(),
          dinoId: dino.id,
          obtainedAt: now,
          lastCollectedAt: now,
        }

        set((s) => ({
          docuPoints: s.docuPoints - price,
          ownedDinos: [...s.ownedDinos, instance],
          pendingReveal: instance,
        }))
      },

      collectDino: (instanceId: string) => {
        const instance = get().ownedDinos.find((d) => d.id === instanceId)
        if (!instance) return
        const dino = DINO_MAP[instance.dinoId]
        const pending = Math.floor(calculatePending(instance.lastCollectedAt, dino.coinsPerHour))
        const now = Date.now()
        set((s) => ({
          coins: s.coins + pending,
          ownedDinos: s.ownedDinos.map((d) =>
            d.id === instanceId ? { ...d, lastCollectedAt: now } : d,
          ),
        }))
      },

      collectAll: () => {
        const { ownedDinos } = get()
        const now = Date.now()
        let total = 0
        const updatedDinos = ownedDinos.map((d) => {
          const dino = DINO_MAP[d.dinoId]
          const pending = Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour))
          total += pending
          return { ...d, lastCollectedAt: now }
        })
        set((s) => ({ coins: s.coins + total, ownedDinos: updatedDinos }))
        return total
      },

      clearReveal: () => set({ pendingReveal: null }),

      setWorkMinutes: (m: number) => {
        if (get().pomodoroPhase !== 'idle') return
        set({ workMinutes: Math.max(5, Math.min(90, m)) })
      },

      setBreakMinutes: (m: number) => {
        if (get().pomodoroPhase !== 'idle') return
        set({ breakMinutes: Math.max(1, Math.min(30, m)) })
      },

      cheat: () => set((s) => ({ docuPoints: s.docuPoints + 999, coins: s.coins + 9999 })),
    }),
    { name: 'pomodocus-store' },
  ),
)
