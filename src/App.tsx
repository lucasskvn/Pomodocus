import { useState } from 'react'
import TimerView from './views/TimerView'
import ParkView from './views/ParkView'
import ShopView from './views/ShopView'
import PointsDisplay from './components/PointsDisplay'
import EggReveal from './components/EggReveal'

type Tab = 'timer' | 'shop' | 'park'

export default function App() {
  const [tab, setTab] = useState<Tab>('timer')
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <div className="flex flex-col min-h-screen w-full">
        <PointsDisplay />

        <main className={`flex-1 ${tab === 'park' ? 'overflow-hidden' : 'overflow-y-auto'} pb-[72px]`}>
          {tab === 'timer' && <TimerView />}
          {tab === 'shop' && <ShopView />}
          {tab === 'park' && <ParkView />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-[#0a1219] border-t border-white/10 flex z-40">
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
            onClick={() => setTab('shop')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              tab === 'shop' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">🥚</span>
            <span className="text-xs font-inter font-medium">Boutique</span>
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
