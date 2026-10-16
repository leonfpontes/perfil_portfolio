import { useEffect, useRef, useState } from 'react';
import { createColorReader, useCanvas } from '@/hooks/useCanvas';
import { cn } from '@/lib/utils';

export interface HalftoneProps {
  src: string;
  alt: string;
  className?: string;
  /** Lado da célula da retícula em px CSS. */
  cell?: number;
  /** Revelação controlada (0..1). Se omitido, anima sozinho na primeira vez que aparece. */
  progress?: number;
}

const AUTO_DURATION = 1.4;
const FEATHER = 0.28;
const LENS_RADIUS = 120;
const LENS_GAIN = 0.6;

interface Grid {
  key: string;
  cols: number;
  rows: number;
  /** Escuridão por célula, 0 (papel) a 1 (tinta cheia). */
  dark: Float32Array;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Amostra a luminância da imagem na resolução da grade, com semântica de object-fit: cover. */
function sampleGrid(img: HTMLImageElement, cols: number, rows: number): Float32Array | null {
  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  let octx: CanvasRenderingContext2D | null = null;
  try {
    octx = off.getContext('2d', { willReadFrequently: true });
  } catch {
    octx = null;
  }
  if (!octx || !img.naturalWidth || !img.naturalHeight) return null;
  const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
  const data = octx.getImageData(0, 0, cols, rows).data;
  const dark = new Float32Array(cols * rows);
  for (let i = 0; i < dark.length; i++) {
    const r = data[i * 4]!;
    const g = data[i * 4 + 1]!;
    const b = data[i * 4 + 2]!;
    const a = data[i * 4 + 3]! / 255;
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    // Leve curva de contraste: meio-tons de foto tendem a "lavar" na retícula.
    dark[i] = clamp01((1 - lum) * a * 1.08) ** 1.1;
  }
  return dark;
}

/**
 * Foto reproduzida como retícula de impressão: pontos de tinta proporcionais à sombra,
 * revelados numa varredura diagonal. O ponteiro funciona como uma lupa sobre a retícula.
 */
export function Halftone({ src, alt, className, cell = 9, progress }: HalftoneProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const gridRef = useRef<Grid | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const startRef = useRef<number | null>(null);
  const lastKeyRef = useRef('');
  const readColors = useRef(createColorReader()).current;

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
      const { width, height, pointer, time } = frame;
      if (!image) {
        if (frame.first) ctx.clearRect(0, 0, width, height);
        return;
      }

      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const gridKey = `${image.src}|${cols}x${rows}`;
      if (!gridRef.current || gridRef.current.key !== gridKey) {
        const dark = sampleGrid(image, cols, rows);
        if (!dark) return;
        gridRef.current = { key: gridKey, cols, rows, dark };
      }
      const grid = gridRef.current;

      let reveal: number;
      const controlled = progressRef.current;
      if (frame.still) {
        // Sem loop não há como acompanhar `progress`: com movimento reduzido mostramos a foto inteira.
        reveal = 1;
      } else if (controlled !== undefined) {
        reveal = clamp01(controlled);
      } else {
        // O loop só roda com o canvas na viewport, então o 1º quadro animado = 1ª interseção.
        if (startRef.current === null) startRef.current = time;
        // Reinício do loop (ex.: mudança de `cell`) zera o tempo; mantém a revelação concluída.
        else if (time < startRef.current) startRef.current = time - AUTO_DURATION;
        reveal = easeOutCubic(clamp01((time - startRef.current) / AUTO_DURATION));
      }

      // Pula o quadro quando nada visível mudou (revelação completa e ponteiro longe).
      const px = pointer.active ? Math.round(pointer.x) : -1;
      const py = pointer.active ? Math.round(pointer.y) : -1;
      const colors = readColors(ctx.canvas, frame.first);
      const drawKey = `${grid.key}|${reveal.toFixed(4)}|${px},${py}|${colors.ink}`;
      if (!frame.first && drawKey === lastKeyRef.current) return;
      lastKeyRef.current = drawKey;

      ctx.clearRect(0, 0, width, height);
      if (reveal <= 0) return;
      ctx.fillStyle = colors.ink;
      ctx.beginPath();
      const maxR = cell * 0.52;
      const sweep = reveal * (1 + FEATHER);
      for (let r = 0; r < grid.rows; r++) {
        const cy = r * cell + cell / 2;
        for (let c = 0; c < grid.cols; c++) {
          const d = grid.dark[r * grid.cols + c]!;
          if (d < 0.04) continue;
          const cx = c * cell + cell / 2;
          // Varredura diagonal: 0 no canto superior esquerdo, 1 no inferior direito.
          const diag = (cx / width + cy / height) / 2;
          const local = clamp01((sweep - diag) / FEATHER);
          if (local <= 0) continue;
          let lens = 1;
          if (pointer.active) {
            const dx = cx - pointer.x;
            const dy = cy - pointer.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < LENS_RADIUS * LENS_RADIUS) {
              const k = 1 - Math.sqrt(dist2) / LENS_RADIUS;
              lens = 1 + LENS_GAIN * k * k * (3 - 2 * k);
            }
          }
          const radius = d * maxR * easeOutCubic(local) * lens;
          if (radius < 0.25) continue;
          ctx.moveTo(cx + radius, cy);
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    },
    { deps: [image, cell] },
  );

  return (
    <div ref={wrapperRef} role="img" aria-label={alt} className={cn('relative overflow-hidden', className)}>
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
