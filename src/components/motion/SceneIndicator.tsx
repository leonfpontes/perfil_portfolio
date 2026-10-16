import { useRef } from 'react';
import { SECTION_ORDER, sectionNumber } from '@/content/sections';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useSceneDirector } from '@/lib/motion/SceneDirector';

/**
 * Marcador de capítulo fixo (desktop): "§ 03 / 11 — Serviços" + régua de
 * progresso da página. Dá a sensação de capítulos, não de scroll infinito.
 */
export function SceneIndicator() {
  const { active } = useSceneDirector();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const number = active ? sectionNumber(active.chapter) : '';

  // Régua de progresso da página inteira.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        gsap.fromTo(
          '[data-progress]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } },
        );
      });
    },
    { scope: rootRef },
  );

  // Troca de capítulo: o rótulo sai por cima e o novo entra por baixo.
  useGSAP(
    () => {
      if (!labelRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.fromTo(labelRef.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
      });
    },
    { dependencies: [active?.chapter], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-8 left-6 z-40 hidden items-end gap-3 mix-blend-normal lg:flex"
    >
      <span className="relative h-24 w-px bg-foreground/20">
        <span data-progress className="absolute inset-0 origin-top bg-signal" />
      </span>
      <span className="label-mono overflow-hidden text-foreground [writing-mode:vertical-rl] rotate-180">
        <span ref={labelRef} className="inline-block">
          {active && number ? `§ ${number} / ${String(SECTION_ORDER.length).padStart(2, '0')} — ${active.label}` : ''}
        </span>
      </span>
    </div>
  );
}
