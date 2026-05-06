# Dino Detail Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow players to click any roaming dinosaur in the park to open a modal where they can rename it, view its stats, level it up (spending coins to increase its individual production rate), and sell it.

**Architecture:** Three new pure functions in `gameLogic.ts` handle cost/price/multiplier math (TDD-first). `DinoInstance` gains `level` and `nickname` fields; three new store actions (`levelUpDino`, `sellDino`, `renameDino`) mutate them. `DinoRoaming` gets an `onClick` prop; `DinoPark` tracks `selectedDinoId` and renders `DinoModal` via `AnimatePresence`.

**Tech Stack:** React 18, TypeScript strict, Zustand 4 (persist), Framer Motion 11, Vitest

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/utils/gameLogic.ts` | Add 3 pure functions |
| Modify | `src/utils/gameLogic.test.ts` | Add tests for new functions |
| Modify | `src/store/useGameStore.ts` | Extend `DinoInstance`, add 3 actions, update `collectDino`/`collectAll` |
| Modify | `src/components/PointsDisplay.tsx` | Apply `dinoProductionMultiplier` in live preview |
| Modify | `src/components/DinoRoaming.tsx` | Add `onClick` prop, apply level multiplier to pending display |
| Modify | `src/components/DinoCard.tsx` | Add level badge, apply level multiplier to pending/cap |
| Modify | `src/components/DinoPark.tsx` | Add `selectedDinoId` state, render `DinoModal`, read `yieldUpgradeLevel` |
| Create | `src/components/DinoModal.tsx` | Full modal UI (rename, stats, level up, sell) |

---

## Task 1: Pure functions for dino economics

**Files:**
- Modify: `src/utils/gameLogic.ts`
- Modify: `src/utils/gameLogic.test.ts`

- [ ] **Step 1: Write failing tests**

Open `src/utils/gameLogic.test.ts` and add at the end:

```ts
describe('dinoLevelUpCost', () => {
  it('common level 0 → 200', () => expect(dinoLevelUpCost('common', 0)).toBe(200))
  it('common level 1 → 360', () => expect(dinoLevelUpCost('common', 1)).toBe(360))
  it('rare level 0 → 500', () => expect(dinoLevelUpCost('rare', 0)).toBe(500))
  it('epic level 0 → 1200', () => expect(dinoLevelUpCost('epic', 0)).toBe(1200))
  it('legendary level 0 → 3000', () => expect(dinoLevelUpCost('legendary', 0)).toBe(3000))
  it('level 10 → Infinity', () => expect(dinoLevelUpCost('common', 10)).toBe(Infinity))
})

describe('dinoSellPrice', () => {
  it('common level 0 → 50', () => expect(dinoSellPrice('common', 0)).toBe(50))
  it('rare level 0 → 150', () => expect(dinoSellPrice('rare', 0)).toBe(150))
  it('epic level 0 → 400', () => expect(dinoSellPrice('epic', 0)).toBe(400))
  it('legendary level 0 → 1000', () => expect(dinoSellPrice('legendary', 0)).toBe(1000))
  it('common level 1 → 50 + 50% of 200 = 150', () => expect(dinoSellPrice('common', 1)).toBe(150))
  it('common level 2 → 50 + 50% of (200+360) = 330', () => expect(dinoSellPrice('common', 2)).toBe(330))
})

describe('dinoProductionMultiplier', () => {
  it('level 0 → 1.0', () => expect(dinoProductionMultiplier(0)).toBe(1.0))
  it('level 5 → 1.5', () => expect(dinoProductionMultiplier(5)).toBe(1.5))
  it('level 10 → 2.0', () => expect(dinoProductionMultiplier(10)).toBe(2.0))
})
```

Also add `dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier` to the import at line 2:

```ts
import { calculatePending, getRemaining, formatTime, rollRarity, workReward, breakReward, computeSessionStats, formatFocusTime, slotUpgradeCost, yieldUpgradeCost, dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier } from './gameLogic'
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/gameLogic.test.ts
```

Expected: FAIL — `dinoLevelUpCost is not a function` (or similar import error).

- [ ] **Step 3: Implement the three functions**

Add to the end of `src/utils/gameLogic.ts`:

```ts
import type { Rarity } from '../data/dinosaurs'
```

Wait — `Rarity` is already imported at line 1. Add the functions after `rollRarity`:

```ts
const DINO_LEVEL_BASE: Record<Rarity, number> = {
  common: 200,
  rare: 500,
  epic: 1200,
  legendary: 3000,
}

const DINO_SELL_BASE: Record<Rarity, number> = {
  common: 50,
  rare: 150,
  epic: 400,
  legendary: 1000,
}

export function dinoLevelUpCost(rarity: Rarity, level: number): number {
  if (level >= 10) return Infinity
  return Math.round(DINO_LEVEL_BASE[rarity] * Math.pow(1.8, level))
}

export function dinoSellPrice(rarity: Rarity, level: number): number {
  let invested = 0
  for (let i = 0; i < level; i++) invested += dinoLevelUpCost(rarity, i)
  return DINO_SELL_BASE[rarity] + Math.floor(invested * 0.5)
}

export function dinoProductionMultiplier(level: number): number {
  return 1 + level * 0.1
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/gameLogic.test.ts
```

Expected: All tests PASS (36 existing + 14 new).

- [ ] **Step 5: Commit**

```bash
git add src/utils/gameLogic.ts src/utils/gameLogic.test.ts
git commit -m "feat: add dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier"
```

---

## Task 2: Extend DinoInstance + store actions

**Files:**
- Modify: `src/store/useGameStore.ts`

- [ ] **Step 1: Extend `DinoInstance` interface**

In `src/store/useGameStore.ts`, update the `DinoInstance` interface (currently at lines 7–12):

```ts
export interface DinoInstance {
  id: string
  dinoId: string
  obtainedAt: number
  lastCollectedAt: number
  level: number
  nickname: string | null
}
```

- [ ] **Step 2: Update `buyEgg` to set defaults for new fields**

In the `buyEgg` action, find the `instance` object literal (around line 139) and add the new fields:

```ts
const instance: DinoInstance = {
  id: uuidv4(),
  dinoId: dino.id,
  obtainedAt: now,
  lastCollectedAt: now,
  level: 0,
  nickname: null,
}
```

- [ ] **Step 3: Add `levelUpDino`, `sellDino`, `renameDino` to the `GameActions` interface**

Find the `GameActions` interface (around line 39) and add:

```ts
interface GameActions {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completePomodoro: () => void
  completeBreak: () => void
  buyEgg: (eggType: EggType) => void
  collectDino: (instanceId: string) => void
  collectAll: () => number
  clearReveal: () => void
  cheat: () => void
  setWorkMinutes: (m: number) => void
  setBreakMinutes: (m: number) => void
  buySlotUpgrade: () => void
  buyYieldUpgrade: () => void
  levelUpDino: (instanceId: string) => void
  sellDino: (instanceId: string) => void
  renameDino: (instanceId: string, name: string) => void
}
```

- [ ] **Step 4: Add the import for new functions**

At the top of `src/store/useGameStore.ts`, update the `gameLogic` import to include the new functions:

```ts
import { calculatePending, rollRarity, workReward, breakReward, computeSessionStats, slotUpgradeCost, yieldUpgradeCost, dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier, type EggType } from '../utils/gameLogic'
```

- [ ] **Step 5: Implement the three new actions**

After the `buyYieldUpgrade` action and before `cheat`, add:

```ts
levelUpDino: (instanceId: string) => {
  const { coins, ownedDinos } = get()
  const instance = ownedDinos.find((d) => d.id === instanceId)
  if (!instance) return
  const dino = DINO_MAP[instance.dinoId]
  const level = instance.level ?? 0
  if (level >= 10) return
  const cost = dinoLevelUpCost(dino.rarity, level)
  if (coins < cost) return
  set((s) => ({
    coins: s.coins - cost,
    ownedDinos: s.ownedDinos.map((d) =>
      d.id === instanceId ? { ...d, level: (d.level ?? 0) + 1 } : d,
    ),
  }))
},

sellDino: (instanceId: string) => {
  const { ownedDinos } = get()
  const instance = ownedDinos.find((d) => d.id === instanceId)
  if (!instance) return
  const dino = DINO_MAP[instance.dinoId]
  const price = dinoSellPrice(dino.rarity, instance.level ?? 0)
  set((s) => ({
    coins: s.coins + price,
    ownedDinos: s.ownedDinos.filter((d) => d.id !== instanceId),
  }))
},

renameDino: (instanceId: string, name: string) => {
  const trimmed = name.trim()
  set((s) => ({
    ownedDinos: s.ownedDinos.map((d) =>
      d.id === instanceId ? { ...d, nickname: trimmed || null } : d,
    ),
  }))
},
```

- [ ] **Step 6: Update `collectDino` to apply level multiplier**

Find `collectDino` (around line 153) and update to:

```ts
collectDino: (instanceId: string) => {
  const { ownedDinos, yieldUpgradeLevel } = get()
  const instance = ownedDinos.find((d) => d.id === instanceId)
  if (!instance) return
  const dino = DINO_MAP[instance.dinoId]
  const yieldMult = 1 + yieldUpgradeLevel * 0.05
  const levelMult = dinoProductionMultiplier(instance.level ?? 0)
  const pending = Math.floor(calculatePending(instance.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
  const now = Date.now()
  set((s) => ({
    coins: s.coins + pending,
    ownedDinos: s.ownedDinos.map((d) =>
      d.id === instanceId ? { ...d, lastCollectedAt: now } : d,
    ),
  }))
},
```

- [ ] **Step 7: Update `collectAll` to apply level multiplier**

Find `collectAll` (around line 169) and update to:

```ts
collectAll: () => {
  const { ownedDinos, yieldUpgradeLevel } = get()
  const yieldMult = 1 + yieldUpgradeLevel * 0.05
  const now = Date.now()
  let total = 0
  const updatedDinos = ownedDinos.map((d) => {
    const dino = DINO_MAP[d.dinoId]
    const levelMult = dinoProductionMultiplier(d.level ?? 0)
    const pending = Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
    total += pending
    return { ...d, lastCollectedAt: now }
  })
  set((s) => ({ coins: s.coins + total, ownedDinos: updatedDinos }))
  return total
},
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/store/useGameStore.ts
git commit -m "feat: extend DinoInstance with level/nickname, add levelUpDino/sellDino/renameDino"
```

---

## Task 3: Propagate level multiplier to display components

**Files:**
- Modify: `src/components/PointsDisplay.tsx`
- Modify: `src/components/DinoCard.tsx`
- Modify: `src/components/DinoRoaming.tsx`
- Modify: `src/components/DinoPark.tsx`

- [ ] **Step 1: Update `PointsDisplay` live preview**

In `src/components/PointsDisplay.tsx`, update the import at line 3:

```ts
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'
```

Then update the `pending` calculation inside `update()` (around line 17–20):

```ts
const pending = ownedDinos.reduce((sum, d) => {
  const dino = DINO_MAP[d.dinoId]
  const levelMult = dinoProductionMultiplier(d.level ?? 0)
  return sum + Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * multiplier * levelMult)
}, 0)
```

- [ ] **Step 2: Update `DinoCard` to apply level multiplier**

Replace the entire `src/components/DinoCard.tsx` with:

```tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, type DinoInstance } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'

interface Props {
  instance: DinoInstance
  index: number
  onClick?: () => void
}

export default function DinoCard({ instance, index, onClick }: Props) {
  const collectDino = useGameStore((s) => s.collectDino)
  const dino = DINO_MAP[instance.dinoId]
  const level = instance.level ?? 0
  const levelMult = dinoProductionMultiplier(level)
  const effectiveRate = dino.coinsPerHour * levelMult
  const cap = 10 * effectiveRate

  const [pending, setPending] = useState(() =>
    calculatePending(instance.lastCollectedAt, effectiveRate),
  )

  useEffect(() => {
    const update = () => setPending(calculatePending(instance.lastCollectedAt, effectiveRate))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [instance.lastCollectedAt, effectiveRate])

  const isFull = pending >= cap
  const pendingDisplay = Math.floor(pending)
  const progress = Math.min(pending / cap, 1)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
      onClick={onClick}
      className="rounded-2xl p-4 flex flex-col gap-3 border"
      style={{
        background: `${dino.color}11`,
        borderColor: `${dino.color}33`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{dino.emoji}</span>
        <div>
          <p className="font-fredoka text-base font-semibold text-white">
            {instance.nickname ?? dino.name}
          </p>
          <p className="font-inter text-xs font-semibold" style={{ color: dino.color }}>
            {RARITY_LABEL[dino.rarity]}
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-0.5">
          <p className="font-fredoka text-sm font-semibold text-white/60">
            {Math.round(effectiveRate)} 🪙/h
          </p>
          {level > 0 && (
            <span
              className="font-fredoka text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${dino.color}33`, color: dino.color }}
            >
              Lv.{level}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-inter text-white/60">
            {pendingDisplay.toLocaleString()} / {Math.floor(cap).toLocaleString()} 🪙
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
        onClick={(e) => { e.stopPropagation(); collectDino(instance.id) }}
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

- [ ] **Step 3: Update `DinoRoaming` to apply level multiplier**

In `src/components/DinoRoaming.tsx`, update the import at line 5:

```ts
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'
```

Change the `Props` interface at line 34:

```ts
interface Props {
  instance: DinoInstance
  onClick: () => void
}
```

Update the component signature at line 41:

```ts
export default function DinoRoaming({ instance, onClick }: Props) {
```

After `const dino = DINO_MAP[instance.dinoId]` (line 42), add:

```ts
const levelMult = dinoProductionMultiplier(instance.level ?? 0)
const effectiveRate = dino.coinsPerHour * levelMult
```

Update the two occurrences of `dino.coinsPerHour` in the `pending` calculations to `effectiveRate`:

Line 45 (initial useState):
```ts
const [pending, setPending] = useState(() =>
  calculatePending(instance.lastCollectedAt, effectiveRate),
)
```

Line 54–57 (useEffect interval):
```ts
const id = setInterval(
  () => setPending(calculatePending(instance.lastCollectedAt, effectiveRate)),
  1000,
)
```

Update the dependency array at line 59:
```ts
}, [instance.lastCollectedAt, effectiveRate])
```

On the `motion.div` (line 93), add `onClick` and `cursor: 'pointer'`:

```tsx
<motion.div
  animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
  transition={{ duration: 5, ease: 'easeInOut' }}
  onClick={onClick}
  className="absolute flex flex-col items-center"
  style={{ transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer' }}
>
```

Update the name tag (around line 128) to show level when > 0:

```tsx
<div style={{
  marginTop: 2,
  padding: '1px 7px',
  borderRadius: 6,
  background: 'rgba(0,0,0,0.5)',
  color: dino.color,
  fontSize: 10,
  fontFamily: 'Inter',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}}>
  {instance.nickname ?? dino.name}
  {(instance.level ?? 0) > 0 && ` Lv.${instance.level}`}
</div>
```

- [ ] **Step 4: Update `DinoPark` total pending to apply yield + level multipliers**

In `src/components/DinoPark.tsx`, update the import at line 5:

```ts
import { calculatePending, dinoProductionMultiplier } from '../utils/gameLogic'
```

Add `yieldUpgradeLevel` to the store reads at lines 92–93:

```ts
const ownedDinos      = useGameStore((s) => s.ownedDinos)
const collectAll      = useGameStore((s) => s.collectAll)
const yieldUpgradeLevel = useGameStore((s) => s.yieldUpgradeLevel)
```

Update the `calc` function inside the useEffect (around line 101–106):

```ts
const calc = () => {
  const yieldMult = 1 + yieldUpgradeLevel * 0.05
  const total = ownedDinos.reduce((sum, d) => {
    const dino = DINO_MAP[d.dinoId]
    const levelMult = dinoProductionMultiplier(d.level ?? 0)
    return sum + Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * yieldMult * levelMult)
  }, 0)
  setTotalPending(total)
}
```

Also update the dependency array of that useEffect:

```ts
}, [ownedDinos, yieldUpgradeLevel])
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/PointsDisplay.tsx src/components/DinoCard.tsx src/components/DinoRoaming.tsx src/components/DinoPark.tsx
git commit -m "feat: propagate dinoProductionMultiplier to all display components"
```

---

## Task 4: Create DinoModal component

**Files:**
- Create: `src/components/DinoModal.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/DinoModal.tsx` with the following content:

```tsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { DINO_MAP, RARITY_LABEL } from '../data/dinosaurs'
import { dinoLevelUpCost, dinoSellPrice, dinoProductionMultiplier } from '../utils/gameLogic'

const RARITY_COLOR: Record<string, string> = {
  common: '#94a3b8',
  rare: '#60a5fa',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

interface Props {
  instanceId: string
  onClose: () => void
}

export default function DinoModal({ instanceId, onClose }: Props) {
  const coins        = useGameStore((s) => s.coins)
  const ownedDinos   = useGameStore((s) => s.ownedDinos)
  const levelUpDino  = useGameStore((s) => s.levelUpDino)
  const sellDino     = useGameStore((s) => s.sellDino)
  const renameDino   = useGameStore((s) => s.renameDino)

  const instance = ownedDinos.find((d) => d.id === instanceId)

  useEffect(() => {
    if (!instance) onClose()
  }, [instance, onClose])

  const [editing, setEditing]       = useState(false)
  const [nameInput, setNameInput]   = useState('')
  const [confirmSell, setConfirmSell] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (instance) {
      setNameInput(instance.nickname ?? DINO_MAP[instance.dinoId]?.name ?? '')
    }
  }, [instanceId]) // only on open

  if (!instance) return null

  const dino      = DINO_MAP[instance.dinoId]
  const level     = instance.level ?? 0
  const levelMult = dinoProductionMultiplier(level)
  const baseRate  = dino.coinsPerHour
  const effectiveRate = Math.round(baseRate * levelMult * 10) / 10
  const cost      = dinoLevelUpCost(dino.rarity, level)
  const sellPrice = dinoSellPrice(dino.rarity, level)
  const canLevelUp = level < 10 && coins >= cost
  const rarityColor = RARITY_COLOR[dino.rarity] ?? '#94a3b8'
  const displayName = instance.nickname ?? dino.name
  const obtainedDate = new Date(instance.obtainedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  const handleStartEdit = () => {
    setNameInput(instance.nickname ?? dino.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const handleRenameCommit = () => {
    setEditing(false)
    renameDino(instanceId, nameInput)
  }

  const handleSell = () => {
    if (confirmSell) {
      sellDino(instanceId)
      onClose()
    } else {
      setConfirmSell(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 p-6 flex flex-col gap-5"
        style={{ background: '#0f1923' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="text-5xl">{dino.emoji}</span>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                ref={inputRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameCommit()
                  if (e.key === 'Escape') { setEditing(false); setNameInput(instance.nickname ?? dino.name) }
                }}
                maxLength={24}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 font-fredoka text-lg font-semibold text-white outline-none focus:border-white/40"
              />
            ) : (
              <button
                onClick={handleStartEdit}
                className="font-fredoka text-xl font-bold text-white hover:text-white/80 transition-colors text-left flex items-center gap-1.5 group"
              >
                {displayName}
                <span className="text-white/30 text-sm group-hover:text-white/60 transition-colors">✏️</span>
              </button>
            )}
            <span
              className="font-inter text-xs font-semibold"
              style={{ color: rarityColor }}
            >
              {RARITY_LABEL[dino.rarity]}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex justify-between items-center">
            <span className="font-inter text-xs text-white/50">Production de base</span>
            <span className="font-fredoka text-sm font-semibold text-white/70">{baseRate} 🪙/h</span>
          </div>
          {level > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-inter text-xs text-white/50">Bonus niveau {level}</span>
              <span className="font-fredoka text-sm font-semibold" style={{ color: rarityColor }}>
                +{Math.round((levelMult - 1) * 100)}%
              </span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-0.5">
            <span className="font-inter text-xs text-white/70 font-medium">Production effective</span>
            <span className="font-fredoka text-base font-bold text-white">{effectiveRate} 🪙/h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-inter text-xs text-white/40">Obtenu le</span>
            <span className="font-inter text-xs text-white/40">{obtainedDate}</span>
          </div>
        </div>

        {/* Level up */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-fredoka text-sm font-semibold text-white/70">
              {level < 10 ? `Niveau ${level} → ${level + 1}` : 'Niveau maximum'}
            </span>
            {level < 10 && (
              <span className="font-inter text-xs text-white/40">
                {cost.toLocaleString()} 🪙
              </span>
            )}
          </div>
          <button
            onClick={() => levelUpDino(instanceId)}
            disabled={!canLevelUp}
            className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-bold transition-all ${
              canLevelUp
                ? 'hover:opacity-90 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
            }`}
            style={canLevelUp ? { background: rarityColor, color: '#0f1923' } : {}}
          >
            {level >= 10
              ? 'Niveau max atteint ⭐'
              : canLevelUp
                ? `⬆ Level up — ${cost.toLocaleString()} 🪙`
                : coins < cost
                  ? `Pas assez de 🪙 (${cost.toLocaleString()} requis)`
                  : `⬆ Level up — ${cost.toLocaleString()} 🪙`}
          </button>
        </div>

        {/* Sell */}
        <button
          onClick={handleSell}
          className={`w-full py-2.5 rounded-xl font-fredoka text-sm font-bold border transition-all cursor-pointer ${
            confirmSell
              ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
          }`}
        >
          {confirmSell
            ? `Confirmer la vente — ${sellPrice.toLocaleString()} 🪙`
            : `Vendre — ${sellPrice.toLocaleString()} 🪙`}
        </button>

        {confirmSell && (
          <button
            onClick={() => setConfirmSell(false)}
            className="text-xs text-white/30 hover:text-white/50 transition-colors text-center -mt-3 cursor-pointer"
          >
            Annuler
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DinoModal.tsx
git commit -m "feat: add DinoModal with rename, stats, level up, sell"
```

---

## Task 5: Wire click trigger in park

**Files:**
- Modify: `src/components/DinoPark.tsx`

- [ ] **Step 1: Add `selectedDinoId` state and `DinoModal` import**

In `src/components/DinoPark.tsx`, add to the imports:

```ts
import { AnimatePresence } from 'framer-motion'  // already imported — check, add if missing
import DinoModal from './DinoModal'
```

`AnimatePresence` is already imported in DinoPark. Just add `DinoModal`.

After the existing state declarations (around line 95–97), add:

```ts
const [selectedDinoId, setSelectedDinoId] = useState<string | null>(null)
```

- [ ] **Step 2: Pass `onClick` to each `DinoRoaming`**

Find the `DinoRoaming` render (around line 214–216):

```tsx
{ownedDinos.map((instance) => (
  <DinoRoaming key={instance.id} instance={instance} />
))}
```

Update to:

```tsx
{ownedDinos.map((instance) => (
  <DinoRoaming
    key={instance.id}
    instance={instance}
    onClick={() => setSelectedDinoId(instance.id)}
  />
))}
```

- [ ] **Step 3: Render `DinoModal` with `AnimatePresence`**

Find the closing `</div>` of the main park container (the last `</div>` before the component's `return` closes, after the `+X animation` block, around line 264). Add just before it:

```tsx
      {/* Dino detail modal */}
      <AnimatePresence>
        {selectedDinoId && (
          <DinoModal
            key={selectedDinoId}
            instanceId={selectedDinoId}
            onClose={() => setSelectedDinoId(null)}
          />
        )}
      </AnimatePresence>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/DinoPark.tsx
git commit -m "feat: wire DinoModal — click roaming dino to open detail panel"
```

---

## Self-Review

**Spec coverage:**
- ✅ Rename dino → `renameDino` action + inline edit in modal
- ✅ View stats → stats section in `DinoModal`
- ✅ Sell → `sellDino` action + two-click confirm
- ✅ Level up → `levelUpDino` action + level button in modal
- ✅ Cost = `baseCost(rarity) × 1.8^level` → `dinoLevelUpCost`
- ✅ Sell price = `basePrice(rarity) + 50% invested` → `dinoSellPrice`
- ✅ +10% production per level → `dinoProductionMultiplier`
- ✅ Level badge on DinoCard and DinoRoaming name tag
- ✅ Multiplier propagated to `collectDino`, `collectAll`, `PointsDisplay`, `DinoPark` total
- ✅ Backward compat: `instance.level ?? 0`, `instance.nickname ?? null`
- ✅ Max level 10 enforced in store guard and UI

**Placeholder scan:** No TBD/TODO. All code blocks complete.

**Type consistency:** `instanceId: string` used uniformly. `DinoInstance.level: number`, `DinoInstance.nickname: string | null` consistent across store, modal, card, roaming.
