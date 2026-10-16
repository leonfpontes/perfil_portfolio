import { useRef } from 'react';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

/** Primeiro ano que aparece no período ("ago 2024 — dez 2025" → "2024"). */
const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? '';

/**
 * Trajetória como uma pilha de fichas: cada experiência para no topo
 * (sticky) e a seguinte desliza por cima, empurrando a anterior para trás.
 */
export function Experience() {
  const { experience } = useContent();
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]', ref.current);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.firstElementChild, {
            scale: 0.92,
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="experiencia" label={experience.eyebrow} tone="paper">
      <Container>
        <SectionHeader id="experiencia" heading={experience} />
        <ol ref={ref} className="relative">
          {experience.items.map((item, i) => (
            <li key={`${item.company}-${item.period}`} data-card className="sticky pb-8" style={{ top: `calc(5rem + ${i * 14}px)` }}>
              <article className="relative grid origin-top gap-6 overflow-hidden border-t-4 border-foreground bg-card p-6 shadow-[0_-1px_0_var(--border)] sm:p-10 lg:min-h-[64vh] lg:grid-cols-12">
                <span aria-hidden="true" className="text-outline pointer-events-none absolute -right-4 -bottom-10 font-serif text-[9rem] leading-none opacity-40 sm:text-[14rem]">
                  {startYear(item.period)}
                </span>
                <div className="relative lg:col-span-4">
                  <p className="label-mono">{item.period}</p>
                  {item.current && (
                    <p className="label-mono mt-2 flex items-center gap-2 text-signal">
                      <span aria-hidden="true" className="size-2 bg-signal" />
                      {experience.currentLabel}
                    </p>
                  )}
                  <p className="label-mono mt-6 text-muted-foreground">{item.location}</p>
                  <p className="mt-1 font-serif text-3xl text-signal">{item.company}</p>
                </div>
                <div className="relative lg:col-span-8">
                  <h3 className="display text-4xl sm:text-5xl">{item.role}</h3>
                  <p className="mt-5 max-w-2xl text-lg text-pretty">{item.summary}</p>
                  <ul className="mt-5 max-w-2xl space-y-2">
                    {item.achievements.map((a) => (
                      <li key={a} className="flex gap-4 text-muted-foreground">
                        <span aria-hidden="true" className="text-signal">
                          —
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </Scene>
  );
}
