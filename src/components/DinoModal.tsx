import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier } from '../utils/gameLogic'

import { DinoParasaurolophus } from '../sprites/DinoParasaurolophus'
import { DinoStegosaurus } from '../sprites/DinoStegosaurus'
import { DinoAnkylosaurus } from '../sprites/DinoAnkylosaurus'
import { DinoTriceratops } from '../sprites/DinoTriceratops'
import { DinoVelociraptor } from '../sprites/DinoVelociraptor'
import { DinoSpinosaurus } from '../sprites/DinoSpinosaurus'
import { DinoTRex } from '../sprites/DinoTRex'
import { DinoBrachiosaurus } from '../sprites/DinoBrachiosaurus'
import { DinoPterodactyl } from '../sprites/DinoPterodactyl'
import { DinoAnkylosaurusClub } from '../sprites/DinoAnkylosaurusClub'

type SpriteComponent = (props: { frame: 0 | 1 | 2; flipped?: boolean }) => React.JSX.Element

const SPRITE_MAP: Record<string, SpriteComponent> = {
  parasaurolophus: DinoParasaurolophus,
  stegosaurus: DinoStegosaurus,
  ankylosaurus: DinoAnkylosaurus,
  triceratops: DinoTriceratops,
  velociraptor: DinoVelociraptor,
  spinosaurus: DinoSpinosaurus,
  trex: DinoTRex,
  brachiosaurus: DinoBrachiosaurus,
  pterodactyl: DinoPterodactyl,
  ankylosaurusclub: DinoAnkylosaurusClub,
}

const RARITY_COLOR: Record<string, string> = {
  common: '#94a3b8',
  rare: '#60a5fa',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

interface Props {
  instanceId: string
  onClose: () => void
}

export default function DinoModal({ instanceId, onClose }: Props) {
  const coins        = useGameStore((s) => s.coins)
  const ownedDinos   = useGameStore((s) => s.ownedDinos)
  const levelUpDino  = useGameStore((s) => s.levelUpDino)
  const sellDino     = useGameStore((s) => s.sellDino)
  const renameDino   = useGameStore((s) => s.renameDino)

  const instance = ownedDinos.find((d) => d.id === instanceId)

  useEffect(() => {
    if (!instance) onClose()
  }, [instance, onClose])

  const [editing, setEditing]         = useState(false)
  const [nameInput, setNameInput]     = useState('')
  const [confirmSell, setConfirmSell] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (instance) {
      setNameInput(instance.nickname ?? DINO_MAP[instance.dinoId]?.name ?? '')
    }
  }, [instanceId]) // only on open, intentional single dep

  if (!instance) return null

  const dino          = DINO_MAP[instance.dinoId]
  const SpriteComponent = SPRITE_MAP[instance.dinoId]
  const level         = instance.level ?? 0
  const levelMult     = dinoProductionMultiplier(level)
  const baseRate      = dino.coinsPerHour
  const effectiveRate = Math.round(baseRate * levelMult * 10) / 10
  const cost          = dinoLevelUpCost(dino.rarity, level)
  const sellPrice     = dinoSellPrice(dino.rarity, level)
  const canLevelUp    = level < 10 && coins >= cost
  const rarityColor   = RARITY_COLOR[dino.rarity] ?? '#94a3b8'
  const displayName   = instance.nickname ?? dino.name
  const obtainedDate  = new Date(instance.obtainedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  const handleStartEdit = () => {
    setNameInput(instance.nickname ?? dino.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const handleRenameCommit = () => {
    setEditing(false)
    renameDino(instanceId, nameInput)
  }

  const handleSell = () => {
    if (confirmSell) {
      sellDino(instanceId)
      onClose()
    } else {
      setConfirmSell(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 p-6 flex flex-col gap-5"
        style={{ background: '#0f1923' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors text-xl leading-none cursor-pointer"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
            {SpriteComponent && <SpriteComponent frame={0} />}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                ref={inputRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameCommit()
                  if (e.key === 'Escape') { setEditing(false); setNameInput(instance.nickname ?? dino.name) }
                }}
                maxLength={24}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 font-fredoka text-lg font-semibold text-white outline-none focus:border-white/40"
              />
            ) : (
              <button
                onClick={handleStartEdit}
                className="font-fredoka text-xl font-bold text-white hover:text-white/80 transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
              >
                {displayName}
                <span className="text-white/30 text-sm group-hover:text-white/60 transition-colors">✏️</span>
              </button>
            )}
            <span
              className="font-inter text-xs font-semibold"
              style={{ color: rarityColor }}
            >
              {RARITY_LABEL[dino.rarity]}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex justify-between items-center">
            <span className="font-inter text-xs text-white/50">Production de base</span>
            <span className="font-fredoka text-sm font-semibold text-white/70">{baseRate} 🪙/h</span>
          </div>
          {level > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-inter text-xs text-white/50">Bonus niveau {level}</span>
              <span className="font-fredoka text-sm font-semibold" style={{ color: rarityColor }}>
                +{Math.round((levelMult - 1) * 100)}%
              </span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-0.5">
            <span className="font-inter text-xs text-white/70 font-medium">Production effective</span>
            <span className="font-fredoka text-base font-bold text-white">{effectiveRate} 🪙/h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-inter text-xs text-white/40">Obtenu le</span>
            <span className="font-inter text-xs text-white/40">{obtainedDate}</span>
          </div>
        </div>

        {/* Level up */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-fredoka text-sm font-semibold text-white/70">
              {level < 10 ? `Niveau ${level} → ${level + 1}` : 'Niveau maximum'}
            </span>
            {level < 10 && (
              <span className="font-inter text-xs text-white/40">
                {cost.toLocaleString()} 🪙
              </span>
            )}
          </div>
          <button
            onClick={() => levelUpDino(instanceId)}
            disabled={!canLevelUp}
            className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-bold transition-all ${
              canLevelUp
                ? 'hover:opacity-90 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
            }`}
            style={canLevelUp ? { background: rarityColor, color: '#0f1923' } : {}}
          >
            {level >= 10
              ? 'Niveau max atteint ⭐'
              : canLevelUp
                ? `⬆ Level up — ${cost.toLocaleString()} 🪙`
                : `Pas assez de 🪙 (${cost.toLocaleString()} requis)`}
          </button>
        </div>

        {/* Sell */}
        <button
          onClick={handleSell}
          className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-bold border transition-all cursor-pointer ${
            confirmSell
              ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
          }`}
        >
          {confirmSell
            ? `Confirmer la vente — ${sellPrice.toLocaleString()} 🪙`
            : `Vendre — ${sellPrice.toLocaleString()} 🪙`}
        </button>

        {confirmSell && (
          <button
            onClick={() => setConfirmSell(false)}
            className="text-xs text-white/30 hover:text-white/50 transition-colors text-center -mt-3 cursor-pointer"
          >
            Annuler
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
