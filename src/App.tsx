import { useState } from 'react'
import TimerView from './views/TimerView'
import ParkView from './views/ParkView'
import PointsDisplay from './components/PointsDisplay'
import EggReveal from './components/EggReveal'

type Tab = 'timer' | 'park'

export default function App() {
  const [tab, setTab] = useState<Tab>('timer')

  return (
    <div className="min-h-screen bg-bg-dark flex justify-center">
      <div className="w-full max-w-[430px] flex flex-col min-h-screen">
        <PointsDisplay />

        <main className="flex-1 overflow-y-auto pb-20">
          {tab === 'timer' ? <TimerView /> : <ParkView />}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0a1219] border-t border-white/10 flex">
          <button
            onClick={() => setTab('timer')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              tab === 'timer' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">🍅</span>
            <span className="text-xs font-inter font-medium">Timer</span>
          </button>
          <button
            onClick={() => setTab('park')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              tab === 'park' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">🦕</span>
            <span className="text-xs font-inter font-medium">Parc</span>
          </button>
        </nav>

        <EggReveal />
      </div>
    </div>
  )
}
