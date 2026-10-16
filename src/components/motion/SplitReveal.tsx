import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, MEDIA, SplitText, useGSAP } from '@/lib/motion/gsap';

type Mode = 'lines' | 'words' | 'chars' | 'read';

interface SplitRevealProps {
  as?: ElementType;
  mode?: Mode;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Atraso em segundos (para coreografar com outros elementos). */
  delay?: number;
  /** Anima ao montar (hero) em vez de esperar o scroll. */
  immediate?: boolean;
}

/**
 * Revela texto com SplitText:
 * - `lines`/`words`/`chars`: sobem de dentro de uma máscara ao entrar na tela;
 * - `read`: palavras acendem conforme o scroll avança, como um marca-texto de leitura.
 * O texto continua no DOM íntegro para leitores de tela (SplitText aplica aria).
 */
export function SplitReveal({ as = 'p', mode: requested = 'lines', children, className, id, delay = 0, immediate = false }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MEDIA.motion, mobile: MEDIA.mobile }, (context) => {
        if (!context.conditions?.motion) return;
        // "Leitura" (palavras acendendo com o scroll) só no desktop: no celular o
        // parágrafo ocupa a tela inteira e ficaria apagado enquanto é lido.
        const mode = requested === 'read' && context.conditions.mobile ? 'lines' : requested;
        const split = SplitText.create(el, {
          type: mode === 'read' ? 'words' : mode === 'chars' ? 'lines,chars' : mode === 'words' ? 'lines,words' : 'lines',
          mask: mode === 'read' ? undefined : 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            if (mode === 'read') {
              return gsap.fromTo(
                self.words,
                { opacity: 0.18 },
                { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true } },
              );
            }
            const targets = mode === 'chars' ? self.chars : mode === 'words' ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: mode === 'chars' ? 6 : 0,
              duration: mode === 'chars' ? 0.9 : 1.1,
              ease: 'expo.out',
              stagger: mode === 'chars' ? 0.018 : mode === 'words' ? 0.03 : 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [children, requested] },
  );

  return createElement(as, { ref, id, className }, children);
}
