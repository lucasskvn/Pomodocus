# PomoDocus — Design Spec

## Overview

PomoDocus est un Pomodoro timer gamifié. Les sessions de travail et de pause génèrent des **DocusPoints** qui servent à acheter des **œufs de dinosaures**. Les dinos obtenus génèrent des **pièces passives** affichées dans un parc. Toute la persistance est en localStorage, zéro backend.

**Stack :** React + Vite + TypeScript, Tailwind CSS, Zustand, Framer Motion  
**Contraintes :** mobile-first (max-width 430px centré desktop), offline-only

---

## Architecture

Single-page app avec deux vues, naviguation par onglets en bas. Un seul store Zustand (approche monolithique) avec middleware `persist` pour localStorage.

```
src/
├── store/
│   └── useGameStore.ts
├── data/
│   └── dinosaurs.ts
├── components/
│   ├── PomodoroTimer.tsx
│   ├── PointsDisplay.tsx
│   ├── EggShop.tsx
│   ├── EggReveal.tsx
│   ├── DinoCard.tsx
│   └── DinoPark.tsx
├── views/
│   ├── TimerView.tsx
│   └── ParkView.tsx
└── App.tsx
```

---

## Data Model

### Dinosaur (static data)

```ts
interface Dinosaur {
  id: string
  name: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  emoji: string
  coinsPerHour: number   // common: 10-30, rare: 60-120, epic: 300, legendary: 1000
  color: string          // hex couleur de card UI
}
```

**8 dinos minimum :**
- 4 common (ex: Parasaurolophus, Stegosaurus, Ankylosaurus, Triceratops)
- 2 rare (ex: Velociraptor, Spinosaurus)
- 1 epic (ex: T-Rex)
- 1 legendary (ex: Brachiosaurus)

### DinoInstance (owned dino)

```ts
interface DinoInstance {
  id: string             // uuid unique par instance
  dinoId: string         // référence vers Dinosaur.id
  obtainedAt: number     // Date.now() au moment de l'obtention
  lastCollectedAt: number // Date.now() au moment de l'obtention (init), reset à chaque collecte
}
```

Chaque dino a son propre timer indépendant. Le timer démarre dès l'obtention (`lastCollectedAt = obtainedAt`). Les dinos obtenus à des moments différents ne sont jamais synchronisés.

### Store State

```ts
interface GameState {
  docuPoints: number
  coins: number
  ownedDinos: DinoInstance[]
  pomodoroPhase: 'work' | 'break' | 'idle'
  timerStartedAt: number | null   // Date.now() quand le timer est en cours
  remainingAtPause: number | null // ms restants au moment de la pause
  sessionsCompleted: number
  pendingReveal: DinoInstance | null // dino en attente d'affichage dans EggReveal
}
```

---

## Store Actions

### `startTimer()`
- `timerStartedAt = Date.now()`
- Si `remainingAtPause` existe : `timerStartedAt = Date.now() - (duration - remainingAtPause)`, `remainingAtPause = null`
- Sinon : démarre fresh

### `pauseTimer()`
- `remainingAtPause = duration - (Date.now() - timerStartedAt)`
- `timerStartedAt = null`

### `resetTimer()`
- `timerStartedAt = null`, `remainingAtPause = null`, `pomodoroPhase = 'idle'`

### `completePomodoro()`
- `pomodoroPhase = 'break'` (en premier, avant de reset le timer)
- `docuPoints += 15`, `sessionsCompleted++`
- Reset `timerStartedAt = Date.now()`, `remainingAtPause = null` (démarre la pause automatiquement)

### `completeBreak()`
- `docuPoints += 2`, `pomodoroPhase = 'idle'`

### `buyEgg(eggType: 'common' | 'rare' | 'legendary')`
- Vérifie que `docuPoints >= prix`
- Déduit le prix
- Tire un dino selon les probabilités de l'œuf
- Push un nouveau `DinoInstance` dans `ownedDinos` avec `obtainedAt = lastCollectedAt = Date.now()`
- `pendingReveal = DinoInstance` créé (le composant `EggReveal` observe ce champ pour s'afficher)

### `clearReveal()`
- `pendingReveal = null` (appelé quand l'utilisateur ferme le modal EggReveal)

### `collectDino(instanceId: string)`
- Calcule `elapsed = Date.now() - lastCollectedAt`
- `pending = Math.min(elapsed * coinsPerHour / 3600000, 10 * coinsPerHour)`
- `coins += Math.floor(pending)`
- `lastCollectedAt = Date.now()`

---

## Timer Behavior

Le timer utilise `Date.now()` comme source de vérité, pas un compteur incrémental. Le `setInterval` (1s) sert uniquement à déclencher des re-renders UI.

**Calcul du temps restant :**
```
remaining = duration - (Date.now() - timerStartedAt)
```

**Durées :**
- Phase work : 25 min (1 500 000 ms)
- Phase break : 5 min (300 000 ms)

**Rechargement de page :**
- Si `timerStartedAt` est non-null en localStorage, le timer reprend automatiquement
- Si `remaining <= 0` au chargement, la phase se complète immédiatement

**Transitions de phase :**
- Fin work → `completePomodoro()` → démarre automatiquement la pause
- Fin break → `completeBreak()` → `idle` (pas de redémarrage auto)

---

## Egg Shop

| Œuf | Prix | common | rare | epic | legendary |
|-----|------|--------|------|------|-----------|
| 🥚 Commun | 15 pts | 70% | 25% | 5% | 0% |
| 🪺 Rare | 40 pts | 20% | 55% | 20% | 5% |
| 💎 Légendaire | 100 pts | 0% | 30% | 50% | 20% |

---

## Passive Income

- Plafond par dino : `10 * coinsPerHour` pièces (équivalent 10h de production)
- Quand le plafond est atteint, la production s'arrête (icône cadenas)
- Pièces en attente affichées en temps réel côté UI (calcul local au composant, pas dans le store)
- Bouton **Collecter** individuel par `DinoCard` → appelle `collectDino(instanceId)`

---

## Components

### `PomodoroTimer`
- Cercle SVG de progression
- Affichage `MM:SS`
- Badge phase (TRAVAIL / PAUSE)
- Compteur sessions
- Boutons Start / Pause / Reset

### `PointsDisplay`
- Header fixe
- DocusPoints (mis à jour depuis le store)
- Coins (calculé localement chaque seconde, somme des pending de tous les dinos)

### `EggShop`
- 3 cartes : prix, probabilités, emoji
- Bouton grisé + cursor disabled si `docuPoints < prix`

### `EggReveal`
- Modal Framer Motion (overlay sombre)
- Fond coloré selon rareté
- Emoji géant + nom + rareté
- Animation shake/crack d'œuf avant révélation
- Bouton "Ajouter au parc"

### `DinoCard`
- Emoji géant, nom, rareté, coins/h
- Pièces en attente (calculées localement)
- Barre de progression vers le plafond 10h
- Bouton Collecter ou icône 🔒 si plein

### `DinoPark`
- Grille CSS responsive
- Message vide encourageant si `ownedDinos.length === 0`

---

## Navigation

Deux onglets fixes en bas :
- 🍅 **Timer** → `TimerView` (timer + egg shop)
- 🦕 **Parc** → `ParkView` (grille dinos)

---

## Design System

| Élément | Valeur |
|---------|--------|
| Fond | `#0f1923` |
| Accent vert | `#4ade80` |
| Accent ambre | `#fbbf24` |
| Font titres | Fredoka (Google Fonts) |
| Font corps | Inter |
| Common | `#94a3b8` |
| Rare | `#60a5fa` |
| Epic | `#a855f7` |
| Legendary | `#f59e0b` |

Animations Framer Motion sur : ouverture d'œuf, apparition des dinos dans le parc, feedback de collecte de pièces.
