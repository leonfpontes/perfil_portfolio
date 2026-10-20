import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface CanvasPointer {
  /** Posição em px CSS relativa ao canto superior esquerdo do canvas. */
  x: number;
  y: number;
  /** `true` enquanto o ponteiro está sobre a área do canvas. */
  active: boolean;
}

export interface CanvasFrame {
  /** Segundos acumulados de animação (pausas não contam). */
  time: number;
  /** Segundos desde o quadro anterior (limitado a 0.1 para não "pular" após pausas). */
  dt: number;
  width: number;
  height: number;
  pointer: CanvasPointer;
  /** `true` no primeiro quadro após montar ou redimensionar — hora de (re)construir estado. */
  first: boolean;
  /** `true` quando não há loop (animate: false ou movimento reduzido): este quadro fica estático. */
  still: boolean;
}

export type CanvasDraw = (ctx: CanvasRenderingContext2D, frame: CanvasFrame) => void;

export interface UseCanvasOptions {
  /** Liga o loop de animação (padrão `true`). Movimento reduzido sempre força quadro estático. */
  animate?: boolean;
  /** Tempo usado no quadro estático — escolha um momento bonito da animação. */
  stillTime?: number;
  /** Mudanças nestas dependências reiniciam o canvas (novo quadro com `first: true`). */
  deps?: DependencyList;
}

const MAX_DPR = 2;

/**
 * Infra comum dos canvas de arte: escala por DPR, resize, ponteiro e um loop rAF
 * que só roda com o canvas visível e a aba ativa — arte decorativa não pode custar bateria.
 * O `draw` é responsável por limpar o canvas (permite pular quadros sem mudança).
 */
export function useCanvas(draw: CanvasDraw, options: UseCanvasOptions = {}): RefObject<HTMLCanvasElement | null> {
  const { animate = true, stillTime = 12, deps = [] } = options;
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const reduced = useReducedMotion();
  const animated = animate && !reduced;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    const context = ctx;

    const pointer: CanvasPointer = { x: -9999, y: -9999, active: false };
    const frame: CanvasFrame = {
      time: animated ? 0 : stillTime,
      dt: 0,
      width: 0,
      height: 0,
      pointer,
      first: true,
      still: !animated,
    };

    let rafId = 0;
    let last = 0;
    let inView = typeof IntersectionObserver === 'undefined';
    let pageVisible = typeof document === 'undefined' || document.visibilityState !== 'hidden';

    const render = () => {
      if (frame.width <= 0 || frame.height <= 0) return;
      drawRef.current(context, frame);
      frame.first = false;
    };

    const resize = () => {
      // Tamanho de layout, não o visual: getBoundingClientRect inclui transformações, e a
      // entrada do hero começa com o bloco achatado (scaleY 0). Medido nesse instante, o
      // canvas ficava com altura 0 e era esticado depois (os azulejos viravam faixas).
      // O ResizeObserver não avisa de mudanças de transform, então o erro não se corrigia.
      let w = canvas.clientWidth;
      let h = canvas.clientHeight;
      if (!w && !h) {
        // Ambientes sem layout (testes): cai no retângulo medido.
        const rect = canvas.getBoundingClientRect();
        w = Math.round(rect.width);
        h = Math.round(rect.height);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.max(0, Math.round(w));
      h = Math.max(0, Math.round(h));
      if (w === frame.width && h === frame.height && canvas.width === Math.round(w * dpr)) return;
      frame.width = w;
      frame.height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame.first = true;
      frame.dt = 0;
      // Sem loop ativo, redesenha na hora; com loop, o próximo tick cuida.
      if (!rafId) render();
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      frame.dt = dt;
      frame.time += dt;
      render();
    };

    const sync = () => {
      const shouldRun = animated && inView && pageVisible;
      if (shouldRun && !rafId) {
        last = 0;
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onPointerOut = (e: PointerEvent) => {
      // relatedTarget nulo = ponteiro saiu da janela.
      if (!e.relatedTarget) pointer.active = false;
    };
    const onVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden';
      sync();
    };

    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize());
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          inView = entry?.isIntersecting ?? false;
          sync();
        },
        { rootMargin: '100px' },
      );
      io.observe(canvas);
    }

    if (animated) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerout', onPointerOut, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibility);
    sync();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      ro?.disconnect();
      io?.disconnect();
      if (!ro) window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, stillTime, ...deps]);

  return ref;
}

export interface CanvasColors {
  /** Cor da tinta (`color` computado do canvas — herda o --foreground da cena). */
  ink: string;
  /** Cor de destaque (`--signal`). */
  signal: string;
  /** Família mono para rótulos técnicos. */
  mono: string;
}

/**
 * Lê as cores do tema direto do CSS computado, com cache curto: o GSAP interpola as
 * custom properties por cena, então a arte precisa acompanhar sem `getComputedStyle` a cada quadro.
 */
export function createColorReader(intervalMs = 250) {
  let lastRead = -Infinity;
  const colors: CanvasColors = { ink: '#1a1a1a', signal: '#e0482b', mono: 'ui-monospace, monospace' };
  return (canvas: HTMLCanvasElement, force = false): CanvasColors => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (!force && now - lastRead < intervalMs) return colors;
    lastRead = now;
    const style = getComputedStyle(canvas);
    colors.ink = style.color || colors.ink;
    colors.signal = style.getPropertyValue('--signal').trim() || colors.signal;
    colors.mono = style.getPropertyValue('--font-mono').trim() || colors.mono;
    return colors;
  };
}
