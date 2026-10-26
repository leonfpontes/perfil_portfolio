import { useRef, useState } from 'react';
import { Halftone } from '@/components/art/Halftone';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/** Em /sobre a seção abre a página: o título vira o H1 e ganha o respiro do cabeçalho fixo. */
export function About({ asPageHero = false }: { asPageHero?: boolean }) {
  const { about, ui } = useContent();
  const [lead, ...rest] = about.story;
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  // Abaixo do H1 da página, os pilares são o nível seguinte (h2), não h3.
  const PillarHeading = asPageHero ? 'h2' : 'h3';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-fact]', { x: -24, stagger: 0.08, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '[data-facts]', start: 'top 85%' } });
        gsap.from('[data-pillar]', {
          yPercent: 20,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-pillars]', start: 'top 88%', toggleActions: 'play none none reverse' },
        });
        // A foto "derrapa" levemente contra o texto (parallax).
      });
      mm.add(MEDIA.desktop, () => {
        gsap.fromTo('[data-about-photo]', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="sobre" label={about.eyebrow} tone="cal" className={cn(asPageHero && 'pt-24 lg:pt-28')}>
      <Container>
        <div ref={ref}>
          <SectionHeader id="sobre" heading={about} level={asPageHero ? 'h1' : 'h2'} />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {lead && (
                <SplitReveal mode="read" className="font-display text-2xl leading-snug text-pretty sm:text-4xl">
                  {lead}
                </SplitReveal>
              )}
              {/* No celular, a história completa fica atrás de "Ler mais" para encurtar a página. */}
              <div id="sobre-mais" className={cn('mt-6 gap-6 text-muted-foreground sm:grid-cols-2 lg:mt-8 lg:grid', expanded ? 'grid' : 'hidden')}>
                {rest.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls="sobre-mais"
                onClick={() => setExpanded((v) => !v)}
                className="link-rule mt-4 cursor-pointer text-sm lg:hidden"
              >
                {expanded ? ui.readLess : ui.readMore}
              </button>
              <dl data-facts className="mt-8 divide-y border-y lg:mt-10">
                {about.facts.map((fact) => (
                  <div key={fact.label} data-fact className="grid grid-cols-3 gap-4 py-3">
                    <dt className="label-caps pt-0.5 text-muted-foreground">{fact.label}</dt>
                    <dd className="col-span-2">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="lg:col-span-5">
              <div data-about-photo>
                <Halftone src={stockImages.team} alt={about.imageAlt} cell={8} className="aspect-[16/10] w-full text-foreground lg:aspect-[4/5]" />
              </div>
              <figcaption className="label-caps mt-3 flex gap-3 text-muted-foreground">
                <span className="text-foreground">Fig. 2</span>
                <span>{ui.illustrativeImage}</span>
              </figcaption>
            </figure>
          </div>

          <ol data-pillars className="mt-12 grid grid-cols-2 gap-px bg-border lg:mt-20 lg:grid-cols-4">
            {about.pillars.map((pillar, i) => (
              <li key={pillar.title} data-pillar className="bg-background p-4 pt-4 lg:p-6 lg:pt-5">
                <p className="label-caps text-signal">{String(i + 1).padStart(2, '0')}</p>
                <PillarHeading className="mt-3 font-display text-2xl lg:mt-6 lg:text-3xl">{pillar.title}</PillarHeading>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Scene>
  );
}
