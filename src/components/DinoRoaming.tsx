import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, type DinoInstance } from '../store/useGameStore'
import { DINO_MAP } from '../data/dinosaurs'
import { calculatePending } from '../utils/gameLogic'

interface Props {
  instance: DinoInstance
}

interface Pos { x: number; y: number }

function randomPos(): Pos {
  return {
    x: 10 + Math.random() * 75,
    y: 10 + Math.random() * 70,
  }
}

export default function DinoRoaming({ instance }: Props) {
  const collectDino = useGameStore((s) => s.collectDino)
  const dino = DINO_MAP[instance.dinoId]

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, dino.coinsPerHour),
  )
  const [pos, setPos] = useState<Pos>(randomPos)
  const [prevX, setPrevX] = useState(pos.x)
  const [flyCoins, setFlyCoins] = useState<{ id: number; amount: number } | null>(null)
  const flyId = useRef(0)

  useEffect(() => {
    const id = setInterval(
      () => setPending(calculatePending(instance.lastCollectedAt, dino.coinsPerHour)),
      1000,
    )
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, dino.coinsPerHour])

  // Move slowly every 5–10s
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      timeout = setTimeout(() => {
        setPos((prev) => {
          setPrevX(prev.x)
          return randomPos()
        })
        schedule()
      }, 5000 + Math.random() * 5000)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [])

  const pendingDisplay = Math.floor(pending)
  const hasPending = pendingDisplay > 0
  const facingLeft = pos.x < prevX

  const handleCollect = () => {
    if (!hasPending) return
    setFlyCoins({ id: ++flyId.current, amount: pendingDisplay })
    collectDino(instance.id)
    setTimeout(() => setFlyCoins(null), 900)
  }

  return (
    <motion.div
      animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      transition={{ duration: 5, ease: 'easeInOut' }}
      className="absolute flex flex-col items-center"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      {/* Coin bubble */}
      <AnimatePresence>
        {hasPending && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ y: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } }}
            onClick={handleCollect}
            className="mb-1 px-2.5 py-1 rounded-full font-fredoka text-sm font-bold shadow-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1a0a00',
              boxShadow: '0 2px 12px rgba(251,191,36,0.6)',
            }}
          >
            🪙 +{pendingDisplay.toLocaleString()}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Coins flying on collect */}
      <AnimatePresence>
        {flyCoins && (
          <motion.div
            key={flyCoins.id}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -60, opacity: 0, scale: 1.4 }}
            exit={{}}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute -top-6 font-fredoka text-base font-bold text-accent-amber pointer-events-none"
            style={{ whiteSpace: 'nowrap' }}
          >
            +{flyCoins.amount.toLocaleString()} 🪙
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dino */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2.4 + Math.random() * 0.8, ease: 'easeInOut' }}
        onClick={handleCollect}
        className="text-5xl select-none cursor-pointer"
        style={{
          display: 'inline-block',
          transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
          filter: hasPending
            ? 'drop-shadow(0 0 8px rgba(251,191,36,0.7))'
            : 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
          transition: 'filter 0.4s, transform 0.3s',
        }}
        title={dino.name}
      >
        {dino.emoji}
      </motion.div>

      {/* Name tag */}
      <div
        className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-inter font-medium"
        style={{ background: 'rgba(0,0,0,0.45)', color: dino.color }}
      >
        {dino.name}
      </div>
    </motion.div>
  )
}
