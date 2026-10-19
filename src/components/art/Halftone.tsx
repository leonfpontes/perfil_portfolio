import { useEffect, useRef, useState } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { cn } from '@/lib/utils';

export interface HalftoneProps {
  src: string;
  alt: string;
  className?: string;
  /** Lado da célula da retícula em px CSS. */
  cell?: number;
}

/** Raio da lupa (desktop) em px CSS. */
const LENS_RADIUS = 110;
/** Parte da revelação ocupada só pela retícula; depois ela se funde à foto. */
const DOTS_PHASE = 0.35;

type RGB = [number, number, number];

interface Prepared {
  key: string;
  cols: number;
  rows: number;
  /** Escuridão por célula da retícula, 0 (papel) a 1 (tinta cheia). */
  dark: Float32Array;
  /** Foto em duotônico da marca, na resolução real do canvas. */
  duotone: HTMLCanvasElement;
  ink: string;
  paper: string;
}

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Converte qualquer cor CSS (inclusive oklch) em RGB, pintando 1 pixel. */
function cssToRgb(color: string, fallback: RGB): RGB {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const x = c.getContext('2d', { willReadFrequently: true });
    if (!x) return fallback;
    x.fillStyle = color;
    x.fillRect(0, 0, 1, 1);
    const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
    return [r!, g!, b!];
  } catch {
    return fallback;
  }
}

/** Desenha a imagem com semântica de object-fit: cover num canvas novo de w×h. */
function cover(img: HTMLImageElement, w: number, h: number): CanvasRenderingContext2D | null {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  let x: CanvasRenderingContext2D | null = null;
  try {
    x = c.getContext('2d', { willReadFrequently: true });
  } catch {
    x = null;
  }
  if (!x || !img.naturalWidth || !img.naturalHeight) return null;
  const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
  return x;
}

const luminance = (d: Uint8ClampedArray, i: number) => (0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]!) / 255;

/** Prepara a grade da retícula e a versão duotônica da foto (uma vez por tamanho). */
function prepare(img: HTMLImageElement, width: number, height: number, dpr: number, cell: number, ink: RGB, paper: RGB): Omit<Prepared, 'key' | 'ink' | 'paper'> | null {
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const small = cover(img, cols, rows);
  const full = cover(img, width * dpr, height * dpr);
  if (!small || !full) return null;

  const sd = small.getImageData(0, 0, cols, rows).data;
  const dark = new Float32Array(cols * rows);
  for (let i = 0; i < dark.length; i++) {
    // Leve curva de contraste: meio-tons de foto tendem a "lavar" na retícula.
    dark[i] = clamp01((1 - luminance(sd, i * 4)) * 1.08) ** 1.1;
  }

  // Duotônico: sombras na tinta da marca, luzes no papel — como uma impressão a duas cores.
  const image = full.getImageData(0, 0, full.canvas.width, full.canvas.height);
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    const t = clamp01((luminance(d, i) - 0.04) / 0.92) ** 0.95;
    d[i] = ink[0] + (paper[0] - ink[0]) * t;
    d[i + 1] = ink[1] + (paper[1] - ink[1]) * t;
    d[i + 2] = ink[2] + (paper[2] - ink[2]) * t;
    d[i + 3] = 255;
  }
  full.putImageData(image, 0, 0);
  return { cols, rows, dark, duotone: full.canvas };
}

/**
 * Foto que "se revela": entra como retícula de impressão e, conforme chega ao
 * centro da tela, os pontos se fundem numa foto duotônica nas cores da marca.
 * No desktop, o cursor funciona como uma lupa que revela a foto antes.
 *
 * Sempre impressa em tinta-sobre-papel (cores fixas da marca), em qualquer tema:
 * nunca aparece em negativo. Sem animação (modo suave), mostra a foto pronta.
 */
export function Halftone({ src, alt, className, cell = 8 }: HalftoneProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const preparedRef = useRef<Prepared | null>(null);
  const lastKeyRef = useRef('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // A foto só é baixada quando a figura se aproxima da tela (economiza dados no celular).
  useEffect(() => {
    setImage(null);
    if (typeof Image === 'undefined') return;
    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    const load = () => {
      img.src = src;
    };
    const el = wrapperRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            observer?.disconnect();
            load();
          }
        },
        { rootMargin: '600px 0px' },
      );
      observer.observe(el);
    } else {
      load();
    }
    return () => {
      cancelled = true;
      img.onload = null;
      observer?.disconnect();
    };
  }, [src]);

  const ref = useCanvas(
    (ctx, frame) => {
      const { width, height, pointer } = frame;
      if (!image) {
        if (frame.first) ctx.clearRect(0, 0, width, height);
        return;
      }

      const dpr = width > 0 ? ctx.canvas.width / width : 1;
      const key = `${image.src}|${Math.round(width)}x${Math.round(height)}|${cell}|${dpr}`;
      let p = preparedRef.current;
      if (!p || p.key !== key) {
        const style = getComputedStyle(ctx.canvas);
        const inkCss = style.getPropertyValue('--breu').trim() || '#13261f';
        const paperCss = style.getPropertyValue('--cal').trim() || '#f7f7f2';
        const prepared = prepare(image, width, height, dpr, cell, cssToRgb(inkCss, [19, 38, 31]), cssToRgb(paperCss, [247, 247, 242]));
        if (!prepared) return;
        p = { ...prepared, key, ink: inkCss, paper: paperCss };
        preparedRef.current = p;
      }

      // Progresso da revelação pela posição na tela: 0 quando a figura surge
      // embaixo, 1 quando o centro dela chega a ~55% da altura da janela.
      let progress = 1;
      if (!frame.still) {
        const rect = ctx.canvas.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        progress = clamp01((vh - rect.top) / (vh * 0.45 + rect.height / 2));
      }
      const fuse = smoothstep(DOTS_PHASE, 1, progress); // 0 = só retícula, 1 = só foto
      const sweep = clamp01(progress / DOTS_PHASE); // varredura diagonal dos pontos

      const lensOn = pointer.active && fuse < 1 && window.matchMedia?.('(pointer: fine)').matches;
      const px = lensOn ? Math.round(pointer.x) : -1;
      const py = lensOn ? Math.round(pointer.y) : -1;
      const drawKey = `${key}|${fuse.toFixed(3)}|${sweep.toFixed(3)}|${px},${py}`;
      if (!frame.first && drawKey === lastKeyRef.current) return;
      lastKeyRef.current = drawKey;

      // Papel.
      ctx.fillStyle = p.paper;
      ctx.fillRect(0, 0, width, height);

      // Retícula (some à medida que a foto se forma).
      if (fuse < 1) {
        ctx.globalAlpha = 1 - fuse;
        ctx.fillStyle = p.ink;
        ctx.beginPath();
        // Os pontos crescem ao se fundir, como tinta espalhando no papel.
        const maxR = cell * (0.52 + 0.35 * fuse);
        for (let r = 0; r < p.rows; r++) {
          const cy = r * cell + cell / 2;
          for (let c = 0; c < p.cols; c++) {
            const d = p.dark[r * p.cols + c]!;
            if (d < 0.04) continue;
            const cx = c * cell + cell / 2;
            const diag = (cx / width + cy / height) / 2;
            const local = clamp01((sweep * 1.3 - diag) / 0.3);
            if (local <= 0) continue;
            const radius = d * maxR * local;
            if (radius < 0.3) continue;
            ctx.moveTo(cx + radius, cy);
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          }
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Foto duotônica (aparece por cima conforme se funde).
      if (fuse > 0) {
        ctx.globalAlpha = fuse;
        ctx.drawImage(p.duotone, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      // Lupa: o cursor revela a foto dentro de um círculo.
      if (lensOn) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, LENS_RADIUS, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(p.duotone, 0, 0, width, height);
        ctx.restore();
        ctx.strokeStyle = p.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, LENS_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    { deps: [image, cell] },
  );

  return (
    <div ref={wrapperRef} role="img" aria-label={alt} className={cn('relative overflow-hidden', className)}>
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
