import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FlowField } from '@/components/art/FlowField';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { CountUp } from '@/components/motion/CountUp';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';

export function Hero() {
  const { hero, contact: contactCopy, about, ui } = useContent();
  const { contact } = useServices();
  const ref = useRef<HTMLDivElement>(null);
  const location = about.facts[0]?.value;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        // Entrada: bloco de cor sobe, retrato é "impresso" de baixo para cima.
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.8, stagger: 0.08 })
          .from('[data-hero-block]', { scaleY: 0, transformOrigin: 'bottom', duration: 1.2 }, 0.15)
          .from('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4 }, 0.35)
          .from('[data-hero-fade]', { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, 0.6);

        // Saída: título acelera para cima, retrato se aproxima, a arte se dissolve.
        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-title]', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-figure]', { yPercent: -12, scale: 1.06, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-art]', { opacity: 0, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-hint]', { opacity: 0, ease: 'none', scrollTrigger: { ...exit, end: '15% top' } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Scene
        id="inicio"
        label={hero.greeting}
        tone="paper"
        customTransition
        className="pt-24 pb-10"
        art={
          <div data-hero-art className="absolute inset-0 text-foreground/70">
            <FlowField seed="leonardo" className="absolute inset-0 size-full" />
          </div>
        }
      >
        <Container>
          <div className="label-mono flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-muted-foreground">
            <span data-hero-meta>{hero.greeting}</span>
            <span data-hero-meta className="hidden sm:inline">
              {location}
            </span>
            <a data-hero-meta href="#mentoria" className="flex items-center gap-2 text-foreground hover:text-signal">
              <span aria-hidden="true" className="size-2 animate-pulse bg-signal" />
              {hero.badge}
            </a>
          </div>

          <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div data-hero-title>
                <SplitReveal as="h1" id="inicio-title" immediate delay={0.2} className="display text-[clamp(3.25rem,8.6vw,8.5rem)] text-balance">
                  {hero.title} <em className="text-signal">{hero.titleHighlight}</em>
                </SplitReveal>
              </div>
              <p data-hero-fade className="mt-8 max-w-xl text-lg text-pretty sm:text-xl">
                {hero.description}
              </p>
              <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild size="lg" className="group h-12 px-6 text-base">
                  <TrackedLink href="#mentoria" trackLabel="hero_offer">
                    {hero.primaryCta} <Arrow />
                  </TrackedLink>
                </Button>
                <TrackedLink href={contact.whatsapp(contactCopy.whatsappMessage)} trackLabel="hero_whatsapp" className="link-rule text-base">
                  {hero.secondaryCta}
                </TrackedLink>
              </div>
            </div>

            <figure data-hero-figure className="relative lg:col-span-4">
              <div className="relative pt-8">
                <div data-hero-block aria-hidden="true" className="absolute inset-0 bg-signal" />
                <img
                  data-hero-portrait
                  src={profile.images.portrait}
                  alt={hero.portraitAlt}
                  width={408}
                  height={612}
                  fetchPriority="high"
                  className="relative mx-auto h-auto w-full max-w-xs grayscale contrast-110 lg:max-w-none"
                />
              </div>
              <figcaption data-hero-fade className="label-mono mt-3 flex justify-between gap-3 text-muted-foreground">
                <span className="text-foreground">{profile.name}</span>
                <span className="text-right">{hero.availability}</span>
              </figcaption>
            </figure>
          </div>

          <dl data-hero-fade className="mt-12 grid grid-cols-2 border-t border-foreground md:grid-cols-4">
            {hero.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-end gap-1 border-b py-4 pr-4 md:border-b-0 ${i % 2 ? 'border-l pl-4' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <dt className="label-mono text-muted-foreground">{stat.label}</dt>
                <dd className="font-serif text-5xl leading-none sm:text-6xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
          <p data-hero-fade className="mt-6 text-sm text-muted-foreground">
            <span className="label-mono mr-3 text-foreground">{hero.trustLine}</span>
            {hero.trustItems.join('  /  ')}
          </p>
        </Container>

        <div data-hero-hint aria-hidden="true" className="label-mono absolute right-6 bottom-6 hidden items-center gap-3 text-muted-foreground lg:flex">
          {ui.scrollHint}
          <span className="relative h-10 w-px overflow-hidden bg-foreground/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_1.8s_ease-in-out_infinite] bg-signal" />
          </span>
        </div>
      </Scene>
    </div>
  );
}
