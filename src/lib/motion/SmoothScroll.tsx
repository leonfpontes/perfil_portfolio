import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, ScrollTrigger } from './gsap';

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollValue {
  /** Rola até um seletor, elemento ou posição — suave com Lenis, nativo sem ele. */
  scrollTo: (target: ScrollTarget, options?: { immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: (target) => nativeScrollTo(target),
});

const HEADER_OFFSET = -56;

function nativeScrollTo(target: ScrollTarget) {
  if (typeof target === 'number') return window.scrollTo({ top: target });
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView();
}

/**
 * Scroll suave com Lenis, sincronizado ao relógio do GSAP para que
 * ScrollTrigger e Lenis andem no mesmo frame (sem "tremidas" em pins).
 * Desligado com prefers-reduced-motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    let lenis: Lenis;
    try {
      lenis = new Lenis({ autoRaf: false, lerp: 0.09, anchors: { offset: HEADER_OFFSET } });
    } catch {
      return; // ambiente sem suporte (ex.: testes) — segue com scroll nativo
    }
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback((target: ScrollTarget, options?: { immediate?: boolean }) => {
    const lenis = lenisRef.current;
    if (!lenis) return nativeScrollTo(target);
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : HEADER_OFFSET, immediate: options?.immediate, duration: 1.4 });
  }, []);

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollValue {
  return useContext(SmoothScrollContext);
}
