import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import { profile } from '@/content/profile';
import { useSteppedScene, useStepTransition } from '@/hooks/useSteppedScene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

const pad = (n: number) => String(n).padStart(2, '0');

function TestimonialStage() {
  const { testimonials, ui } = useContent();
  const stageRef = useRef<HTMLDivElement>(null);
  const total = testimonials.items.length;
  const { index, goTo } = useSteppedScene({ count: total, scopeRef: stageRef, stepLength: 45 });
  useStepTransition(stageRef, index);

  // A aspa gigante gira um pouco a cada depoimento — um "carimbo" que acompanha a troca.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.to('[data-quote-mark]', { rotate: index * 14 - 6, scale: 1 + (index % 2) * 0.08, duration: 1, ease: 'expo.out' });
        gsap.to('[data-quote-progress]', { scaleX: (index + 1) / total, duration: 0.8, ease: 'expo.out' });
      });
    },
    { dependencies: [index], scope: stageRef },
  );

  return (
    <div ref={stageRef} className="grid gap-8 lg:grid-cols-12">
      <span data-quote-mark aria-hidden="true" className="hidden h-[0.5em] origin-[50%_35%] font-display text-[11rem] leading-[0.85] text-signal lg:col-span-2 lg:block">
        “
      </span>
      <div className="min-w-0 lg:col-span-10">
        {/* Desktop: um depoimento por vez (empilhados). Celular: trilho horizontal guiado pelo scroll. */}
        <HorizontalTrack media="mobile" label={testimonials.eyebrow} className="max-lg:flex max-lg:gap-5 lg:grid">
          {testimonials.items.map((t, i) => (
            <figure
              key={t.name}
              data-step-item
              className={cn(
                'max-lg:w-[84vw] max-lg:shrink-0 max-lg:snap-center lg:[grid-area:1/1]',
                i === index ? 'lg:visible lg:opacity-100' : 'lg:invisible lg:opacity-0',
              )}
            >
              <span aria-hidden="true" className="block h-12 font-display text-8xl leading-none text-signal lg:hidden">
                “
              </span>
              <blockquote className="display text-2xl leading-snug font-normal text-pretty sm:text-[2rem]">{t.quote}</blockquote>
              <figcaption className="mt-8 border-t pt-4">
                <p className="text-lg font-medium">
                  <TrackedLink href={t.linkedin} trackEvent="outbound_click" trackLabel="testimonial_author" className="link-rule">
                    {t.name}
                  </TrackedLink>
                </p>
                <p className="mt-1 text-muted-foreground">{t.role}</p>
                <p className="label-caps mt-1 text-muted-foreground">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </HorizontalTrack>

        <div className="mt-10">
          <div aria-hidden="true" className="hidden h-px bg-foreground/20 lg:block">
            <div data-quote-progress className="h-full origin-left bg-signal" style={{ transform: `scaleX(${(index + 1) / total})` }} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="hidden items-center gap-6 lg:flex">
              <button type="button" onClick={() => goTo(index - 1)} className="group link-rule cursor-pointer">
                <Arrow direction="left" /> {ui.previous}
              </button>
              <span className="label-caps text-muted-foreground">
                {pad(index + 1)} {ui.of} {pad(total)}
              </span>
              <button type="button" onClick={() => goTo(index + 1)} className="group link-rule cursor-pointer">
                {ui.next} <Arrow />
              </button>
            </div>
            <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="testimonials_linkedin" className="label-caps link-rule text-muted-foreground">
              {testimonials.sourceNote} <Arrow direction="up-right" />
            </TrackedLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Depoimentos logo após a oferta: prova social antes dos detalhes. */
export function Testimonials() {
  const { testimonials } = useContent();
  return (
    <Scene id="depoimentos" label={testimonials.eyebrow} tone="mata" className="lg:py-16">
      <Container>
        <SectionHeader id="depoimentos" heading={testimonials} compact />
        <TestimonialStage />
      </Container>
    </Scene>
  );
}
