import { useRef } from 'react';
import { useCanvas, type CanvasFrame } from '@/hooks/useCanvas';
import { createRandom, type Random } from '@/lib/art/random';
import { cn } from '@/lib/utils';

/**
 * Painel de azulejos generativo, no espírito dos painéis modernistas de Athos
 * Bulcão: poucos módulos geométricos, poucas cores, combinados ao acaso. Cada
 * visita (seed) compõe uma parede diferente; de tempos em tempos um azulejo gira
 * 90°, e o que está sob o cursor também.
 */

/** Cores de marca lidas do CSS (fixas, não mudam com a cena). */
type BrandColor = 'azul' | 'ocre' | 'mata' | 'cal' | 'breu';

/** Módulo desenhado num quadrado unitário [0,1]², antes da rotação. */
type Motif = (ctx: CanvasRenderingContext2D) => void;

const motifs: Motif[] = [
  // Quarto de círculo apoiado num canto.
  (c) => {
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, 1, 0, Math.PI / 2);
    c.closePath();
    c.fill();
  },
  // Meia-lua sobre a base.
  (c) => {
    c.beginPath();
    c.arc(0.5, 1, 0.5, Math.PI, 0);
    c.closePath();
    c.fill();
  },
  // Meio quadrado na diagonal.
  (c) => {
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(1, 0);
    c.lineTo(0, 1);
    c.closePath();
    c.fill();
  },
  // Dois quartos de círculo em cantos opostos.
  (c) => {
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, 0.5, 0, Math.PI / 2);
    c.closePath();
    c.moveTo(1, 1);
    c.arc(1, 1, 0.5, Math.PI, Math.PI * 1.5);
    c.closePath();
    c.fill();
  },
  // Círculo central.
  (c) => {
    c.beginPath();
    c.arc(0.5, 0.5, 0.3, 0, Math.PI * 2);
    c.fill();
  },
  // Faixa: metade do azulejo.
  (c) => {
    c.fillRect(0, 0, 1, 0.5);
  },
  // Quadrado no canto + quarto de círculo vazado.
  (c) => {
    c.beginPath();
    c.rect(0, 0, 1, 1);
    c.arc(1, 1, 0.62, Math.PI, Math.PI * 1.5);
    c.lineTo(1, 1);
    c.closePath();
    c.fill('evenodd');
  },
];

/** Pares fundo/figura com bom contraste — a "paleta da parede". */
const PAIRS: [BrandColor, BrandColor][] = [
  ['azul', 'cal'],
  ['cal', 'azul'],
  ['ocre', 'breu'],
  ['mata', 'ocre'],
  ['cal', 'mata'],
  ['azul', 'ocre'],
  ['ocre', 'azul'],
  ['cal', 'ocre'],
];

interface Tile {
  motif: number;
  pair: number;
  angle: number;
  target: number;
}

interface Wall {
  key: string;
  cols: number;
  rows: number;
  tiles: Tile[];
  rnd: Random;
  nextFlip: number;
  hovered: number;
  colors: Record<BrandColor, string>;
}

function readBrandColors(el: HTMLElement): Record<BrandColor, string> {
  const s = getComputedStyle(el);
  const v = (name: BrandColor, fallback: string) => s.getPropertyValue(`--${name}`).trim() || fallback;
  return { azul: v('azul', '#2d4fb3'), ocre: v('ocre', '#f0b429'), mata: v('mata', '#14513f'), cal: v('cal', '#f7f7f3'), breu: v('breu', '#13261f') };
}

function buildWall(key: string, cols: number, rows: number, seed: string, colors: Wall['colors']): Wall {
  const rnd = createRandom(`${seed}:${cols}x${rows}`);
  const tiles: Tile[] = Array.from({ length: cols * rows }, () => {
    const angle = rnd.int(0, 3) * (Math.PI / 2);
    return { motif: rnd.int(0, motifs.length - 1), pair: rnd.int(0, PAIRS.length - 1), angle, target: angle };
  });
  return { key, cols, rows, tiles, rnd, nextFlip: 0, hovered: -1, colors };
}

function drawTile(ctx: CanvasRenderingContext2D, wall: Wall, i: number, size: number) {
  const tile = wall.tiles[i]!;
  const x = (i % wall.cols) * size;
  const y = Math.floor(i / wall.cols) * size;
  const [bg, fg] = PAIRS[tile.pair]!;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = wall.colors[bg];
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(tile.angle);
  ctx.translate(-size / 2, -size / 2);
  ctx.scale(size, size);
  ctx.fillStyle = wall.colors[fg];
  motifs[tile.motif]!(ctx);
  ctx.restore();
}

export interface AzulejoProps {
  className?: string;
  /** Muda a composição da parede. */
  seed?: string;
  /** Lado do azulejo em px CSS. */
  size?: number;
  /** Intervalo médio (s) entre giros espontâneos. */
  every?: number;
}

export function Azulejo({ className, seed = 'lp', size = 56, every = 1.1 }: AzulejoProps) {
  const wallRef = useRef<Wall | null>(null);

  const ref = useCanvas(
    (ctx, frame: CanvasFrame) => {
      const { width, height, pointer, time, dt } = frame;
      const cols = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      const key = `${seed}|${cols}x${rows}`;
      let wall = wallRef.current;
      if (!wall || wall.key !== key) {
        wall = buildWall(key, cols, rows, seed, readBrandColors(ctx.canvas));
        wallRef.current = wall;
      }

      const dirty = new Set<number>();
      if (frame.first) wall.tiles.forEach((_, i) => dirty.add(i));

      if (!frame.still) {
        // Giro espontâneo de um azulejo ao acaso.
        if (time >= wall.nextFlip) {
          const i = wall.rnd.int(0, wall.tiles.length - 1);
          wall.tiles[i]!.target += Math.PI / 2;
          wall.nextFlip = time + every * (0.5 + wall.rnd.next());
        }
        // O azulejo sob o cursor gira uma vez ao ser "tocado".
        const hovered =
          pointer.active && pointer.x >= 0 && pointer.y >= 0 && pointer.x < width && pointer.y < height
            ? Math.floor(pointer.y / size) * cols + Math.floor(pointer.x / size)
            : -1;
        if (hovered !== wall.hovered) {
          if (hovered >= 0 && wall.tiles[hovered]) wall.tiles[hovered]!.target += Math.PI / 2;
          wall.hovered = hovered;
        }
        // Aproxima cada ângulo do alvo (amortecimento exponencial).
        const k = 1 - Math.exp(-dt * 7);
        wall.tiles.forEach((t, i) => {
          if (Math.abs(t.target - t.angle) > 0.001) {
            t.angle += (t.target - t.angle) * k;
            if (Math.abs(t.target - t.angle) <= 0.001) t.angle = t.target;
            dirty.add(i);
          }
        });
      }

      // Só redesenha os azulejos que mudaram.
      dirty.forEach((i) => drawTile(ctx, wall!, i, size));
    },
    { stillTime: 0, deps: [seed, size] },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />;
}
