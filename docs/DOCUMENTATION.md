# Documentation Pomodocus

Bienvenue dans la documentation complète de Pomodocus ! Consultez les guides ci-dessous pour comprendre l'architecture, développer de nouvelles fonctionnalités, ou contribuer au projet.

## 📚 Guides de documentation

### Pour les développeurs

- **[Guide du Développeur](DEVELOPER.md)** - Comment configurer votre environnement de développement et travailler sur le projet
- **[API & Store](API.md)** - Documentation de l'état global Zustand et des fonctions utilitaires
- **[Architecture](ARCHITECTURE.md)** - Vue d'ensemble technique et structure du projet

### Pour les contributeurs

- **[Guide de Contribution](CONTRIBUTING.md)** - Comment contribuer au projet et soumettre vos améliorations

### Documentation de design

Consultez le dossier `superpowers/` pour les spécifications détaillées :
- `superpowers/plans/` - Plans d'implémentation
- `superpowers/specs/` - Spécifications de design

## 🎮 Vue d'ensemble rapide

**Pomodocus** combine :
- 🍅 Un **Pomodoro Timer** pour gérer vos sessions de travail
- 💎 Un système de **points (DocusPoints)** gagnés à chaque session
- 🦖 Une collection de **dinosaures** à débloquer et collectionner
- 💰 Un système de **revenus passifs** (les dinos génèrent des pièces)
- 🎨 Une **interface visuelle attrayante** avec sprites animés

## 🏗️ Architecture résumée

```
State Management: Zustand (localStorage persistent)
    ↓
Game Logic: Fonctions pures (gameLogic.ts)
    ↓
Components: React + Tailwind + Framer Motion
    ↓
Views: Timer, Shop, Park
```

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Tests
npm test
```

## 📂 Structure des fichiers

```
docs/
├── DOCUMENTATION.md      # Index et vue d'ensemble (cette page)
├── DEVELOPER.md          # Guide du développeur
├── API.md                # Documentation API
├── ARCHITECTURE.md       # Architecture détaillée
├── CONTRIBUTING.md       # Guide de contribution
└── superpowers/
    ├── plans/            # Plans d'implémentation
    └── specs/            # Spécifications de design
```

## 🔍 Besoin d'aide ?

- **Je suis nouveau sur le projet** → Commencez par [Guide du Développeur](DEVELOPER.md)
- **Je veux comprendre l'architecture** → Consultez [Architecture](ARCHITECTURE.md)
- **Je veux ajouter une feature** → Lisez [API & Store](API.md) et [Guide de Contribution](CONTRIBUTING.md)
- **Je veux signaler un bug** → Ouvrez une issue sur GitHub

---

**Amusez-vous bien en développant pour Pomodocus ! 🦕**
