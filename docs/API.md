# Documentation API & Store

Documentation de l'état global et des fonctions utilitaires de Pomodocus.

## 🏪 Zustand Store

Le store principal se trouve dans `src/store/useGameStore.ts`.

### État Principal

```typescript
interface GameState {
  // Timer
  timerState: 'idle' | 'running' | 'paused';
  timeRemaining: number;           // en secondes
  sessionDuration: number;         // session Pomodoro (défaut: 1500s = 25min)
  breakDuration: number;           // pause (défaut: 300s = 5min)
  
  // Points & énergie
  points: number;                  // DocusPoints
  totalSessionsCompleted: number;  // nombre de sessions complétées
  
  // Dinosaures
  dinosaurs: Dinosaur[];           // collection personnelle
  revealingDinosaurId: string | null; // pour animation de révélation
  
  // Configuration
  soundEnabled: boolean;           // son activé/désactivé
}
```

### Actions principales

#### Timer

```typescript
startTimer()
// Démarre le timer. Le timer utilise Date.now() comme source de vérité

pauseTimer()
// Met en pause le timer en cours

resetTimer()
// Réinitialise le timer et l'état

completeSession()
// Signale la fin d'une session (ajoute des points)
```

#### Dinosaures

```typescript
purchaseDinosaur(id: string, rarity: 'common' | 'rare' | 'epic')
// Achète un dinosaure si l'utilisateur a assez de points
// Lance la révélation du dinosaure acheté

collectCoins(dinosaurId: string)
// Collecte les pièces générées par un dinosaure
// Consomme les coins générés en arrière-plan

addDinosaur(dinosaur: Dinosaur)
// Ajoute un dinosaure à la collection

removeDinosaur(id: string)
// Retire un dinosaure de la collection
```

#### Points & Récompenses

```typescript
addPoints(amount: number)
// Ajoute des points au total

subtractPoints(amount: number)
// Soustrait des points

setRevealingDinosaur(dinoId: string | null)
// Configure quel dinosaure afficher en révélation
```

#### Configuration

```typescript
updateSessionDuration(seconds: number)
// Met à jour la durée d'une session Pomodoro

updateBreakDuration(seconds: number)
// Met à jour la durée d'une pause

toggleSound()
// Active/désactive le son
```

### Exemple d'utilisation

```typescript
import { useGameStore } from '@/store/useGameStore'

function MyComponent() {
  const points = useGameStore((state) => state.points)
  const dinosaurs = useGameStore((state) => state.dinosaurs)
  const addPoints = useGameStore((state) => state.addPoints)
  
  return (
    <div>
      <p>Points: {points}</p>
      <p>Dinosaurs: {dinosaurs.length}</p>
      <button onClick={() => addPoints(10)}>Ajouter 10 points</button>
    </div>
  )
}
```

### Persistance

L'état est automatiquement sauvegardé dans le localStorage via le middleware `persist` de Zustand.

```typescript
// localStorage key: 'game-store'
// L'état est restauré au chargement
```

---

## 🎮 Logique du Jeu

Les fonctions pures de logique métier se trouvent dans `src/utils/gameLogic.ts`.

### Fonctions disponibles

#### `formatTime(seconds: number): string`

Formate des secondes en `MM:SS`.

```typescript
formatTime(150)  // "02:30"
formatTime(0)    // "00:00"
```

#### `getRemaining(startTime: number, duration: number): number`

Calcule le temps restant basé sur `Date.now()`.

```typescript
const startTime = Date.now()
const remaining = getRemaining(startTime, 1500) // temps restant en secondes
```

#### `calculatePendingCoins(dinosaurs: Dinosaur[]): Map<string, number>`

Calcule les pièces en attente pour chaque dinosaure basé sur leur dernier collecte.

```typescript
const pending = calculatePendingCoins(dinosaurs)
const coinsForDino1 = pending.get('dino-1') // nombre de pièces
```

#### `rollRarity(): 'common' | 'rare' | 'epic'`

Détermine la rareté aléatoire d'un dinosaure acheté (avec probabilités).

```typescript
const rarity = rollRarity()
```

---

## 🦖 Types de données

### Dinosaur

```typescript
interface Dinosaur {
  id: string;                          // identifiant unique
  name: string;                        // nom du dinosaure
  rarity: 'common' | 'rare' | 'epic';  // rareté
  price: number;                       // prix en points
  spriteComponent: React.ComponentType; // composant React du sprite
  coinsPerMinute: number;              // générateur passif
  lastCollected: number;               // timestamp de la dernière collecte
  pendingCoins: number;                // pièces non collectées
}
```

### Rareté et prix

| Rareté | Probabilité | Prix (points) |
|--------|-------------|---------------|
| common | 60%         | 50            |
| rare   | 30%         | 150           |
| epic   | 10%         | 500           |

---

## ⏱️ Timers et Sessions

### Durées par défaut

- **Session Pomodoro** : 25 minutes (1500 secondes)
- **Pause courte** : 5 minutes (300 secondes)
- **Points par session complétée** : 10 points

### Source de vérité du timer

Le timer utilise `Date.now()` pour éviter les dérives dues à `setInterval`. Cela garantit l'exactitude même si l'utilisateur change d'onglet.

---

## 📊 Statistiques et Données

### Points accumulés

- 10 points par session Pomodoro complétée
- Points sauvegardés dans le localStorage

### Collecte de pièces

- Chaque dinosaure génère un certain nombre de pièces par minute
- Les pièces sont calculées à la demande quand l'utilisateur les collecte

---

## 🔧 Éxensions et Customisation

### Ajouter un nouveau dinosaure

1. Créez le composant sprite : `src/sprites/DinoNewDino.tsx`
2. Ajoutez à `src/data/dinosaurs.ts` :

```typescript
{
  id: 'dino-new',
  name: 'New Dinosaur',
  rarity: 'common',
  price: 50,
  spriteComponent: DinoNewDino,
  coinsPerMinute: 1,
  lastCollected: Date.now(),
  pendingCoins: 0,
}
```

### Modifier les durées des sessions

Dans le composant `TimerSettings.tsx`, modifiez les sliders pour changer les durées.

### Ajouter une nouvelle action au store

```typescript
// Dans useGameStore.ts
{
  myNewAction: (param) => set((state) => ({
    // votre logique
  })),
}
```

---

## 🧪 Tests

### Tester la logique du jeu

Les fonctions de `gameLogic.ts` sont testées dans `gameLogic.test.ts`.

```bash
npm test
```

### Exemple de test

```typescript
import { formatTime } from '@/utils/gameLogic'

test('formatTime formate correctement', () => {
  expect(formatTime(150)).toBe('02:30')
  expect(formatTime(0)).toBe('00:00')
})
```

---

## 💾 Sauvegarde et localStorage

L'état complet est sauvegardé automatiquement dans le localStorage sous la clé `game-store`.

```javascript
// Accés direct (dans la console du navigateur)
JSON.parse(localStorage.getItem('game-store'))
```

### Réinitialiser les données

```javascript
localStorage.removeItem('game-store')
// Rechargez la page
```

---

## 🔗 Liens utiles

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Besoin d'aide ?** Consultez le [Guide du Développeur](DEVELOPER.md) ou ouvrez une issue.
