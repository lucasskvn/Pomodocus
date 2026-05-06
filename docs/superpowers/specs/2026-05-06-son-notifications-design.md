# Son de fin de timer + Notifications navigateur — Design Spec

## Goal

Jouer un son de cloche et afficher une notification navigateur quand le timer pomodoro (travail ou pause) se termine.

---

## Architecture

Deux responsabilités séparées :

1. **`src/utils/sound.ts`** — fonction pure `playDing()` qui génère un chime via Web Audio API
2. **`src/components/PomodoroTimer.tsx`** — appel à `playDing()` et `showNotification()` au moment de la complétion ; demande de permission notification au démarrage du timer

---

## Son — `src/utils/sound.ts`

```ts
export function playDing(): void
```

Implémentation avec `AudioContext` :
- Crée un oscillateur sinusoïdal à 880 Hz (La5) pendant 0.6s
- Enveloppe d'amplitude : attaque instantanée, décroissance exponentielle douce (gain 0 → 0.6 → 0)
- Un second oscillateur à 1108 Hz (Do#6) avec délai de 80ms pour l'harmonie
- Résultat : un ding doux à deux notes, naturellement

Gestion des erreurs : si `AudioContext` n'est pas supporté ou si l'utilisateur n'a pas encore interagi avec la page (autoplay policy), le son échoue silencieusement (try/catch).

---

## Notifications — dans `PomodoroTimer.tsx`

### Demande de permission

Au `onClick` du bouton Start (premier démarrage), si `Notification.permission === 'default'`, appeler `Notification.requestPermission()`. Ne pas bloquer le démarrage du timer si refusé.

### Affichage de la notification

Fonction locale `showNotification(phase: 'work' | 'break')` :
- Vérifie `Notification.permission === 'granted'`
- Work → `new Notification('PomoDocus', { body: 'Session terminée ! Lance ta pause 🎉', icon: '/vite.svg' })`
- Break → `new Notification('PomoDocus', { body: 'Pause terminée ! Retour au travail 💪', icon: '/vite.svg' })`

### Déclenchement

Dans le `tick()` de `PomodoroTimer.tsx`, quand `r === 0 && !completedRef.current` :

```ts
completedRef.current = true
playDing()
showNotification(pomodoroPhase)
if (pomodoroPhase === 'work') completePomodoro()
else if (pomodoroPhase === 'break') completeBreak()
```

---

## Ce qui ne change pas

- Aucun état Zustand ajouté (pas de préférence de son, pas de toggle — fonctionnalité toujours active)
- Aucune UI supplémentaire (pas de bouton mute pour l'instant)
- Aucune dépendance externe

---

## Out of Scope

- Choix du son / volume réglable
- Bouton mute dans l'interface
- Notifications sur mobile (PWA)
