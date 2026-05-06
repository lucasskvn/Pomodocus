import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { calculatePending } from '../utils/gameLogic'
import { DINO_MAP } from '../data/dinosaurs'

export default function PointsDisplay() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const coins = useGameStore((s) => s.coins)
  const ownedDinos = useGameStore((s) => s.ownedDinos)
  const [displayCoins, setDisplayCoins] = useState(coins)

  useEffect(() => {
    const update = () => {
      const pending = ownedDinos.reduce((sum, d) => {
        const dino = DINO_MAP[d.dinoId]
        return sum + Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour))
      }, 0)
      setDisplayCoins(coins + pending)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [ownedDinos, coins])

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0a1219] border-b border-white/10">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⚡</span>
        <span className="font-fredoka text-lg font-semibold text-accent-green">
          {docuPoints} pts
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-lg">🪙</span>
        <span className="font-fredoka text-lg font-semibold text-accent-amber">
          {displayCoins.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
