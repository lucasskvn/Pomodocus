# Architecture de Pomodocus

Vue d'ensemble technique et architecture du projet Pomodocus.

## 🏗️ Vue d'ensemble générale

```
┌─────────────────────────────────────────────┐
│  Interface Utilisateur (React Components)   │
│  ├─ Views (TimerView, ParkView, ShopView)   │
│  ├─ Components (Timer, DinoCard, Shop...)   │
│  └─ Sprites (DinoT-Rex, DinoBrachio...)     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Gestion d'État (Zustand Store)             │
│  ├─ État global (points, dinosaures...)     │
│  ├─ Actions du jeu                          │
│  └─ Persistance localStorage                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Logique Métier (Pure Functions)            │
│  ├─ gameLogic.ts (calculatePending, etc.)   │
│  └─ Tests unitaires (Vitest)                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Données Statiques                          │
│  └─ dinosaurs.ts (configuration dinos)      │
└─────────────────────────────────────────────┘
```

## 📁 Structure des fichiers

```
Pomodocus/
├── public/                 # Ressources statiques
│   └── sprites/           # Images des dinosaures
│
├── src/
│   ├── index.css          # Styles globaux Tailwind
│   ├── main.tsx           # Point d'entrée React
│   ├── App.tsx            # Composant racine + navigation
│   │
│   ├── components/        # Composants réutilisables
│   │   ├── PomodoroTimer.tsx      # Affichage du timer
│   │   ├── PointsDisplay.tsx      # Affichage des points/coins
│   │   ├── EggShop.tsx            # Sélection des œufs
│   │   ├── EggReveal.tsx          # Animation de révélation
│   │   ├── DinoCard.tsx           # Carte d'un dinosaure
│   │   ├── DinoPark.tsx           # Grille de dinosaures
│   │   ├── StatsCards.tsx         # Statistiques
│   │   ├── TimerSettings.tsx      # Configuration du timer
│   │   └── YoutubePlayer.tsx      # Lecteur vidéo (bonus)
│   │
│   ├── views/             # Pages principales
│   │   ├── TimerView.tsx          # Page timer + shop
│   │   ├── ParkView.tsx           # Page collection dinosaures
│   │   └── ShopView.tsx           # Page boutique (alternative)
│   │
│   ├── sprites/           # Composants visuels dinosaures
│   │   ├── DinoT-Rex.tsx
│   │   ├── DinoTriceratops.tsx
│   │   ├── DinoAnkylosaurus.tsx
│   │   ├── DinoBrachiosaurus.tsx
│   │   ├── ... (autres dinos)
│   │   └── ParkBackground.tsx
│   │
│   ├── data/              # Données statiques
│   │   └── dinosaurs.ts   # Configuration des dinosaures
│   │
│   ├── store/             # Gestion d'état
│   │   └── useGameStore.ts # Store Zustand principal
│   │
│   └── utils/             # Utilitaires et logique
│       ├── gameLogic.ts           # Fonctions pures du jeu
│       └── gameLogic.test.ts      # Tests unitaires
│
├── docs/                  # Documentation
│   ├── DOCUMENTATION.md   # Index documentation
│   ├── DEVELOPER.md       # Guide développeur
│   ├── API.md            # API et store
│   ├── ARCHITECTURE.md   # Cette page
│   ├── CONTRIBUTING.md   # Guide contribution
│   └── superpowers/      # Spécifications détaillées
│
├── index.html            # Fichier HTML principal
├── package.json          # Dépendances npm
├── vite.config.ts        # Configuration Vite
├── tsconfig.json         # Configuration TypeScript
├── tailwind.config.js    # Configuration Tailwind
└── README.md             # Vue d'ensemble du projet
```

## 🔄 Flux de données

### 1. Affichage initial

```
App.tsx
  ├── Lit useGameStore
  ├── Affiche TimerView ou ParkView
  └── Hydrate l'état depuis localStorage
```

### 2. Session Pomodoro

```
PomodoroTimer.tsx
  ├── Appelle startTimer() du store
  ├── Utilise setInterval pour re-render
  ├── Calcul du temps restant via Date.now()
  ├── À la fin: completeSession()
  └── Ajoute 10 points aux DocusPoints
```

### 3. Achat de dinosaure

```
EggShop.tsx
  ├─ Affiche 3 cartes d'œufs
  ├─ onClick: purchaseDinosaur()
  │   ├─ Vérifie les points suffisants
  │   ├─ Déduit les points
  │   ├─ Ajoute le dinosaure à la collection
  │   └─ Lance la révélation
  └─ EggReveal.tsx animate l'apparition
```

### 4. Collecte de pièces

```
DinoCard.tsx
  ├── Affiche les pièces en attente
  ├── onClick: collectCoins()
  │   ├─ Calcule les pièces accumulées
  │   ├─ Ajoute au total de coins
  │   └─ Réinitialise pendingCoins
  └── Re-render affiche les nouvelles pièces
```

## 🛠️ Stack technologique

### Frontend

| Technologie | Version | Rôle |
|------------|---------|------|
| React | 18.3 | Framework UI |
| TypeScript | 5.5 | Typage statique |
| Vite | 5.4 | Bundler et dev server |
| Tailwind CSS | 3.4 | Framework CSS |
| Zustand | 4.5 | State management |
| Framer Motion | 11.0 | Animations |

### Utilitaires

| Technologie | Rôle |
|------------|------|
| Vitest | Framework de tests |
| jsdom | DOM virtuel pour tests |
| PostCSS | Traitement CSS |
| AutoPrefixer | Compatibilité cross-browser |

## 💾 Gestion de l'état

### Zustand Store

L'état global est centralisé dans `src/store/useGameStore.ts`.

**Avantages :**
- Minimal et performant
- Pas de boilerplate Redux
- Middleware `persist` pour localStorage
- Hooks React simples

**Sélection d'état :**
```typescript
const points = useGameStore((state) => state.points)
const addPoints = useGameStore((state) => state.addPoints)
```

### Persistance

L'état complet est sauvegardé dans le localStorage sous la clé `game-store`.

```javascript
// localStorage['game-store']
{
  "state": {
    "timerState": "idle",
    "points": 100,
    "dinosaurs": [...],
    // ...
  }
}
```

## ⏱️ Système de Timer

### Architecture du timer

```
PomodoroTimer.tsx
  ├─ État: startTime (Date.now() sauvegardé au démarrage)
  ├─ setInterval déclenche le re-render toutes les secondes
  ├─ Le temps restant est calculé: duration - (Date.now() - startTime)
  └─ Aucune dérive même si l'onglet perd le focus
```

**Avantage :** Source de vérité = Date.now() (horloge système)

### Flux du timer

```
1. Utilisateur clique "Start"
   ├─ startTimer() sauvegarde Date.now()
   ├─ État = 'running'
   └─ setInterval commence

2. Chaque seconde
   ├─ Re-render du composant
   ├─ Calcul du temps restant
   ├─ Affichage du temps
   └─ Vérification si terminé

3. Timer atteint 0
   ├─ completeSession() appelé
   ├─ addPoints(10)
   ├─ État = 'idle'
   ├─ Pause commence (ou utilisateur ré-initie)
   └─ EggReveal popup (optionnel)
```

## 🎮 Système de points

### Sources de points

| Événement | Points |
|-----------|--------|
| Session complétée | +10 |
| Achat dinosaure | -X (selon rareté) |

### Rareté et prix

```
rollRarity() applique ces probabilités:
├─ 60% → common (50 points)
├─ 30% → rare (150 points)
└─ 10% → epic (500 points)
```

## 🦖 Système de dinosaures

### Cycle de vie

```
1. Utilisateur dans la Shop
   ├─ Affichage de 3 œufs aléatoires
   └─ 1 de chaque rareté possible

2. Achat
   ├─ purchaseDinosaur(id, rarity)
   ├─ Vérification des points
   ├─ Déduction des points
   ├─ Création du dinosaure
   └─ Ajout à la collection

3. Révélation
   ├─ setRevealingDinosaur(id)
   ├─ EggReveal affiche l'animation
   ├─ Framer Motion effectue la transformation
   └─ CloseReveal() réinitialise après animation

4. Collection
   ├─ Affichage dans DinoPark
   ├─ Génération passive de pièces
   ├─ onClick: collectCoins()
   └─ Pièces converties en coins
```

### Données du dinosaure

```typescript
{
  id: 'dino-1',
  name: 'T-Rex',
  rarity: 'rare',
  price: 150,
  spriteComponent: DinoTRex,
  coinsPerMinute: 2,
  lastCollected: Date.now(),
  pendingCoins: 0,
}
```

## 🎨 Système d'animations

### Framer Motion

Utilisé pour :
- Animation de révélation d'œufs
- Transitions entre pages
- Effets de hover sur cartes

**Exemple :**
```typescript
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Contenu */}
</motion.div>
```

## 🧪 Tests

### Structure des tests

```
gameLogic.test.ts
  ├─ Tests formatTime()
  ├─ Tests getRemaining()
  ├─ Tests calculatePendingCoins()
  └─ Tests rollRarity()
```

### Lancer les tests

```bash
npm test          # Tous les tests
npm test -- --ui  # Avec interface
```

## 🚀 Build et déploiement

### Build process

```
1. npm run build
   ├─ tsc (compile TypeScript)
   ├─ Vite (bundle et minify)
   └─ Résultat: dist/ prêt pour production

2. Résultat
   ├─ dist/index.html
   ├─ dist/assets/
   └─ Fichiers optimisés et compressés
```

### Déploiement

Le dossier `dist/` peut être déployé sur n'importe quel serveur web statique :
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Serveur personnel

## 📊 Performance

### Optimisations

1. **Tree-shaking** : Vite en production élimine le code inutilisé
2. **Code splitting** : Routes séparées
3. **Lazy loading** : Composants chargés à la demande
4. **Memoization** : `useMemo` pour éviter les re-renders
5. **Zustand selectors** : Ne ré-rendent que si la sélection change

## 🔒 Sécurité

### Points à considérer

- État en localStorage = accessible par JS (`vulnerable` aux XSS)
- Pour production : ajouter une authentification/backend
- Valider les données côté serveur
- Utiliser HTTPS

## 📚 Ressources

- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

---

**Consultez aussi :**
- [API.md](API.md) - Documentation détaillée de l'API
- [DEVELOPER.md](DEVELOPER.md) - Guide pour les développeurs
