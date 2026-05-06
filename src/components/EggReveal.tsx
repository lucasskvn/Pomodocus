import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'

const RARITY_BG: Record<string, string> = {
  common: '#1e293b',
  rare: '#1e3a5f',
  epic: '#2d1b69',
  legendary: '#451a03',
}

export default function EggReveal() {
  const pendingReveal = useGameStore((s) => s.pendingReveal)
  const clearReveal = useGameStore((s) => s.clearReveal)

  const dino = pendingReveal ? DINO_MAP[pendingReveal.dinoId] : null

  return (
    <AnimatePresence>
      {pendingReveal && dino && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={clearReveal}
        >
          <motion.div
            key="card"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            style={{ background: RARITY_BG[dino.rarity] }}
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl select-none"
            >
              🥚
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 15 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-7xl">{dino.emoji}</span>
              <span className="font-fredoka text-2xl font-bold text-white">{dino.name}</span>
              <span
                className="font-inter text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: dino.color, background: `${dino.color}22` }}
              >
                {RARITY_LABEL[dino.rarity]}
              </span>
              <span className="font-inter text-sm text-white/60">
                {dino.coinsPerHour} 🪙/h
              </span>
            </motion.div>

            <button
              onClick={clearReveal}
              className="mt-2 w-full py-3 rounded-2xl font-fredoka text-base font-semibold hover:opacity-90 transition-opacity"
              style={{ background: dino.color, color: '#0f1923' }}
            >
              Ajouter au parc
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
