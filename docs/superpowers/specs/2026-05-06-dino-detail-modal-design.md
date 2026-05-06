# Dino Detail Modal — Design Spec

## Goal

Allow players to click on any dinosaur in the park to open a modal where they can rename it, view its stats, level it up (spending coins to increase its individual production rate), and sell it.

---

## Data Model

### `DinoInstance` (extend existing interface in `src/store/useGameStore.ts`)

```ts
export interface DinoInstance {
  id: string
  dinoId: string
  obtainedAt: number
  lastCollectedAt: number
  level: number         // 0–10, default 0
  nickname: string | null  // null = display dino's base name
}
```

All existing instances in localStorage lack these fields; they must be read with safe defaults (`level ?? 0`, `nickname ?? null`).

---

## Pure Functions (`src/utils/gameLogic.ts`)

### `dinoLevelUpCost(rarity, level)`

Cost to go from `level` to `level + 1`:

```
baseCost(rarity) × 1.8^level
```

Base costs by rarity:
- `'common'`   → 200 🪙
- `'rare'`     → 500 🪙
- `'epic'`     → 1 200 🪙
- `'legendary'`→ 3 000 🪙

Returns `Infinity` when `level >= 10` (max level reached).

### `dinoSellPrice(rarity, level)`

```
basePrice(rarity) + 50% of total coins spent on level-ups
```

Base sell prices:
- `'common'`   → 50 🪙
- `'rare'`     → 150 🪙
- `'epic'`     → 400 🪙
- `'legendary'`→ 1 000 🪙

Total coins invested = sum of `dinoLevelUpCost(rarity, i)` for i in 0..level-1.

### `dinoProductionMultiplier(level)`

```
1 + level * 0.10
```

Level 0 → ×1.0, level 5 → ×1.5, level 10 → ×2.0.

---

## Store Actions (`src/store/useGameStore.ts`)

Three new actions:

| Action | Logic |
|---|---|
| `levelUpDino(instanceId)` | Guards: find instance, check `level < 10`, check `coins >= cost`. Deducts cost, increments `level`. |
| `sellDino(instanceId)` | Adds sell price to `coins`, removes instance from `ownedDinos`. Closes modal via `pendingReveal` pattern (caller sets `selectedDinoId` to null). |
| `renameDino(instanceId, name)` | Sets `nickname` to trimmed string or `null` if empty. |

---

## Production Multiplier — Propagation

Every place that reads `dino.coinsPerHour` must apply both multipliers:

```
effectiveRate = dino.coinsPerHour
              × dinoProductionMultiplier(instance.level)
              × (1 + yieldUpgradeLevel * 0.05)
```

Affected locations:
- `collectDino` in store
- `collectAll` in store
- `PointsDisplay` live preview
- `DinoCard` progress bar and displayed rate

---

## Components

### `DinoModal` (`src/components/DinoModal.tsx`)

Props:
```ts
interface DinoModalProps {
  instanceId: string
  onClose: () => void
}
```

Layout (full-screen overlay, dark backdrop, centered card):

```
┌─────────────────────────────────┐
│  [×]                            │
│                                 │
│  🦕  [nom / surnom éditable]    │
│       ✦ Légendaire              │
│                                 │
│  Production de base  12 🪙/h   │
│  Bonus niveau (+30%) 15.6 🪙/h │
│  Collecté depuis obtention 234 🪙│
│                                 │
│  ⬆ Monter au niveau 4          │
│    Coût : 1 166 🪙              │
│    [LEVEL UP]  (grisé si broke) │
│                                 │
│  [VENDRE — 230 🪙]             │
│    → confirmation inline        │
└─────────────────────────────────┘
```

**Rename:** clicking the name text replaces it with an `<input>`. On blur or Enter → `renameDino(instanceId, value)`.

**Level up button:** disabled when `coins < cost` or `level >= 10`. Shows "Niveau max" text at level 10.

**Sell:** first click changes button to "Confirmer la vente — 230 🪙" (red). Second click calls `sellDino` and `onClose`.

**Animation:** Framer Motion `AnimatePresence` → `opacity 0→1`, `scale 0.9→1`.

### `DinoPark` (modify `src/components/DinoPark.tsx`)

Add state:
```ts
const [selectedDinoId, setSelectedDinoId] = useState<string | null>(null)
```

Wrap `DinoCard` click: `onClick={() => setSelectedDinoId(d.id)}`.

Render at bottom (outside grid):
```tsx
<AnimatePresence>
  {selectedDinoId && (
    <DinoModal instanceId={selectedDinoId} onClose={() => setSelectedDinoId(null)} />
  )}
</AnimatePresence>
```

### `DinoCard` (modify `src/components/DinoCard.tsx`)

- Add `onClick` prop
- Display level badge if `level > 0`: small `Lv.3` chip on the card
- Apply `dinoProductionMultiplier(instance.level)` to displayed rate and progress bar

---

## Migration / Backward Compatibility

On first load, existing `DinoInstance` records from localStorage lack `level` and `nickname`. All reads must use:
```ts
instance.level ?? 0
instance.nickname ?? null
```

No explicit migration needed — Zustand `persist` will merge partial state.

---

## Testing

Pure functions to test in `src/utils/gameLogic.test.ts`:
- `dinoLevelUpCost` at level 0, 5, 10 for each rarity
- `dinoSellPrice` at level 0 and level 3
- `dinoProductionMultiplier` at 0, 5, 10

Store actions tested via existing store test patterns (if any) or inline logic verification.

---

## Out of Scope

- XP bar / experience system (different from direct level-up)
- Dino evolution / skin changes at max level
- Sorting/filtering park by level
