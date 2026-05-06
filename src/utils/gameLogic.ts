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
