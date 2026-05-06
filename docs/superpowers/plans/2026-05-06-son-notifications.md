# Son de fin de timer + Notifications navigateur — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Important:** Do NOT run any git commands (no git add, no git commit).

**Goal:** Jouer un chime Web Audio et afficher une notification navigateur à la fin de chaque phase du timer pomodoro.

**Architecture:** `playDing()` dans `src/utils/sound.ts` génère un chime à deux notes via `AudioContext` avec gestion silencieuse des erreurs. `PomodoroTimer.tsx` appelle `playDing()` et `showNotification()` quand `remaining === 0`, et demande la permission notification au démarrage du timer.

**Tech Stack:** Web Audio API (natif), Web Notifications API (natif), React 18, TypeScript strict

---

## File Map

| Action | File | Responsabilité |
|---|---|---|
| Create | `src/utils/sound.ts` | Fonction `playDing()` — synthèse audio |
| Modify | `src/components/PomodoroTimer.tsx` | Appel playDing + notification à la complétion |

---

## Task 1: Fonction `playDing()`

**Files:**
- Create: `src/utils/sound.ts`

- [ ] **Step 1: Create `src/utils/sound.ts`**

```ts
export function playDing(): void {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    const makeNote = (freq: number, startDelay: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + startDelay)
      gain.gain.setValueAtTime(0, now + startDelay)
      gain.gain.linearRampToValueAtTime(0.5, now + startDelay + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + 0.8)
      osc.start(now + startDelay)
      osc.stop(now + startDelay + 0.8)
    }

    makeNote(880, 0)      // La5
    makeNote(1108, 0.08)  // Do#6 légèrement décalé
  } catch {
    // AudioContext non supporté ou autoplay policy — fail silently
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run tests to ensure nothing broke**

```bash
npx vitest run
```

Expected: All tests pass (unchanged count).

---

## Task 2: Intégrer dans `PomodoroTimer.tsx`

**Files:**
- Modify: `src/components/PomodoroTimer.tsx`

Current file is at `/home/virtualangel/delivery/perso/Pomodocus/src/components/PomodoroTimer.tsx`. Read it before editing.

- [ ] **Step 1: Add `playDing` import**

At the top of `src/components/PomodoroTimer.tsx`, add the import after the existing imports:

```ts
import { playDing } from '../utils/sound'
```

- [ ] **Step 2: Add `showNotification` helper**

Inside the `PomodoroTimer` component, before the `useEffect`, add this helper function:

```ts
const showNotification = (phase: 'work' | 'break') => {
  if (Notification.permission !== 'granted') return
  const body = phase === 'work'
    ? 'Session terminée ! Lance ta pause 🎉'
    : 'Pause terminée ! Retour au travail 💪'
  new Notification('PomoDocus', { body, icon: '/vite.svg' })
}
```

- [ ] **Step 3: Request notification permission on Start**

Find the Start button's `onClick` handler. Currently it calls `isRunning ? pauseTimer : startTimer`. Wrap `startTimer` to also request permission:

Replace the button's onClick:
```tsx
onClick={isRunning ? pauseTimer : () => {
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  startTimer()
}}
```

- [ ] **Step 4: Play sound and send notification on completion**

Find the `tick` function inside the `useEffect`. It currently looks like:

```ts
if (r === 0 && !completedRef.current) {
  completedRef.current = true
  if (pomodoroPhase === 'work') completePomodoro()
  else if (pomodoroPhase === 'break') completeBreak()
}
```

Replace with:

```ts
if (r === 0 && !completedRef.current) {
  completedRef.current = true
  playDing()
  showNotification(pomodoroPhase as 'work' | 'break')
  if (pomodoroPhase === 'work') completePomodoro()
  else if (pomodoroPhase === 'break') completeBreak()
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Run tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 7: Manual test**

Ouvre l'app (`npm run dev`). Lance un timer court (5 min réduit à 1 min via le slider), attends la fin :
- Tu dois entendre un ding à deux notes
- Si tu as accordé la permission, une notification navigateur doit apparaître

---

## Self-Review

**Spec coverage:**
- ✅ Son à la fin du pomodoro ET de la pause → `playDing()` appelé dans les deux cas
- ✅ Web Audio API, fail silently → try/catch
- ✅ Notifications permission demandée au Start → `Notification.requestPermission()`
- ✅ Message différent selon la phase → `showNotification(phase)`
- ✅ Pas d'état Zustand ajouté
- ✅ Pas d'UI supplémentaire

**Placeholder scan:** Aucun TBD. ✓

**Type consistency:** `playDing()` retourne `void`, `showNotification(phase)` prend `'work' | 'break'`. Cast `pomodoroPhase as 'work' | 'break'` nécessaire car le type store inclut `'idle'` mais le guard `r === 0` est atteint seulement quand le timer tourne (pas en idle). ✓
