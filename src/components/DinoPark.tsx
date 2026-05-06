import { useGameStore } from '../store/useGameStore'
import DinoCard from './DinoCard'

export default function DinoPark() {
  const ownedDinos = useGameStore((s) => s.ownedDinos)

  if (ownedDinos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
        <span className="text-6xl">🥚</span>
        <p className="font-fredoka text-xl font-semibold text-white">Parc vide !</p>
        <p className="font-inter text-sm text-white/50 leading-relaxed">
          Complète des sessions Pomodoro pour gagner des DocusPoints, puis achète des œufs dans la boutique.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="font-fredoka text-xl font-semibold text-white">
        Ton parc{' '}
        <span className="text-accent-green">
          ({ownedDinos.length} dino{ownedDinos.length > 1 ? 's' : ''})
        </span>
      </h2>
      {ownedDinos.map((instance, i) => (
        <DinoCard key={instance.id} instance={instance} index={i} />
      ))}
    </div>
  )
}
