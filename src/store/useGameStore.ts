import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { DINOSAURS, DINO_MAP } from '../data/dinosaurs'
import { DAILY_QUESTS } from '../data/quests'
import { THEMES, DECORATIONS, DINO_COSMETICS, type ThemeType } from '../data/cosmetics'
import { calculatePending, rollRarity, workReward, breakReward, computeSessionStats, slotUpgradeCost, yieldUpgradeCost, dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier, type EggType } from '../utils/gameLogic'

export interface TimerPreset {
  id: string
  name: string
  workMinutes: number
  breakMinutes: number
  builtin?: true
}

export interface DinoInstance {
  id: string
  dinoId: string
  obtainedAt: number
  lastCollectedAt: number
  level: number
  nickname: string | null
}

export interface SessionTask {
  id: string
  title: string
  completed: boolean
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
  slotUpgradeLevel: number
  yieldUpgradeLevel: number
  presets: TimerPreset[]
  sessionLog: Array<{ date: string; sessions: number; minutes: number }>
  claimedQuests: string[]
  lastQuestDate: string
  timerBackground: 'default' | 'gradient' | 'solid' | 'custom'
  timerBackgroundImage: string | null
  parkTheme: ThemeType
  ownedThemes: ThemeType[]
  ownedDecorations: string[]
  dinoCosmetics: Record<string, string[]>
  activeCosmetics: Record<string, Record<string, string>>
  sessionTasks: SessionTask[]
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
  buySlotUpgrade: () => void
  buyYieldUpgrade: () => void
  levelUpDino: (instanceId: string) => void
  sellDino: (instanceId: string) => void
  renameDino: (instanceId: string, name: string) => void
  applyPreset: (id: string) => void
  saveCustomPreset: (slot: 0 | 1 | 2, name: string, workMinutes: number, breakMinutes: number) => void
  deleteCustomPreset: (slot: 0 | 1 | 2) => void
  claimQuest: (questId: string) => void
  checkQuestDateReset: () => void
  setTimerBackground: (bg: 'default' | 'gradient' | 'solid' | 'custom') => void
  setTimerBackgroundImage: (image: string | null) => void
  buyTheme: (themeId: ThemeType) => void
  buyDecoration: (decorationId: string) => void
  buyDinoCosmetic: (cosmeticId: string, dinoInstanceId: string) => void
  toggleDinoCosmetic: (dinoInstanceId: string, cosmeticType: string, cosmeticId: string) => void
  addTask: (title: string) => void
  toggleTask: (taskId: string) => void
  removeTask: (taskId: string) => void
  clearTasks: () => void
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
      slotUpgradeLevel: 0,
      yieldUpgradeLevel: 0,
      presets: [
        { id: 'classic',  name: 'Classique', workMinutes: 25, breakMinutes: 5,  builtin: true as const },
        { id: 'deepwork', name: 'Deep Work', workMinutes: 50, breakMinutes: 10, builtin: true as const },
        { id: 'sprint',   name: 'Sprint',    workMinutes: 15, breakMinutes: 3,  builtin: true as const },
        { id: 'custom-0', name: '',          workMinutes: 25, breakMinutes: 5  },
        { id: 'custom-1', name: '',          workMinutes: 25, breakMinutes: 5  },
        { id: 'custom-2', name: '',          workMinutes: 25, breakMinutes: 5  },
      ],
      sessionLog: [],
      claimedQuests: [],
      lastQuestDate: '',
      timerBackground: 'default',
      timerBackgroundImage: null,
      parkTheme: 'default',
      ownedThemes: ['default'],
      ownedDecorations: [],
      dinoCosmetics: {},
      activeCosmetics: {},
      sessionTasks: [],

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
        const todayKey = new Date().toISOString().slice(0, 10)
        const log = get().sessionLog ?? []
        const idx = log.findIndex(r => r.date === todayKey)
        const updatedLog = idx >= 0
          ? log.map((r, i) => i === idx ? { ...r, sessions: r.sessions + 1, minutes: r.minutes + workMinutes } : r)
          : [...log, { date: todayKey, sessions: 1, minutes: workMinutes }]
        set((s) => ({
          pomodoroPhase: 'break',
          docuPoints: s.docuPoints + workReward(s.workMinutes),
          sessionsCompleted: s.sessionsCompleted + 1,
          timerStartedAt: Date.now(),
          remainingAtPause: null,
          sessionLog: updatedLog,
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
        const { docuPoints, ownedDinos, slotUpgradeLevel } = get()
        const price = EGG_PRICES[eggType]
        const maxDinos = 5 + slotUpgradeLevel * 2
        if (docuPoints < price) return
        if (ownedDinos.length >= maxDinos) return

        const rarity = rollRarity(eggType)
        const pool = DINOSAURS.filter((d) => d.rarity === rarity)
        const dino = pool[Math.floor(Math.random() * pool.length)]
        const now = Date.now()
        const instance: DinoInstance = {
          id: uuidv4(),
          dinoId: dino.id,
          obtainedAt: now,
          lastCollectedAt: now,
          level: 0,
          nickname: null,
        }

        set((s) => ({
          docuPoints: s.docuPoints - price,
          ownedDinos: [...s.ownedDinos, instance],
          pendingReveal: instance,
        }))
      },

      collectDino: (instanceId: string) => {
        const { ownedDinos, yieldUpgradeLevel } = get()
        const instance = ownedDinos.find((d) => d.id === instanceId)
        if (!instance) return
        const dino = DINO_MAP[instance.dinoId]
        const yieldMult = 1 + yieldUpgradeLevel * 0.05
        const levelMult = dinoProductionMultiplier(instance.level ?? 0)
        const pending = Math.floor(calculatePending(instance.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
        const now = Date.now()
        set((s) => ({
          coins: s.coins + pending,
          ownedDinos: s.ownedDinos.map((d) =>
            d.id === instanceId ? { ...d, lastCollectedAt: now } : d,
          ),
        }))
      },

      collectAll: () => {
        const { ownedDinos, yieldUpgradeLevel } = get()
        const yieldMult = 1 + yieldUpgradeLevel * 0.05
        const now = Date.now()
        let total = 0
        const updatedDinos = ownedDinos.map((d) => {
          const dino = DINO_MAP[d.dinoId]
          const levelMult = dinoProductionMultiplier(d.level ?? 0)
          const pending = Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
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

      buySlotUpgrade: () => {
        const { coins, slotUpgradeLevel } = get()
        const cost = slotUpgradeCost(slotUpgradeLevel)
        if (coins < cost) return
        set((s) => ({ coins: s.coins - cost, slotUpgradeLevel: s.slotUpgradeLevel + 1 }))
      },

      buyYieldUpgrade: () => {
        const { coins, yieldUpgradeLevel } = get()
        const cost = yieldUpgradeCost(yieldUpgradeLevel)
        if (coins < cost) return
        set((s) => ({ coins: s.coins - cost, yieldUpgradeLevel: s.yieldUpgradeLevel + 1 }))
      },

      levelUpDino: (instanceId: string) => {
        const { coins, ownedDinos } = get()
        const instance = ownedDinos.find((d) => d.id === instanceId)
        if (!instance) return
        const dino = DINO_MAP[instance.dinoId]
        const level = instance.level ?? 0
        if (level >= 10) return
        const cost = dinoLevelUpCost(dino.rarity, level)
        if (coins < cost) return
        set((s) => ({
          coins: s.coins - cost,
          ownedDinos: s.ownedDinos.map((d) =>
            d.id === instanceId ? { ...d, level: (d.level ?? 0) + 1 } : d,
          ),
        }))
      },

      sellDino: (instanceId: string) => {
        const { ownedDinos } = get()
        const instance = ownedDinos.find((d) => d.id === instanceId)
        if (!instance) return
        const dino = DINO_MAP[instance.dinoId]
        const price = dinoSellPrice(dino.rarity, instance.level ?? 0)
        set((s) => ({
          coins: s.coins + price,
          ownedDinos: s.ownedDinos.filter((d) => d.id !== instanceId),
        }))
      },

      renameDino: (instanceId: string, name: string) => {
        if (!get().ownedDinos.find((d) => d.id === instanceId)) return
        const trimmed = name.trim()
        set((s) => ({
          ownedDinos: s.ownedDinos.map((d) =>
            d.id === instanceId ? { ...d, nickname: trimmed || null } : d,
          ),
        }))
      },

      applyPreset: (id: string) => {
        const { presets, pomodoroPhase } = get()
        if (pomodoroPhase !== 'idle') return
        const preset = presets.find((p) => p.id === id)
        if (!preset) return
        set({
          workMinutes: Math.max(5, Math.min(90, preset.workMinutes)),
          breakMinutes: Math.max(1, Math.min(30, preset.breakMinutes)),
        })
      },

      saveCustomPreset: (slot: 0 | 1 | 2, name: string, workMinutes: number, breakMinutes: number) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((s) => ({
          presets: s.presets.map((p, i) =>
            i === 3 + slot ? { ...p, name: trimmed, workMinutes, breakMinutes } : p,
          ),
        }))
      },

      deleteCustomPreset: (slot: 0 | 1 | 2) => {
        set((s) => ({
          presets: s.presets.map((p, i) =>
            i === 3 + slot
              ? { id: `custom-${slot}`, name: '', workMinutes: 25, breakMinutes: 5 }
              : p,
          ),
        }))
      },

      checkQuestDateReset: () => {
        const today = new Date().toISOString().slice(0, 10)
        const { lastQuestDate } = get()
        if (lastQuestDate !== today) {
          set({ claimedQuests: [], lastQuestDate: today })
        }
      },

      claimQuest: (questId: string) => {
        const today = new Date().toISOString().slice(0, 10)
        const { lastQuestDate, claimedQuests, todaySessions, streak } = get()

        if (lastQuestDate !== today) {
          set({ claimedQuests: [], lastQuestDate: today })
        }

        if (claimedQuests.includes(questId)) return

        const quest = DAILY_QUESTS.find(q => q.id === questId)
        if (!quest) return

        let canClaim = false
        if (quest.type === 'sessions') canClaim = todaySessions >= quest.target
        if (quest.type === 'streak') canClaim = streak >= quest.target

        if (!canClaim) return

        set((s) => ({
          claimedQuests: [...s.claimedQuests, questId],
          coins: s.coins + (quest.reward.coins || 0),
          docuPoints: s.docuPoints + (quest.reward.docuPoints || 0),
        }))
      },

      cheat: () => set((s) => ({ docuPoints: s.docuPoints + 999, coins: s.coins + 9999 })),

      setTimerBackground: (bg: 'default' | 'gradient' | 'solid' | 'custom') => {
        set({ timerBackground: bg })
      },

      setTimerBackgroundImage: (image: string | null) => {
        set({ timerBackgroundImage: image })
      },

      buyTheme: (themeId: ThemeType) => {
        const theme = THEMES[themeId]
        if (!theme) return
        const { coins, ownedThemes } = get()
        const isOwned = ownedThemes.includes(themeId)

        if (isOwned) {
          set({ parkTheme: themeId })
          return
        }

        if (coins < theme.price) return
        set((s) => ({
          coins: s.coins - theme.price,
          ownedThemes: [...s.ownedThemes, themeId],
          parkTheme: themeId,
        }))
      },

      buyDecoration: (decorationId: string) => {
        const decoration = DECORATIONS.find((d) => d.id === decorationId)
        if (!decoration) return
        const { coins } = get()
        if (coins < decoration.price) return
        set((s) => ({
          coins: s.coins - decoration.price,
          ownedDecorations: [...s.ownedDecorations, decorationId],
        }))
      },

      buyDinoCosmetic: (cosmeticId: string, dinoInstanceId: string) => {
        const cosmetic = DINO_COSMETICS.find((c) => c.id === cosmeticId)
        if (!cosmetic) return
        const { coins } = get()
        if (coins < cosmetic.price) return
        set((s) => {
          const currentCosmetics = s.dinoCosmetics[dinoInstanceId] ?? []
          return {
            coins: s.coins - cosmetic.price,
            dinoCosmetics: {
              ...s.dinoCosmetics,
              [dinoInstanceId]: [...currentCosmetics, cosmeticId],
            },
          }
        })
      },

      toggleDinoCosmetic: (dinoInstanceId: string, cosmeticType: string, cosmeticId: string) => {
        set((s) => ({
          activeCosmetics: {
            ...s.activeCosmetics,
            [dinoInstanceId]: {
              ...(s.activeCosmetics[dinoInstanceId] ?? {}),
              [cosmeticType]: cosmeticId,
            },
          },
        }))
      },

      addTask: (title: string) => {
        const trimmed = title.trim()
        if (!trimmed) return
        const newTask: SessionTask = {
          id: uuidv4(),
          title: trimmed,
          completed: false,
        }
        set((s) => ({ sessionTasks: [...s.sessionTasks, newTask] }))
      },

      toggleTask: (taskId: string) => {
        set((s) => ({
          sessionTasks: s.sessionTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t,
          ),
        }))
      },

      removeTask: (taskId: string) => {
        set((s) => ({
          sessionTasks: s.sessionTasks.filter((t) => t.id !== taskId),
        }))
      },

      clearTasks: () => {
        set({ sessionTasks: [] })
      },
    }),
    { name: 'pomodocus-store' },
  ),
)
