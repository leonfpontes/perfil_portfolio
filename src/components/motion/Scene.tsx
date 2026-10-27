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
  /** Ocupa a tela inteira no desktop: só para cenas fixadas (pin), que precisam do palco cheio. */
  fill?: boolean;
}

/**
 * Uma "cena" do site: ocupa a viewport, tem o próprio tom de cor (que sobe
 * com a rolagem) e transforma o conteúdo ao sair — o anterior se apaga
 * enquanto o próximo aparece. O wrapper externo existe para que o gatilho de
 * cena (header, indicador) cubra também o tempo em que a seção fica fixada.
 */
export function Scene({ id, chapter = id, label, tone, children, art, className, customTransition, labelledBy, fill }: SceneProps) {
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
      // Só opacidade: transform no corpo da cena quebraria os pins internos
      // (um ancestral transformado vira o "containing block" do position: fixed).
      const layers = outer.querySelectorAll('[data-scene-body], [data-scene-art]');
      const mm = gsap.matchMedia();
      // Só opacidade: vale também no modo suave (não causa enjoo).
      // Cena que já nasce dentro da primeira tela (ex.: logo abaixo de um hero curto) não
      // "entra": presa à rolagem, ela ficaria meio apagada no primeiro quadro. Posição
      // absoluta: numa troca de página, a rolagem ainda é a da página anterior aqui.
      const entersFromBelow = outer.getBoundingClientRect().top + window.scrollY >= window.innerHeight * 0.98;
      mm.add(MEDIA.wide, () => {
        // Entrada e saída se sobrepõem: nunca há uma tela vazia entre cenas.
        if (entersFromBelow) {
          gsap.fromTo(layers, { opacity: 0.5 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: outer, start: 'top bottom', end: 'top 60%', scrub: true } });
        }
        gsap.to(layers, {
          opacity: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: outer, start: 'bottom 40%', end: 'bottom 5%', scrub: true },
        });
      });
      // No celular as seções são mais altas que a tela: só a entrada é animada,
      // para que nada se apague enquanto ainda está sendo lido.
      mm.add(MEDIA.narrow, () => {
        if (!entersFromBelow) return;
        gsap.fromTo(layers, { opacity: 0.5 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: outer, start: 'top bottom', end: 'top 70%', scrub: true } });
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
        className={cn(
          // A seção pinta o próprio tom: a troca de cor acompanha a rolagem (a nova
          // cena sobe por cima da anterior, com sombra na borda), sem "estalo".
          // Espaçamento fixo de 96/128 px; altura de tela cheia só nas cenas fixadas,
          // para não sobrar vão vazio abaixo de seções curtas.
          `tone-${tone} relative isolate flex flex-col justify-center overflow-clip bg-background py-24 text-foreground lg:py-32`,
          fill && 'lg:min-h-svh',
          'shadow-[0_-28px_56px_-32px_rgb(20_33_61/0.18)]',
          className,
        )}
      >
        {art && (
          <div data-scene-art aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            {art}
          </div>
        )}
        <div data-scene-body className="relative w-full">
          {children}
        </div>
      </section>
    </div>
  );
}
