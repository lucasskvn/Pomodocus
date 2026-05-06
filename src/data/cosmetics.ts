export type ThemeType = 'default' | 'christmas' | 'halloween' | 'spring' | 'summer'

export interface Theme {
  id: ThemeType
  name: string
  description: string
  price: number
  skyColor: string
  groundColor: string
  emoji: string
}

export interface Decoration {
  id: string
  name: string
  description: string
  price: number
  emoji: string
  type: 'tree' | 'rock' | 'flower' | 'decoration'
}

export interface DinoCosmetic {
  id: string
  name: string
  description: string
  price: number
  type: 'hat' | 'effect' | 'skin'
  emoji?: string
}

export const THEMES: Record<ThemeType, Theme> = {
  default: {
    id: 'default',
    name: 'Jungle',
    description: 'Thème de base - Jungle verdoyante',
    price: 0,
    skyColor: '#1e3a8a',
    groundColor: '#2d8a35',
    emoji: '🌿',
  },
  christmas: {
    id: 'christmas',
    name: 'Noël',
    description: 'Parc enneigé avec décorations festives',
    price: 1000,
    skyColor: '#0f172a',
    groundColor: '#e0f2fe',
    emoji: '❄️',
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween',
    description: 'Parc effrayant avec citrouilles',
    price: 1000,
    skyColor: '#1a1a2e',
    groundColor: '#8b5a00',
    emoji: '🎃',
  },
  spring: {
    id: 'spring',
    name: 'Printemps',
    description: 'Fleurs et nature épanouie',
    price: 1000,
    skyColor: '#87ceeb',
    groundColor: '#90ee90',
    emoji: '🌸',
  },
  summer: {
    id: 'summer',
    name: 'Été',
    description: 'Soleil éclatant et ciel dégagé',
    price: 1000,
    skyColor: '#fbbf24',
    groundColor: '#fcd34d',
    emoji: '☀️',
  },
}

export const DECORATIONS: Decoration[] = [
  {
    id: 'tree-oak',
    name: 'Chêne',
    description: 'Grand arbre robuste',
    price: 100,
    emoji: '🌳',
    type: 'tree',
  },
  {
    id: 'tree-palm',
    name: 'Palmier',
    description: 'Palmier tropical',
    price: 80,
    emoji: '🌴',
    type: 'tree',
  },
  {
    id: 'rock-big',
    name: 'Rocher',
    description: 'Gros rocher',
    price: 50,
    emoji: '🪨',
    type: 'rock',
  },
  {
    id: 'flower-tulip',
    name: 'Tulipe',
    description: 'Fleur colorée',
    price: 30,
    emoji: '🌷',
    type: 'flower',
  },
  {
    id: 'flower-rose',
    name: 'Rose',
    description: 'Rose rouge',
    price: 40,
    emoji: '🌹',
    type: 'flower',
  },
  {
    id: 'decoration-mushroom',
    name: 'Champignon',
    description: 'Petit champignon magique',
    price: 60,
    emoji: '🍄',
    type: 'decoration',
  },
]

export const DINO_COSMETICS: DinoCosmetic[] = [
  {
    id: 'hat-santa',
    name: 'Bonnet du Père Noël',
    description: 'Chapeau de Noël festif',
    price: 150,
    type: 'hat',
    emoji: '🎅',
  },
  {
    id: 'hat-crown',
    name: 'Couronne',
    description: 'Couronne royale dorée',
    price: 200,
    type: 'hat',
    emoji: '👑',
  },
  {
    id: 'hat-witch',
    name: 'Chapeau de sorcière',
    description: 'Chapeau pointu noir',
    price: 120,
    type: 'hat',
    emoji: '🎩',
  },
  {
    id: 'effect-fire',
    name: 'Aura de feu',
    description: 'Dinosaure enflammé',
    price: 250,
    type: 'effect',
    emoji: '🔥',
  },
  {
    id: 'effect-ice',
    name: 'Aura glaciale',
    description: 'Dinosaure gelé',
    price: 250,
    type: 'effect',
    emoji: '❄️',
  },
  {
    id: 'effect-stars',
    name: 'Aura stellaire',
    description: 'Dinosaure scintillant',
    price: 300,
    type: 'effect',
    emoji: '✨',
  },
  {
    id: 'skin-golden',
    name: 'Skin Doré',
    description: 'Dinosaure doré étincelant',
    price: 400,
    type: 'skin',
    emoji: '🟡',
  },
  {
    id: 'skin-shadow',
    name: 'Skin Ombre',
    description: 'Dinosaure noir mystérieux',
    price: 350,
    type: 'skin',
    emoji: '⬛',
  },
]
