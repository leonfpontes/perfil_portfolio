import type { CanvasColors, CanvasFrame } from '@/hooks/useCanvas';
import type { NoiseFn } from '@/lib/art/noise';
import type { Random } from '@/lib/art/random';

export type CoverVariant = 'rings' | 'gates' | 'radar' | 'contour';

export interface CoverContext {
  /** PRNG recriado a cada quadro com a mesma semente: layout estável, sem guardar estado. */
  rnd: Random;
  noise: NoiseFn;
  colors: CanvasColors;
}

/** Estratégia de desenho de uma capa. Recebe o canvas já limpo e com transform de DPR aplicado. */
export type CoverPainter = (ctx: CanvasRenderingContext2D, frame: CanvasFrame, env: CoverContext) => void;

const TAU = Math.PI * 2;

function monoFont(colors: CanvasColors, size: number): string {
  return `500 ${Math.round(size)}px ${colors.mono}`;
}

/** GiraHub — selo/carimbo de círculos concêntricos e excêntricos: comunidade como roda. */
const rings: CoverPainter = (ctx, { width, height, time }, { rnd, colors }) => {
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(width, height) * 0.4;
  const rot = time * 0.06;
  ctx.strokeStyle = colors.ink;
  ctx.fillStyle = colors.ink;

  // Borda dupla do selo.
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TAU);
  ctx.stroke();
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.955, 0, TAU);
  ctx.stroke();

  // Régua de marcações girando devagar.
  ctx.beginPath();
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * TAU + rot;
    const long = i % 10 === 0;
    const r0 = R * 0.955;
    const r1 = r0 - (long ? R * 0.07 : R * 0.03);
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
  }
  ctx.stroke();

  // Legenda circular em mono, no sentido contrário.
  const text = 'GIRAHUB · MULTI-TENANT · LGPD · ';
  const textR = R * 0.8;
  const fontSize = Math.max(8, R * 0.075);
  ctx.font = monoFont(colors, fontSize);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.85;
  const step = TAU / text.length;
  for (let i = 0; i < text.length; i++) {
    const a = i * step - rot * 0.7;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * textR, cy + Math.sin(a) * textR);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(text[i]!, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Anéis excêntricos: cada "membro" gira em torno do centro comum.
  const count = rnd.int(6, 9);
  ctx.lineWidth = 0.7;
  let signalRing = { x: cx, y: cy, r: 0 };
  const signalIndex = rnd.int(0, count - 1);
  for (let i = 0; i < count; i++) {
    const r = R * rnd.range(0.18, 0.62);
    const off = R * rnd.range(0.02, 0.1);
    const phase = rnd.range(0, TAU);
    const speed = rnd.range(0.3, 1) * (rnd.next() < 0.5 ? -1 : 1);
    const a = phase + time * 0.08 * speed;
    const x = cx + Math.cos(a) * off;
    const y = cy + Math.sin(a) * off;
    if (i === signalIndex) signalRing = { x, y, r };
    ctx.globalAlpha = rnd.range(0.45, 0.9);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Anel tracejado interno.
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.68, rot * -1.4, rot * -1.4 + TAU);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arco e ponto de destaque percorrendo um dos anéis.
  const orbit = time * 0.35;
  ctx.strokeStyle = colors.signal;
  ctx.fillStyle = colors.signal;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(signalRing.x, signalRing.y, signalRing.r, orbit - 0.9, orbit);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(signalRing.x + Math.cos(orbit) * signalRing.r, signalRing.y + Math.sin(orbit) * signalRing.r, 3, 0, TAU);
  ctx.fill();

  // Mira central.
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();
};

/** Portal PMO — corredor de 5 portões (gates) em perspectiva, com a linha de progresso atravessando-os. */
const gates: CoverPainter = (ctx, { width, height, time }, { colors }) => {
  const GATES = 5;
  const z0 = 1.4;
  const dz = 1.05;
  const cx = width * 0.56;
  const cy = height * 0.5;
  const f = Math.min(height * 0.4, width * 0.55) * z0;
  const camX = -0.55;
  const project = (x: number, y: number, z: number): [number, number] => [cx + ((x - camX) * f) / z, cy + (y * f) / z];
  const halfW = 0.62;

  // Linha de progresso: avança pelo corredor e recomeça.
  const zEnd = z0 + dz * (GATES - 1) + 0.5;
  const p = (time * 0.09) % 1;
  const zLine = z0 - 0.3 + p * (zEnd - z0 + 0.3);
  const active = Math.max(-1, Math.min(GATES - 1, Math.floor((zLine - z0) / dz)));

  // Trilhos do piso e do teto até o ponto de fuga.
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  for (const [x, y] of [[-halfW, 1], [halfW, 1], [-halfW, -1], [halfW, -1]] as const) {
    const [ax, ay] = project(x, y, z0 - 0.4);
    const [bx, by] = project(x, y, zEnd + 2);
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  // Travessas do piso, como régua de profundidade.
  for (let z = z0 - 0.4; z < zEnd; z += dz / 4) {
    const [ax, ay] = project(-halfW, 1, z);
    const [bx, by] = project(halfW, 1, z);
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Do mais distante ao mais próximo, para os rótulos próximos ficarem por cima.
  for (let i = GATES - 1; i >= 0; i--) {
    const z = z0 + i * dz;
    const highlighted = i === active;
    const [lx, ty] = project(-halfW, -1, z);
    const [rx, by] = project(halfW, 1, z);
    const inset = (0.08 * f) / z;
    ctx.strokeStyle = highlighted ? colors.signal : colors.ink;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = highlighted ? 1.6 : 1;
    ctx.strokeRect(lx, ty, rx - lx, by - ty);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(lx + inset, ty + inset, rx - lx - inset * 2, by - ty - inset);
    // Portão concluído ganha hachura fina (marca de "aprovado").
    if (i < active) {
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      const hatch = Math.max(3, (0.09 * f) / z);
      for (let x = lx + inset + hatch; x < rx - inset; x += hatch) {
        ctx.moveTo(x, by - inset * 0.5);
        ctx.lineTo(x, by - inset * 2);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    const size = Math.max(8, (0.14 * f) / z);
    ctx.font = monoFont(colors, size);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`G${i + 1}`, lx, ty - size * 0.3);
  }

  // Linha de progresso no piso.
  if (zLine > z0 - 0.4) {
    const [ax, ay] = project(-halfW, 1, zLine);
    const [bx, by] = project(halfW, 1, zLine);
    const [tx, ty] = project(-halfW, -1, zLine);
    ctx.strokeStyle = colors.signal;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.lineWidth = 0.6;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
  }
};

/** LP Diagnóstico — radar de maturidade com 6 eixos e polígono "respirando". */
const radar: CoverPainter = (ctx, { width, height, time }, { rnd, colors }) => {
  const AXES = 6;
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(width, height) * 0.36;
  const angle = (i: number) => -Math.PI / 2 + (i / AXES) * TAU;

  ctx.strokeStyle = colors.ink;
  ctx.fillStyle = colors.ink;

  // Grade hexagonal (níveis de maturidade).
  ctx.lineWidth = 0.6;
  for (let level = 1; level <= 5; level++) {
    const r = (R * level) / 5;
    ctx.globalAlpha = level === 5 ? 0.9 : 0.4;
    ctx.beginPath();
    for (let i = 0; i <= AXES; i++) {
      const a = angle(i % AXES);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Eixos com marcações finas.
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  for (let i = 0; i < AXES; i++) {
    const a = angle(i);
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + ux * R * 1.08, cy + uy * R * 1.08);
    for (let t = 1; t < 20; t++) {
      const r = (R * t) / 20;
      const k = t % 4 === 0 ? 3 : 1.5;
      ctx.moveTo(cx + ux * r - uy * k, cy + uy * r + ux * k);
      ctx.lineTo(cx + ux * r + uy * k, cy + uy * r - ux * k);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Rótulos dos eixos.
  const size = Math.max(8, R * 0.075);
  ctx.font = monoFont(colors, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < AXES; i++) {
    const a = angle(i);
    ctx.fillText(`D${i + 1}`, cx + Math.cos(a) * R * 1.2, cy + Math.sin(a) * R * 1.2);
  }

  // Polígono de pontuação: base estável por semente + respiração lenta.
  const points: [number, number][] = [];
  for (let i = 0; i < AXES; i++) {
    const base = rnd.range(0.42, 0.88);
    const v = Math.min(1, Math.max(0.1, base + 0.06 * Math.sin(time * 0.7 + i * 1.3)));
    const a = angle(i);
    points.push([cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]);
  }
  ctx.strokeStyle = colors.signal;
  ctx.fillStyle = colors.signal;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.globalAlpha = 0.08;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  for (const [x, y] of points) {
    ctx.moveTo(x + 2.6, y);
    ctx.arc(x, y, 2.6, 0, TAU);
  }
  ctx.fill();
};

/**
 * Segmentos do marching squares por caso (bits: tl=8, tr=4, br=2, bl=1).
 * Arestas: 0 topo, 1 direita, 2 base, 3 esquerda.
 */
const MS_SEGMENTS: readonly (readonly [number, number])[][] = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[3, 0], [2, 1]], [[0, 2]], [[3, 0]],
  [[3, 0]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
];

/** PlantMap — curvas de nível topográficas com alguns pinos de localização. */
const contour: CoverPainter = (ctx, { width, height, time }, { rnd, noise, colors }) => {
  const cell = Math.max(6, Math.min(width, height) / 60);
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const scale = 1 / (Math.min(width, height) * 0.45);
  const z = time * 0.025;
  const field = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell * scale;
      const y = r * cell * scale;
      field[r * cols + c] = noise(x, y, z) * 0.75 + noise(x * 2.3 + 17, y * 2.3, z * 1.4) * 0.25;
    }
  }

  const LEVELS = 13;
  const edgePoint = (edge: number, x: number, y: number, a: number, b: number, c: number, d: number, t: number): [number, number] => {
    const lerp = (v0: number, v1: number) => (t - v0) / (v1 - v0 || 1e-6);
    switch (edge) {
      case 0: return [x + lerp(a, b) * cell, y];
      case 1: return [x + cell, y + lerp(b, c) * cell];
      case 2: return [x + lerp(d, c) * cell, y + cell];
      default: return [x, y + lerp(a, d) * cell];
    }
  };
  /** Traça no path atual as isolinhas dos níveis mestres (a cada 4) ou das intermediárias. */
  const traceLevels = (master: boolean) => {
    ctx.beginPath();
    for (let l = 0; l < LEVELS; l++) {
      if ((l % 4 === 0) !== master) continue;
      const t = -0.72 + (l / (LEVELS - 1)) * 1.44;
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
    }
  };

  ctx.strokeStyle = colors.ink;
  ctx.lineCap = 'round';
  // Gratícula cartográfica bem leve.
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 1; i < 4; i++) {
    ctx.moveTo((width * i) / 4, 0);
    ctx.lineTo((width * i) / 4, height);
    ctx.moveTo(0, (height * i) / 4);
    ctx.lineTo(width, (height * i) / 4);
  }
  ctx.stroke();
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 0.6;
  traceLevels(false);
  ctx.stroke();
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.1;
  traceLevels(true);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Pinos: posições fixas por semente, leve "pulso" no anel.
  const pins = rnd.int(3, 5);
  const size = Math.max(8, Math.min(width, height) * 0.032);
  ctx.font = monoFont(colors, size);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < pins; i++) {
    const x = rnd.range(0.15, 0.85) * width;
    const y = rnd.range(0.2, 0.85) * height;
    const pulse = 6 + 3 * (0.5 + 0.5 * Math.sin(time * 1.2 + i * 2));
    ctx.strokeStyle = colors.signal;
    ctx.fillStyle = colors.signal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - 16, 3.5, 0, TAU);
    ctx.fill();
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = colors.ink;
    ctx.fillText(`P${String(i + 1).padStart(2, '0')}`, x + 8, y - 16);
  }
};

/** Registro de estratégias: adicionar uma capa nova é só incluir um painter aqui. */
export const coverPainters: Record<CoverVariant, CoverPainter> = { rings, gates, radar, contour };
