import { useGameStore } from '../store/useGameStore'
import type { EggType } from '../utils/gameLogic'

const EGGS: { type: EggType; emoji: string; label: string; price: number; probs: string }[] = [
  { type: 'common', emoji: '🥚', label: 'Œuf Commun', price: 15, probs: '70% C · 25% R · 5% E' },
  { type: 'rare', emoji: '🪺', label: 'Œuf Rare', price: 40, probs: '20% C · 55% R · 20% E · 5% L' },
  { type: 'legendary', emoji: '💎', label: 'Œuf Légendaire', price: 100, probs: '30% R · 50% E · 20% L' },
]

export default function EggShop() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const ownedDinos = useGameStore((s) => s.ownedDinos)
  const slotUpgradeLevel = useGameStore((s) => s.slotUpgradeLevel)
  const buyEgg = useGameStore((s) => s.buyEgg)

  const maxDinos = 5 + slotUpgradeLevel * 2
  const parkFull = ownedDinos.length >= maxDinos

  return (
    <div className="pb-2">
      <h2 className="font-fredoka text-xl font-semibold text-white mb-1">Œufs</h2>
      {parkFull && (
        <p className="font-inter text-xs text-amber-400/80 mb-3">
          Parc plein ({ownedDinos.length}/{maxDinos}) — achetez des emplacements ↓
        </p>
      )}
      <div className="flex flex-col gap-3">
        {EGGS.map((egg) => {
          const canAfford = docuPoints >= egg.price && !parkFull
          return (
            <button
              key={egg.type}
              onClick={() => canAfford && buyEgg(egg.type)}
              disabled={!canAfford}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                canAfford
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 cursor-pointer'
                  : 'border-white/10 bg-white/[0.02] opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-4xl">{egg.emoji}</span>
              <div className="flex-1">
                <p className="font-fredoka text-base font-semibold text-white">{egg.label}</p>
                <p className="font-inter text-xs text-white/50 mt-0.5">{egg.probs}</p>
              </div>
              <div className="flex items-center gap-1">
                {parkFull ? (
                  <span className="font-inter text-xs text-amber-400/70">Parc plein</span>
                ) : (
                  <>
                    <span className="font-fredoka font-bold text-lg text-accent-green">{egg.price}</span>
                    <span className="font-inter text-xs text-white/50">pts</span>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
