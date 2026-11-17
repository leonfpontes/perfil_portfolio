import { useRef } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile } from '@/content/profile';
import { sectionNumber } from '@/content/sections';
import type { Screenshot } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { pathOf } from '@/lib/router/routes';
import { cn } from '@/lib/utils';

/**
 * Captura real do app num quadro de vidro, com a luz ambiente atrás (.glass-spot).
 * A luz não segue o cursor: fica parada atrás do quadro e só se inclina um pouco
 * (glass-light.ts). Os cantos seguem o LP Noir: 12 px no quadro, 8 px na imagem.
 */
function Shot({ shot, priority = false, className }: { shot: Screenshot; priority?: boolean; className?: string }) {
  return (
    <div data-glass-light className={cn('relative', className)}>
      <div aria-hidden="true" className="glass-spot" />
      <div className="glass relative rounded-xl p-1.5 sm:p-2">
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="block h-auto w-full rounded-lg bg-[#05070d]"
        />
      </div>
    </div>
  );
}

/**
 * /brain — abertura de página de produto: título, as duas ações e, logo abaixo,
 * a captura do app em tela cheia. A ação principal leva ao contato; entrar no app
 * fica como link secundário (quem já usa).
 */
export function BrainHero() {
  const { brainPage, nav } = useContent();
  const { hero } = brainPage;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 })
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.2)
          .from('[data-hero-shot]', { opacity: 0, y: 48, duration: 1.2 }, 0.35);

        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-title]', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: exit });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Scene id="inicio" label={nav.brain} tone="cal" customTransition className="pt-24 pb-12 lg:pt-24 lg:pb-24">
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
                {nav.brain}
              </li>
            </ol>
            <span data-hero-meta className="hidden sm:inline">
              {hero.eyebrow}
            </span>
          </nav>

          <div className="grid gap-6 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-10">
            <div data-hero-title className="lg:col-span-8">
              <p data-hero-fade className="label-caps text-signal sm:hidden">
                {hero.eyebrow}
              </p>
              <SplitReveal as="h1" id="inicio-title" immediate className="display mt-3 text-4xl text-balance sm:mt-0 xl:text-6xl">
                {hero.title} <span className="highlight">{hero.titleHighlight}</span>
              </SplitReveal>
            </div>
            <div className="flex flex-col justify-end gap-6 lg:col-span-4">
              <p data-hero-fade className="text-pretty text-muted-foreground sm:text-lg">
                {hero.description}
              </p>
              <div data-hero-fade className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild size="lg" variant="signal" className="group h-12 px-6 text-base">
                  <TrackedLink href="#contato" trackLabel="brain_hero_primary">
                    {hero.primaryCta} <Arrow />
                  </TrackedLink>
                </Button>
                <TrackedLink href="#produto" trackLabel="brain_hero_secondary" className="link-rule text-base">
                  {hero.secondaryCta}
                </TrackedLink>
              </div>
            </div>
          </div>

          <figure data-hero-shot className="relative mt-10 lg:mt-14">
            <Shot shot={hero.shot} priority />
            <figcaption className="glass label-caps absolute bottom-4 left-4 rounded-lg px-3 py-2 text-[#f1ede4] sm:bottom-6 sm:left-6">
              {hero.shotCaption}
            </figcaption>
          </figure>

          <dl data-hero-fade className="mt-10 grid grid-cols-2 border-t border-border md:grid-cols-4 lg:mt-12">
            {hero.facts.map((fact, i) => (
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

/** /brain — o produto em quatro telas, numa faixa marinho: texto de um lado, captura do outro, alternando. */
export function BrainTour() {
  const { brainPage } = useContent();
  const { tour } = brainPage;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        gsap.utils.toArray<HTMLElement>('[data-tour-item]').forEach((item) => {
          gsap.from(item.querySelector('[data-tour-shot]'), {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: item, start: 'top 75%', toggleActions: 'play none none reverse' },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="produto" label={tour.eyebrow} tone="anil">
      <Container>
        <div ref={ref}>
          <SectionHeader id="produto" heading={tour} />
          <ol className="flex flex-col gap-20 lg:gap-32">
            {tour.items.map((item, i) => (
              <li key={item.label} data-tour-item className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={cn('lg:col-span-4', i % 2 && 'lg:order-2')}>
                  <p className="label-caps text-signal">
                    {String(i + 1).padStart(2, '0')} · {item.label}
                  </p>
                  <h3 className="display mt-3 text-3xl text-balance sm:text-4xl">{item.title}</h3>
                  <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">{item.description}</p>
                  <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-snug">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.25} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-tour-shot className={cn('lg:col-span-8', i % 2 && 'lg:order-1')}>
                  <Shot shot={item.shot} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Scene>
  );
}

/** /brain — os recursos menores, em lista numerada (o mesmo desenho dos entregáveis do diagnóstico). */
export function BrainFeatures() {
  const { brainPage } = useContent();
  const { features } = brainPage;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        gsap.from('[data-detail-item]', {
          x: -16,
          stagger: 0.05,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="recursos" label={features.eyebrow} tone="cal">
      <Container>
        <div ref={ref}>
          <SectionHeader id="recursos" heading={features} />
          <div className="lg:ml-[25%]">
            <h3 className="label-caps mb-3 text-muted-foreground">{features.itemsTitle}</h3>
            <ol className="grid border-t sm:grid-cols-2 sm:gap-x-10">
              {features.items.map((item, i) => (
                <li key={item.title} data-detail-item className="grid grid-cols-[3rem_1fr] gap-x-3 border-b py-4 sm:py-5">
                  <span aria-hidden="true" className="text-outline font-display text-4xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-2xl leading-tight">{item.title}</span>
                    <span className="mt-1 block text-muted-foreground">{item.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Scene>
  );
}

/** /brain — o app no celular e os três passos do vault até a tela. */
export function BrainMobile() {
  const { brainPage } = useContent();
  const { mobile } = brainPage;

  return (
    <Scene id="celular" label={mobile.eyebrow} tone="ocre">
      <Container>
        <SectionHeader id="celular" heading={mobile} />
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6">
            {mobile.shots.map((shot, i) => (
              <Shot key={shot.src} shot={shot} className={cn('mx-auto w-full max-w-[18rem]', i === 1 && 'mt-10 sm:mt-16')} />
            ))}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="label-caps mb-3 text-muted-foreground">{mobile.stepsTitle}</h3>
            <ol className="flex flex-col border-t">
              {mobile.steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-3 border-b py-5">
                  <span aria-hidden="true" className="text-outline font-display text-4xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-2xl leading-tight">{step.title}</span>
                    <span className="mt-1 block text-muted-foreground">{step.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Scene>
  );
}

/**
 * /brain — para quem já usa: o login do app, com privacidade e termos ao lado, e o
 * resumo em inglês que o Google pede para verificar o app. Fica antes do convite final.
 */
export function BrainAccess() {
  const { brainPage } = useContent();
  const { access } = brainPage;

  return (
    <Scene id="acesso" label={access.eyebrow} tone="cal">
      <Container>
        <div className="grid gap-6 border-t border-border pt-5 lg:grid-cols-12">
          <p className="label-caps text-muted-foreground lg:col-span-3">
            § {sectionNumber('brain', 'acesso')} — {access.eyebrow}
          </p>
          <div className="flex flex-col gap-6 lg:col-span-9">
            <SplitReveal as="h2" id="acesso-title" className="display text-3xl text-balance sm:text-4xl">
              {access.title}
            </SplitReveal>
            <p className="max-w-2xl text-pretty text-muted-foreground lg:text-lg">{access.description}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild size="lg" variant="outline" className="group h-12 bg-transparent px-6 text-base">
                <TrackedLink href={profile.brain.login} trackLabel="brain_access_login">
                  {access.cta} <Arrow />
                </TrackedLink>
              </Button>
              <TrackedLink href={profile.brain.privacy} trackLabel="brain_access_privacy" className="link-rule text-base">
                {access.privacy}
              </TrackedLink>
              <TrackedLink href={profile.brain.terms} trackLabel="brain_access_terms" className="link-rule text-base">
                {access.terms}
              </TrackedLink>
            </div>
            <p lang="en" className="max-w-2xl border-l-2 border-signal pl-5 text-sm text-pretty text-muted-foreground sm:text-base">
              {access.note}
            </p>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
