import { useGameStore } from '../store/useGameStore'
import DinoRoaming from './DinoRoaming'

export default function DinoPark() {
  const ownedDinos = useGameStore((s) => s.ownedDinos)

  if (ownedDinos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{
          height: 'calc(100vh - 52px - 72px)',
          background: 'linear-gradient(180deg, #1a4a20 0%, #2d6e35 40%, #1e5228 100%)',
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
      style={{
        height: 'calc(100vh - 52px - 72px)',
        background: `
          radial-gradient(ellipse at 15% 85%, #1a5c22 0%, transparent 45%),
          radial-gradient(ellipse at 85% 15%, #1a5c22 0%, transparent 45%),
          radial-gradient(ellipse at 50% 50%, #256b2c 0%, transparent 70%),
          linear-gradient(180deg, #2d7a35 0%, #236b2a 35%, #1e5e26 65%, #173f1c 100%)
        `,
      }}
    >
      {/* Grass texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={`${(i / 20) * 100}%`} y1="0"
            x2={`${(i / 20) * 100 + 3}%`} y2="100%"
            stroke="#4ade80" strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Corner trees */}
      <span className="absolute top-3 left-3 text-5xl opacity-70 pointer-events-none select-none">🌴</span>
      <span className="absolute top-3 right-3 text-5xl opacity-70 pointer-events-none select-none">🌴</span>
      <span className="absolute bottom-10 left-5 text-4xl opacity-60 pointer-events-none select-none">🌳</span>
      <span className="absolute bottom-10 right-5 text-4xl opacity-60 pointer-events-none select-none">🌳</span>

      {/* Side bushes */}
      <span className="absolute top-1/3 left-2 text-3xl opacity-50 pointer-events-none select-none">🌿</span>
      <span className="absolute top-2/3 right-2 text-3xl opacity-50 pointer-events-none select-none">🌿</span>
      <span className="absolute top-1/2 left-3 text-2xl opacity-40 pointer-events-none select-none">🌱</span>
      <span className="absolute top-1/4 right-3 text-2xl opacity-40 pointer-events-none select-none">🌱</span>

      {/* Soft dirt path in the middle */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: '52%',
          height: '20%',
          background: 'rgba(101,67,33,0.10)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />

      {/* Dinos */}
      {ownedDinos.map((instance) => (
        <DinoRoaming key={instance.id} instance={instance} />
      ))}

      {/* Hint */}
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <span className="font-inter text-[10px] text-green-200/25 tracking-wide">
          Appuie sur un dino pour collecter
        </span>
      </div>
    </div>
  )
}
