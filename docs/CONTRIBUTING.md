# Guide de Contribution

Merci de votre intérêt pour contribuer à Pomodocus ! Ce guide vous explique comment procéder de manière efficace.

## 🚀 Avant de commencer

1. Consultez le [Guide du Développeur](DEVELOPER.md)
2. Familiarisez-vous avec [l'Architecture](ARCHITECTURE.md)
3. Lisez la section [API](API.md) pour les détails techniques
4. Vérifiez que votre environnement est configuré correctement

## 📋 Types de contributions

### 🐛 Signaler des bugs

**Avant de signaler :**
- Vérifiez que le bug n'a pas déjà été reporté
- Testez avec la dernière version du code
- Essayez de reproduire le bug de manière fiable

**Pour signaler :**
1. Ouvrez une [issue GitHub](https://github.com/lucasskvn/Pomodocus/issues)
2. Utilisez le titre: `[BUG] Description courte`
3. Incluez:
   - Étapes pour reproduire
   - Comportement attendu
   - Comportement actuel
   - Environnement (OS, navigateur, Node version)
   - Screenshots si pertinent

**Exemple :**
```
[BUG] Timer continue après fermeture

## Étapes pour reproduire
1. Démarrer un timer
2. Fermer l'appli
3. Rouvrir l'appli

## Attendu
Le timer repend son compte

## Actuel
Le timer a écoulé depuis le premier démarrage

## Environnement
- OS: Linux
- Browser: Chrome 125
- Node: v18.16
```

### ✨ Proposer des nouvelles features

**Avant de proposer :**
- Vérifiez que la feature n'est pas déjà plannifiée
- Consultez les [documents de spécification](./superpowers/specs/)

**Pour proposer :**
1. Ouvrez une [issue GitHub](https://github.com/lucasskvn/Pomodocus/issues)
2. Utilisez le titre: `[FEATURE] Description courte`
3. Incluez:
   - Description claire de la feature
   - Cas d'utilisation
   - Bénéfices attendus
   - Maquette (si applicable)

### 🔧 Implémenter des features ou fixes

Consultez la section [Workflow de développement](#-workflow-de-développement) ci-dessous.

## 💻 Workflow de développement

### 1. Fork le projet

```bash
# Sur GitHub, cliquez "Fork" pour créer une copie personnelle
# Puis clonez votre fork en local:
git clone https://github.com/VOTRE-USERNAME/Pomodocus.git
cd Pomodocus
```

### 2. Créer une branche

```bash
# Mettez à jour main
git checkout main
git pull origin main

# Créez votre branche feature
git checkout -b feature/numero-issue-description-courte

# Exemples:
# git checkout -b feature/42-fix-timer-drift
# git checkout -b feature/25-add-sound-settings
# git checkout -b feature/10-improve-perf
```

### 3. Développez votre contribution

```bash
# Installez les dépendances
npm install

# Démarrez le dev server
npm run dev

# Apportez vos changements
# Testez votre code
```

### 4. Tests

**Exécutez les tests avant de committer :**

```bash
npm test
```

**Si vous ajoutez une nouvelle fonction :**
- Écrivez ou mettez à jour les tests correspondants
- Le coverage ne doit pas diminuer

**Exemple de test :**
```typescript
test('ma nouvelle feature fonctionne', () => {
  const result = myNewFunction()
  expect(result).toBe(expectedValue)
})
```

### 5. Vérification du code

**Avant de committer :**

```bash
# Vérifiez qu'aucun fichier n'est cassé
npm run build

# Vérifiez les tests
npm test

# Preview de la build
npm run preview
```

### 6. Committer vos changements

```bash
# Consultez vos changements
git status
git diff

# Stagez les fichiers
git add src/components/MonFichier.tsx

# Committez avec un message descriptif
git commit -m "Add: votre description claire"
```

**Format des messages de commit :**
```
[TYPE] Description courte (50 chars max)

Description plus détaillée si nécessaire (72 chars max par ligne)

Fixes #42
```

**Types autorisés :**
- `Add:` - Nouvelle feature
- `Fix:` - Correction de bug
- `Refactor:` - Restructuration de code
- `Perf:` - Amélioration de performance
- `Docs:` - Documentation
- `Test:` - Ajout/modification de tests
- `Style:` - Formatage, pas de logique
- `Chore:` - Dépendances, build config

### 7. Push vers votre fork

```bash
git push origin feature/42-fix-timer-drift
```

### 8. Ouvrir une Pull Request

1. Sur GitHub, naviguez vers votre fork
2. Cliquez "Compare & pull request"
3. Remplissez le template:

```markdown
## Description
Courte description de ce que vous implémentez.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change (change qui casse la compatibilité)
- [ ] Documentation

## Lié à
Closes #42

## How Has This Been Tested?
Décrivez comment tester votre code.

## Checklist
- [ ] Mon code suit les conventions du projet
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] J'ai ajouté des tests pour ma nouvelle feature
- [ ] Les tests passent localement avec `npm test`
- [ ] Le build passe avec `npm run build`
```

### 9. Review et itération

- Les mainteneurs vont réviser votre PR
- Répondez aux commentaires et ajustez au besoin
- Pushez les changements dans la même branche
- La PR se mettra à jour automatiquement

## 📝 Conventions de code

### TypeScript

- Nommage en camelCase pour les variables/fonctions
- Nommage en PascalCase pour les composants/types
- Toujours typer : `const name: string = ...`

```typescript
// ✅ Bon
interface DinosaureConfig {
  name: string;
  price: number;
}

function calculatePoints(sessions: number): number {
  return sessions * 10;
}

// ❌ Mauvais
function calculate(s) {
  return s * 10;
}
```

### React Components

- Un composant par fichier (sauf petits utilitaires)
- Componants nommés en PascalCase
- Hooks au début du composant

```typescript
// ✅ Bon
export function MyComponent(): React.ReactElement {
  const [count, setCount] = useState(0);
  
  return <div>{count}</div>;
}

// ❌ Mauvais
export const myComponent = () => <div>test</div>;
```

### Styles Tailwind

- Utiliser uniquement les classes Tailwind
- Pas de CSS personnalisé dans les composants

```typescript
// ✅ Bon
<div className="bg-blue-500 px-4 py-2 rounded">

// ❌ Mauvais
<div style={{ backgroundColor: 'blue', padding: '10px' }}>
```

### Commentaires

- Commentez le "pourquoi", pas le "quoi"
- Maintenez les commentaires à jour

```typescript
// ✅ Bon
// Utiliser Date.now() pour éviter la dérive si l'onglet perd le focus
const elapsed = Date.now() - startTime;

// ❌ Mauvais
// Ajouter endTime à elapsed
const elapsed = Date.now() - startTime;
```

## 🎯 Domaines clés

### Ajouter un dinosaure

1. Créez `src/sprites/DinoNewDino.tsx`
2. Ajoutez à `src/data/dinosaurs.ts`
3. Écrivez un test
4. Documentez dans [ARCHITECTURE.md](ARCHITECTURE.md)

### Modifier le store

1. Éditez `src/store/useGameStore.ts`
2. Mettez à jour les types si nécessaire
3. Écrivez des tests pour les actions
4. Documentez dans [API.md](API.md)

### Optimisation de performance

1. Mesurez d'abord avec DevTools
2. Changez une chose à la fois
3. Re-mesurez et documentez l'impact

### Documentation

- Maintenez la documentation à jour
- Incluez des exemples de code
- Fixez les liens cassés

## 🤝 Bonnes pratiques

### Points importants

✅ **À faire :**
- Discuter de features majeures dans une issue avant de coder
- Garder les PRs focalisées et petites
- Écrire des messages de commit clairs
- Tester votre code
- Demander de l'aide si bloqué

❌ **À éviter :**
- Changer le style de code existant sans raison
- Committer du code de debug (`console.log`, code commenté)
- Mélanger plusieurs features dans une PR
- Ignorer les feedback des reviewers
- Pusher directement sur `main`

### Quand demander de l'aide

N'hésitez pas à :
- Poser des questions dans les issues
- Demander une review précoce sur votre draft PR
- Mentionner les mainteneurs (`@lucasskvn`, `@hugoddb`)

## ✅ Checklist avant de soumettre

- [ ] Mon code suit les conventions du projet
- [ ] J'ai testé localement avec `npm run dev`
- [ ] Les tests passent : `npm test`
- [ ] Le build fonctionne : `npm run build`
- [ ] J'ai mis à jour la documentation
- [ ] J'ai rebasé sur `main` récent
- [ ] Je n'ai pas de `console.log` ou code debug
- [ ] Les messages de commit sont clairs
- [ ] La PR a une description détaillée

## 🎓 Ressources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/types.html)

## 🙏 Merci !

Merci d'avoir contribué à Pomodocus ! Votre aide nous aide à construire un meilleur projet. 🦕🦖

---

**Questions ?** Ouvrez une issue ou contactez les mainteneurs sur GitHub.

**Bon développement ! 🚀**
