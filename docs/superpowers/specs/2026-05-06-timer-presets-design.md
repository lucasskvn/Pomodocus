# Timer Presets — Design Spec

## Goal

Permettre à l'utilisateur d'appliquer rapidement des configurations de timer prédéfinies ou personnalisées (3 presets builtin + 3 slots custom nommés) depuis le panneau TimerSettings.

---

## Data Model

### `TimerPreset` (nouveau type dans `src/store/useGameStore.ts`)

```ts
export interface TimerPreset {
  id: string
  name: string
  workMinutes: number
  breakMinutes: number
  builtin?: true
}
```

### Nouveaux champs dans `GameState`

```ts
presets: TimerPreset[]
```

Valeur initiale (presets builtin + 3 slots vides) :

```ts
presets: [
  { id: 'classic',  name: 'Classique', workMinutes: 25, breakMinutes: 5,  builtin: true },
  { id: 'deepwork', name: 'Deep Work', workMinutes: 50, breakMinutes: 10, builtin: true },
  { id: 'sprint',   name: 'Sprint',    workMinutes: 15, breakMinutes: 3,  builtin: true },
  { id: 'custom-0', name: '',          workMinutes: 25, breakMinutes: 5  },
  { id: 'custom-1', name: '',          workMinutes: 25, breakMinutes: 5  },
  { id: 'custom-2', name: '',          workMinutes: 25, breakMinutes: 5  },
]
```

Un slot custom est considéré **vide** si `name === ''`.

### Nouvelles actions dans `GameActions`

```ts
applyPreset: (id: string) => void
saveCustomPreset: (slot: 0 | 1 | 2, name: string, workMinutes: number, breakMinutes: number) => void
deleteCustomPreset: (slot: 0 | 1 | 2) => void
```

**`applyPreset`** : trouve le preset par id, appelle `setWorkMinutes` + `setBreakMinutes` (respecte le guard `pomodoroPhase === 'idle'`).

**`saveCustomPreset`** : met à jour `presets[3 + slot]` avec name/workMinutes/breakMinutes. Guard : `name.trim()` non vide.

**`deleteCustomPreset`** : remet `presets[3 + slot]` à `{ name: '', workMinutes: 25, breakMinutes: 5 }`.

---

## UI — section Presets dans `TimerSettings.tsx`

Ajoutée en bas du panel après le séparateur, **uniquement quand `isIdle`** (disabled sinon).

### Presets builtin (3 chips)

```
[Classique]  [Deep Work]  [Sprint]
```

Chips cliquables (fond blanc/5, border white/10). Le preset actif (work + break correspondent aux sliders) est mis en évidence (border accent-green).

### Slots custom (3 slots)

Chaque slot est soit :

**Vide** → bouton `+` grisé avec tooltip "Sauvegarder la config actuelle". Clic → affiche mini-formulaire inline.

**Rempli** → chip avec nom + icône `✕`. Clic sur la chip → applique. Clic sur `✕` → supprime (redevient vide).

### Mini-formulaire inline (slot vide → clic `+`)

```
[___nom___] [Sauvegarder]  [Annuler]
```

- Input pré-focalisé, maxLength=16
- Durées = valeurs actuelles des sliders (pas d'édition dans le formulaire)
- Sauvegarder désactivé si nom vide
- Escape ou Annuler = ferme sans sauvegarder

Un seul formulaire ouvert à la fois (state local `editingSlot: 0|1|2|null`).

---

## Fichiers modifiés

| Action | Fichier |
|---|---|
| Modify | `src/store/useGameStore.ts` — `TimerPreset` type, champ `presets`, 3 actions |
| Modify | `src/components/TimerSettings.tsx` — section presets en bas |

---

## Tests

Fonctions pures à tester dans `gameLogic.test.ts` si applicable. Les actions store sont simples (pas de logique complexe) — vérification via TypeScript + test manuel.

Test manuel :
1. Cliquer "Deep Work" → sliders passent à 50/10
2. Cliquer `+` sur slot vide, nommer "Perso", sauvegarder → chip apparaît
3. Cliquer chip "Perso" → sliders appliqués
4. Cliquer `✕` → chip redevient `+`
5. Timer en cours → section presets désactivée

---

## Out of Scope

- Réordonner les presets (drag & drop)
- Modifier un preset builtin
- Plus de 3 slots custom
- Éditer un preset custom existant (supprimer + recréer)
