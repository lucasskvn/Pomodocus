import { useGameStore } from '../store/useGameStore'
import { THEMES, DECORATIONS } from '../data/cosmetics'

export default function CosmeticsShop() {
  const coins = useGameStore((s) => s.coins)
  const parkTheme = useGameStore((s) => s.parkTheme)
  const ownedThemes = useGameStore((s) => s.ownedThemes)
  const ownedDecorations = useGameStore((s) => s.ownedDecorations)
  const buyTheme = useGameStore((s) => s.buyTheme)
  const buyDecoration = useGameStore((s) => s.buyDecoration)

  return (
    <div className="flex flex-col gap-8">
      {/* Thèmes */}
      <div className="space-y-4">
        <h2 className="font-fredoka text-2xl font-bold text-white">🌍 Thèmes</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(THEMES).map((theme) => {
            const isOwned = ownedThemes.includes(theme.id)
            const isActive = parkTheme === theme.id
            const canBuy = coins >= theme.price && !isOwned
            const canActivate = isOwned && !isActive
            return (
              <button
                key={theme.id}
                onClick={() => (canBuy || canActivate) && buyTheme(theme.id)}
                disabled={!canBuy && !canActivate}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  isActive
                    ? 'border-accent-green bg-accent-green/10'
                    : isOwned
                      ? 'border-white/20 bg-white/5 hover:border-white/40 cursor-pointer'
                      : canBuy
                        ? 'border-white/20 bg-white/5 hover:border-white/40 cursor-pointer'
                        : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl block mb-2">{theme.emoji}</span>
                <p className="font-fredoka font-semibold text-white text-sm">{theme.name}</p>
                <p className="font-inter text-xs text-white/60 mt-1">{theme.description}</p>
                {!isOwned && <p className="font-fredoka text-accent-amber text-sm mt-2">{theme.price} 🪙</p>}
                {isActive && <p className="font-inter text-xs text-accent-green mt-2">✓ Actif</p>}
                {isOwned && !isActive && <p className="font-inter text-xs text-accent-green mt-2">✓ Acheté</p>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Décorations */}
      <div className="space-y-4">
        <h2 className="font-fredoka text-2xl font-bold text-white">🎨 Décoration du parc</h2>
        <div className="grid grid-cols-2 gap-3">
          {DECORATIONS.map((deco) => {
            const isOwned = ownedDecorations.includes(deco.id)
            const canBuy = coins >= deco.price && !isOwned
            return (
              <button
                key={deco.id}
                onClick={() => canBuy && buyDecoration(deco.id)}
                disabled={!canBuy}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  isOwned
                    ? 'border-accent-green bg-accent-green/10'
                    : canBuy
                      ? 'border-white/20 bg-white/5 hover:border-white/40 cursor-pointer'
                      : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl block mb-2">{deco.emoji}</span>
                <p className="font-fredoka font-semibold text-white text-sm">{deco.name}</p>
                <p className="font-inter text-xs text-white/60 mt-1">{deco.description}</p>
                <p className="font-fredoka text-accent-amber text-sm mt-2">{deco.price} 🪙</p>
                {isOwned && <p className="font-inter text-xs text-accent-green mt-2">✓ Acheté</p>}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
