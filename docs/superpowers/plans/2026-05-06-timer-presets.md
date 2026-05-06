# Timer Presets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Important:** Do NOT run any git commands (no git add, no git commit).

**Goal:** Permettre à l'utilisateur d'appliquer des presets de timer (3 builtin + 3 slots custom nommés) depuis le panneau TimerSettings.

**Architecture:** `TimerPreset` type + champ `presets` + 3 actions ajoutés au store Zustand. `TimerSettings.tsx` étendu avec une section presets en bas : chips builtin + slots custom avec formulaire inline pour créer/supprimer.

**Tech Stack:** React 18, TypeScript strict, Zustand 4 (persist)

---

## File Map

| Action | Fichier |
|---|---|
| Modify | `src/store/useGameStore.ts` — type `TimerPreset`, champ `presets`, actions `applyPreset`/`saveCustomPreset`/`deleteCustomPreset` |
| Modify | `src/components/TimerSettings.tsx` — section presets avec chips et formulaire inline |

---

## Task 1: Étendre le store avec les presets

**Files:**
- Modify: `src/store/useGameStore.ts`

Read the file before editing: `/home/virtualangel/delivery/perso/Pomodocus/src/store/useGameStore.ts`

- [ ] **Step 1: Ajouter l'interface `TimerPreset` et l'exporter**

Juste avant `export interface DinoInstance` (en haut du fichier), ajouter :

```ts
export interface TimerPreset {
  id: string
  name: string
  workMinutes: number
  breakMinutes: number
  builtin?: true
}
```

- [ ] **Step 2: Ajouter `presets` dans `GameState`**

Dans l'interface `GameState`, après `yieldUpgradeLevel: number`, ajouter :

```ts
  presets: TimerPreset[]
```

- [ ] **Step 3: Ajouter les 3 actions dans `GameActions`**

Dans l'interface `GameActions`, après `buyYieldUpgrade: () => void`, ajouter :

```ts
  applyPreset: (id: string) => void
  saveCustomPreset: (slot: 0 | 1 | 2, name: string, workMinutes: number, breakMinutes: number) => void
  deleteCustomPreset: (slot: 0 | 1 | 2) => void
```

- [ ] **Step 4: Ajouter la valeur initiale de `presets` dans le store**

Dans le corps du store (`(set, get) => ({`), après `yieldUpgradeLevel: 0,`, ajouter :

```ts
      presets: [
        { id: 'classic',  name: 'Classique', workMinutes: 25, breakMinutes: 5,  builtin: true },
        { id: 'deepwork', name: 'Deep Work', workMinutes: 50, breakMinutes: 10, builtin: true },
        { id: 'sprint',   name: 'Sprint',    workMinutes: 15, breakMinutes: 3,  builtin: true },
        { id: 'custom-0', name: '',          workMinutes: 25, breakMinutes: 5  },
        { id: 'custom-1', name: '',          workMinutes: 25, breakMinutes: 5  },
        { id: 'custom-2', name: '',          workMinutes: 25, breakMinutes: 5  },
      ],
```

- [ ] **Step 5: Implémenter les 3 nouvelles actions**

Après l'action `buyYieldUpgrade` et avant `cheat`, ajouter :

```ts
      applyPreset: (id: string) => {
        const { presets, pomodoroPhase } = get()
        if (pomodoroPhase !== 'idle') return
        const preset = presets.find((p) => p.id === id)
        if (!preset) return
        set({
          workMinutes: Math.max(5, Math.min(90, preset.workMinutes)),
          breakMinutes: Math.max(1, Math.min(30, preset.breakMinutes)),
        })
      },

      saveCustomPreset: (slot: 0 | 1 | 2, name: string, workMinutes: number, breakMinutes: number) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((s) => ({
          presets: s.presets.map((p, i) =>
            i === 3 + slot ? { ...p, name: trimmed, workMinutes, breakMinutes } : p,
          ),
        }))
      },

      deleteCustomPreset: (slot: 0 | 1 | 2) => {
        set((s) => ({
          presets: s.presets.map((p, i) =>
            i === 3 + slot
              ? { id: `custom-${slot}`, name: '', workMinutes: 25, breakMinutes: 5 }
              : p,
          ),
        }))
      },
```

- [ ] **Step 6: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Vérifier les tests**

```bash
npx vitest run
```

Expected: All tests pass.

---

## Task 2: Section presets dans TimerSettings.tsx

**Files:**
- Modify: `src/components/TimerSettings.tsx`

Read the file before editing: `/home/virtualangel/delivery/perso/Pomodocus/src/components/TimerSettings.tsx`

- [ ] **Step 1: Remplacer le contenu entier de `TimerSettings.tsx`**

```tsx
import { useState } from 'react'
import { useGameStore, type TimerPreset } from '../store/useGameStore'
import { workReward, breakReward } from '../utils/gameLogic'

export default function TimerSettings() {
  const workMinutes      = useGameStore((s) => s.workMinutes)
  const breakMinutes     = useGameStore((s) => s.breakMinutes)
  const pomodoroPhase    = useGameStore((s) => s.pomodoroPhase)
  const presets          = useGameStore((s) => s.presets)
  const setWorkMinutes   = useGameStore((s) => s.setWorkMinutes)
  const setBreakMinutes  = useGameStore((s) => s.setBreakMinutes)
  const applyPreset      = useGameStore((s) => s.applyPreset)
  const saveCustomPreset = useGameStore((s) => s.saveCustomPreset)
  const deleteCustomPreset = useGameStore((s) => s.deleteCustomPreset)

  const isIdle = pomodoroPhase === 'idle'
  const [editingSlot, setEditingSlot] = useState<0 | 1 | 2 | null>(null)
  const [editingName, setEditingName] = useState('')

  const builtinPresets = presets.slice(0, 3)
  const customSlots    = presets.slice(3)

  const isActive = (p: TimerPreset) =>
    p.workMinutes === workMinutes && p.breakMinutes === breakMinutes

  const handleSave = (slot: 0 | 1 | 2) => {
    if (!editingName.trim()) return
    saveCustomPreset(slot, editingName, workMinutes, breakMinutes)
    setEditingSlot(null)
    setEditingName('')
  }

  const handleCancel = () => {
    setEditingSlot(null)
    setEditingName('')
  }

  return (
    <div className="flex flex-col gap-5 px-3 py-6 justify-center w-full">

      {/* Travail */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Travail
        </span>
        <span className="font-fredoka text-accent-green text-lg font-bold leading-none">
          {workMinutes} min
        </span>
        <input
          type="range" min={5} max={90} step={5}
          value={workMinutes} disabled={!isIdle}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          className="w-full accent-accent-green disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-accent-green">
          +{workReward(workMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      {/* Pause */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Pause
        </span>
        <span className="font-fredoka text-[#60a5fa] text-lg font-bold leading-none">
          {breakMinutes} min
        </span>
        <input
          type="range" min={1} max={30} step={1}
          value={breakMinutes} disabled={!isIdle}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-full accent-[#60a5fa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-[#60a5fa]">
          +{breakReward(breakMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Presets
        </span>

        {/* Builtin */}
        <div className="flex flex-col gap-1">
          {builtinPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => isIdle && applyPreset(preset.id)}
              disabled={!isIdle}
              className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
                isActive(preset)
                  ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                  : isIdle
                  ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {preset.name}
              <span className="text-white/40 font-inter font-normal ml-1 text-[10px]">
                {preset.workMinutes}/{preset.breakMinutes}
              </span>
            </button>
          ))}
        </div>

        {/* Custom slots */}
        <div className="flex flex-col gap-1 mt-1">
          {customSlots.map((slot, i) => {
            const slotIndex = i as 0 | 1 | 2
            const isEmpty   = slot.name === ''
            const isEditing = editingSlot === slotIndex

            if (isEditing) {
              return (
                <div key={slot.id} className="flex flex-col gap-1">
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(slotIndex)
                      if (e.key === 'Escape') handleCancel()
                    }}
                    maxLength={16}
                    placeholder="Nom..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 font-fredoka text-xs text-white outline-none focus:border-accent-green"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSave(slotIndex)}
                      disabled={!editingName.trim()}
                      className="flex-1 py-1 rounded-lg font-fredoka text-xs font-semibold bg-accent-green/20 border border-accent-green text-accent-green disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-1 rounded-lg font-fredoka text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            }

            if (isEmpty) {
              return (
                <button
                  key={slot.id}
                  onClick={() => { if (isIdle) { setEditingSlot(slotIndex); setEditingName('') } }}
                  disabled={!isIdle}
                  className="w-full px-2 py-1.5 rounded-lg font-fredoka text-xs text-white/30 border border-dashed border-white/15 hover:border-white/30 hover:text-white/50 transition-all disabled:cursor-not-allowed cursor-pointer"
                >
                  + Sauvegarder
                </button>
              )
            }

            return (
              <div key={slot.id} className="flex items-center gap-1">
                <button
                  onClick={() => isIdle && applyPreset(slot.id)}
                  disabled={!isIdle}
                  className={`flex-1 text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
                    isActive(slot)
                      ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                      : isIdle
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {slot.name}
                </button>
                <button
                  onClick={() => isIdle && deleteCustomPreset(slotIndex)}
                  disabled={!isIdle}
                  className="text-white/30 hover:text-red-400 transition-colors text-xs disabled:cursor-not-allowed cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Vérifier les tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Test manuel**

Lance l'app (`npm run dev`), ouvre le panneau réglages à gauche :
- Les 3 presets builtin apparaissent (Classique, Deep Work, Sprint)
- Clic "Deep Work" → sliders passent à 50/10, chip s'active (vert)
- Clic "+ Sauvegarder" sur un slot vide → champ de nom apparaît
- Saisir un nom, Entrée → slot rempli avec chip
- Clic sur la chip → config appliquée
- Clic ✕ → slot redevient vide
- Timer en cours → tous les boutons désactivés

---

## Self-Review

**Spec coverage:**
- ✅ 3 presets builtin (Classique 25/5, Deep Work 50/10, Sprint 15/3)
- ✅ 3 slots custom (vide = `name === ''`)
- ✅ `applyPreset` respecte `pomodoroPhase === 'idle'` + clamping
- ✅ `saveCustomPreset` guard `name.trim()` non vide
- ✅ `deleteCustomPreset` remet les valeurs par défaut
- ✅ Formulaire inline avec autoFocus, Enter/Escape, boutons ✓/✕
- ✅ Un seul slot en édition à la fois (`editingSlot` state)
- ✅ Chip active = border accent-green quand work+break correspondent aux sliders
- ✅ Section désactivée quand timer en cours

**Placeholder scan:** Aucun TBD. ✓

**Type consistency:** `TimerPreset` exporté depuis store, importé dans TimerSettings. `slot: 0 | 1 | 2` cohérent entre actions et UI. ✓
