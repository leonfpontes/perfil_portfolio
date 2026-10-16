import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Halftone } from '@/components/art/Halftone';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { CountUp } from '@/components/motion/CountUp';
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
      className={cn('flex flex-col border-t-4 bg-card p-6 sm:p-10', plan.highlighted ? 'border-signal' : 'border-foreground')}
    >
      <p className="label-mono flex justify-between text-muted-foreground">
        <span>{plan.tag}</span>
        <span>{String.fromCharCode(65 + index)}</span>
      </p>
      <h3 className="display mt-6 text-4xl sm:text-5xl">{plan.title}</h3>
      <p className="mt-4 text-muted-foreground">{plan.description}</p>

      <div className="mt-8 border-y py-6">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <CountUp value={plan.price} className="font-serif text-7xl leading-none" />
          <span className="label-mono">{plan.priceNote}</span>
        </p>
        <p className="label-mono mt-3 text-muted-foreground">{plan.regularPrice}</p>
      </div>

      <ul className="flex-1 divide-y">
        {plan.features.map((feature) => (
          <li key={feature} data-feature className="flex gap-4 py-3 text-sm">
            <span aria-hidden="true" className="text-signal">
              —
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button asChild size="lg" variant={plan.highlighted ? 'signal' : 'default'} className="group mt-8 h-12 w-full text-base">
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
      mm.add(MEDIA.motion, () => {
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
          <p className="mb-10 max-w-2xl border-l-2 border-signal pl-5 text-pretty lg:ml-[25%]">{offer.founderNote}</p>
          <div data-plans className="grid gap-px bg-border md:grid-cols-2">
            {offer.plans.map((plan, i) => (
              <PlanSheet key={plan.id} plan={plan} index={i} />
            ))}
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
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: sceneSectionOf(ref.current), pin: true, start: 'top top', end: '+=240%', scrub: 0.6 },
        });
        gsap.set('[data-step]', { opacity: 0.2 });
        steps.forEach((_, i) => {
          tl.to('[data-gate-line]', { scaleX: (i + 1) / steps.length, duration: 1 })
            .to(`[data-node="${i}"]`, { scale: 1.8, backgroundColor: 'var(--signal)', duration: 0.3 }, '<0.7')
            .to(`[data-step="${i}"]`, { opacity: 1, y: -6, duration: 0.4 }, '<')
            .to(`[data-step="${i - 1}"]`, { opacity: 0.45, y: 0, duration: 0.4 }, '<');
        });
        tl.to('[data-step]', { opacity: 1, duration: 0.4 }).from('[data-isnot]', { opacity: 0, y: 40, duration: 0.8 }, '<');
        tl.to('[data-strike]', { scaleX: 1, stagger: 0.5, duration: 0.6 });
      });
      mm.add(MEDIA.mobile, () => {
        gsap.from('[data-step]', { opacity: 0, y: 30, stagger: 0.15, scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
        gsap.to('[data-strike]', { scaleX: 1, stagger: 0.3, scrollTrigger: { trigger: '[data-isnot]', start: 'top 70%' } });
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
          <div aria-hidden="true" className="absolute top-0 right-0 left-0 h-px bg-foreground/20">
            <div data-gate-line className="h-full origin-left scale-x-0 bg-foreground max-lg:scale-x-100" />
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => (
              <li key={step.title} data-step={i} className="relative pt-8">
                <span data-node={i} aria-hidden="true" className="absolute -top-[5px] left-0 size-[9px] bg-foreground" />
                <p className="label-mono text-muted-foreground">G{i + 1}</p>
                <p className="mt-2 font-serif text-4xl leading-tight">{step.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div data-isnot className="mt-12 grid items-end gap-10 lg:grid-cols-12">
          <figure className="lg:col-span-7">
            <Halftone src={stockImages.workshop} alt="" className="aspect-[16/7] max-h-[34vh] w-full text-foreground" />
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
