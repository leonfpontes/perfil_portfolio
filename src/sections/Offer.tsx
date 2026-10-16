import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Halftone } from '@/components/art/Halftone';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene, sceneSectionOf } from '@/components/motion/Scene';
import { stockImages } from '@/content/profile';
import type { Plan } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';
import { cn } from '@/lib/utils';

function PlanSheet({ plan, index }: { plan: Plan; index: number }) {
  const { contact } = useServices();
  return (
    <article
      data-plan={index}
      className={cn(
        'flex flex-col border-t-4 bg-card p-5 max-lg:w-[86vw] max-lg:shrink-0 max-lg:snap-center sm:p-10',
        plan.highlighted ? 'border-signal' : 'border-foreground',
      )}
    >
      <p className="label-mono flex justify-between text-muted-foreground">
        <span>{plan.tag}</span>
        <span>{String.fromCharCode(65 + index)}</span>
      </p>
      <h3 className="display mt-4 text-3xl sm:mt-6 sm:text-5xl">{plan.title}</h3>
      <p className="mt-3 text-sm text-muted-foreground max-sm:hidden sm:mt-4 sm:text-base">{plan.description}</p>

      <div className="mt-5 border-y py-4 sm:mt-8 sm:py-6">
        <p className="flex flex-wrap items-baseline gap-x-3">
          {/* Preço não "conta": contador em preço soa como promoção e mostra valores falsos. */}
          <span className="font-serif text-5xl leading-none sm:text-7xl">{plan.price}</span>
          <span className="label-mono">{plan.priceNote}</span>
        </p>
        <p className="label-mono mt-3 text-muted-foreground">{plan.regularPrice}</p>
      </div>

      <ul className="flex-1 divide-y">
        {plan.features.map((feature) => (
          <li key={feature} data-feature className="flex gap-3 py-1.5 text-[13px] leading-snug sm:gap-4 sm:py-3 sm:text-sm">
            <span aria-hidden="true" className="text-signal">
              —
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button asChild size="lg" variant={plan.highlighted ? 'signal' : 'default'} className="group mt-5 h-12 w-full text-base sm:mt-8">
        <TrackedLink href={contact.whatsapp(plan.whatsappMessage)} trackLabel={`plan_${plan.id}`}>
          {plan.cta} <Arrow />
        </TrackedLink>
      </Button>
    </article>
  );
}

/** Cena 1 — os dois planos chegam de lados opostos, como propostas sobre a mesa. */
function PlansScene() {
  const { offer } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const st = { trigger: '[data-plans]', start: 'top 80%', toggleActions: 'play none none reverse' };
        gsap.from('[data-plan="0"]', { xPercent: -14, rotate: -2, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: st });
        gsap.from('[data-plan="1"]', { xPercent: 14, rotate: 2, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.08, scrollTrigger: st });
        gsap.from('[data-feature]', { opacity: 0, x: -12, stagger: 0.04, duration: 0.6, delay: 0.4, scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="mentoria" label={offer.eyebrow} tone="sand">
      <Container>
        <div ref={ref}>
          <SectionHeader id="mentoria" heading={offer} />
          <p className="mb-8 max-w-2xl border-l-2 border-signal pl-5 text-sm text-pretty sm:mb-10 sm:text-base lg:ml-[25%]">{offer.founderNote}</p>
          <div data-plans>
            <HorizontalTrack media="mobile" label={offer.title} className="max-lg:flex max-lg:gap-4 lg:grid lg:grid-cols-2 lg:gap-px lg:bg-border">
              {offer.plans.map((plan, i) => (
                <PlanSheet key={plan.id} plan={plan} index={i} />
              ))}
            </HorizontalTrack>
          </div>
        </div>
      </Container>
    </Scene>
  );
}

/**
 * Cena 2 — a jornada como "gates". A tela fica fixada enquanto a linha é
 * traçada e cada etapa acende; depois, o que a mentoria NÃO é vai sendo riscado.
 */
function JourneyStage() {
  const { offer, ui } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const steps = offer.journey.steps;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        // Pin curto: os gates acendem em sequência e o bloco "o que não é" já
        // está na tela desde o início — só os riscos esperam o fim.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: sceneSectionOf(ref.current), pin: true, start: 'top top', end: '+=150%', scrub: 0.6 },
        });
        gsap.set('[data-step]', { opacity: 0.35 });
        steps.forEach((_, i) => {
          tl.to('[data-gate-line]', { scaleX: (i + 1) / steps.length, duration: 1 })
            .to(`[data-node="${i}"]`, { scale: 1.8, backgroundColor: 'var(--signal)', duration: 0.3 }, '<0.7')
            .to(`[data-step="${i}"]`, { opacity: 1, duration: 0.4 }, '<');
        });
        tl.to('[data-strike]', { scaleX: 1, stagger: 0.4, duration: 0.5 });
      });
      mm.add(MEDIA.mobile, () => {
        gsap.to('[data-strike]', { scaleX: 1, stagger: 0.3, duration: 0.5, scrollTrigger: { trigger: '[data-isnot]', start: 'top 75%' } });
      });
    },
    { scope: ref, dependencies: [steps.length] },
  );

  return (
    <Container>
      <div ref={ref}>
        <h2 id="jornada-title" className="display max-w-4xl text-5xl sm:text-6xl">
          {offer.journey.title}
        </h2>

        <div className="relative mt-10">
          <div aria-hidden="true" className="absolute top-0 right-0 left-0 hidden h-px bg-foreground/20 lg:block">
            <div data-gate-line className="h-full origin-left scale-x-0 bg-foreground" />
          </div>
          {/* Celular: cada gate é um painel do trilho horizontal, com o número gigante. */}
          <HorizontalTrack media="mobile" label={offer.journey.title} className="max-lg:flex max-lg:gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                data-step={i}
                className="relative pt-8 max-lg:flex max-lg:min-h-[52svh] max-lg:w-[78vw] max-lg:shrink-0 max-lg:snap-center max-lg:flex-col max-lg:justify-end max-lg:border-t max-lg:border-foreground"
              >
                <span data-node={i} aria-hidden="true" className="absolute -top-[5px] left-0 size-[9px] bg-foreground max-lg:bg-signal" />
                <span aria-hidden="true" className="text-outline font-serif text-[9rem] leading-none lg:hidden">
                  G{i + 1}
                </span>
                <p className="label-mono text-muted-foreground max-lg:hidden">G{i + 1}</p>
                <p className="mt-2 font-serif text-4xl leading-tight">{step.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </HorizontalTrack>
        </div>

        <div data-isnot className="mt-12 grid items-end gap-10 lg:grid-cols-12">
          <figure className="lg:col-span-7">
            <Halftone src={stockImages.workshop} alt="" className="aspect-[16/9] w-full text-foreground lg:aspect-[16/7] lg:max-h-[34vh]" />
            <figcaption className="label-mono mt-3 flex gap-3 text-muted-foreground">
              <span className="text-foreground">Fig. 1</span>
              <span>{ui.illustrativeImage}</span>
            </figcaption>
          </figure>
          <div className="lg:col-span-5">
            <h3 className="display text-4xl">{offer.isNot.title}</h3>
            <ul className="mt-6 divide-y border-y">
              {offer.isNot.items.map((item) => (
                <li key={item} className="flex gap-4 py-4">
                  <span aria-hidden="true" className="font-mono text-signal">
                    ×
                  </span>
                  <span className="relative">
                    {item}
                    <span data-strike aria-hidden="true" className="absolute top-1/2 -right-1 -left-1 h-[2px] origin-left scale-x-0 bg-signal" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

export function Offer() {
  const { offer } = useContent();
  return (
    <>
      <PlansScene />
      <Scene id="jornada" chapter="mentoria" label={offer.eyebrow} tone="paper" className="lg:py-16">
        <JourneyStage />
      </Scene>
    </>
  );
}
