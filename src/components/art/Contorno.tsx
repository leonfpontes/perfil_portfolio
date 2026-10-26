import { useMemo, useRef } from 'react';
import { createColorReader, useCanvas, type CanvasFrame } from '@/hooks/useCanvas';
import { createNoise } from '@/lib/art/noise';
import { cn } from '@/lib/utils';

/**
 * Segmentos do marching squares por caso (bits: a=8 topo-esq., b=4 topo-dir., c=2 base-dir., d=1 base-esq.).
 * Arestas: 0 topo, 1 direita, 2 base, 3 esquerda.
 */
const MS_SEGMENTS: readonly (readonly [number, number])[][] = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[3, 0], [2, 1]], [[0, 2]], [[3, 0]],
  [[3, 0]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
];

export interface ContornoProps {
  className?: string;
  /** Muda o relevo das curvas. */
  seed?: string;
  /** Quantidade de curvas de nível. */
  levels?: number;
  /** Opacidade das curvas comuns (a curva champagne fica sempre mais visível). */
  intensity?: number;
}

/**
 * Curvas de nível em linha fina — a arte do LP Noir, no lugar dos azulejos.
 * O relevo deriva devagar com o tempo, o cursor "levanta" o terreno por onde passa
 * e uma única curva sai em champagne (o sinal da cena). Canvas pausado fora da tela;
 * no modo suave, um quadro estático.
 */
export function Contorno({ className, seed = 'lp', levels = 14, intensity = 0.12 }: ContornoProps) {
  const noise = useMemo(() => createNoise(`contorno:${seed}`), [seed]);
  const readColors = useRef(createColorReader()).current;
  const lift = useRef({ x: -9999, y: -9999, k: 0 });

  const ref = useCanvas(
    (ctx, frame: CanvasFrame) => {
      const { width, height, time, pointer, dt, still } = frame;
      const colors = readColors(ctx.canvas, frame.first);
      ctx.clearRect(0, 0, width, height);

      // O "levantamento" do cursor segue o ponteiro com atraso e some quando ele sai.
      const l = lift.current;
      if (!still && pointer.active) {
        const follow = 1 - Math.exp(-dt * 5);
        l.x = l.x < -999 ? pointer.x : l.x + (pointer.x - l.x) * follow;
        l.y = l.y < -999 ? pointer.y : l.y + (pointer.y - l.y) * follow;
        l.k = Math.min(1, l.k + dt * 1.5);
      } else {
        l.k = Math.max(0, l.k - dt * 1.2);
      }

      const cell = Math.max(7, Math.min(width, height) / 70);
      const cols = Math.ceil(width / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      const scale = 1 / (Math.max(width, height) * 0.5);
      const z = time * 0.02;
      const radius = Math.min(width, height) * 0.28;
      const field = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * cell;
          const py = r * cell;
          let v = noise(px * scale, py * scale, z) * 0.8 + noise(px * scale * 2.1 + 11, py * scale * 2.1, z * 1.3) * 0.2;
          if (l.k > 0) {
            const d2 = ((px - l.x) ** 2 + (py - l.y) ** 2) / (radius * radius);
            v += Math.exp(-d2) * 0.35 * l.k;
          }
          field[r * cols + c] = v;
        }
      }

      const edgePoint = (edge: number, x: number, y: number, a: number, b: number, c: number, d: number, t: number): [number, number] => {
        const lerp = (v0: number, v1: number) => (t - v0) / (v1 - v0 || 1e-6);
        switch (edge) {
          case 0: return [x + lerp(a, b) * cell, y];
          case 1: return [x + cell, y + lerp(b, c) * cell];
          case 2: return [x + lerp(d, c) * cell, y + cell];
          default: return [x, y + lerp(a, d) * cell];
        }
      };
      const trace = (t: number) => {
        ctx.beginPath();
        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const a = field[r * cols + c]!;
            const b = field[r * cols + c + 1]!;
            const cc = field[(r + 1) * cols + c + 1]!;
            const d = field[(r + 1) * cols + c]!;
            const kase = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (cc > t ? 2 : 0) | (d > t ? 1 : 0);
            const segs = MS_SEGMENTS[kase];
            if (!segs || segs.length === 0) continue;
            const x = c * cell;
            const y = r * cell;
            for (const [e0, e1] of segs) {
              const [x0, y0] = edgePoint(e0, x, y, a, b, cc, d, t);
              const [x1, y1] = edgePoint(e1, x, y, a, b, cc, d, t);
              ctx.moveTo(x0, y0);
              ctx.lineTo(x1, y1);
            }
          }
        }
        ctx.stroke();
      };

      ctx.lineCap = 'round';
      const signalLevel = Math.floor(levels * 0.62);
      for (let i = 0; i < levels; i++) {
        const t = -0.75 + (i / (levels - 1)) * 1.5;
        const isSignal = i === signalLevel;
        ctx.strokeStyle = isSignal ? colors.signal : colors.ink;
        ctx.globalAlpha = isSignal ? Math.min(1, intensity * 4) : intensity;
        ctx.lineWidth = isSignal ? 1.1 : 0.7;
        trace(t);
      }
      ctx.globalAlpha = 1;
    },
    { stillTime: 8, deps: [seed, levels, intensity] },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />;
}
