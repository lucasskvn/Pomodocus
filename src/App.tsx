import { useState, useEffect } from 'react'
import TimerView from './views/TimerView'
import ParkView from './views/ParkView'
import ShopView from './views/ShopView'
import HistoryView from './views/HistoryView'
import QuestsView from './views/QuestsView'
import PointsDisplay from './components/PointsDisplay'
import EggReveal from './components/EggReveal'
import { useGameStore } from './store/useGameStore'
import YoutubePlayer from './components/YoutubePlayer'

type Tab = 'timer' | 'shop' | 'park' | 'history' | 'quests'

export default function App() {
  const [tab, setTab] = useState<Tab>('timer')
  const pomodoroPhase = useGameStore((s) => s.pomodoroPhase)
  const timerLocked = pomodoroPhase !== 'idle'
  const checkQuestDateReset = useGameStore((s) => s.checkQuestDateReset)
  const timerBackground = useGameStore((s) => s.timerBackground)
  const timerBackgroundImage = useGameStore((s) => s.timerBackgroundImage)

  useEffect(() => {
    checkQuestDateReset()
  }, [checkQuestDateReset])

  const getBackgroundStyle = () => {
    if (timerBackground === 'custom' && timerBackgroundImage) {
      return { background: `url(${timerBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    }
    if (timerBackground === 'gradient') {
      return { background: 'linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(96,165,250,0.15) 100%)' }
    }
    if (timerBackground === 'solid') {
      return { background: 'rgba(20,30,48,0.95)' }
    }
    return { background: '#0f1923' }
  }

  return (
    <div className="min-h-screen flex flex-col" style={getBackgroundStyle()}>
      <div className="flex flex-col min-h-screen w-full">
        <PointsDisplay />

        <main className={`flex-1 ${tab === 'park' ? 'overflow-hidden' : 'overflow-y-auto'} pb-[72px]`}>
          {tab === 'timer' && <TimerView />}
          {tab === 'shop' && <ShopView />}
          {tab === 'park' && <ParkView />}
          {tab === 'history' && <HistoryView />}
          {tab === 'quests' && <QuestsView />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-[#0a1219] border-t border-white/10 flex z-40 overflow-x-auto">
          <button
            onClick={() => setTab('timer')}
            className={`flex-1 min-w-max py-4 px-3 flex flex-col items-center gap-1 transition-colors ${
              tab === 'timer' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">🍅</span>
            <span className="text-xs font-inter font-medium">Timer</span>
          </button>
          <button
            onClick={() => !timerLocked && setTab('shop')}
            disabled={timerLocked}
            title={timerLocked ? 'Termine ta session avant de naviguer' : undefined}
            className={`flex-1 min-w-max py-4 px-3 flex flex-col items-center gap-1 transition-colors ${
              tab === 'shop' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            } ${timerLocked ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">🥚</span>
            <span className="text-xs font-inter font-medium">Boutique</span>
          </button>
          <button
            onClick={() => !timerLocked && setTab('park')}
            disabled={timerLocked}
            title={timerLocked ? 'Termine ta session avant de naviguer' : undefined}
            className={`flex-1 min-w-max py-4 px-3 flex flex-col items-center gap-1 transition-colors ${
              tab === 'park' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            } ${timerLocked ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">🦕</span>
            <span className="text-xs font-inter font-medium">Parc</span>
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 min-w-max py-4 px-3 flex flex-col items-center gap-1 transition-colors ${
              tab === 'history' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">📅</span>
            <span className="text-xs font-inter font-medium">Historique</span>
          </button>
          <button
            onClick={() => setTab('quests')}
            className={`flex-1 min-w-max py-4 px-3 flex flex-col items-center gap-1 transition-colors ${
              tab === 'quests' ? 'text-accent-green' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-2xl">⚔️</span>
            <span className="text-xs font-inter font-medium">Quêtes</span>
          </button>
        </nav>

        <EggReveal />
        <YoutubePlayer />
      </div>
    </div>
  )
}
