import { useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Funil } from '@/components/art/Funil';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import type { PageHeroCopy } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { pathOf } from '@/lib/router/routes';

interface PageHeroProps {
  copy: PageHeroCopy;
  /** Nome curto da página na trilha "Início / …". */
  crumb: string;
  primaryHref: string;
  /** Âncora da página (ex.: "#jornada"). */
  secondaryHref: string;
  trackPrefix: string;
  /** Peça grande em vidro sobre o painel (ex.: o preço). */
  emblem?: ReactNode;
}

/**
 * Abertura das páginas internas, com a mesma coreografia do hero da página inicial:
 * o painel do funil sobe, o H1 entra por linhas e, ao rolar, o título acelera para cima.
 */
export function PageHero({ copy, crumb, primaryHref, secondaryHref, trackPrefix, emblem }: PageHeroProps) {
  const { nav } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 })
          .from('[data-hero-block]', { scaleY: 0, transformOrigin: 'bottom', duration: 0.9 }, 0.05)
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.3);

        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-title]', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-figure]', { yPercent: -10, ease: 'none', scrollTrigger: exit });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Scene id="inicio" label={crumb} tone="cal" customTransition className="pt-24 pb-10 lg:min-h-[88svh]">
        <Container>
          <nav aria-label="Trilha" className="label-caps flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li data-hero-meta>
                <a href={pathOf('home')} className="hover:text-foreground">
                  {nav.home}
                </a>
              </li>
              <li data-hero-meta aria-hidden="true">
                /
              </li>
              <li data-hero-meta aria-current="page" className="text-foreground">
                {crumb}
              </li>
            </ol>
            <span data-hero-meta className="hidden sm:inline">
              {copy.eyebrow}
            </span>
          </nav>

          <div className="grid gap-8 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-10">
            <div className="lg:col-span-8">
              <p data-hero-fade className="label-caps text-signal sm:hidden">
                {copy.eyebrow}
              </p>
              <div data-hero-title>
                <SplitReveal as="h1" id="inicio-title" immediate className="display mt-3 text-[clamp(2.4rem,5vw,5.25rem)] text-balance sm:mt-0">
                  {copy.title} <span className="highlight">{copy.titleHighlight}</span>
                </SplitReveal>
              </div>
              <p data-hero-fade className="mt-6 max-w-xl text-pretty sm:text-xl lg:mt-8">
                {copy.description}
              </p>
              <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild size="lg" variant="signal" className="group h-12 px-6 text-base">
                  <TrackedLink href={primaryHref} trackLabel={`${trackPrefix}_hero_primary`}>
                    {copy.primaryCta} <Arrow />
                  </TrackedLink>
                </Button>
                <TrackedLink href={secondaryHref} trackLabel={`${trackPrefix}_hero_secondary`} className="link-rule text-base">
                  {copy.secondaryCta}
                </TrackedLink>
              </div>
            </div>

            <figure data-hero-figure aria-hidden="true" className="relative hidden lg:col-span-4 lg:block">
              <div data-hero-block className="relative h-full min-h-[22rem] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(80%_70%_at_25%_15%,color-mix(in_oklab,var(--signal)_14%,transparent),transparent_70%)]">
                <Funil labels={false} />
                {emblem && <div className="glass absolute inset-x-3 bottom-3 rounded-lg p-5">{emblem}</div>}
              </div>
            </figure>
          </div>

          <dl data-hero-fade className="mt-10 grid grid-cols-2 border-t border-border md:grid-cols-4 lg:mt-12">
            {copy.facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col gap-1 border-b py-4 pr-4 md:border-b-0 ${i % 2 ? 'border-l pl-4' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <dt className="label-caps text-muted-foreground">{fact.label}</dt>
                <dd className="font-display text-lg leading-tight sm:text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Scene>
    </div>
  );
}
