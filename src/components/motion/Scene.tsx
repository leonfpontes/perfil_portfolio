import { useRef, type ReactNode } from 'react';
import type { SectionId } from '@/content/types';
import { gsap, MEDIA, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { useSceneDirector } from '@/lib/motion/SceneDirector';
import type { Tone } from '@/lib/motion/SceneThemeController';
import { cn } from '@/lib/utils';

/**
 * Encontra o <section> da cena que contém `el`. Filhos usam isto em vez de uma
 * ref do pai: no React a ref do pai só é ligada depois dos efeitos de layout
 * dos filhos, então ela ainda seria `null` quando o filho cria o pin.
 */
export function sceneSectionOf(el: Element | null | undefined): HTMLElement | null {
  return (el?.closest('[data-scene] > section') as HTMLElement | null) ?? null;
}

interface SceneProps {
  id: SectionId;
  chapter?: SectionId;
  label: string;
  tone: Tone;
  children: ReactNode;
  /** Camada de arte em tela cheia, atrás do conteúdo. */
  art?: ReactNode;
  className?: string;
  /** Desliga a saída/entrada genérica (para cenas que coreografam a própria transição). */
  customTransition?: boolean;
  labelledBy?: string;
}

/**
 * Uma "cena" do site: ocupa a viewport, assume um tom de cor ao entrar e
 * transforma o conteúdo ao sair — o anterior recua e se apaga enquanto o
 * próximo sobe. O wrapper externo existe para que o gatilho de tom cubra
 * também o tempo em que a seção fica fixada (pin spacer).
 */
export function Scene({ id, chapter = id, label, tone, children, art, className, customTransition, labelledBy }: SceneProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { activate } = useSceneDirector();

  useGSAP(
    () => {
      const outer = outerRef.current;
      if (!outer) return;

      ScrollTrigger.create({
        trigger: outer,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && activate({ id, chapter, label, tone }),
      });

      if (customTransition) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const layers = outer.querySelectorAll('[data-scene-body], [data-scene-art]');
        gsap.fromTo(
          layers,
          { opacity: 0, y: () => window.innerHeight * 0.08 },
          { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: outer, start: 'top 95%', end: 'top 45%', scrub: true } },
        );
        gsap.to(layers, {
          opacity: 0,
          y: () => -window.innerHeight * 0.08,
          scale: 0.97,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: outer, start: 'bottom 75%', end: 'bottom 20%', scrub: true },
        });
      });
    },
    { scope: outerRef, dependencies: [activate, tone, label] },
  );

  return (
    <div ref={outerRef} data-scene={id}>
      <section
        id={id}
        data-tone={tone}
        aria-labelledby={labelledBy ?? `${id}-title`}
        className={cn('relative isolate flex min-h-svh flex-col justify-center overflow-clip py-24', className)}
      >
        {art && (
          <div data-scene-art aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            {art}
          </div>
        )}
        <div data-scene-body className="relative w-full origin-top">
          {children}
        </div>
      </section>
    </div>
  );
}
