import { useRef } from 'react';
import { Container, SectionHeader } from '@/components/common/Section';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/** Primeiro ano que aparece no período ("ago 2024 — dez 2025" → "2024"). */
const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? '';

/**
 * Trajetória:
 * - desktop: pilha de fichas — cada experiência para no topo (sticky) e a
 *   seguinte desliza por cima, empurrando a anterior para o fundo;
 * - celular: trilho horizontal, uma ficha por tela.
 */
export function Experience() {
  const { experience } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
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
    <Scene id="experiencia" label={experience.eyebrow} tone="cal">
      <Container>
        <SectionHeader id="experiencia" heading={experience} />
        <div ref={ref}>
          <HorizontalTrack media="mobile" label={experience.title} className="max-lg:flex max-lg:gap-4 lg:block">
            {experience.items.map((item, i) => (
              <div
                key={`${item.company}-${item.period}`}
                data-card
                className="max-lg:w-[86vw] max-lg:shrink-0 max-lg:snap-center lg:sticky lg:pb-8"
                style={{ top: `calc(5rem + ${i * 14}px)` }}
              >
                <article
                  className={cn(
                    'relative grid h-full origin-top gap-5 overflow-hidden border-t-4 border-foreground bg-card p-5 sm:p-10 lg:min-h-[54vh] lg:grid-cols-12 lg:gap-6',
                    'ring-1 ring-foreground/10 lg:shadow-[0_-28px_60px_-24px_rgb(0_0_0/0.55)]',
                  )}
                >
                  <span aria-hidden="true" className="text-outline pointer-events-none absolute -right-3 -bottom-6 font-display text-[7rem] leading-none opacity-30 sm:text-[14rem] lg:-bottom-10">
                    {startYear(item.period)}
                  </span>
                  <div className="relative lg:col-span-4">
                    <p className="label-caps">{item.period}</p>
                    {item.current && (
                      <p className="label-caps mt-2 flex items-center gap-2 text-signal">
                        <span aria-hidden="true" className="size-2 bg-signal" />
                        {experience.currentLabel}
                      </p>
                    )}
                    <p className="label-caps mt-3 text-muted-foreground max-lg:hidden lg:mt-6">{item.location}</p>
                    <p className="mt-1 font-display text-2xl text-signal lg:text-3xl">{item.company}</p>
                  </div>
                  <div className="relative lg:col-span-8">
                    <h3 className="display text-3xl sm:text-5xl">{item.role}</h3>
                    <p className="mt-3 text-pretty lg:mt-5 lg:max-w-2xl lg:text-lg">{item.summary}</p>
                    <ul className="mt-3 space-y-1.5 text-[13px] max-lg:[&>li:nth-child(n+4)]:hidden lg:mt-5 lg:max-w-2xl lg:space-y-2 lg:text-base">
                      {item.achievements.map((a) => (
                        <li key={a} className="flex gap-3 text-muted-foreground lg:gap-4">
                          <span aria-hidden="true" className="text-signal">
                            —
                          </span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            ))}
          </HorizontalTrack>
        </div>
      </Container>
    </Scene>
  );
}
