# Timer Settings — Design Spec
Date: 2026-05-06

## Objectif

Permettre à l'utilisateur de configurer les durées de travail (5–90 min) et de pause (1–30 min) via un panneau de réglages affiché à gauche du timer. Le gain en DocuPoints est proportionnel à la durée choisie selon une fonction puissance à rendements décroissants.

---

## Formule de récompense

Fonction puissance avec exposant 0.65 :

```ts
workReward(minutes)  = Math.round(15 * Math.pow(minutes / 25, 0.65))
breakReward(minutes) = Math.round(2  * Math.pow(minutes / 5,  0.65))
```

Exemples travail :
- 5 min → 5 pts
- 15 min → 10 pts
- 25 min → 15 pts (baseline)
- 45 min → 23 pts
- 60 min → 28 pts
- 90 min → 36 pts

Exemples pause :
- 1 min → 1 pt
- 5 min → 2 pts (baseline)
- 15 min → 4 pts
- 30 min → 7 pts

Les deux fonctions sont exportées depuis `src/utils/gameLogic.ts` comme fonctions pures testables.

---

## Store (useGameStore.ts)

### Nouvelles valeurs d'état persistées

```ts
workMinutes: number   // défaut : 25
breakMinutes: number  // défaut : 5
```

### Nouvelles actions

```ts
setWorkMinutes(m: number): void   // bloqué si pomodoroPhase !== 'idle'
setBreakMinutes(m: number): void  // bloqué si pomodoroPhase !== 'idle'
```

### Remplacement des constantes fixes

`WORK_DURATION` et `BREAK_DURATION` (constantes module exportées) sont supprimées. Partout où elles étaient utilisées, on lit directement `get().workMinutes * 60 * 1000` et `get().breakMinutes * 60 * 1000`.

### completePomodoro / completeBreak

Utilisent `workMinutes` / `breakMinutes` du state au moment de l'appel pour calculer le gain via `workReward()` / `breakReward()`.

---

## Composant TimerSettings

**Fichier :** `src/components/TimerSettings.tsx`

### Contenu (panneau ~130px de large)

```
TRAVAIL
[valeur] min
[slider 5–90]
+N pts

───────────

PAUSE
[valeur] min
[slider 1–30]
+N pts
```

- Les deux sliders sont `disabled` quand `pomodoroPhase !== 'idle'`.
- Le gain prévu est recalculé à chaque changement de slider via `workReward()` / `breakReward()`.
- Appelle `setWorkMinutes` / `setBreakMinutes` au `onChange` du slider.

---

## Layout TimerView

```tsx
<div className="flex min-h-full">
  <TimerSettings />                    {/* ~130px */}
  <div className="flex-1">             {/* timer centré */}
    <PomodoroTimer />
  </div>
  <div style={{ width: '340px' }}>     {/* boutique */}
    <EggShop />
  </div>
</div>
```

---

## Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `src/utils/gameLogic.ts` | +`workReward()`, +`breakReward()` |
| `src/utils/gameLogic.test.ts` | +tests pour les deux fonctions |
| `src/store/useGameStore.ts` | +`workMinutes`, +`breakMinutes`, +setters, refactor `completePomodoro`/`completeBreak`, `startTimer`, `pauseTimer` |
| `src/components/TimerSettings.tsx` | nouveau composant |
| `src/components/PomodoroTimer.tsx` | remplace imports `WORK_DURATION`/`BREAK_DURATION` par lecture du store (`workMinutes`, `breakMinutes`) |
| `src/views/TimerView.tsx` | intègre `<TimerSettings />` à gauche |

---

## Ce qui ne change pas

- La mécanique de pause/resume du timer est inchangée.
- L'EggShop, le parc, et les dinos ne sont pas affectés.
- La structure de `DinoInstance` est inchangée.
