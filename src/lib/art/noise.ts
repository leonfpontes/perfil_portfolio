import { createRandom } from './random';

/** Função de ruído coerente: (x, y, z?) → valor contínuo em [-1, 1]. */
export type NoiseFn = (x: number, y: number, z?: number) => number;

const GRAD3: readonly (readonly [number, number, number])[] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

const F3 = 1 / 3;
const G3 = 1 / 6;

/**
 * Simplex noise 3D com permutação semeada. Usamos sempre 3D (z = 0 para 2D)
 * porque o terceiro eixo vira "tempo" e anima o campo sem saltos.
 */
export function createNoise(seed: number | string): NoiseFn {
  const rnd = createRandom(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd.next() * (i + 1));
    const tmp = p[i]!;
    p[i] = p[j]!;
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]!;
    permMod12[i] = perm[i]! % 12;
  }

  const corner = (gi: number, x: number, y: number, z: number): number => {
    const t = 0.6 - x * x - y * y - z * z;
    if (t < 0) return 0;
    const g = GRAD3[gi]!;
    const t2 = t * t;
    return t2 * t2 * (g[0] * x + g[1] * y + g[2] * z);
  };

  return (xin, yin, zin = 0) => {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = permMod12[ii + perm[jj + perm[kk]!]!]!;
    const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]!]!]!;
    const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]!]!]!;
    const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]!]!]!;

    const n =
      corner(gi0, x0, y0, z0) +
      corner(gi1, x1, y1, z1) +
      corner(gi2, x2, y2, z2) +
      corner(gi3, x3, y3, z3);
    // 32 normaliza para ~[-1, 1]; o clamp garante o contrato mesmo nos extremos.
    return Math.max(-1, Math.min(1, 32 * n));
  };
}
