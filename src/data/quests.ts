export interface QuestDefinition {
  id: string
  title: string
  description: string
  type: 'sessions' | 'streak'
  target: number
  reward: { coins?: number; docuPoints?: number }
}

export const DAILY_QUESTS: QuestDefinition[] = [
  {
    id: 'q1',
    title: 'Premier pas',
    description: 'Termine 1 session aujourd\'hui',
    type: 'sessions',
    target: 1,
    reward: { coins: 30 },
  },
  {
    id: 'q2',
    title: 'En rythme',
    description: 'Termine 3 sessions aujourd\'hui',
    type: 'sessions',
    target: 3,
    reward: { coins: 100 },
  },
  {
    id: 'q3',
    title: 'Régularité',
    description: 'Maintiens ton streak',
    type: 'streak',
    target: 1,
    reward: { docuPoints: 20 },
  },
]
