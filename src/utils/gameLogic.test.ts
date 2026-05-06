import { describe, it, expect, vi } from 'vitest'
import { calculatePending, getRemaining, formatTime, rollRarity, workReward, breakReward, computeSessionStats, formatFocusTime, slotUpgradeCost, yieldUpgradeCost, dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier } from './gameLogic'

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

describe('computeSessionStats', () => {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  it('première session : initialise tout à 1', () => {
    const r = computeSessionStats('', 0, 0, 0, 25)
    expect(r.streak).toBe(1)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(25)
    expect(r.lastSessionDate).toBe(today)
  })

  it('même jour : incrémente todaySessions, streak inchangé', () => {
    const r = computeSessionStats(today, 3, 2, 50, 25)
    expect(r.streak).toBe(3)
    expect(r.todaySessions).toBe(3)
    expect(r.totalFocusMinutes).toBe(75)
    expect(r.lastSessionDate).toBe(today)
  })

  it('jour suivant : incrémente streak, remet todaySessions à 1', () => {
    const r = computeSessionStats(yesterday, 3, 5, 100, 25)
    expect(r.streak).toBe(4)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(125)
    expect(r.lastSessionDate).toBe(today)
  })

  it('jour manqué : remet streak à 1', () => {
    const r = computeSessionStats('2020-01-01', 5, 3, 100, 30)
    expect(r.streak).toBe(1)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(130)
    expect(r.lastSessionDate).toBe(today)
  })
})

describe('formatFocusTime', () => {
  it('formate < 60 min en Nm', () => expect(formatFocusTime(45)).toBe('45m'))
  it('formate 0 en 0m', () => expect(formatFocusTime(0)).toBe('0m'))
  it('formate 60 min en 1h 0m', () => expect(formatFocusTime(60)).toBe('1h 0m'))
  it('formate 85 min en 1h 25m', () => expect(formatFocusTime(85)).toBe('1h 25m'))
})

describe('slotUpgradeCost', () => {
  it('niveau 0 coûte 500', () => expect(slotUpgradeCost(0)).toBe(500))
  it('niveau 1 coûte 900', () => expect(slotUpgradeCost(1)).toBe(900))
  it('niveau 2 coûte 1620', () => expect(slotUpgradeCost(2)).toBe(1620))
  it('croît avec le niveau', () => expect(slotUpgradeCost(3)).toBeGreaterThan(slotUpgradeCost(2)))
})

describe('yieldUpgradeCost', () => {
  it('niveau 0 coûte 1000', () => expect(yieldUpgradeCost(0)).toBe(1000))
  it('niveau 1 coûte 1800', () => expect(yieldUpgradeCost(1)).toBe(1800))
  it('niveau 2 coûte 3240', () => expect(yieldUpgradeCost(2)).toBe(3240))
  it('croît avec le niveau', () => expect(yieldUpgradeCost(3)).toBeGreaterThan(yieldUpgradeCost(2)))
})

describe('workReward', () => {
  it('returns 15 at baseline 25 min', () => {
    expect(workReward(25)).toBe(15)
  })
  it('returns less than 15 at 5 min', () => {
    expect(workReward(5)).toBeLessThan(15)
  })
  it('returns more than 15 at 90 min', () => {
    expect(workReward(90)).toBeGreaterThan(15)
  })
  it('has diminishing returns: 90min gives less than 3.6x of 25min', () => {
    expect(workReward(90)).toBeLessThan(Math.round(15 * 3.6))
  })
})

describe('breakReward', () => {
  it('returns 2 at baseline 5 min', () => {
    expect(breakReward(5)).toBe(2)
  })
  it('returns more than 2 at 30 min', () => {
    expect(breakReward(30)).toBeGreaterThan(2)
  })
  it('returns less than 2 at 1 min', () => {
    expect(breakReward(1)).toBeLessThan(2)
  })
})

describe('dinoLevelUpCost', () => {
  it('common level 0 → 200', () => expect(dinoLevelUpCost('common', 0)).toBe(200))
  it('common level 1 → 360', () => expect(dinoLevelUpCost('common', 1)).toBe(360))
  it('rare level 0 → 500', () => expect(dinoLevelUpCost('rare', 0)).toBe(500))
  it('epic level 0 → 1200', () => expect(dinoLevelUpCost('epic', 0)).toBe(1200))
  it('legendary level 0 → 3000', () => expect(dinoLevelUpCost('legendary', 0)).toBe(3000))
  it('level 10 → Infinity', () => expect(dinoLevelUpCost('common', 10)).toBe(Infinity))
})

describe('dinoSellPrice', () => {
  it('common level 0 → 50', () => expect(dinoSellPrice('common', 0)).toBe(50))
  it('rare level 0 → 150', () => expect(dinoSellPrice('rare', 0)).toBe(150))
  it('epic level 0 → 400', () => expect(dinoSellPrice('epic', 0)).toBe(400))
  it('legendary level 0 → 1000', () => expect(dinoSellPrice('legendary', 0)).toBe(1000))
  it('common level 1 → 50 + 50% of 200 = 150', () => expect(dinoSellPrice('common', 1)).toBe(150))
  it('common level 2 → 50 + 50% of (200+360) = 330', () => expect(dinoSellPrice('common', 2)).toBe(330))
})

describe('dinoProductionMultiplier', () => {
  it('level 0 → 1.0', () => expect(dinoProductionMultiplier(0)).toBe(1.0))
  it('level 5 → 1.5', () => expect(dinoProductionMultiplier(5)).toBe(1.5))
  it('level 10 → 2.0', () => expect(dinoProductionMultiplier(10)).toBe(2.0))
})
