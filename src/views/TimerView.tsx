import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PomodoroTimer from '../components/PomodoroTimer'
import TimerSettings from '../components/TimerSettings'
import StatsCards from '../components/StatsCards'

const SETTINGS_WIDTH = 130
const COLLAPSED_WIDTH = 32

export default function TimerView() {
  const [settingsOpen, setSettingsOpen] = useState(true)

  return (
    <div className="flex min-h-full">
      {/* Panneau gauche — Réglages */}
      <motion.div
        animate={{ width: settingsOpen ? SETTINGS_WIDTH : COLLAPSED_WIDTH }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-shrink-0 border-r border-white/10 overflow-hidden flex flex-col"
      >
        <div className="flex justify-end p-1.5 flex-shrink-0">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className="w-6 h-6 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors font-bold text-sm"
            title={settingsOpen ? 'Masquer les réglages' : 'Afficher les réglages'}
          >
            {settingsOpen ? '‹' : '›'}
          </button>
        </div>
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1"
            >
              <TimerSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Zone centrale */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 gap-6 py-6">
        <PomodoroTimer />
        <StatsCards />
      </div>

      {/* Spacer miroir — compense le panneau gauche pour centrer le timer */}
      <motion.div
        animate={{ width: settingsOpen ? SETTINGS_WIDTH : COLLAPSED_WIDTH }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-shrink-0"
      />
    </div>
  )
}
