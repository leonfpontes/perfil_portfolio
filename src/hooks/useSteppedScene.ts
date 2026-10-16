import { useCallback, useRef, useState, type RefObject } from 'react';
import { gsap, MEDIA, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { useSmoothScroll } from '@/lib/motion/SmoothScroll';
import { sceneSectionOf } from '@/components/motion/Scene';

interface SteppedSceneOptions {
  count: number;
  /** Qualquer elemento dentro da cena; o <section> que o contém é fixado. */
  scopeRef: RefObject<HTMLElement | null>;
  /** Altura de scroll por passo, em % da viewport. */
  stepLength?: number;
}

/**
 * Cena "em passos": fixa a seção e converte o progresso do scroll em um
 * índice (0..count-1). No celular ou sem movimento (reduced motion), vira um
 * carrossel comum controlado por `goTo`. Os mesmos botões funcionam nos dois modos.
 */
export function useSteppedScene({ count, scopeRef, stepLength = 70 }: SteppedSceneOptions) {
  const [index, setIndex] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Só fixa no desktop: no celular o conteúdo de um passo não cabe numa tela.
      mm.add(MEDIA.desktop, () => {
        triggerRef.current = ScrollTrigger.create({
          trigger: sceneSectionOf(scopeRef.current),
          pin: true,
          start: 'top top',
          end: `+=${count * stepLength}%`,
          onUpdate: (self) => setIndex(Math.min(count - 1, Math.floor(self.progress * count))),
        });
        return () => {
          triggerRef.current = null;
        };
      });
    },
    { dependencies: [count, stepLength] },
  );

  const goTo = useCallback(
    (next: number) => {
      const target = (next + count) % count;
      const st = triggerRef.current;
      if (!st) return setIndex(target);
      // Rola até o meio do trecho correspondente ao passo — o índice segue o scroll.
      scrollTo(st.start + ((target + 0.5) / count) * (st.end - st.start));
    },
    [count, scrollTo],
  );

  return { index, goTo };
}

/**
 * Coreografa a troca entre itens empilhados (mesma célula de grid, desktop):
 * o anterior sai primeiro e só então o novo entra — nunca dois textos
 * sobrepostos, mesmo com scroll rápido.
 */
export function useStepTransition(scopeRef: RefObject<HTMLElement | null>, index: number, selector = '[data-step-item]') {
  const prev = useRef(index);
  useGSAP(
    () => {
      const from = prev.current;
      prev.current = index;
      if (from === index) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const items = gsap.utils.toArray<HTMLElement>(selector, scopeRef.current);
        const out = items[from];
        const inn = items[index];
        const dir = index > from ? 1 : -1;
        // Interrompe qualquer troca anterior e esconde os demais na hora.
        gsap.killTweensOf(items);
        items.forEach((el) => el !== out && el !== inn && gsap.set(el, { clearProps: 'all' }));
        const tl = gsap.timeline();
        if (out) tl.fromTo(out, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -32 * dir, duration: 0.28, ease: 'power2.in' });
        if (inn) tl.fromTo(inn, { autoAlpha: 0, y: 40 * dir }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' });
        tl.add(() => items.forEach((el) => gsap.set(el, { clearProps: 'all' })));
      });
    },
    { dependencies: [index], scope: scopeRef },
  );
}
