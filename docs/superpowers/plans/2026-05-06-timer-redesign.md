# Timer Redesign & Boutique Tab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Déplacer l'EggShop dans un onglet Boutique dédié et ajouter 3 stats cards (sessions aujourd'hui, streak, focus total) dans la vue Timer.

**Architecture:** Les fonctions `computeSessionStats` et `formatFocusTime` sont extraites dans `gameLogic.ts` (pures, testables). Le store Zustand reçoit 4 nouveaux champs de stats. `StatsCards` et `ShopView` sont de nouveaux composants isolés. `App.tsx` passe à 3 onglets.

**Tech Stack:** React 18, Zustand 4, TypeScript, Tailwind CSS, Framer Motion, Vitest

**Note:** Pas de `git add` ni de commit — l'utilisateur a explicitement interdit toute opération git.

---

### Task 1 : Fonctions pures (TDD)

**Files:**
- Modify: `src/utils/gameLogic.ts`
- Modify: `src/utils/gameLogic.test.ts`

- [ ] **Step 1 : Écrire les tests qui échouent**

Ajouter à la fin de `src/utils/gameLogic.test.ts` :

```ts
describe('computeSessionStats', () => {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  it('première session : initialise tout à 1', () => {
    const r = computeSessionStats('', 0, 0, 0, 25)
    expect(r.streak).toBe(1)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(25)
    expect(r.lastSessionDate).toBe(today)
  })

  it('même jour : incrémente todaySessions, streak inchangé', () => {
    const r = computeSessionStats(today, 3, 2, 50, 25)
    expect(r.streak).toBe(3)
    expect(r.todaySessions).toBe(3)
    expect(r.totalFocusMinutes).toBe(75)
    expect(r.lastSessionDate).toBe(today)
  })

  it('jour suivant : incrémente streak, remet todaySessions à 1', () => {
    const r = computeSessionStats(yesterday, 3, 5, 100, 25)
    expect(r.streak).toBe(4)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(125)
    expect(r.lastSessionDate).toBe(today)
  })

  it('jour manqué : remet streak à 1', () => {
    const r = computeSessionStats('2020-01-01', 5, 3, 100, 30)
    expect(r.streak).toBe(1)
    expect(r.todaySessions).toBe(1)
    expect(r.totalFocusMinutes).toBe(130)
    expect(r.lastSessionDate).toBe(today)
  })
})

describe('formatFocusTime', () => {
  it('formate < 60 min en Nm', () => expect(formatFocusTime(45)).toBe('45m'))
  it('formate 0 en 0m', () => expect(formatFocusTime(0)).toBe('0m'))
  it('formate 60 min en 1h 0m', () => expect(formatFocusTime(60)).toBe('1h 0m'))
  it('formate 85 min en 1h 25m', () => expect(formatFocusTime(85)).toBe('1h 25m'))
})
```

Mettre à jour la ligne d'import dans le fichier test :

```ts
import { calculatePending, getRemaining, formatTime, rollRarity, workReward, breakReward, computeSessionStats, formatFocusTime } from './gameLogic'
```

- [ ] **Step 2 : Vérifier que les tests échouent**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx vitest run --reporter=verbose 2>&1 | tail -15
```

Attendu : erreurs d'import sur `computeSessionStats` et `formatFocusTime`

- [ ] **Step 3 : Implémenter les fonctions dans gameLogic.ts**

Ajouter à la fin de `src/utils/gameLogic.ts` :

```ts
export interface SessionStats {
  lastSessionDate: string
  streak: number
  todaySessions: number
  totalFocusMinutes: number
}

export function computeSessionStats(
  lastSessionDate: string,
  streak: number,
  todaySessions: number,
  totalFocusMinutes: number,
  workMinutes: number,
): SessionStats {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const newTotal = totalFocusMinutes + workMinutes

  if (lastSessionDate === today) {
    return { lastSessionDate: today, streak, todaySessions: todaySessions + 1, totalFocusMinutes: newTotal }
  }
  if (lastSessionDate === yesterday) {
    return { lastSessionDate: today, streak: streak + 1, todaySessions: 1, totalFocusMinutes: newTotal }
  }
  return { lastSessionDate: today, streak: 1, todaySessions: 1, totalFocusMinutes: newTotal }
}

export function formatFocusTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
```

- [ ] **Step 4 : Vérifier que tous les tests passent**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx vitest run --reporter=verbose 2>&1 | tail -10
```

Attendu : 28 tests passent (20 anciens + 8 nouveaux)

---

### Task 2 : Mise à jour du store

**Files:**
- Modify: `src/store/useGameStore.ts`

- [ ] **Step 1 : Ajouter l'import de computeSessionStats**

Modifier la ligne d'import de gameLogic :

```ts
import { calculatePending, rollRarity, workReward, breakReward, computeSessionStats, type EggType } from '../utils/gameLogic'
```

- [ ] **Step 2 : Ajouter les champs dans GameState**

Dans l'interface `GameState`, ajouter après `pendingReveal` :

```ts
  todaySessions: number
  streak: number
  totalFocusMinutes: number
  lastSessionDate: string
```

- [ ] **Step 3 : Initialiser les champs dans le state**

Dans le bloc `create(...)`, ajouter après `pendingReveal: null` :

```ts
      todaySessions: 0,
      streak: 0,
      totalFocusMinutes: 0,
      lastSessionDate: '',
```

- [ ] **Step 4 : Mettre à jour completePomodoro**

Remplacer l'action `completePomodoro` par :

```ts
      completePomodoro: () => {
        const { workMinutes, lastSessionDate, streak, todaySessions, totalFocusMinutes } = get()
        const stats = computeSessionStats(lastSessionDate, streak, todaySessions, totalFocusMinutes, workMinutes)
        set((s) => ({
          pomodoroPhase: 'break',
          docuPoints: s.docuPoints + workReward(s.workMinutes),
          sessionsCompleted: s.sessionsCompleted + 1,
          timerStartedAt: Date.now(),
          remainingAtPause: null,
          ...stats,
        }))
      },
```

- [ ] **Step 5 : Vérifier TypeScript**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 3 : Composant StatsCards

**Files:**
- Create: `src/components/StatsCards.tsx`

- [ ] **Step 1 : Créer le composant**

```tsx
import { useGameStore } from '../store/useGameStore'
import { formatFocusTime } from '../utils/gameLogic'

export default function StatsCards() {
  const todaySessions = useGameStore((s) => s.todaySessions)
  const streak = useGameStore((s) => s.streak)
  const totalFocusMinutes = useGameStore((s) => s.totalFocusMinutes)

  return (
    <div className="flex gap-3 w-full max-w-sm px-2">
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">🍅</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{todaySessions}</span>
        <span className="font-inter text-[10px] text-white/50 text-center">aujourd'hui</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">🔥</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{streak}</span>
        <span className="font-inter text-[10px] text-white/50">jours</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-1">
        <span className="text-lg">⏱</span>
        <span className="font-fredoka text-xl font-bold text-white leading-none">{formatFocusTime(totalFocusMinutes)}</span>
        <span className="font-inter text-[10px] text-white/50">focus total</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 4 : ShopView + navigation 3 onglets

**Files:**
- Create: `src/views/ShopView.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1 : Créer ShopView.tsx**

```tsx
import EggShop from '../components/EggShop'

export default function ShopView() {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <EggShop />
    </div>
  )
}
```

- [ ] **Step 2 : Remplacer App.tsx**

```tsx
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
```

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 5 : Simplifier TimerView

**Files:**
- Modify: `src/views/TimerView.tsx`

- [ ] **Step 1 : Remplacer TimerView.tsx**

Supprimer le panneau shop (déplacé dans ShopView), ajouter StatsCards :

```tsx
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
    </div>
  )
}
```

- [ ] **Step 2 : Vérification finale**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1 && npx vitest run 2>&1 | tail -6
```

Attendu : 0 erreurs TS, 28 tests passent
