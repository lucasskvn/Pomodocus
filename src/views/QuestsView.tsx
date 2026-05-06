import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { DAILY_QUESTS } from '../data/quests'

export default function QuestsView() {
  const todaySessions = useGameStore((s) => s.todaySessions)
  const streak = useGameStore((s) => s.streak)
  const claimedQuests = useGameStore((s) => s.claimedQuests)
  const claimQuest = useGameStore((s) => s.claimQuest)
  const checkQuestDateReset = useGameStore((s) => s.checkQuestDateReset)

  useEffect(() => {
    checkQuestDateReset()
  }, [checkQuestDateReset])

  const getProgress = (questId: string): number => {
    const quest = DAILY_QUESTS.find(q => q.id === questId)
    if (!quest) return 0

    if (quest.type === 'sessions') return todaySessions
    if (quest.type === 'streak') return streak
    return 0
  }

  const isComplete = (questId: string): boolean => {
    const quest = DAILY_QUESTS.find(q => q.id === questId)
    if (!quest) return false
    return getProgress(questId) >= quest.target
  }

  const isClaimed = (questId: string): boolean => claimedQuests.includes(questId)

  return (
    <div className="flex flex-col py-8 px-6 max-w-lg mx-auto w-full gap-6">
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-white">Quêtes</h1>
        <p className="font-inter text-sm text-white/60">Objectifs du jour</p>
      </div>

      <div className="space-y-4">
        {DAILY_QUESTS.map((quest) => {
          const progress = getProgress(quest.id)
          const complete = isComplete(quest.id)
          const claimed = isClaimed(quest.id)
          const ratio = Math.min(progress / quest.target, 1)

          return (
            <div
              key={quest.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-fredoka text-lg font-semibold text-white">
                    {quest.title}
                  </h3>
                  <p className="font-inter text-sm text-white/60">
                    {quest.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span className="font-fredoka text-lg font-bold text-white">
                    {quest.reward.coins ? quest.reward.coins : quest.reward.docuPoints}
                  </span>
                  <span className="text-lg">
                    {quest.reward.coins ? '🪙' : '⚡'}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-inter text-white/60">
                    {progress} / {quest.target}
                  </span>
                  {complete && !claimed && (
                    <span className="font-inter text-accent-green text-xs">✓ Complète</span>
                  )}
                  {claimed && (
                    <span className="font-inter text-white/40 text-xs">✓ Réclamée</span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-green transition-all duration-500"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => claimQuest(quest.id)}
                disabled={!complete || claimed}
                className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-semibold transition-opacity ${
                  claimed
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : complete
                      ? 'bg-accent-green text-[#0f1923] hover:opacity-90 cursor-pointer'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {claimed ? 'Réclamée' : complete ? 'Réclamer' : 'En cours'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
