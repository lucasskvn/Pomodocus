# Système d'améliorations — Design Spec
Date: 2026-05-06

## Objectif

Limiter le parc à 5 dinos par défaut et permettre d'acheter des améliorations répétables avec des 🪙 Coins dans la boutique : plus d'emplacements (+2/achat) et meilleur rendement (+5%/achat), avec des coûts qui scalent exponentiellement (×1.8 par niveau).

---

## Store

### Nouveaux champs persistés

```ts
slotUpgradeLevel: number   // défaut 0
yieldUpgradeLevel: number  // défaut 0
```

### Valeurs dérivées (calculées à la volée, pas stockées)

```ts
maxDinos(slotUpgradeLevel)    = 5 + slotUpgradeLevel * 2
yieldMultiplier(yieldLevel)   = 1 + yieldUpgradeLevel * 0.05
slotUpgradeCost(level)        = Math.round(500 * Math.pow(1.8, level))
yieldUpgradeCost(level)       = Math.round(1000 * Math.pow(1.8, level))
```

### Nouvelles actions

```ts
buySlotUpgrade(): void   // déduit slotUpgradeCost(slotUpgradeLevel) en coins, incrémente slotUpgradeLevel
buyYieldUpgrade(): void  // déduit yieldUpgradeCost(yieldUpgradeLevel) en coins, incrémente yieldUpgradeLevel
```

Les deux actions font un early return si `coins < coût`.

### Modifications d'actions existantes

**`buyEgg`** : ajoute la vérification `ownedDinos.length < maxDinos(slotUpgradeLevel)` avant d'autoriser l'achat.

**`collectDino`** : applique `yieldMultiplier` → `Math.floor(calculatePending(...) * (1 + yieldUpgradeLevel * 0.05))`

**`collectAll`** : idem, même multiplicateur appliqué à chaque dino.

---

## Composant UpgradeShop

**Fichier :** `src/components/UpgradeShop.tsx`

Deux cards d'amélioration :

### Card Slots

```
🏠 Emplacements dinos
Niveau N  →  total : X dinos
[Acheter  —  Y 🪙]     (désactivé si coins < coût)
```

- Titre : "Emplacements dinos"
- Sous-titre : `Niveau {N} — {5 + N*2} dinos max`
- Bouton : `{slotUpgradeCost(level)} 🪙`

### Card Rendement

```
⚡ Rendement
Niveau N  →  +N*5% sur tous les dinos
[Acheter  —  Y 🪙]     (désactivé si coins < coût)
```

- Titre : "Rendement"
- Sous-titre : `Niveau {N} — +{N*5}% de production`
- Bouton : `{yieldUpgradeCost(level)} 🪙`

---

## ShopView mise à jour

```tsx
<ShopView>
  <section> Œufs (EggShop — DocuPoints) </section>
  <section> Améliorations (UpgradeShop — Coins) </section>
</ShopView>
```

---

## EggShop mise à jour

Quand `ownedDinos.length >= maxDinos` : les 3 boutons d'achat sont désactivés avec le label "Parc plein" à la place du prix.

---

## PointsDisplay — preview live

Le calcul de coins affichés applique le multiplicateur :

```ts
displayCoins = coins + sum(Math.floor(calculatePending(d.lastCollectedAt, dino.coinsPerHour) * yieldMultiplier))
```

---

## Fonctions pures (gameLogic.ts)

Deux nouvelles fonctions exportées et testées :

```ts
export function slotUpgradeCost(level: number): number {
  return Math.round(500 * Math.pow(1.8, level))
}

export function yieldUpgradeCost(level: number): number {
  return Math.round(1000 * Math.pow(1.8, level))
}
```

---

## Fichiers modifiés / créés

| Fichier | Changement |
|---------|------------|
| `src/utils/gameLogic.ts` | +`slotUpgradeCost`, +`yieldUpgradeCost` |
| `src/utils/gameLogic.test.ts` | +tests pour les deux fonctions |
| `src/store/useGameStore.ts` | +`slotUpgradeLevel`, +`yieldUpgradeLevel`, +`buySlotUpgrade`, +`buyYieldUpgrade`, refactor `buyEgg`, `collectDino`, `collectAll` |
| `src/components/UpgradeShop.tsx` | nouveau composant |
| `src/components/EggShop.tsx` | affiche "Parc plein" si cap atteint |
| `src/components/PointsDisplay.tsx` | applique `yieldMultiplier` à la preview |
| `src/views/ShopView.tsx` | intègre `<UpgradeShop />` |

## Ce qui ne change pas

- `calculatePending` — reste pure, sans multiplicateur
- La logique de timer, stats, et parc
