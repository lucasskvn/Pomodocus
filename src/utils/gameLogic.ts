import type { Rarity } from '../data/dinosaurs'

export type EggType = 'common' | 'rare' | 'legendary'

const EGG_PROBABILITIES: Record<EggType, [Rarity, number][]> = {
  common: [['common', 0.70], ['rare', 0.25], ['epic', 0.05], ['legendary', 0]],
  rare: [['common', 0.20], ['rare', 0.55], ['epic', 0.20], ['legendary', 0.05]],
  legendary: [['common', 0], ['rare', 0.30], ['epic', 0.50], ['legendary', 0.20]],
}

export function calculatePending(lastCollectedAt: number, coinsPerHour: number): number {
  const elapsed = Date.now() - lastCollectedAt
  return Math.min((elapsed / 3_600_000) * coinsPerHour, 10 * coinsPerHour)
}

export function getRemaining(timerStartedAt: number, duration: number): number {
  return Math.max(0, duration - (Date.now() - timerStartedAt))
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export interface SessionStats {
  lastSessionDate: string
  streak: number
  todaySessions: number
  totalFocusMinutes: number
}

export function computeSessionStats(
  lastSessionDate: string,
  streak: number,
  todaySessions: number,
  totalFocusMinutes: number,
  workMinutes: number,
): SessionStats {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const newTotal = totalFocusMinutes + workMinutes

  if (lastSessionDate === today) {
    return { lastSessionDate: today, streak, todaySessions: todaySessions + 1, totalFocusMinutes: newTotal }
  }
  if (lastSessionDate === yesterday) {
    return { lastSessionDate: today, streak: streak + 1, todaySessions: 1, totalFocusMinutes: newTotal }
  }
  return { lastSessionDate: today, streak: 1, todaySessions: 1, totalFocusMinutes: newTotal }
}

export function formatFocusTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function workReward(minutes: number): number {
  return Math.round(15 * Math.pow(minutes / 25, 0.65))
}

export function breakReward(minutes: number): number {
  return Math.round(2 * Math.pow(minutes / 5, 0.65))
}

export function slotUpgradeCost(level: number): number {
  return Math.round(500 * Math.pow(1.8, level))
}

export function yieldUpgradeCost(level: number): number {
  return Math.round(1000 * Math.pow(1.8, level))
}

export function rollRarity(eggType: EggType): Rarity {
  const probs = EGG_PROBABILITIES[eggType]
  const roll = Math.random()
  let cumulative = 0
  for (const [rarity, prob] of probs) {
    cumulative += prob
    if (roll < cumulative) return rarity
  }
  return probs[probs.length - 1][0]
}

const DINO_LEVEL_BASE: Record<Rarity, number> = {
  common: 200,
  rare: 500,
  epic: 1200,
  legendary: 3000,
}

const DINO_SELL_BASE: Record<Rarity, number> = {
  common: 50,
  rare: 150,
  epic: 400,
  legendary: 1000,
}

export function dinoLevelUpCost(rarity: Rarity, level: number): number {
  if (level >= 10) return Infinity
  return Math.round(DINO_LEVEL_BASE[rarity] * Math.pow(1.8, level))
}

export function dinoSellPrice(rarity: Rarity, level: number): number {
  let invested = 0
  for (let i = 0; i < level; i++) invested += dinoLevelUpCost(rarity, i)
  return DINO_SELL_BASE[rarity] + Math.floor(invested * 0.5)
}

export function dinoProductionMultiplier(level: number): number {
  return 1 + level * 0.1
}
