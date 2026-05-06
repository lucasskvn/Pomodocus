import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { DINOSAURS, DINO_MAP } from '../data/dinosaurs'
import { calculatePending, rollRarity, type EggType } from '../utils/gameLogic'

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

export const WORK_DURATION = 25* 60 * 1000
export const BREAK_DURATION = 5 * 60 * 1000

interface GameState {
  docuPoints: number
  coins: number
  ownedDinos: DinoInstance[]
  pomodoroPhase: 'work' | 'break' | 'idle'
  timerStartedAt: number | null
  remainingAtPause: number | null
  sessionsCompleted: number
  pendingReveal: DinoInstance | null
}

interface GameActions {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completePomodoro: () => void
  completeBreak: () => void
  buyEgg: (eggType: EggType) => void
  collectDino: (instanceId: string) => void
  clearReveal: () => void
  cheat: () => void
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

      startTimer: () => {
        const { remainingAtPause, pomodoroPhase } = get()
        const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION
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
        const { timerStartedAt, pomodoroPhase } = get()
        if (timerStartedAt === null) return
        const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION
        set({
          remainingAtPause: Math.max(0, duration - (Date.now() - timerStartedAt)),
          timerStartedAt: null,
        })
      },

      resetTimer: () => {
        set({ timerStartedAt: null, remainingAtPause: null, pomodoroPhase: 'idle' })
      },

      completePomodoro: () => {
        set((s) => ({
          pomodoroPhase: 'break',
          docuPoints: s.docuPoints + 15,
          sessionsCompleted: s.sessionsCompleted + 1,
          timerStartedAt: Date.now(),
          remainingAtPause: null,
        }))
      },

      completeBreak: () => {
        set((s) => ({
          pomodoroPhase: 'idle',
          docuPoints: s.docuPoints + 2,
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

      clearReveal: () => set({ pendingReveal: null }),

      cheat: () => set((s) => ({ docuPoints: s.docuPoints + 999, coins: s.coins + 9999 })),
    }),
    { name: 'pomodocus-store' },
  ),
)
