# Timer Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un panneau de réglages à gauche du timer permettant de configurer les durées de travail/pause, avec un gain de DocuPoints qui croît de façon concave avec la durée.

**Architecture:** Les fonctions `workReward` / `breakReward` sont ajoutées à `gameLogic.ts` (pures, testables). Le store Zustand persiste `workMinutes` et `breakMinutes` et expose des setters bloqués si le timer tourne. `TimerSettings.tsx` est un nouveau composant affiché à gauche dans `TimerView`.

**Tech Stack:** React 18, Zustand 4, TypeScript, Tailwind CSS, Vitest

**Note:** Pas de `git add` ni de commit — l'utilisateur a explicitement interdit toute opération git.

---

### Task 1: Fonctions de récompense (TDD)

**Files:**
- Modify: `src/utils/gameLogic.ts`
- Modify: `src/utils/gameLogic.test.ts`

- [ ] **Step 1: Écrire les tests qui échouent**

Ajouter à la fin de `src/utils/gameLogic.test.ts` :

```ts
describe('workReward', () => {
  it('returns 15 at baseline 25 min', () => {
    expect(workReward(25)).toBe(15)
  })
  it('returns less than 15 at 5 min', () => {
    expect(workReward(5)).toBeLessThan(15)
  })
  it('returns more than 15 at 90 min', () => {
    expect(workReward(90)).toBeGreaterThan(15)
  })
  it('has diminishing returns: 90min gives less than 3.6x of 25min', () => {
    expect(workReward(90)).toBeLessThan(Math.round(15 * 3.6))
  })
})

describe('breakReward', () => {
  it('returns 2 at baseline 5 min', () => {
    expect(breakReward(5)).toBe(2)
  })
  it('returns more than 2 at 30 min', () => {
    expect(breakReward(30)).toBeGreaterThan(2)
  })
  it('returns less than 2 at 1 min', () => {
    expect(breakReward(1)).toBeLessThan(2)
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx vitest run --reporter=verbose 2>&1 | tail -20
```

Attendu : erreur d'import (`workReward` / `breakReward` not found)

- [ ] **Step 3: Implémenter les fonctions dans gameLogic.ts**

Ajouter à la fin de `src/utils/gameLogic.ts` (avant la dernière ligne si besoin) :

```ts
export function workReward(minutes: number): number {
  return Math.round(15 * Math.pow(minutes / 25, 0.65))
}

export function breakReward(minutes: number): number {
  return Math.round(2 * Math.pow(minutes / 5, 0.65))
}
```

Et mettre à jour l'import dans `gameLogic.test.ts` pour inclure les nouvelles fonctions :

```ts
import { calculatePending, getRemaining, formatTime, rollRarity, workReward, breakReward } from './gameLogic'
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx vitest run --reporter=verbose 2>&1 | tail -20
```

Attendu : tous les tests passent (anciens + 7 nouveaux)

---

### Task 2: Mise à jour du store

**Files:**
- Modify: `src/store/useGameStore.ts`

- [ ] **Step 1: Mettre à jour les imports**

En haut de `src/store/useGameStore.ts`, ajouter `workReward` et `breakReward` à l'import de `gameLogic` :

```ts
import { calculatePending, rollRarity, workReward, breakReward, type EggType } from '../utils/gameLogic'
```

- [ ] **Step 2: Supprimer les constantes fixes et ajouter les valeurs dans l'état**

Supprimer les lignes :
```ts
export const WORK_DURATION = 25* 60 * 1000
export const BREAK_DURATION = 5 * 60 * 1000
```

Ajouter `workMinutes` et `breakMinutes` dans l'interface `GameState` :
```ts
interface GameState {
  docuPoints: number
  coins: number
  ownedDinos: DinoInstance[]
  pomodoroPhase: 'work' | 'break' | 'idle'
  timerStartedAt: number | null
  remainingAtPause: number | null
  sessionsCompleted: number
  pendingReveal: DinoInstance | null
  workMinutes: number
  breakMinutes: number
}
```

Ajouter `setWorkMinutes` et `setBreakMinutes` dans `GameActions` :
```ts
interface GameActions {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completePomodoro: () => void
  completeBreak: () => void
  buyEgg: (eggType: EggType) => void
  collectDino: (instanceId: string) => void
  clearReveal: () => void
  cheat: () => void
  setWorkMinutes: (m: number) => void
  setBreakMinutes: (m: number) => void
}
```

- [ ] **Step 3: Initialiser les valeurs et implémenter les actions**

Dans le bloc `create(...)`, ajouter les valeurs initiales :
```ts
workMinutes: 25,
breakMinutes: 5,
```

Remplacer `startTimer` par :
```ts
startTimer: () => {
  const { remainingAtPause, pomodoroPhase, workMinutes, breakMinutes } = get()
  const duration = (pomodoroPhase === 'break' ? breakMinutes : workMinutes) * 60 * 1000
  if (remainingAtPause !== null) {
    set({
      timerStartedAt: Date.now() - (duration - remainingAtPause),
      remainingAtPause: null,
    })
  } else {
    set({
      timerStartedAt: Date.now(),
      pomodoroPhase: pomodoroPhase === 'idle' ? 'work' : pomodoroPhase,
    })
  }
},
```

Remplacer `pauseTimer` par :
```ts
pauseTimer: () => {
  const { timerStartedAt, pomodoroPhase, workMinutes, breakMinutes } = get()
  if (timerStartedAt === null) return
  const duration = (pomodoroPhase === 'break' ? breakMinutes : workMinutes) * 60 * 1000
  set({
    remainingAtPause: Math.max(0, duration - (Date.now() - timerStartedAt)),
    timerStartedAt: null,
  })
},
```

Remplacer `completePomodoro` par :
```ts
completePomodoro: () => {
  set((s) => ({
    pomodoroPhase: 'break',
    docuPoints: s.docuPoints + workReward(s.workMinutes),
    sessionsCompleted: s.sessionsCompleted + 1,
    timerStartedAt: Date.now(),
    remainingAtPause: null,
  }))
},
```

Remplacer `completeBreak` par :
```ts
completeBreak: () => {
  set((s) => ({
    pomodoroPhase: 'idle',
    docuPoints: s.docuPoints + breakReward(s.breakMinutes),
    timerStartedAt: null,
    remainingAtPause: null,
  }))
},
```

Ajouter les setters à la fin (avant `clearReveal`) :
```ts
setWorkMinutes: (m: number) => {
  if (get().pomodoroPhase !== 'idle') return
  set({ workMinutes: Math.max(5, Math.min(90, m)) })
},
setBreakMinutes: (m: number) => {
  if (get().pomodoroPhase !== 'idle') return
  set({ breakMinutes: Math.max(1, Math.min(30, m)) })
},
```

- [ ] **Step 4: Vérifier que TypeScript compile**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 3: Mettre à jour PomodoroTimer.tsx

**Files:**
- Modify: `src/components/PomodoroTimer.tsx`

- [ ] **Step 1: Remplacer les imports de constantes par des valeurs du store**

Changer la ligne d'import :
```ts
import { useGameStore, WORK_DURATION, BREAK_DURATION } from '../store/useGameStore'
```
en :
```ts
import { useGameStore } from '../store/useGameStore'
```

Ajouter ces deux selectors après les existants :
```ts
const workMinutes = useGameStore((s) => s.workMinutes)
const breakMinutes = useGameStore((s) => s.breakMinutes)
```

Remplacer la ligne :
```ts
const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION
```
par :
```ts
const duration = (pomodoroPhase === 'break' ? breakMinutes : workMinutes) * 60 * 1000
```

- [ ] **Step 2: Vérifier que TypeScript compile**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 4: Créer TimerSettings.tsx

**Files:**
- Create: `src/components/TimerSettings.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
import { useGameStore } from '../store/useGameStore'
import { workReward, breakReward } from '../utils/gameLogic'

export default function TimerSettings() {
  const workMinutes = useGameStore((s) => s.workMinutes)
  const breakMinutes = useGameStore((s) => s.breakMinutes)
  const pomodoroPhase = useGameStore((s) => s.pomodoroPhase)
  const setWorkMinutes = useGameStore((s) => s.setWorkMinutes)
  const setBreakMinutes = useGameStore((s) => s.setBreakMinutes)

  const isIdle = pomodoroPhase === 'idle'

  return (
    <div
      className="flex flex-col gap-6 px-3 py-8 border-r border-white/10 justify-center"
      style={{ width: '130px', minWidth: '100px' }}
    >
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Travail
        </span>
        <span className="font-fredoka text-accent-green text-lg font-bold leading-none">
          {workMinutes} min
        </span>
        <input
          type="range"
          min={5}
          max={90}
          step={5}
          value={workMinutes}
          disabled={!isIdle}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          className="w-full accent-accent-green disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-accent-green">
          +{workReward(workMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Pause
        </span>
        <span className="font-fredoka text-[#60a5fa] text-lg font-bold leading-none">
          {breakMinutes} min
        </span>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={breakMinutes}
          disabled={!isIdle}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-full accent-[#60a5fa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-[#60a5fa]">
          +{breakReward(breakMinutes)} pts
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Vérifier que TypeScript compile**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1
```

Attendu : aucune erreur

---

### Task 5: Intégrer TimerSettings dans TimerView

**Files:**
- Modify: `src/views/TimerView.tsx`

- [ ] **Step 1: Mettre à jour TimerView.tsx**

Remplacer le contenu entier de `src/views/TimerView.tsx` par :

```tsx
import PomodoroTimer from '../components/PomodoroTimer'
import EggShop from '../components/EggShop'
import TimerSettings from '../components/TimerSettings'

export default function TimerView() {
  return (
    <div className="flex min-h-full">
      <TimerSettings />
      <div className="flex flex-col items-center justify-center flex-1">
        <PomodoroTimer />
      </div>
      <div
        className="flex flex-col justify-center border-l border-white/10 overflow-y-auto"
        style={{ width: '340px', minWidth: '280px' }}
      >
        <EggShop />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Vérifier build complet**

```bash
cd /home/virtualangel/delivery/perso/Pomodocus && npx tsc --noEmit 2>&1 && npx vitest run 2>&1 | tail -10
```

Attendu : 0 erreurs TS, tous les tests passent
