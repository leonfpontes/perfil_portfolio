/** Gerador pseudoaleatório determinístico: mesma semente, mesma arte em todo carregamento. */
export interface Random {
  /** Próximo número em [0, 1). */
  next(): number;
  /** Número real em [min, max). */
  range(min: number, max: number): number;
  /** Inteiro em [min, max] (inclusivo). */
  int(min: number, max: number): number;
  /** Elemento aleatório de uma lista não vazia. */
  pick<T>(items: readonly T[]): T;
}

/** Hash FNV-1a de 32 bits — transforma sementes textuais em inteiros estáveis. */
export function hashSeed(seed: number | string): number {
  if (typeof seed === 'number') return seed >>> 0;
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Cria um PRNG mulberry32: rápido, pequeno e bom o bastante para arte generativa. */
export function createRandom(seed: number | string): Random {
  let state = hashSeed(seed);

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    range: (min, max) => min + (max - min) * next(),
    int: (min, max) => Math.floor(min + (max - min + 1) * next()),
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) throw new Error('pick() requer uma lista não vazia');
      return items[Math.floor(next() * items.length)] as T;
    },
  };
}
