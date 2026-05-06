import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, type DinoInstance } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'

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
  onClick?: () => void
}

export default function DinoCard({ instance, index, onClick }: Props) {
  const collectDino = useGameStore((s) => s.collectDino)
  const dino = DINO_MAP[instance.dinoId]
  const SpriteComponent = SPRITE_MAP[instance.dinoId]
  const cap = 10 * dino.coinsPerHour
  const level = instance.level ?? 0
  const effectiveRate = dino.coinsPerHour * dinoProductionMultiplier(level)

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, effectiveRate),
  )

  useEffect(() => {
    const update = () => setPending(calculatePending(instance.lastCollectedAt, effectiveRate))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, effectiveRate])

  const isFull = pending >= cap
  const pendingDisplay = Math.floor(pending)
  const progress = Math.min(pending / cap, 1)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
      onClick={onClick}
      className="rounded-2xl p-4 flex flex-col gap-3 border"
      style={{
        background: `${dino.color}11`,
        borderColor: `${dino.color}33`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          {SpriteComponent && <SpriteComponent frame={0} />}
        </div>
        <div>
          <p className="font-fredoka text-base font-semibold text-white">
            {instance.nickname ?? dino.name}
          </p>
          <p className="font-inter text-xs font-semibold" style={{ color: dino.color }}>
            {RARITY_LABEL[dino.rarity]}
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-0.5">
          <p className="font-fredoka text-sm font-semibold text-white/60">
            {Math.round(effectiveRate)} 🪙/h
          </p>
          {level > 0 && (
            <span
              className="font-fredoka text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${dino.color}33`, color: dino.color }}
            >
              Lv.{level}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-inter text-white/60">
            {pendingDisplay.toLocaleString()} / {Math.floor(cap).toLocaleString()} 🪙
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
        onClick={(e) => { e.stopPropagation(); collectDino(instance.id) }}
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
