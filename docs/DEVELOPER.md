# Guide du Développeur

Ce guide vous aide à configurer votre environnement et à démarrer le développement sur Pomodocus.

## 📋 Prérequis

- **Node.js** : v16 ou supérieur (v18+ recommandé)
- **npm** : v7 ou supérieur (inclus avec Node.js)
- **Git** : Pour cloner le projet

Vérifiez votre installation :
```bash
node --version
npm --version
```

## 🔧 Installation de l'environnement

### 1. Cloner le repository

```bash
git clone https://github.com/lucasskvn/Pomodocus.git
cd Pomodocus
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application s'ouvrira sur `http://localhost:5173` avec le hot reload activé.

## 💻 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Compile TypeScript et crée la build |
| `npm run preview` | Prévisualise la version buildée |
| `npm test` | Exécute les tests Vitest |

## 🗂️ Navigation dans le code

### Points d'entrée

- `index.html` - Fichier HTML principal
- `src/main.tsx` - Point d'entrée React
- `src/App.tsx` - Composant racine

### Dossiers clés

| Dossier | Contenu |
|---------|---------|
| `src/components/` | Composants réutilisables (Timer, Shop, etc.) |
| `src/views/` | Pages principales (TimerView, ParkView, ShopView) |
| `src/sprites/` | Composants visuels des dinosaures |
| `src/store/` | Gestion d'état Zustand |
| `src/utils/` | Logique métier et utilitaires |
| `src/data/` | Données statiques (liste des dinosaures) |

## 📊 Comprendre le state management

Pomodocus utilise **Zustand** pour la gestion d'état. Le store principal est dans `src/store/useGameStore.ts`.

### État principal :
```typescript
{
  points: number,              // DocusPoints actuels
  dinosaurs: Dinosaur[],       // Collection de dinosaures
  timerState: 'idle' | 'running' | 'paused',
  timeRemaining: number,       // Temps restant en secondes
  // ... et plus
}
```

### Actions principales :
```typescript
// Timer
startTimer()
pauseTimer()
resetTimer()

// Dinosaures
purchaseDinosaur(id: string)
collectCoins(id: string)

// Gestion des points
addPoints(amount: number)
```

Consultez [API.md](API.md) pour la documentation complète.

## 🧪 Tests

Les tests sont exécutés avec **Vitest** et **jsdom**.

### Lancer les tests

```bash
npm test
```

### Où trouver les tests

Les fichiers de test se trouvent dans `src/utils/` avec l'extension `.test.ts`.

**Exemple :** `src/utils/gameLogic.test.ts` teste les fonctions pures de la logique du jeu.

## 🎨 Styles et Tailwind

Pomodocus utilise **Tailwind CSS** pour tous les styles.

- **Config** : `tailwind.config.js`
- **Entry CSS** : `src/index.css`
- **Approche** : Utility-first (classes Tailwind directement dans les composants)

### Import de fonts personnalisées

L'application charge les fonts via Google Fonts. Modifiez `index.html` pour ajouter de nouvelles fonts.

## 🦖 Travailler avec les dinosaures

### Ajouter un nouveau dinosaure

1. Créez un composant sprite dans `src/sprites/` (ex: `DinoNewDino.tsx`)
2. Ajoutez l'entrée dans `src/data/dinosaurs.ts`
3. Mise à jour des rareté et prix
4. Testez dans la boutique

### Données des dinosaures

```typescript
// src/data/dinosaurs.ts
interface Dinosaur {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
  price: number;
  spriteComponent: React.ComponentType;
  // ...
}
```

## 🔄 Workflow de développement conseillé

1. **Créez une branche** : `git checkout -b feature/ma-feature`
2. **Développez** : Modifiez les fichiers et testez avec `npm run dev`
3. **Testez** : Exécutez `npm test` et vérifiez que tout fonctionne
4. **Committez** : `git commit -m "Add: ma nouvelle feature"`
5. **Pushez** : `git push origin feature/ma-feature`
6. **Créez une PR** sur GitHub

## 🐛 Debugging

### Logs du store

Zustand supporte les middleware personnalisés. Pour logger l'état :

```typescript
// Dans useGameStore.ts
(set) => ({
  // ... actions
}),
{
  name: "game-store",
}
```

### DevTools

Utilisez les DevTools de votre navigateur (F12) pour :
- Inspecter l'état React
- Ver ifier les performances
- Examiner le localStorage

### Console

Importez le store et inspectez-le :
```typescript
import { useGameStore } from './store/useGameStore'
// Dans les tests ou composants
const state = useGameStore.getState()
console.log(state)
```

## 📦 Build pour production

```bash
npm run build
```

Cela crée un dossier `dist/` optimisé prêt à être déployé.

### Vérification avant build

```bash
npm run build
npm run preview
```

## 🤝 Besoin d'aide ?

- **Questions de developpement** : Consultez [API.md](API.md)
- **Architecture** : Lisez [ARCHITECTURE.md](ARCHITECTURE.md)
- **Contribution** : Suivez [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues** : Ouvrez une issue sur GitHub

---

**Bon développement ! 🚀**
