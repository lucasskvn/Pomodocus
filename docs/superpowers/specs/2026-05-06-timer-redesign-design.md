# Timer Redesign & Boutique Tab — Design Spec
Date: 2026-05-06

## Objectif

Déplacer l'EggShop dans son propre onglet "Boutique", et enrichir la vue Timer avec 3 cards de statistiques (sessions aujourd'hui, streak, temps total de focus) affichées sous le ring.

---

## Navigation

L'app passe de 2 à 3 onglets dans `App.tsx` :

| Onglet | Emoji | Vue |
|--------|-------|-----|
| Timer | 🍅 | `TimerView` |
| Boutique | 🥚 | `ShopView` (nouveau) |
| Parc | 🦕 | `ParkView` (inchangé) |

Type `Tab = 'timer' | 'shop' | 'park'`

---

## Nouveau fichier : ShopView

`src/views/ShopView.tsx` — wrapper minimal autour de `<EggShop />` existant. Aucune modification de `EggShop.tsx`.

```tsx
import EggShop from '../components/EggShop'

export default function ShopView() {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <EggShop />
    </div>
  )
}
```

---

## Stats dans le store

### Nouvelles valeurs d'état persistées

```ts
todaySessions: number      // sessions complétées aujourd'hui, default 0
streak: number             // jours consécutifs avec ≥1 session, default 0
totalFocusMinutes: number  // cumul total en minutes, default 0
lastSessionDate: string    // YYYY-MM-DD de la dernière session, default ''
```

### Logique dans completePomodoro

Au moment de `completePomodoro`, on calcule la date du jour (`new Date().toISOString().slice(0, 10)`) et on compare à `lastSessionDate` :

```
today = date du jour (YYYY-MM-DD)
yesterday = date d'hier (YYYY-MM-DD)

si lastSessionDate === today:
  todaySessions += 1
  totalFocusMinutes += workMinutes

si lastSessionDate === yesterday:
  streak += 1
  todaySessions = 1
  lastSessionDate = today
  totalFocusMinutes += workMinutes

si lastSessionDate < yesterday ou lastSessionDate === '':
  streak = 1
  todaySessions = 1
  lastSessionDate = today
  totalFocusMinutes += workMinutes
```

Le gain de points et les autres effets de `completePomodoro` restent inchangés.

---

## Layout TimerView

`TimerView` perd le panneau shop (déplacé dans ShopView). Structure :

```
[TimerSettings 130px collapsible] | [zone centrale flex-1]
```

La zone centrale contient verticalement :
1. `<PomodoroTimer />` (inchangé)
2. `<StatsCards />` — nouveau composant

---

## Nouveau composant : StatsCards

`src/components/StatsCards.tsx`

3 cards côte à côte sous les boutons du timer :

| Card | Icône | Valeur | Label |
|------|-------|--------|-------|
| Aujourd'hui | 🍅 | `todaySessions` | sessions |
| Streak | 🔥 | `streak` | jours |
| Focus total | ⏱ | `totalFocusMinutes` formaté | ex. `1h 25m` |

Format `totalFocusMinutes` :
- < 60 min → `Nm`
- ≥ 60 min → `Xh Ym`

Les cards sont en lecture seule — aucune action utilisateur.

Style : fond `bg-white/5`, bordure `border-white/10`, coins arrondis `rounded-xl`, valeur en `font-fredoka` large, label en `font-inter text-xs text-white/50`.

---

## Fichiers modifiés / créés

| Fichier | Changement |
|---------|------------|
| `src/App.tsx` | 3 onglets, ajout ShopView |
| `src/views/ShopView.tsx` | nouveau |
| `src/views/TimerView.tsx` | supprime panneau shop, ajoute StatsCards |
| `src/store/useGameStore.ts` | +`todaySessions`, `streak`, `totalFocusMinutes`, `lastSessionDate`, logique dans `completePomodoro` |
| `src/components/StatsCards.tsx` | nouveau |

## Ce qui ne change pas

- `EggShop.tsx` — inchangé
- `ParkView.tsx` — inchangé
- `TimerSettings.tsx` — inchangé
- `PomodoroTimer.tsx` — inchangé
- Toute la logique de jeu (dinos, coins, eggs)
