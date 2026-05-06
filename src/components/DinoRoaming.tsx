import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { type DinoInstance } from '../store/useGameStore'
import { DINO_MAP } from '../data/dinosaurs'
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

type SpriteProps = { frame: 0 | 1 | 2; flipped?: boolean }
type SpriteComponent = (props: SpriteProps) => React.JSX.Element

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
  onClick: () => void
}
interface Pos  { x: number; y: number }

function randomPos(): Pos {
  return { x: 12 + Math.random() * 72, y: 12 + Math.random() * 68 }
}

export default function DinoRoaming({ instance, onClick }: Props) {
  const dino = DINO_MAP[instance.dinoId]
  const levelMult = dinoProductionMultiplier(instance.level ?? 0)
  const effectiveRate = dino.coinsPerHour * levelMult

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, effectiveRate),
  )
  const [pos, setPos]       = useState<Pos>(randomPos)
  const [prevX, setPrevX]   = useState(pos.x)
  const [moving, setMoving] = useState(false)
  const [frame, setFrame]   = useState<0 | 1 | 2>(0)

  /* Pending update */
  useEffect(() => {
    const id = setInterval(
      () => setPending(calculatePending(instance.lastCollectedAt, effectiveRate)),
      1000,
    )
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, effectiveRate])

  /* Roam every 5–10s */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        setPos((prev) => { setPrevX(prev.x); return randomPos() })
        setMoving(true)
        setTimeout(() => setMoving(false), 5000)
        schedule()
      }, 5000 + Math.random() * 5000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  /* Walk cycle: 0→1→2→1→0 at ~3 fps while moving */
  useEffect(() => {
    if (!moving) { setFrame(0); return }
    const cycle: (0 | 1 | 2)[] = [0, 1, 2, 1]
    let i = 0
    const id = setInterval(() => {
      setFrame(cycle[i % cycle.length])
      i++
    }, 220)
    return () => clearInterval(id)
  }, [moving])

  const hasPending = Math.floor(pending) > 0
  const flipped    = pos.x < prevX
  const Sprite     = SPRITE_MAP[instance.dinoId]

  return (
    <motion.div
      animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      transition={{ duration: 5, ease: 'easeInOut' }}
      onClick={onClick}
      className="absolute flex flex-col items-center"
      style={{ transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer' }}
    >
      {/* Shadow */}
      <div style={{
        position: 'absolute',
        bottom: -4, left: '50%',
        transform: 'translateX(-50%)',
        width: 52, height: 12,
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '50%',
        filter: 'blur(5px)',
        pointerEvents: 'none',
      }} />

      {/* Sprite */}
      <div
        style={{
          filter: hasPending
            ? 'drop-shadow(0 0 10px rgba(251,191,36,0.85))'
            : 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
          transition: 'filter 0.5s',
          cursor: 'default',
        }}
      >
        {Sprite
          ? <Sprite frame={frame} flipped={flipped} />
          : <span style={{ fontSize: 48 }}>{dino.emoji}</span>
        }
      </div>

      {/* Name tag */}
      <div style={{
        marginTop: 2,
        padding: '1px 7px',
        borderRadius: 6,
        background: 'rgba(0,0,0,0.5)',
        color: dino.color,
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {instance.nickname ?? dino.name}
        {(instance.level ?? 0) > 0 && ` Lv.${instance.level}`}
      </div>
    </motion.div>
  )
}
