// Neste jogo, agropecuária representa os produtos de origem animal.
export const products = [
  { name: 'Milho', icon: '🌽', origin: 0 }, { name: 'Cenoura', icon: '🥕', origin: 0 },
  { name: 'Maçã', icon: '🍎', origin: 0 }, { name: 'Uva', icon: '🍇', origin: 0 },
  { name: 'Batata', icon: '🥔', origin: 0 }, { name: 'Tomate', icon: '🍅', origin: 0 },
  { name: 'Ovos', icon: '🥚', origin: 1 }, { name: 'Leite cru', icon: '🥛', origin: 1 },
  { name: 'Mel de apiário', icon: '🍯', origin: 1 }, { name: 'Lã', icon: '🐑', origin: 1 },
  { name: 'Queijo', icon: '🧀', origin: 2 }, { name: 'Pão', icon: '🍞', origin: 2 },
  { name: 'Geleia', icon: '🫙', origin: 2 }, { name: 'Chocolate', icon: '🍫', origin: 2 },
  { name: 'Suco industrializado', icon: '🧃', origin: 2 }, { name: 'Óleo de girassol', icon: '🌻', origin: 2 },
  { name: 'Castanha coletada na floresta', icon: '🌰', origin: 3 },
  { name: 'Peixe de pesca', icon: '🐟', origin: 3 },
  { name: 'Látex de seringueira nativa', icon: '🌳', origin: 3 },
  { name: 'Açaí de coleta silvestre', icon: '🫐', origin: 3 },
  { name: 'Caranguejo do mangue', icon: '🦀', origin: 3 }
];
export const origins = ['Agricultura', 'Agropecuária', 'Agroindústria', 'Extrativismo'];
export function levelFor(hits) { return 1 + Math.floor(hits / 5); }
export function durationFor(level) { return Math.max(1500, 6500 * Math.pow(0.85, level - 1)); }
