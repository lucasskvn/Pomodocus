import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { DINO_MAP } from '../data/dinosaurs'
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'
import DinoRoaming from './DinoRoaming'
import DinoModal from './DinoModal'
import { ParkBackground } from '../sprites/ParkBackground'

/* ── Clouds ─────────────────────────────────────────────── */
function Cloud({ top, delay, duration, scale = 1 }: { top: string; delay: number; duration: number; scale?: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top,
        left: 0,
        animation: `cloud-drift ${duration}s linear ${delay}s infinite`,
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
      }}
    >
      <div style={{ position: 'relative', width: 100, height: 36 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 100, height: 26, background: 'rgba(255,255,255,0.07)', borderRadius: 999 }} />
        <div style={{ position: 'absolute', bottom: 14, left: 18, width: 55, height: 38, background: 'rgba(255,255,255,0.055)', borderRadius: 999 }} />
        <div style={{ position: 'absolute', bottom: 14, left: 48, width: 38, height: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 999 }} />
      </div>
    </div>
  )
}

/* ── Bird ────────────────────────────────────────────────── */
function Bird({ top, delay, duration }: { top: string; delay: number; duration: number }) {
  return (
    <div
      className="absolute pointer-events-none select-none text-lg opacity-40"
      style={{ top, left: 0, animation: `bird-fly ${duration}s ease-in-out ${delay}s infinite` }}
    >
      🐦
    </div>
  )
}

/* ── Pond ────────────────────────────────────────────────── */
function Pond() {
  return (
    <div className="absolute pointer-events-none" style={{ left: '38%', top: '52%', width: '20%', height: '14%' }}>
      {/* Water body */}
      <div
        style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.35) 0%, rgba(14,165,233,0.2) 55%, transparent 100%)',
          borderRadius: '50%',
          border: '1px solid rgba(147,197,253,0.25)',
          animation: 'pond-shimmer 3s ease-in-out infinite',
        }}
      />
      {/* Shimmer highlight */}
      <div
        style={{
          position: 'absolute', top: '18%', left: '20%',
          width: '35%', height: '25%',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '50%',
          transform: 'rotate(-20deg)',
          filter: 'blur(3px)',
        }}
      />
      {/* Lily pad */}
      <div style={{ position: 'absolute', bottom: '20%', right: '18%', fontSize: 16, opacity: 0.8, userSelect: 'none' }}>🪷</div>
    </div>
  )
}

/* ── Grass patches (E) ───────────────────────────────────── */
function GrassPatches() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 18% 12% at 25% 35%, rgba(61,140,41,0.25) 0%, transparent 100%),
          radial-gradient(ellipse 14% 10% at 70% 20%, rgba(78,160,55,0.2) 0%, transparent 100%),
          radial-gradient(ellipse 20% 15% at 80% 70%, rgba(45,120,32,0.22) 0%, transparent 100%),
          radial-gradient(ellipse 16% 10% at 15% 75%, rgba(72,150,50,0.18) 0%, transparent 100%)
        `,
      }} />
    </>
  )
}

/* ── Park ────────────────────────────────────────────────── */
export default function DinoPark() {
  const ownedDinos  = useGameStore((s) => s.ownedDinos)
  const collectAll  = useGameStore((s) => s.collectAll)
  const yieldUpgradeLevel = useGameStore((s) => s.yieldUpgradeLevel)

  const [totalPending, setTotalPending] = useState(0)
  const [flyAmount, setFlyAmount]       = useState<number | null>(null)
  const [selectedDinoId, setSelectedDinoId] = useState<string | null>(null)
  const flyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Recalculate total pending every second */
  useEffect(() => {
    const calc = () => {
      const yieldMult = 1 + yieldUpgradeLevel * 0.05
      const total = ownedDinos.reduce((sum, d) => {
        const dino = DINO_MAP[d.dinoId]
        const levelMult = dinoProductionMultiplier(d.level ?? 0)
        return sum + Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
      }, 0)
      setTotalPending(total)
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [ownedDinos, yieldUpgradeLevel])

  const handleCollectAll = () => {
    if (totalPending === 0) return
    const gained = collectAll()
    if (gained > 0) {
      setFlyAmount(gained)
      if (flyTimer.current) clearTimeout(flyTimer.current)
      flyTimer.current = setTimeout(() => setFlyAmount(null), 1800)
    }
  }

  if (ownedDinos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{
          height: 'calc(100vh - 52px - 72px)',
          background: 'linear-gradient(180deg, #12350f 0%, #1e5a1a 40%, #163d12 100%)',
        }}
      >
        <div className="text-5xl animate-bounce">🥚</div>
        <p className="font-fredoka text-xl font-semibold text-green-200">Parc vide !</p>
        <p className="font-inter text-sm text-green-300/60 leading-relaxed max-w-[320px]">
          Complète des sessions Pomodoro pour gagner des DocusPoints, puis achète des œufs dans la boutique.
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ height: 'calc(100vh - 52px - 72px)' }}
    >
      {/* SVG background */}
      <ParkBackground width={window.innerWidth} height={window.innerHeight - 52 - 72} />
      {/* B — Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
        }}
      />

      {/* A — Grass texture lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" preserveAspectRatio="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={`${(i / 24) * 100}%`} y1="0"
            x2={`${(i / 24) * 100 + 2}%`} y2="100%"
            stroke="#4ade80" strokeWidth="1"
          />
        ))}
      </svg>

      {/* E — Grass patches */}
      <GrassPatches />

      {/* D — Clouds (back layer, very faint) */}
      <Cloud top="5%"  delay={0}   duration={55} scale={1.4} />
      <Cloud top="12%" delay={-20} duration={70} scale={0.9} />
      <Cloud top="4%"  delay={-40} duration={90} scale={1.1} />

      {/* A — Back trees (small, faded) */}
      <span className="absolute pointer-events-none select-none" style={{ top: '5%', left: '5%',  fontSize: 28, opacity: 0.35 }}>🌴</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '5%', right: '5%', fontSize: 28, opacity: 0.35 }}>🌴</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '8%', left: '22%', fontSize: 22, opacity: 0.25 }}>🌳</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '6%', right: '20%', fontSize: 20, opacity: 0.22 }}>🌳</span>

      {/* E — Pond */}
      <Pond />

      {/* E — Rocks */}
      <span className="absolute pointer-events-none select-none" style={{ top: '30%', left: '8%',  fontSize: 20, opacity: 0.55 }}>🪨</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '62%', right: '10%', fontSize: 16, opacity: 0.45 }}>🪨</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '45%', left: '30%', fontSize: 13, opacity: 0.35 }}>🪨</span>

      {/* E — Side bushes */}
      <span className="absolute pointer-events-none select-none" style={{ top: '38%', left: '1%',  fontSize: 28, opacity: 0.5 }}>🌿</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '58%', right: '1%', fontSize: 26, opacity: 0.45 }}>🌿</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '22%', left: '2%',  fontSize: 20, opacity: 0.35 }}>🌱</span>
      <span className="absolute pointer-events-none select-none" style={{ top: '72%', right: '2%', fontSize: 18, opacity: 0.35 }}>🌱</span>

      {/* Soft dirt trail */}
      <div className="absolute inset-x-0 pointer-events-none" style={{
        top: '53%', height: '22%',
        background: 'rgba(101,67,33,0.09)',
        borderRadius: '50%',
        filter: 'blur(22px)',
      }} />

      {/* D — Birds */}
      <Bird top="18%" delay={0}   duration={28} />
      <Bird top="10%" delay={-12} duration={36} />

      {/* Dinos (above ground elements) */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {ownedDinos.map((instance) => (
          <DinoRoaming
            key={instance.id}
            instance={instance}
            onClick={() => setSelectedDinoId(instance.id)}
          />
        ))}
      </div>

      {/* A — Front trees (larger, saturated) */}
      <span className="absolute pointer-events-none select-none" style={{ bottom: '8%', left: '2%',  fontSize: 48, opacity: 0.75, zIndex: 5 }}>🌴</span>
      <span className="absolute pointer-events-none select-none" style={{ bottom: '8%', right: '2%', fontSize: 48, opacity: 0.75, zIndex: 5 }}>🌴</span>
      <span className="absolute pointer-events-none select-none" style={{ bottom: '5%', left: '15%', fontSize: 34, opacity: 0.6,  zIndex: 5 }}>🌳</span>
      <span className="absolute pointer-events-none select-none" style={{ bottom: '5%', right: '14%', fontSize: 32, opacity: 0.55, zIndex: 5 }}>🌳</span>

      {/* Collect all bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3"
        style={{ zIndex: 30, background: 'rgba(10,26,12,0.75)', backdropFilter: 'blur(6px)', borderTop: '1px solid rgba(74,222,128,0.12)' }}
      >
        <span className="font-inter text-sm text-green-300/70">
          En attente : <span className="font-fredoka font-semibold text-accent-amber">{totalPending.toLocaleString()} 🪙</span>
        </span>

        <button
          onClick={handleCollectAll}
          disabled={totalPending === 0}
          className="px-5 py-2 rounded-full font-fredoka text-base font-semibold transition-all"
          style={
            totalPending > 0
              ? { background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a0a00', boxShadow: '0 2px 12px rgba(251,191,36,0.45)' }
              : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed' }
          }
        >
          Tout collecter
        </button>
      </div>

      {/* +X animation on collect all */}
      <AnimatePresence>
        {flyAmount !== null && (
          <motion.div
            key={flyAmount + Date.now()}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.5 }}
            exit={{}}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute pointer-events-none font-fredoka font-bold text-accent-amber"
            style={{ zIndex: 50, bottom: 60, left: '50%', transform: 'translateX(-50%)', fontSize: 28, whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(251,191,36,0.7)' }}
          >
            +{flyAmount.toLocaleString()} 🪙
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dino detail modal */}
      <AnimatePresence>
        {selectedDinoId && (
          <DinoModal
            key={selectedDinoId}
            instanceId={selectedDinoId}
            onClose={() => setSelectedDinoId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
