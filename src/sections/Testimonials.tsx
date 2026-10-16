import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
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
  const { index, goTo } = useSteppedScene({ count: total, scopeRef: stageRef, stepLength: 60 });
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
      <span data-quote-mark aria-hidden="true" className="block h-[0.5em] origin-[50%_35%] font-serif text-[9rem] leading-[0.85] text-signal lg:col-span-2 lg:text-[11rem]">
        “
      </span>
      <div className="lg:col-span-10">
        <div className="grid" aria-live="polite">
          {testimonials.items.map((t, i) => (
            <figure
              key={t.role}
              data-step-item
              aria-hidden={i !== index}
              className={cn('[grid-area:1/1]', i === index ? 'visible opacity-100' : 'invisible opacity-0')}
            >
              <blockquote className="display text-3xl leading-tight text-pretty sm:text-5xl">{t.quote}</blockquote>
              <figcaption className="mt-8 border-t pt-4">
                <p className="font-medium">{t.role}</p>
                <p className="label-mono mt-1 text-muted-foreground">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10">
          <div aria-hidden="true" className="h-px bg-foreground/20">
            <div data-quote-progress className="h-full origin-left bg-signal" style={{ transform: `scaleX(${(index + 1) / total})` }} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => goTo(index - 1)} className="group link-rule cursor-pointer">
                <Arrow direction="left" /> {ui.previous}
              </button>
              <span className="label-mono text-muted-foreground">
                {pad(index + 1)} {ui.of} {pad(total)}
              </span>
              <button type="button" onClick={() => goTo(index + 1)} className="group link-rule cursor-pointer">
                {ui.next} <Arrow />
              </button>
            </div>
            <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="testimonials_linkedin" className="label-mono link-rule text-muted-foreground">
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
    <Scene id="depoimentos" label={testimonials.eyebrow} tone="ink" className="lg:py-16">
      <Container>
        <SectionHeader id="depoimentos" heading={testimonials} compact />
        <TestimonialStage />
      </Container>
    </Scene>
  );
}
