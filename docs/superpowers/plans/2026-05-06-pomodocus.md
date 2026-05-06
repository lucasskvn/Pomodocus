# PomoDocus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PomoDocus, un Pomodoro timer gamifié où les sessions Pomodoro et pause génèrent des DocusPoints pour acheter des œufs de dinosaures qui produisent des pièces passives.

**Architecture:** Un seul store Zustand monolithique avec `persist` middleware (localStorage). La logique pure du jeu est extraite dans `src/utils/gameLogic.ts` pour être testable. Le timer utilise `Date.now()` comme source de vérité — `setInterval` ne sert qu'à déclencher les re-renders.

**Tech Stack:** React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Zustand 4, Framer Motion 11, Vitest 2

---

## File Map

| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances et scripts |
| `vite.config.ts` | Config Vite + Vitest |
| `tsconfig.json` | Config TypeScript |
| `index.html` | Entry point + Google Fonts |
| `tailwind.config.js` | Palette, fonts custom |
| `src/index.css` | Tailwind directives + body |
| `src/main.tsx` | Mount React |
| `src/App.tsx` | Navigation 2 onglets + EggReveal overlay |
| `src/data/dinosaurs.ts` | 8 dinos statiques + types |
| `src/utils/gameLogic.ts` | Fonctions pures (calculatePending, getRemaining, formatTime, rollRarity) |
| `src/utils/gameLogic.test.ts` | Tests Vitest |
| `src/store/useGameStore.ts` | Store Zustand (état global + actions) |
| `src/components/PointsDisplay.tsx` | Header DocusPoints + coins temps réel |
| `src/components/PomodoroTimer.tsx` | Timer SVG + Start/Pause/Reset |
| `src/components/EggShop.tsx` | 3 cartes d'œufs avec prix |
| `src/components/EggReveal.tsx` | Modal Framer Motion révélation dino |
| `src/components/DinoCard.tsx` | Card dino avec pièces en attente + collecte |
| `src/components/DinoPark.tsx` | Grille des dinos + état vide |
| `src/views/TimerView.tsx` | Timer + EggShop |
| `src/views/ParkView.tsx` | DinoPark |

---

### Task 1: Scaffold du projet Vite + React + TS + Tailwind

**Files:**
- Replace: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `postcss.config.js`
- Create: `tailwind.config.js`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Remplacer package.json**

Écrire `package.json` :

```json
{
  "name": "pomodocus",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://github.com/lucasskvn/Pomodocus#readme",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "uuid": "^9.0.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/uuid": "^9.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Créer vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 3: Créer tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Créer tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Créer index.html**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>PomoDocus 🦕</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Créer postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Créer tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#0f1923',
        'accent-green': '#4ade80',
        'accent-amber': '#fbbf24',
        rarity: {
          common: '#94a3b8',
          rare: '#60a5fa',
          epic: '#a855f7',
          legendary: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 8: Créer src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0f1923;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 9: Créer src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 10: Créer src/App.tsx (shell temporaire)**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <p className="font-fredoka text-accent-green text-2xl">PomoDocus 🦕</p>
    </div>
  )
}
```

- [ ] **Step 11: Installer les dépendances**

```bash
npm install
```

Expected: packages installés, no errors

- [ ] **Step 12: Vérifier que le dev server démarre**

```bash
npm run dev
```

Expected: serveur sur http://localhost:5173, page affiche "PomoDocus 🦕" sur fond `#0f1923` avec la font Fredoka

---

### Task 2: Données statiques des dinosaures

**Files:**
- Create: `src/data/dinosaurs.ts`

- [ ] **Step 1: Créer src/data/dinosaurs.ts**

```ts
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Dinosaur {
  id: string
  name: string
  rarity: Rarity
  emoji: string
  coinsPerHour: number
  color: string
}

export const DINOSAURS: Dinosaur[] = [
  { id: 'parasaurolophus', name: 'Parasaurolophus', rarity: 'common', emoji: '🦕', coinsPerHour: 10, color: '#94a3b8' },
  { id: 'stegosaurus', name: 'Stégosaure', rarity: 'common', emoji: '🌿', coinsPerHour: 15, color: '#94a3b8' },
  { id: 'ankylosaurus', name: 'Ankylosaure', rarity: 'common', emoji: '🐢', coinsPerHour: 20, color: '#94a3b8' },
  { id: 'triceratops', name: 'Tricératops', rarity: 'common', emoji: '🦏', coinsPerHour: 30, color: '#94a3b8' },
  { id: 'velociraptor', name: 'Vélociraptor', rarity: 'rare', emoji: '🦅', coinsPerHour: 60, color: '#60a5fa' },
  { id: 'spinosaurus', name: 'Spinosaure', rarity: 'rare', emoji: '🐊', coinsPerHour: 120, color: '#60a5fa' },
  { id: 'trex', name: 'T-Rex', rarity: 'epic', emoji: '🦖', coinsPerHour: 300, color: '#a855f7' },
  { id: 'brachiosaurus', name: 'Brachiosaure', rarity: 'legendary', emoji: '✨', coinsPerHour: 1000, color: '#f59e0b' },
]

export const DINO_MAP: Record<string, Dinosaur> = Object.fromEntries(
  DINOSAURS.map((d) => [d.id, d]),
)

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
}
```

---

### Task 3: Logique de jeu (TDD)

**Files:**
- Create: `src/utils/gameLogic.test.ts`
- Create: `src/utils/gameLogic.ts`

- [ ] **Step 1: Écrire les tests (avant l'implémentation)**

Créer `src/utils/gameLogic.test.ts` :

```ts
import { describe, it, expect, vi } from 'vitest'
import { calculatePending, getRemaining, formatTime, rollRarity } from './gameLogic'

describe('calculatePending', () => {
  it('retourne les coins gagnés depuis lastCollectedAt', () => {
    const oneHourAgo = Date.now() - 3_600_000
    expect(calculatePending(oneHourAgo, 60)).toBeCloseTo(60, 0)
  })

  it('plafonne à 10h de production', () => {
    const twentyHoursAgo = Date.now() - 72_000_000
    expect(calculatePending(twentyHoursAgo, 60)).toBe(600)
  })

  it('retourne 0 si aucun temps écoulé', () => {
    expect(calculatePending(Date.now(), 60)).toBeCloseTo(0, 0)
  })
})

describe('getRemaining', () => {
  it('retourne les ms restants', () => {
    const tenSecondsAgo = Date.now() - 10_000
    expect(getRemaining(tenSecondsAgo, 60_000)).toBeCloseTo(50_000, -3)
  })

  it('retourne 0 si la durée est dépassée', () => {
    const twoMinutesAgo = Date.now() - 120_000
    expect(getRemaining(twoMinutesAgo, 60_000)).toBe(0)
  })
})

describe('formatTime', () => {
  it('formate 90000ms en 01:30', () => {
    expect(formatTime(90_000)).toBe('01:30')
  })

  it('formate 0ms en 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formate 1500000ms en 25:00', () => {
    expect(formatTime(1_500_000)).toBe('25:00')
  })
})

describe('rollRarity', () => {
  it('retourne common pour un œuf commun quand roll < 0.70', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollRarity('common')).toBe('common')
    vi.restoreAllMocks()
  })

  it('retourne rare pour un œuf commun quand 0.70 ≤ roll < 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.85)
    expect(rollRarity('common')).toBe('rare')
    vi.restoreAllMocks()
  })

  it('retourne epic pour un œuf commun quand roll ≥ 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.97)
    expect(rollRarity('common')).toBe('epic')
    vi.restoreAllMocks()
  })

  it('retourne legendary pour un œuf rare quand roll ≥ 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.97)
    expect(rollRarity('rare')).toBe('legendary')
    vi.restoreAllMocks()
  })

  it('retourne epic pour un œuf légendaire quand 0.30 ≤ roll < 0.80', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollRarity('legendary')).toBe('epic')
    vi.restoreAllMocks()
  })
})
```

- [ ] **Step 2: Lancer les tests — confirmer qu'ils échouent**

```bash
npm test -- --run
```

Expected: FAIL avec "Cannot find module './gameLogic'"

- [ ] **Step 3: Implémenter src/utils/gameLogic.ts**

```ts
import type { Rarity } from '../data/dinosaurs'

export type EggType = 'common' | 'rare' | 'legendary'

const EGG_PROBABILITIES: Record<EggType, [Rarity, number][]> = {
  common: [['common', 0.70], ['rare', 0.25], ['epic', 0.05], ['legendary', 0]],
  rare: [['common', 0.20], ['rare', 0.55], ['epic', 0.20], ['legendary', 0.05]],
  legendary: [['common', 0], ['rare', 0.30], ['epic', 0.50], ['legendary', 0.20]],
}

export function calculatePending(lastCollectedAt: number, coinsPerHour: number): number {
  const elapsed = Date.now() - lastCollectedAt
  return Math.min((elapsed / 3_600_000) * coinsPerHour, 10 * coinsPerHour)
}

export function getRemaining(timerStartedAt: number, duration: number): number {
  return Math.max(0, duration - (Date.now() - timerStartedAt))
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function rollRarity(eggType: EggType): Rarity {
  const probs = EGG_PROBABILITIES[eggType]
  const roll = Math.random()
  let cumulative = 0
  for (const [rarity, prob] of probs) {
    cumulative += prob
    if (roll < cumulative) return rarity
  }
  return probs[probs.length - 1][0]
}
```

- [ ] **Step 4: Lancer les tests — confirmer qu'ils passent**

```bash
npm test -- --run
```

Expected: tous les tests PASS (9 tests)

---

### Task 4: Store Zustand

**Files:**
- Create: `src/store/useGameStore.ts`

- [ ] **Step 1: Créer src/store/useGameStore.ts**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { DINOSAURS, DINO_MAP } from '../data/dinosaurs'
import { calculatePending, rollRarity, type EggType } from '../utils/gameLogic'

export interface DinoInstance {
  id: string
  dinoId: string
  obtainedAt: number
  lastCollectedAt: number
}

const EGG_PRICES: Record<EggType, number> = {
  common: 15,
  rare: 40,
  legendary: 100,
}

export const WORK_DURATION = 25 * 60 * 1000
export const BREAK_DURATION = 5 * 60 * 1000

interface GameState {
  docuPoints: number
  coins: number
  ownedDinos: DinoInstance[]
  pomodoroPhase: 'work' | 'break' | 'idle'
  timerStartedAt: number | null
  remainingAtPause: number | null
  sessionsCompleted: number
  pendingReveal: DinoInstance | null
}

interface GameActions {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completePomodoro: () => void
  completeBreak: () => void
  buyEgg: (eggType: EggType) => void
  collectDino: (instanceId: string) => void
  clearReveal: () => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      docuPoints: 0,
      coins: 0,
      ownedDinos: [],
      pomodoroPhase: 'idle',
      timerStartedAt: null,
      remainingAtPause: null,
      sessionsCompleted: 0,
      pendingReveal: null,

      startTimer: () => {
        const { remainingAtPause, pomodoroPhase } = get()
        const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION
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

      pauseTimer: () => {
        const { timerStartedAt, pomodoroPhase } = get()
        if (timerStartedAt === null) return
        const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION
        set({
          remainingAtPause: Math.max(0, duration - (Date.now() - timerStartedAt)),
          timerStartedAt: null,
        })
      },

      resetTimer: () => {
        set({ timerStartedAt: null, remainingAtPause: null, pomodoroPhase: 'idle' })
      },

      completePomodoro: () => {
        set((s) => ({
          pomodoroPhase: 'break',
          docuPoints: s.docuPoints + 15,
          sessionsCompleted: s.sessionsCompleted + 1,
          timerStartedAt: Date.now(),
          remainingAtPause: null,
        }))
      },

      completeBreak: () => {
        set((s) => ({
          pomodoroPhase: 'idle',
          docuPoints: s.docuPoints + 2,
          timerStartedAt: null,
          remainingAtPause: null,
        }))
      },

      buyEgg: (eggType: EggType) => {
        const { docuPoints } = get()
        const price = EGG_PRICES[eggType]
        if (docuPoints < price) return

        const rarity = rollRarity(eggType)
        const pool = DINOSAURS.filter((d) => d.rarity === rarity)
        const dino = pool[Math.floor(Math.random() * pool.length)]
        const now = Date.now()
        const instance: DinoInstance = {
          id: uuidv4(),
          dinoId: dino.id,
          obtainedAt: now,
          lastCollectedAt: now,
        }

        set((s) => ({
          docuPoints: s.docuPoints - price,
          ownedDinos: [...s.ownedDinos, instance],
          pendingReveal: instance,
        }))
      },

      collectDino: (instanceId: string) => {
        const instance = get().ownedDinos.find((d) => d.id === instanceId)
        if (!instance) return
        const dino = DINO_MAP[instance.dinoId]
        const pending = Math.floor(calculatePending(instance.lastCollectedAt, dino.coinsPerHour))
        const now = Date.now()
        set((s) => ({
          coins: s.coins + pending,
          ownedDinos: s.ownedDinos.map((d) =>
            d.id === instanceId ? { ...d, lastCollectedAt: now } : d,
          ),
        }))
      },

      clearReveal: () => set({ pendingReveal: null }),
    }),
    { name: 'pomodocus-store' },
  ),
)
```

---

### Task 5: App shell avec navigation 2 onglets

**Files:**
- Create: `src/views/TimerView.tsx`
- Create: `src/views/ParkView.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Créer src/views/TimerView.tsx (placeholder)**

```tsx
export default function TimerView() {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="text-white/40 font-inter text-sm">Timer — en construction</p>
    </div>
  )
}
```

- [ ] **Step 2: Créer src/views/ParkView.tsx (placeholder)**

```tsx
export default function ParkView() {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="text-white/40 font-inter text-sm">Parc — en construction</p>
    </div>
  )
}
```

- [ ] **Step 3: Remplacer src/App.tsx**

```tsx
import { useState } from 'react'
import TimerView from './views/TimerView'
import ParkView from './views/ParkView'

type Tab = 'timer' | 'park'

export default function App() {
  const [tab, setTab] = useState<Tab>('timer')

  return (
    <div className="min-h-screen bg-bg-dark flex justify-center">
      <div className="w-full max-w-[430px] flex flex-col min-h-screen">
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
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Vérifier dans le navigateur**

Expected: fond sombre, 2 onglets en bas, switch entre "Timer" et "Parc"

---

### Task 6: PointsDisplay

**Files:**
- Create: `src/components/PointsDisplay.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Créer src/components/PointsDisplay.tsx**

```tsx
import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { calculatePending } from '../utils/gameLogic'
import { DINO_MAP } from '../data/dinosaurs'

export default function PointsDisplay() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const coins = useGameStore((s) => s.coins)
  const ownedDinos = useGameStore((s) => s.ownedDinos)
  const [displayCoins, setDisplayCoins] = useState(coins)

  useEffect(() => {
    const update = () => {
      const pending = ownedDinos.reduce((sum, d) => {
        const dino = DINO_MAP[d.dinoId]
        return sum + Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour))
      }, 0)
      setDisplayCoins(coins + pending)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [ownedDinos, coins])

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0a1219] border-b border-white/10">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⚡</span>
        <span className="font-fredoka text-lg font-semibold text-accent-green">
          {docuPoints} pts
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-lg">🪙</span>
        <span className="font-fredoka text-lg font-semibold text-accent-amber">
          {displayCoins.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Ajouter PointsDisplay dans src/App.tsx**

Importer et ajouter `<PointsDisplay />` au-dessus de `<main>` :

```tsx
import { useState } from 'react'
import TimerView from './views/TimerView'
import ParkView from './views/ParkView'
import PointsDisplay from './components/PointsDisplay'

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
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Expected: header affiche "⚡ 0 pts" à gauche, "🪙 0" à droite

---

### Task 7: PomodoroTimer

**Files:**
- Create: `src/components/PomodoroTimer.tsx`
- Modify: `src/views/TimerView.tsx`

- [ ] **Step 1: Créer src/components/PomodoroTimer.tsx**

```tsx
import { useEffect, useRef, useState } from 'react'
import { useGameStore, WORK_DURATION, BREAK_DURATION } from '../store/useGameStore'
import { getRemaining, formatTime } from '../utils/gameLogic'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroTimer() {
  const pomodoroPhase = useGameStore((s) => s.pomodoroPhase)
  const timerStartedAt = useGameStore((s) => s.timerStartedAt)
  const remainingAtPause = useGameStore((s) => s.remainingAtPause)
  const sessionsCompleted = useGameStore((s) => s.sessionsCompleted)
  const startTimer = useGameStore((s) => s.startTimer)
  const pauseTimer = useGameStore((s) => s.pauseTimer)
  const resetTimer = useGameStore((s) => s.resetTimer)
  const completePomodoro = useGameStore((s) => s.completePomodoro)
  const completeBreak = useGameStore((s) => s.completeBreak)

  const duration = pomodoroPhase === 'break' ? BREAK_DURATION : WORK_DURATION

  const [remaining, setRemaining] = useState(() => {
    if (timerStartedAt !== null) return getRemaining(timerStartedAt, duration)
    if (remainingAtPause !== null) return remainingAtPause
    return duration
  })

  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false

    if (timerStartedAt === null) {
      setRemaining(remainingAtPause ?? duration)
      return
    }

    const tick = () => {
      const r = getRemaining(timerStartedAt, duration)
      setRemaining(r)
      if (r === 0 && !completedRef.current) {
        completedRef.current = true
        if (pomodoroPhase === 'work') completePomodoro()
        else if (pomodoroPhase === 'break') completeBreak()
      }
    }

    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [timerStartedAt, pomodoroPhase, duration, remainingAtPause, completePomodoro, completeBreak])

  const isRunning = timerStartedAt !== null
  const progress = 1 - remaining / duration
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)
  const phaseColor = pomodoroPhase === 'break' ? '#60a5fa' : '#4ade80'
  const phaseLabel =
    pomodoroPhase === 'work' ? 'TRAVAIL' : pomodoroPhase === 'break' ? 'PAUSE' : 'PRÊT'

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center gap-2">
        <span className="text-white/50 font-inter text-sm">Session</span>
        <span className="font-fredoka text-accent-green text-lg font-semibold">
          #{sessionsCompleted + 1}
        </span>
      </div>

      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={RADIUS}
            fill="none"
            stroke="#1e2d3d"
            strokeWidth="8"
          />
          <circle
            cx="80" cy="80" r={RADIUS}
            fill="none"
            stroke={phaseColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-fredoka text-4xl font-bold text-white">
            {formatTime(remaining)}
          </span>
          <span
            className="font-inter text-xs font-semibold tracking-widest mt-1"
            style={{ color: phaseColor }}
          >
            {phaseLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-full border border-white/20 text-white/60 font-inter text-sm hover:border-white/40 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="px-8 py-3 rounded-full font-fredoka text-lg font-semibold transition-opacity hover:opacity-90"
          style={{ background: phaseColor, color: '#0f1923' }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mettre à jour src/views/TimerView.tsx**

```tsx
import PomodoroTimer from '../components/PomodoroTimer'

export default function TimerView() {
  return (
    <div className="flex flex-col">
      <PomodoroTimer />
    </div>
  )
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Expected: cercle SVG à 25:00, bouton "Start" vert. Cliquer Start → décompte. Cliquer Pause → stop. Cliquer Reset → retour à 25:00. Recharger page pendant que le timer tourne → reprend là où il en était.

---

### Task 8: EggShop

**Files:**
- Create: `src/components/EggShop.tsx`
- Modify: `src/views/TimerView.tsx`

- [ ] **Step 1: Créer src/components/EggShop.tsx**

```tsx
import { useGameStore } from '../store/useGameStore'
import type { EggType } from '../utils/gameLogic'

const EGGS: { type: EggType; emoji: string; label: string; price: number; probs: string }[] = [
  { type: 'common', emoji: '🥚', label: 'Œuf Commun', price: 15, probs: '70% C · 25% R · 5% E' },
  { type: 'rare', emoji: '🪺', label: 'Œuf Rare', price: 40, probs: '20% C · 55% R · 20% E · 5% L' },
  { type: 'legendary', emoji: '💎', label: 'Œuf Légendaire', price: 100, probs: '30% R · 50% E · 20% L' },
]

export default function EggShop() {
  const docuPoints = useGameStore((s) => s.docuPoints)
  const buyEgg = useGameStore((s) => s.buyEgg)

  return (
    <div className="px-4 pb-6">
      <h2 className="font-fredoka text-xl font-semibold text-white mb-3">Boutique</h2>
      <div className="flex flex-col gap-3">
        {EGGS.map((egg) => {
          const canAfford = docuPoints >= egg.price
          return (
            <button
              key={egg.type}
              onClick={() => canAfford && buyEgg(egg.type)}
              disabled={!canAfford}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                canAfford
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 cursor-pointer'
                  : 'border-white/10 bg-white/[0.02] opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-4xl">{egg.emoji}</span>
              <div className="flex-1">
                <p className="font-fredoka text-base font-semibold text-white">{egg.label}</p>
                <p className="font-inter text-xs text-white/50 mt-0.5">{egg.probs}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-fredoka font-bold text-lg text-accent-green">{egg.price}</span>
                <span className="font-inter text-xs text-white/50">pts</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mettre à jour src/views/TimerView.tsx**

```tsx
import PomodoroTimer from '../components/PomodoroTimer'
import EggShop from '../components/EggShop'

export default function TimerView() {
  return (
    <div className="flex flex-col">
      <PomodoroTimer />
      <EggShop />
    </div>
  )
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Expected: 3 cartes d'œufs grisées sous le timer (docuPoints = 0)

---

### Task 9: EggReveal modal

**Files:**
- Create: `src/components/EggReveal.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Créer src/components/EggReveal.tsx**

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'

const RARITY_BG: Record<string, string> = {
  common: '#1e293b',
  rare: '#1e3a5f',
  epic: '#2d1b69',
  legendary: '#451a03',
}

export default function EggReveal() {
  const pendingReveal = useGameStore((s) => s.pendingReveal)
  const clearReveal = useGameStore((s) => s.clearReveal)

  const dino = pendingReveal ? DINO_MAP[pendingReveal.dinoId] : null

  return (
    <AnimatePresence>
      {pendingReveal && dino && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={clearReveal}
        >
          <motion.div
            key="card"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            style={{ background: RARITY_BG[dino.rarity] }}
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl select-none"
            >
              🥚
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 15 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-7xl">{dino.emoji}</span>
              <span className="font-fredoka text-2xl font-bold text-white">{dino.name}</span>
              <span
                className="font-inter text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: dino.color, background: `${dino.color}22` }}
              >
                {RARITY_LABEL[dino.rarity]}
              </span>
              <span className="font-inter text-sm text-white/60">
                {dino.coinsPerHour} 🪙/h
              </span>
            </motion.div>

            <button
              onClick={clearReveal}
              className="mt-2 w-full py-3 rounded-2xl font-fredoka text-base font-semibold hover:opacity-90 transition-opacity"
              style={{ background: dino.color, color: '#0f1923' }}
            >
              Ajouter au parc
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Ajouter EggReveal dans src/App.tsx**

Importer `EggReveal` et l'ajouter juste avant la fermeture du `<div>` conteneur :

```tsx
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
```

- [ ] **Step 3: Tester manuellement (donner des points via la console)**

Dans la console du navigateur :

```js
const s = JSON.parse(localStorage.getItem('pomodocus-store'))
s.state.docuPoints = 200
localStorage.setItem('pomodocus-store', JSON.stringify(s))
location.reload()
```

Expected après rechargement : les 3 cartes d'œufs sont actives. Cliquer "Œuf Commun" → animation de shake de l'œuf → dino révélé avec fond coloré selon rareté → bouton "Ajouter au parc"

---

### Task 10: DinoCard

**Files:**
- Create: `src/components/DinoCard.tsx`

- [ ] **Step 1: Créer src/components/DinoCard.tsx**

```tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, type DinoInstance } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { calculatePending } from '../utils/gameLogic'

interface Props {
  instance: DinoInstance
  index: number
}

export default function DinoCard({ instance, index }: Props) {
  const collectDino = useGameStore((s) => s.collectDino)
  const dino = DINO_MAP[instance.dinoId]
  const cap = 10 * dino.coinsPerHour

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, dino.coinsPerHour),
  )

  useEffect(() => {
    const update = () => setPending(calculatePending(instance.lastCollectedAt, dino.coinsPerHour))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, dino.coinsPerHour])

  const isFull = pending >= cap
  const pendingDisplay = Math.floor(pending)
  const progress = Math.min(pending / cap, 1)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
      className="rounded-2xl p-4 flex flex-col gap-3 border"
      style={{ background: `${dino.color}11`, borderColor: `${dino.color}33` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{dino.emoji}</span>
        <div>
          <p className="font-fredoka text-base font-semibold text-white">{dino.name}</p>
          <p className="font-inter text-xs font-semibold" style={{ color: dino.color }}>
            {RARITY_LABEL[dino.rarity]}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-fredoka text-sm font-semibold text-white/60">
            {dino.coinsPerHour} 🪙/h
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-inter text-white/60">
            {pendingDisplay.toLocaleString()} / {cap.toLocaleString()} 🪙
          </span>
          {isFull && <span className="text-accent-amber text-xs">🔒 Plein</span>}
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress * 100}%`, background: dino.color }}
          />
        </div>
      </div>

      <button
        onClick={() => collectDino(instance.id)}
        disabled={pendingDisplay === 0}
        className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-semibold transition-opacity ${
          pendingDisplay > 0
            ? 'hover:opacity-90 cursor-pointer'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
        style={pendingDisplay > 0 ? { background: dino.color, color: '#0f1923' } : {}}
      >
        {isFull
          ? `🔒 Collecter ${pendingDisplay.toLocaleString()} 🪙`
          : pendingDisplay > 0
            ? `Collecter ${pendingDisplay.toLocaleString()} 🪙`
            : 'En production...'}
      </button>
    </motion.div>
  )
}
```

---

### Task 11: DinoPark + ParkView

**Files:**
- Create: `src/components/DinoPark.tsx`
- Modify: `src/views/ParkView.tsx`

- [ ] **Step 1: Créer src/components/DinoPark.tsx**

```tsx
import { useGameStore } from '../store/useGameStore'
import DinoCard from './DinoCard'

export default function DinoPark() {
  const ownedDinos = useGameStore((s) => s.ownedDinos)

  if (ownedDinos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
        <span className="text-6xl">🥚</span>
        <p className="font-fredoka text-xl font-semibold text-white">Parc vide !</p>
        <p className="font-inter text-sm text-white/50 leading-relaxed">
          Complète des sessions Pomodoro pour gagner des DocusPoints, puis achète des œufs dans la boutique.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="font-fredoka text-xl font-semibold text-white">
        Ton parc{' '}
        <span className="text-accent-green">
          ({ownedDinos.length} dino{ownedDinos.length > 1 ? 's' : ''})
        </span>
      </h2>
      {ownedDinos.map((instance, i) => (
        <DinoCard key={instance.id} instance={instance} index={i} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Mettre à jour src/views/ParkView.tsx**

```tsx
import DinoPark from '../components/DinoPark'

export default function ParkView() {
  return (
    <div className="flex flex-col">
      <DinoPark />
    </div>
  )
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

1. Onglet Parc sans dinos → message vide avec emoji œuf
2. Acheter un œuf depuis Timer (avec points injectés en console) → aller dans Parc → carte dino apparaît avec animation spring
3. La barre de progression se remplit progressivement
4. Cliquer "Collecter" → coins s'ajoutent dans le header

---

### Task 12: Vérification end-to-end

**Files:** aucune modification — vérification uniquement

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 2: Tests**

```bash
npm test -- --run
```

Expected: tous les tests PASS

- [ ] **Step 3: Parcours utilisateur complet**

Ouvrir http://localhost:5173 et vérifier :

1. **Timer :** Start → décompte → Pause → reprend → Reset → 25:00
2. **Persistance :** Recharger pendant que le timer tourne → reprend exactement là où il en était
3. **Shop :** Avec ≥ 15 pts, cliquer "Œuf Commun" → animation œuf → dino révélé
4. **Parc :** Dino visible avec barre de progression, bouton Collecter actif après quelques secondes
5. **Coins :** Header met à jour le total (coins stockés + pending de tous les dinos) chaque seconde
6. **Switch d'onglet :** Timer continue de tourner pendant qu'on consulte le parc
7. **Plafond 10h :** Injecter un dino avec `lastCollectedAt` vieux de 20h → barre pleine, icône 🔒, bouton "Collecter" actif
