import PomodoroTimer from '../components/PomodoroTimer'
import EggShop from '../components/EggShop'

export default function TimerView() {
  return (
    <div className="flex min-h-full">
      {/* Timer centré plein écran */}
      <div className="flex flex-col items-center justify-center flex-1">
        <PomodoroTimer />
      </div>

      {/* Boutique sur le côté droit */}
      <div
        className="flex flex-col justify-center border-l border-white/10 overflow-y-auto"
        style={{ width: '340px', minWidth: '280px' }}
      >
        <EggShop />
      </div>
    </div>
  )
}
