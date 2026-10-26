import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import { useSteppedScene, useStepTransition } from '@/hooks/useSteppedScene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

const pad = (n: number) => String(n).padStart(2, '0');

/** Selo circular com os nomes dos serviços — gira conforme o scroll. */
function ServiceSeal({ words }: { words: string[] }) {
  const text = `${words.join(' · ')} · `;
  return (
    <svg data-seal viewBox="0 0 200 200" aria-hidden="true" className="size-full">
      <defs>
        <path id="seal-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <text className="fill-current font-sans uppercase" style={{ fontSize: 8.6, letterSpacing: '0.12em' }}>
        <textPath href="#seal-path" textLength={515}>
          {text}
        </textPath>
      </text>
    </svg>
  );
}

function ServicesStage() {
  const { services, ui } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const count = services.items.length;
  const { index, goTo } = useSteppedScene({ count, scopeRef: ref, stepLength: 45 });
  useStepTransition(ref, index);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        // Numeral "odômetro": a coluna de dígitos desliza até o serviço atual.
        gsap.to('[data-odometer]', { yPercent: (-100 / count) * index, duration: 0.9, ease: 'expo.out' });
        gsap.to('[data-seal]', { rotate: index * -60, duration: 1.4, ease: 'expo.out' });
      });
    },
    { dependencies: [index, count], scope: ref },
  );

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-12">
      <div aria-hidden="true" className="relative mx-auto hidden aspect-square lg:col-span-5 lg:block lg:w-full lg:max-w-sm">
        <div className="absolute inset-0 text-foreground/70">
          <ServiceSeal words={services.items.map((s) => s.title.split(' ').slice(0, 2).join(' '))} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[1em] overflow-hidden font-display text-[7rem] leading-none sm:text-[9rem]">
            <div data-odometer className="text-outline" style={{ transform: `translateY(${(-100 / count) * index}%)` }}>
              {services.items.map((_, i) => (
                <div key={i} className="h-[1em]">
                  {pad(i + 1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <HorizontalTrack media="mobile" label={services.eyebrow} className="max-lg:flex max-lg:gap-5 lg:grid">
          {services.items.map((service, i) => (
            <article
              key={service.title}
              data-step-item
              className={cn(
                'max-lg:w-[84vw] max-lg:shrink-0 max-lg:snap-center lg:[grid-area:1/1]',
                i === index ? 'lg:visible lg:opacity-100' : 'lg:invisible lg:opacity-0',
              )}
            >
              <span aria-hidden="true" className="text-outline mb-4 block font-display text-8xl leading-none lg:hidden">
                {pad(i + 1)}
              </span>
              <p className="label-caps">
                {ui.audience}: {service.audience}
              </p>
              <h3 className="display mt-4 text-4xl sm:text-6xl">{service.title}</h3>
              <p className="mt-5 max-w-xl text-lg text-pretty">{service.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="rounded-sm border border-border px-3 py-1.5 text-sm">
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </HorizontalTrack>

        <nav aria-label={services.eyebrow} className="mt-12 hidden items-center gap-2 lg:flex">
          {services.items.map((service, i) => (
            <button
              key={service.title}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? 'step' : undefined}
              aria-label={service.title}
              className="group flex h-8 flex-1 cursor-pointer items-center"
            >
              <span className={cn('h-0.5 w-full transition-all duration-500', i === index ? 'bg-foreground' : 'bg-foreground/25 group-hover:bg-foreground/60')} />
            </button>
          ))}
        </nav>
        <TrackedLink href="#contato" trackLabel="services_cta" className="group link-rule mt-6 inline-block font-display text-2xl">
          {services.cta} <Arrow />
        </TrackedLink>
      </div>
    </div>
  );
}

export function Services() {
  const { services } = useContent();
  return (
    <Scene id="servicos" label={services.eyebrow} tone="ocre" className="lg:py-16">
      <Container>
        <SectionHeader id="servicos" heading={services} compact />
        <ServicesStage />
      </Container>
    </Scene>
  );
}
