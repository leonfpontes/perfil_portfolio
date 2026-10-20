import { useRef } from 'react';
import { createColorReader, useCanvas, type CanvasFrame } from '@/hooks/useCanvas';
import { createNoise, type NoiseFn } from '@/lib/art/noise';
import { createRandom, type Random } from '@/lib/art/random';
import { cn } from '@/lib/utils';

export interface FlowFieldProps {
  /** Multiplicador da quantidade de traços (1 ≈ um agente a cada 9000px²). */
  density?: number;
  seed?: string;
  className?: string;
}

/** Pontos por rastro: define o comprimento visível de cada traço. */
const TRAIL = 64;
/** Faixas de idade do rastro; cada faixa vira um único stroke com alpha próprio. */
const BUCKETS = 8;
const PER_BUCKET = TRAIL / BUCKETS;
const MAX_AGENTS = 420;
const NOISE_SCALE = 0.0017;
const TIME_SCALE = 0.035;
const SPEED = 1.7;
const REPEL_RADIUS = 160;

interface FieldState {
  key: string;
  count: number;
  xs: Float32Array;
  ys: Float32Array;
  len: Uint8Array;
  life: Float32Array;
  signal: Uint8Array;
  head: number;
  noise: NoiseFn;
  rnd: Random;
}

function createField(seed: string, density: number, width: number, height: number): FieldState {
  const rnd = createRandom(seed);
  const count = Math.max(40, Math.min(MAX_AGENTS, Math.round(((width * height) / 14000) * density)));
  const state: FieldState = {
    key: `${seed}|${density}|${width}x${height}`,
    count,
    xs: new Float32Array(count * TRAIL),
    ys: new Float32Array(count * TRAIL),
    len: new Uint8Array(count),
    life: new Float32Array(count),
    signal: new Uint8Array(count),
    head: 0,
    noise: createNoise(seed),
    rnd,
  };
  for (let a = 0; a < count; a++) {
    state.signal[a] = rnd.next() < 0.05 ? 1 : 0;
    spawn(state, a, 0, width, height);
  }
  return state;
}

function spawn(s: FieldState, a: number, slot: number, width: number, height: number) {
  s.xs[a * TRAIL + slot] = s.rnd.range(-20, width + 20);
  s.ys[a * TRAIL + slot] = s.rnd.range(-20, height + 20);
  s.len[a] = 1;
  s.life[a] = s.rnd.range(80, 260);
}

/** Avança todos os agentes um passo ao longo do campo de ruído (escrevendo no próximo slot do anel). */
function step(s: FieldState, frame: CanvasFrame, amount: number) {
  const { width, height, pointer, time } = frame;
  const next = (s.head + 1) % TRAIL;
  const z = time * TIME_SCALE;
  const v = SPEED * amount;
  const repel = pointer.active;
  for (let a = 0; a < s.count; a++) {
    const base = a * TRAIL;
    const x = s.xs[base + s.head]!;
    const y = s.ys[base + s.head]!;
    s.life[a]! -= amount;
    if (s.life[a]! <= 0 || x < -40 || y < -40 || x > width + 40 || y > height + 40) {
      spawn(s, a, next, width, height);
      continue;
    }
    // Ruído em [-1,1] → ângulo; o fator 1.6π mantém correntes longas, como linhas de gravura.
    const angle = s.noise(x * NOISE_SCALE, y * NOISE_SCALE, z) * Math.PI * 1.6;
    let nx = x + Math.cos(angle) * v;
    let ny = y + Math.sin(angle) * v;
    if (repel) {
      const dx = nx - pointer.x;
      const dy = ny - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (1 - d / REPEL_RADIUS) ** 2 * 2.2 * amount;
        nx += (dx / d) * f;
        ny += (dy / d) * f;
      }
    }
    s.xs[base + next] = nx;
    s.ys[base + next] = ny;
    if (s.len[a]! < TRAIL) s.len[a]! += 1;
  }
  s.head = next;
}

/** Desenha os rastros em lotes (cor × faixa de idade): ~12 strokes por quadro, independente do nº de agentes. */
function paint(ctx: CanvasRenderingContext2D, s: FieldState, isSignal: 0 | 1, color: string, baseAlpha: number) {
  ctx.strokeStyle = color;
  for (let b = 0; b < BUCKETS; b++) {
    const from = b * PER_BUCKET;
    ctx.globalAlpha = baseAlpha * (1 - b / BUCKETS) ** 1.3;
    ctx.beginPath();
    for (let a = 0; a < s.count; a++) {
      if (s.signal[a] !== isSignal) continue;
      const len = s.len[a]!;
      if (len - 1 <= from) continue;
      const to = Math.min(from + PER_BUCKET, len - 1);
      const base = a * TRAIL;
      let slot = (s.head - from + TRAIL) % TRAIL;
      ctx.moveTo(s.xs[base + slot]!, s.ys[base + slot]!);
      for (let k = from + 1; k <= to; k++) {
        slot = (s.head - k + TRAIL) % TRAIL;
        ctx.lineTo(s.xs[base + slot]!, s.ys[base + slot]!);
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Campo de fluxo em traço fino, como linhas de gravura que se reorganizam devagar.
 * Fundo sempre transparente: o papel da página (que muda por cena) aparece por trás.
 */
export function FlowField({ density = 1, seed = 'dossier', className }: FlowFieldProps) {
  const stateRef = useRef<FieldState | null>(null);
  const readColors = useRef(createColorReader()).current;

  const ref = useCanvas(
    (ctx, frame) => {
      const { width, height } = frame;
      const key = `${seed}|${density}|${width}x${height}`;
      let s = stateRef.current;
      if (frame.first || !s || s.key !== key) {
        s = createField(seed, density, width, height);
        stateRef.current = s;
        // Pré-aquece os rastros para o primeiro quadro (e o estático) já ter textura.
        for (let i = 0; i < TRAIL * 2; i++) step(s, frame, 1);
      } else {
        step(s, frame, Math.min(frame.dt * 60, 3));
      }

      const colors = readColors(ctx.canvas, frame.first);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.9;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      paint(ctx, s, 0, colors.ink, 0.42);
      paint(ctx, s, 1, colors.signal, 0.85);
    },
    { stillTime: 18, deps: [seed, density] },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />;
}
