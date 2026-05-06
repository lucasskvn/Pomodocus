import { useGameStore } from '../store/useGameStore'
import { slotUpgradeCost, yieldUpgradeCost } from '../utils/gameLogic'

export default function UpgradeShop() {
  const coins = useGameStore((s) => s.coins)
  const slotUpgradeLevel = useGameStore((s) => s.slotUpgradeLevel)
  const yieldUpgradeLevel = useGameStore((s) => s.yieldUpgradeLevel)
  const buySlotUpgrade = useGameStore((s) => s.buySlotUpgrade)
  const buyYieldUpgrade = useGameStore((s) => s.buyYieldUpgrade)

  const slotCost = slotUpgradeCost(slotUpgradeLevel)
  const yieldCost = yieldUpgradeCost(yieldUpgradeLevel)
  const maxDinos = 5 + slotUpgradeLevel * 2
  const yieldBonus = yieldUpgradeLevel === 0 ? 'Aucun bonus' : `+${yieldUpgradeLevel * 5}%`

  return (
    <div className="pb-2">
      <h2 className="font-fredoka text-xl font-semibold text-white mb-3">Améliorations</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
          <span className="text-4xl">🏠</span>
          <div className="flex-1">
            <p className="font-fredoka text-base font-semibold text-white">Emplacements dinos</p>
            <p className="font-inter text-xs text-white/50 mt-0.5">
              Niveau {slotUpgradeLevel} — {maxDinos} dinos max
            </p>
          </div>
          <button
            onClick={buySlotUpgrade}
            disabled={coins < slotCost}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-fredoka font-bold text-sm transition-all flex-shrink-0 ${
              coins >= slotCost
                ? 'bg-accent-amber/20 border border-accent-amber text-accent-amber hover:bg-accent-amber/30 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {slotCost.toLocaleString()} 🪙
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
          <span className="text-4xl">⚡</span>
          <div className="flex-1">
            <p className="font-fredoka text-base font-semibold text-white">Rendement</p>
            <p className="font-inter text-xs text-white/50 mt-0.5">
              Niveau {yieldUpgradeLevel} — {yieldBonus} de production
            </p>
          </div>
          <button
            onClick={buyYieldUpgrade}
            disabled={coins < yieldCost}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-fredoka font-bold text-sm transition-all flex-shrink-0 ${
              coins >= yieldCost
                ? 'bg-accent-amber/20 border border-accent-amber text-accent-amber hover:bg-accent-amber/30 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {yieldCost.toLocaleString()} 🪙
          </button>
        </div>
      </div>
    </div>
  )
}
