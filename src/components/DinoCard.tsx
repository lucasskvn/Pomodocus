import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, type DinoInstance } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { calculatePending } from '../utils/gameLogic'

import { DinoParasaurolophus } from '../sprites/DinoParasaurolophus'
import { DinoStegosaurus }     from '../sprites/DinoStegosaurus'
import { DinoAnkylosaurus }    from '../sprites/DinoAnkylosaurus'
import { DinoTriceratops }     from '../sprites/DinoTriceratops'
import { DinoVelociraptor }    from '../sprites/DinoVelociraptor'
import { DinoSpinosaurus }     from '../sprites/DinoSpinosaurus'
import { DinoTRex }            from '../sprites/DinoTRex'
import { DinoBrachiosaurus }   from '../sprites/DinoBrachiosaurus'
import { DinoPterodactyl }     from '../sprites/DinoPterodactyl'
import { DinoAnkylosaurusClub } from '../sprites/DinoAnkylosaurusClub'

type SpriteComponent = (props: { frame: 0 | 1 | 2; flipped?: boolean }) => React.JSX.Element

const SPRITE_MAP: Record<string, SpriteComponent> = {
  parasaurolophus: DinoParasaurolophus,
  stegosaurus:     DinoStegosaurus,
  ankylosaurus:    DinoAnkylosaurus,
  triceratops:     DinoTriceratops,
  velociraptor:    DinoVelociraptor,
  spinosaurus:     DinoSpinosaurus,
  trex:            DinoTRex,
  brachiosaurus:   DinoBrachiosaurus,
  pterodactyl:     DinoPterodactyl,
  ankylosaurusclub: DinoAnkylosaurusClub,
}

interface Props {
  instance: DinoInstance
  index: number
}

export default function DinoCard({ instance, index }: Props) {
  const collectDino = useGameStore((s) => s.collectDino)
  const dino = DINO_MAP[instance.dinoId]
  const SpriteComponent = SPRITE_MAP[instance.dinoId]
  const cap = 10 * dino.coinsPerHour

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, dino.coinsPerHour),
  )

  useEffect(() => {
    const update = () => setPending(calculatePending(instance.lastCollectedAt, dino.coinsPerHour))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, dino.coinsPerHour])

  const isFull = pending >= cap
  const pendingDisplay = Math.floor(pending)
  const progress = Math.min(pending / cap, 1)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
      className="rounded-2xl p-4 flex flex-col gap-3 border"
      style={{ background: `${dino.color}11`, borderColor: `${dino.color}33` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          {SpriteComponent && <SpriteComponent frame={0} />}
        </div>
        <div>
          <p className="font-fredoka text-base font-semibold text-white">{dino.name}</p>
          <p className="font-inter text-xs font-semibold" style={{ color: dino.color }}>
            {RARITY_LABEL[dino.rarity]}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-fredoka text-sm font-semibold text-white/60">
            {dino.coinsPerHour} 🪙/h
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-inter text-white/60">
            {pendingDisplay.toLocaleString()} / {cap.toLocaleString()} 🪙
          </span>
          {isFull && <span className="text-accent-amber text-xs">🔒 Plein</span>}
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress * 100}%`, background: dino.color }}
          />
        </div>
      </div>

      <button
        onClick={() => collectDino(instance.id)}
        disabled={pendingDisplay === 0}
        className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-semibold transition-opacity ${
          pendingDisplay > 0
            ? 'hover:opacity-90 cursor-pointer'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
        style={pendingDisplay > 0 ? { background: dino.color, color: '#0f1923' } : {}}
      >
        {isFull
          ? `🔒 Collecter ${pendingDisplay.toLocaleString()} 🪙`
          : pendingDisplay > 0
            ? `Collecter ${pendingDisplay.toLocaleString()} 🪙`
            : 'En production...'}
      </button>
    </motion.div>
  )
}
