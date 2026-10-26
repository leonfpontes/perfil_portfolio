import { useRef } from 'react';
import { useAfterFirstPaint } from '@/hooks/useAfterFirstPaint';
import { Funil } from '@/components/art/Funil';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { CountUp } from '@/components/motion/CountUp';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { pathOf } from '@/lib/router/routes';
import { useServices } from '@/lib/services';
import { cn } from '@/lib/utils';

export function Hero() {
  const { hero, contact: contactCopy, about, offer, ui } = useContent();
  const { contact } = useServices();
  const ref = useRef<HTMLDivElement>(null);
  const location = about.facts[0]?.value;
  // A arte entra depois do primeiro paint: o título é o LCP e não espera o SVG.
  const showArt = useAfterFirstPaint();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Só no desktop: no celular o hero aparece pronto (é o maior elemento da
      // primeira tela, e escondê-lo até o JS rodar atrasaria o carregamento percebido).
      mm.add(MEDIA.desktop, () => {
        // Entrada: bloco de cor sobe, retrato é "impresso" de baixo para cima.
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        // Intro curta: o título começa a subir já no primeiro quadro.
        intro
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 })
          .from('[data-hero-block]', { scaleY: 0, transformOrigin: 'bottom', duration: 0.9 }, 0.05)
          .from('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1 }, 0.2)
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.3);

        // Saída: título acelera para cima, retrato se aproxima, a arte se dissolve.
        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-title]', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-figure]', { yPercent: -12, scale: 1.06, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-hint]', { opacity: 0, ease: 'none', scrollTrigger: { ...exit, end: '15% top' } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-glass-light>
      <Scene
        id="inicio"
        label={hero.greeting}
        tone="cal"
        customTransition
        fill
        className="pt-24 pb-10 lg:pt-24 lg:pb-24"
        art={
          <div data-hero-art className="absolute inset-x-0 top-[8.75rem] bottom-44">
            {/* Luz ambiente champagne atrás do vidro (lp-noir.css): o vidro a desfoca. */}
            <div className="glass-spot" />
            {showArt && <Funil className="[mask-image:linear-gradient(90deg,rgb(0_0_0/0.3),black_55%)]" />}
          </div>
        }
      >
        <Container>
          <div className="label-caps flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-muted-foreground">
            <span data-hero-meta>{hero.greeting}</span>
            <span data-hero-meta className="hidden sm:inline">
              {location}
            </span>
            <a data-hero-meta href={pathOf('mentoring')} className="flex items-center gap-2 text-foreground hover:text-signal">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
              {hero.badge}
            </a>
          </div>

          <div className="grid gap-8 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-10">
            <div className="lg:col-span-8">
              <div data-hero-title>
                <SplitReveal as="h1" id="inicio-title" immediate className="display text-4xl xl:text-6xl text-balance">
                  {hero.title} <span className="highlight">{hero.titleHighlight}</span>
                </SplitReveal>
              </div>
              <p data-hero-fade className="mt-6 max-w-xl text-pretty sm:text-xl lg:mt-8">
                {hero.description}
              </p>
              {/* As duas ofertas logo na primeira tela: para quem é, o que é e quanto custa. */}
              <div data-hero-fade className="mt-8 max-w-2xl">
                <p className="label-caps mb-2 text-muted-foreground">{hero.offersLabel}</p>
                <ul className="grid gap-2">
                  {offer.plans.map((plan) => (
                    <li key={plan.id}>
                      <TrackedLink
                        href={pathOf(plan.id === 'mentoring' ? 'mentoring' : 'diagnostic')}
                        trackLabel={`hero_${plan.id}`}
                        className={cn(
                          'group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-lg px-4 py-3 transition-colors sm:py-4',
                          plan.highlighted ? 'glass hover:bg-white/10' : 'border border-border hover:border-border hover:bg-white/[0.03]',
                        )}
                      >
                        <span className={cn('label-caps', plan.highlighted ? 'text-signal' : 'text-muted-foreground')}>{plan.tag}</span>
                        <span className="row-span-2 flex items-center gap-3 font-display text-lg whitespace-nowrap sm:text-2xl">
                          {plan.priceShort} <Arrow />
                        </span>
                        <span className="font-display text-lg leading-tight sm:text-2xl">{plan.title}</span>
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
                <TrackedLink href={contact.whatsapp(contactCopy.whatsappMessage)} trackLabel="hero_whatsapp" className="link-rule mt-4 inline-block text-base">
                  {hero.secondaryCta}
                </TrackedLink>
              </div>
            </div>

            <figure data-hero-figure className="relative lg:col-span-4">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(70%_60%_at_50%_30%,#2e2c28,#111113_72%)] pt-8 max-lg:mx-auto max-lg:w-3/4 max-lg:pt-5">
                <div data-hero-block aria-hidden="true" className="absolute inset-0" />
                <img
                  data-hero-portrait
                  src={profile.images.portrait}
                  alt={hero.portraitAlt}
                  width={408}
                  height={612}
                  fetchPriority="high"
                  className="relative mx-auto h-auto w-full grayscale contrast-110 max-lg:max-h-[42svh] max-lg:w-auto"
                />
                <figcaption data-hero-fade className="glass absolute inset-x-3 bottom-3 grid gap-0.5 rounded-lg px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{profile.name}</span>
                  <span className="text-muted-foreground">{hero.availability}</span>
                </figcaption>
              </div>
            </figure>
          </div>

          <dl data-hero-fade className="mt-10 grid grid-cols-2 border-t border-border md:grid-cols-4 lg:mt-12">
            {hero.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-end gap-1 border-b py-4 pr-4 md:border-b-0 ${i % 2 ? 'border-l pl-4' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <dt className="label-caps text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none sm:text-6xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
          <p data-hero-fade className="mt-6 hidden text-sm text-muted-foreground sm:block">
            <span className="label-caps mr-3 text-foreground">{hero.trustLine}</span>
            {hero.trustItems.join('  /  ')}
          </p>
        </Container>

        <div data-hero-hint aria-hidden="true" className="label-caps absolute right-6 bottom-6 hidden items-center gap-3 text-muted-foreground lg:flex">
          {ui.scrollHint}
          <span className="relative h-10 w-px overflow-hidden bg-foreground/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_1.8s_ease-in-out_infinite] bg-signal" />
          </span>
        </div>
      </Scene>
    </div>
  );
}
