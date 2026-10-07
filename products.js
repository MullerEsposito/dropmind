// Neste jogo, agropecuária representa os produtos de origem animal.
export const products = [
  { name: 'Milho', icon: '🌽', origin: 0 }, { name: 'Cenoura', icon: '🥕', origin: 0 },
  { name: 'Maçã', icon: '🍎', origin: 0 }, { name: 'Uva', icon: '🍇', origin: 0 },
  { name: 'Batata', icon: '🥔', origin: 0 }, { name: 'Tomate', icon: '🍅', origin: 0 },
  { name: 'Ovos', icon: '🥚', origin: 1 }, { name: 'Leite cru', icon: '🥛', origin: 1 },
  { name: 'Mel', icon: '🍯', origin: 1 }, { name: 'Lã', icon: '🐑', origin: 1 },
  { name: 'Queijo', icon: '🧀', origin: 2 }, { name: 'Pão', icon: '🍞', origin: 2 },
  { name: 'Geleia', icon: '🫙', origin: 2 }, { name: 'Chocolate', icon: '🍫', origin: 2 },
  { name: 'Suco industrializado', icon: '🧃', origin: 2 }, { name: 'Óleo de girassol', icon: '🌻', origin: 2 }
];
export const origins = ['Agricultura', 'Agropecuária', 'Agroindústria'];
export function levelFor(hits) { return 1 + Math.floor(hits / 5); }
export function durationFor(level) { return Math.max(1500, 6500 * Math.pow(0.85, level - 1)); }
