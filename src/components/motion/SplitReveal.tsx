import { Children, createElement, isValidElement, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, MEDIA, SplitText, useGSAP } from '@/lib/motion/gsap';

type Mode = 'lines' | 'words' | 'chars' | 'read';

/** Texto "achatado" dos filhos — muda sempre que o conteúdo visível muda. */
export function textKey(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => (isValidElement<{ children?: ReactNode }>(child) ? textKey(child.props.children) : String(child)))
    .join('');
}

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
 * No celular, uma única entrada do bloco (sem dividir o texto).
 */
export function SplitReveal({ as = 'p', mode: requested = 'lines', children, className, id, delay = 0, immediate = false }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      // Celular: sem SplitText (medir cada linha/palavra custa caro na CPU do
      // aparelho). O bloco inteiro sobe uma vez; no hero, nem isso.
      // Modo suave: nada se mexe. Regra geral: a animação move, nunca esconde o texto.
      mm.add(MEDIA.mobile, () => {
        if (immediate) return;
        gsap.from(el, { y: 24, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      mm.add(MEDIA.desktop, () => {
        const mode = requested;
        const split = SplitText.create(el, {
          // O texto continua no DOM íntegro (só envolto em spans); sem aria-label em <p>.
          aria: 'none',
          type: mode === 'read' ? 'words' : mode === 'chars' ? 'lines,chars' : mode === 'words' ? 'lines,words' : 'lines',
          // Máscara (texto que "sobe" de trás de um corte) só nos caracteres de um título
          // de uma linha; em linhas e palavras o texto só se desloca, sempre visível.
          mask: mode === 'chars' ? 'lines' : undefined,
          linesClass: mode === 'chars' ? 'split-line' : undefined,
          autoSplit: true,
          onSplit(self) {
            if (mode === 'read') {
              return gsap.fromTo(
                self.words,
                { opacity: 0.55 },
                { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true } },
              );
            }
            const targets = mode === 'chars' ? self.chars : mode === 'words' ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: mode === 'chars' ? 115 : 30,
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

  // O SplitText reescreve o DOM em spans, e o React deixa de conseguir atualizar
  // esse texto. Quando o conteúdo muda (ex.: troca de idioma), o elemento é
  // recriado do zero via `key`.
  return createElement(as, { ref, id, className, key: textKey(children) }, children);
}
