# 🍅 Pomodocus

Une application gamifiée de **Pomodoro** avec des dinosaures collectibles ! Complète des sessions de focus, gagne des pièces, élève tes dinosaures et personnalise ton environnement.

## ✨ Features

### ⏱️ **Minuteur Pomodoro**
- Sessions de travail/pause configurables (5-90 min travail, 1-30 min pause)
- 3 présets intégrés : Classique (25/5), Deep Work (50/10), Sprint (15/3)
- Sauvegarde de 3 présets personnalisés
- Notifications audio et notifications du navigateur à la fin des sessions
- **Liste de tâches personnalisable** : Ajoute, coche et supprime des tâches pendant ta session
  - Persiste pendant ta session Pomodoro
  - Affichage du nombre de tâches complétées

### 🦕 **Parc de Dinosaures**
- Collectionne 10 dinosaures uniques avec animations SVG détaillées
- Dinosaures de rareté croissante : Commun → Rare → Épique → Légendaire
- Production passive de pièces (🪙) basée sur le type et le niveau du dinosaure
- Bouton **"Tout collecter"** pour récupérer les pièces de tous tes dinos
- Chaque dinosaure a sa propre animation de marche naturelle
- Parc avec fond dynamique : ciel bleu, arbres, rochers, étang avec animation

### 🛍️ **Boutique**
- Achète des œufs avec tes points de focus (⚡ docuPoints)
- 3 types d'œufs : Commun (15 pts), Rare (40 pts), Légendaire (100 pts)
- Les œufs révèlent des dinosaures aléatoires de la bonne rareté

### 📈 **Amélioration des Dinosaures**
- **Level up** : Augmente la production de pièces de ton dinosaure (max niveau 10)
- **Slots** : Augmente la capacité maximale de dinosaures dans le parc
- **Rendement** : Augmente la production globale de pièces (+5% par niveau)

### 📊 **Statistiques & Histoire**
- **Carte heatmap** : Visualise tes 12 dernières semaines de focus
- Couleur basée sur le nombre de sessions par jour
- **Stats temps réel** : Sessions d'aujourd'hui, streak en jours, temps total de focus

### ⚔️ **Quêtes Quotidiennes**
- 3 quêtes qui se renouvellent chaque jour
- Premier pas : 1 session → 30 🪙
- En rythme : 3 sessions → 100 🪙
- Régularité : Maintenir un streak → 20 ⚡
- Clique pour réclamer tes récompenses

### 🎨 **Personnalisation**
- **Fonds du Timer** (4 options) :
  - Défaut (noir classique)
  - Gradient vert/bleu
  - Sombre semi-transparent
  - **Personnalisé** (upload une image)
  - Les images s'affichent en full screen avec effet parallax

- **Thèmes Saisonniers** (achat permanent) :
  - 🌿 Jungle (défaut, gratuit)
  - ❄️ Noël (ciel sombre, sol blanc)
  - 🎃 Halloween (ciel noir, sol marron)
  - 🌸 Printemps (ciel bleu clair, sol vert)
  - ☀️ Été (ciel doré, sol jaune)
  - **Prix** : 1000 🪙 par thème (achat unique, puis activation gratuite)

- **Décoration du Parc** :
  - 🌳 Arbres (Chêne, Palmier)
  - 🪨 Rochers
  - 🌷 Fleurs (Tulipe, Rose)
  - 🍄 Champignon magique
  - Chaque décoration s'affiche avec position/rotation aléatoire

### 📱 **Interface**
- Design responsive avec mode sombre
- 5 onglets de navigation : Timer, Boutique, Parc, Historique, Quêtes
- **Timer central** avec :
  - Chrono circulaire avec progress bar
  - Boutons Start/Pause/Reset
  - **Liste de tâches** intégrée (ajouter, cocher, supprimer)
- Stats affichées à droite du timer (sessions, streak, temps total)
- Réglages repliables à gauche (travail, pause, présets, fonds d'écran)

## 🎮 Gameplay

1. **Complète une session Pomodoro** → Gagne des points de focus (⚡)
2. **Accumule des points** → Achète des œufs dans la boutique
3. **Les œufs éclosent** → Découvre tes nouveaux dinosaures
4. **Collectionne les dinosaures** → Ils produisent des pièces (🪙) passivement
5. **Améliore tes dinosaures** → Level up, augmente ta production
6. **Effectue les quêtes** → Gagne des récompenses bonus chaque jour

## 🛠️ Tech Stack

- **React 18** + TypeScript 5.5
- **Zustand** pour la gestion d'état avec persistance
- **Framer Motion** pour les animations fluides
- **Tailwind CSS** pour le style
- **Vitest** pour les tests (36+ tests)
- **Web Audio API** pour les sons
- **SVG sprites** pour les animations des dinosaures

## 📋 À propos

Pomodocus combine la technique Pomodoro avec la gamification. Le système de récompense immédiat (dinosaures, pièces, upgrades) t'encourage à compléter régulièrement tes sessions. C'est un projet créé pour le hackathon 🚀

## 📦 Installation

```bash
npm install
npm run dev
```

Accède à http://localhost:5173

## 🧪 Tests

```bash
npm test
```

36+ tests d'unité pour les logiques de jeu

---

**Collectionne-les tous, maintiens ton streak ! 🔥**
