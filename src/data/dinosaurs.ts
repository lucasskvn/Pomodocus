export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Dinosaur {
  id: string
  name: string
  rarity: Rarity
  emoji: string
  coinsPerHour: number
  color: string
}

export const DINOSAURS: Dinosaur[] = [
  { id: 'parasaurolophus', name: 'Parasaurolophus', rarity: 'common', emoji: '🦕', coinsPerHour: 10, color: '#94a3b8' },
  { id: 'stegosaurus', name: 'Stégosaure', rarity: 'common', emoji: '🌿', coinsPerHour: 15, color: '#94a3b8' },
  { id: 'ankylosaurus', name: 'Ankylosaure', rarity: 'common', emoji: '🐢', coinsPerHour: 20, color: '#94a3b8' },
  { id: 'triceratops', name: 'Tricératops', rarity: 'common', emoji: '🦏', coinsPerHour: 30, color: '#94a3b8' },
  { id: 'velociraptor', name: 'Vélociraptor', rarity: 'rare', emoji: '🦅', coinsPerHour: 60, color: '#60a5fa' },
  { id: 'spinosaurus', name: 'Spinosaure', rarity: 'rare', emoji: '🐊', coinsPerHour: 120, color: '#60a5fa' },
  { id: 'trex', name: 'T-Rex', rarity: 'epic', emoji: '🦖', coinsPerHour: 300, color: '#a855f7' },
  { id: 'brachiosaurus', name: 'Brachiosaure', rarity: 'legendary', emoji: '✨', coinsPerHour: 1000, color: '#f59e0b' },
  { id: 'pterodactyl', name: 'Ptérodactyle', rarity: 'rare', emoji: '🦅', coinsPerHour: 90, color: '#818cf8' },
  { id: 'ankylosaurusclub', name: 'Ankylosaure Club', rarity: 'epic', emoji: '🐢', coinsPerHour: 400, color: '#34d399' },
]

export const DINO_MAP: Record<string, Dinosaur> = Object.fromEntries(
  DINOSAURS.map((d) => [d.id, d]),
)

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
}
