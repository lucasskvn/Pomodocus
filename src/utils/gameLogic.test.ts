import { describe, it, expect, vi } from 'vitest'
import { calculatePending, getRemaining, formatTime, rollRarity } from './gameLogic'

describe('calculatePending', () => {
  it('retourne les coins gagnés depuis lastCollectedAt', () => {
    const oneHourAgo = Date.now() - 3_600_000
    expect(calculatePending(oneHourAgo, 60)).toBeCloseTo(60, 0)
  })

  it('plafonne à 10h de production', () => {
    const twentyHoursAgo = Date.now() - 72_000_000
    expect(calculatePending(twentyHoursAgo, 60)).toBe(600)
  })

  it('retourne 0 si aucun temps écoulé', () => {
    expect(calculatePending(Date.now(), 60)).toBeCloseTo(0, 0)
  })
})

describe('getRemaining', () => {
  it('retourne les ms restants', () => {
    const tenSecondsAgo = Date.now() - 10_000
    expect(getRemaining(tenSecondsAgo, 60_000)).toBeCloseTo(50_000, -3)
  })

  it('retourne 0 si la durée est dépassée', () => {
    const twoMinutesAgo = Date.now() - 120_000
    expect(getRemaining(twoMinutesAgo, 60_000)).toBe(0)
  })
})

describe('formatTime', () => {
  it('formate 90000ms en 01:30', () => {
    expect(formatTime(90_000)).toBe('01:30')
  })

  it('formate 0ms en 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formate 1500000ms en 25:00', () => {
    expect(formatTime(1_500_000)).toBe('25:00')
  })
})

describe('rollRarity', () => {
  it('retourne common pour un œuf commun quand roll < 0.70', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollRarity('common')).toBe('common')
    vi.restoreAllMocks()
  })

  it('retourne rare pour un œuf commun quand 0.70 ≤ roll < 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.85)
    expect(rollRarity('common')).toBe('rare')
    vi.restoreAllMocks()
  })

  it('retourne epic pour un œuf commun quand roll ≥ 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.97)
    expect(rollRarity('common')).toBe('epic')
    vi.restoreAllMocks()
  })

  it('retourne legendary pour un œuf rare quand roll ≥ 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.97)
    expect(rollRarity('rare')).toBe('legendary')
    vi.restoreAllMocks()
  })

  it('retourne epic pour un œuf légendaire quand 0.30 ≤ roll < 0.80', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollRarity('legendary')).toBe('epic')
    vi.restoreAllMocks()
  })
})
