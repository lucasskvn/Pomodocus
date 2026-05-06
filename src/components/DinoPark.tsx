import { useGameStore } from '../store/useGameStore'
import DinoCard from './DinoCard'

export default function DinoPark() {
  const ownedDinos = useGameStore((s) => s.ownedDinos)

  if (ownedDinos.length === 0) {
    return (
      <div
        className="min-h-full flex flex-col items-center gap-4 py-20 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #0a2010 0%, #0f2d18 60%, #0a1a0c 100%)' }}
      >
        <div className="text-5xl mb-2">🌿</div>
        <span className="text-6xl">🥚</span>
        <p className="font-fredoka text-xl font-semibold text-green-300">Parc vide !</p>
        <p className="font-inter text-sm text-green-200/50 leading-relaxed">
          Complète des sessions Pomodoro pour gagner des DocusPoints, puis achète des œufs dans la boutique.
        </p>
      </div>
    )
  }

  return (
    <div
      className="min-h-full"
      style={{ background: 'linear-gradient(180deg, #0a2010 0%, #0f2d18 60%, #0a1a0c 100%)' }}
    >
      {/* Jungle header */}
      <div className="relative px-4 pt-5 pb-3 border-b border-green-900/50">
        <div className="absolute inset-0 opacity-10 text-6xl flex items-end justify-between px-2 pb-0 pointer-events-none select-none overflow-hidden">
          <span>🌴</span>
          <span>🌿</span>
          <span>🌴</span>
        </div>
        <div className="relative flex items-center justify-between">
          <h2 className="font-fredoka text-xl font-semibold text-green-300">
            Jurassic Parc{' '}
            <span className="text-accent-green">
              ({ownedDinos.length} dino{ownedDinos.length > 1 ? 's' : ''})
            </span>
          </h2>
          <span className="text-2xl">🦖</span>
        </div>
      </div>

      {/* Dino grid */}
      <div className="p-4 flex flex-col gap-3">
        {ownedDinos.map((instance, i) => (
          <DinoCard key={instance.id} instance={instance} index={i} />
        ))}
      </div>

      {/* Jungle floor decoration */}
      <div className="text-center py-4 text-3xl opacity-20 select-none pointer-events-none">
        🌿🌱🌿🌱🌿
      </div>
    </div>
  )
}
