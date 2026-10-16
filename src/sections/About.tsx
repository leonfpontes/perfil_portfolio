import { useRef } from 'react';
import { Halftone } from '@/components/art/Halftone';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

export function About() {
  const { about, ui } = useContent();
  const [lead, ...rest] = about.story;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-fact]', { opacity: 0, x: -24, stagger: 0.08, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '[data-facts]', start: 'top 85%' } });
        gsap.from('[data-pillar]', {
          yPercent: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-pillars]', start: 'top 88%', toggleActions: 'play none none reverse' },
        });
        // A foto "derrapa" levemente contra o texto (parallax).
        gsap.fromTo('[data-about-photo]', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="sobre" label={about.eyebrow} tone="paper">
      <Container>
        <div ref={ref}>
          <SectionHeader id="sobre" heading={about} />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {lead && (
                <SplitReveal mode="read" className="font-serif text-3xl leading-snug text-pretty sm:text-4xl">
                  {lead}
                </SplitReveal>
              )}
              <div className="mt-8 grid gap-6 text-muted-foreground sm:grid-cols-2">
                {rest.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
              <dl data-facts className="mt-10 divide-y border-y">
                {about.facts.map((fact) => (
                  <div key={fact.label} data-fact className="grid grid-cols-3 gap-4 py-3">
                    <dt className="label-mono pt-0.5 text-muted-foreground">{fact.label}</dt>
                    <dd className="col-span-2">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="lg:col-span-5">
              <div data-about-photo>
                <Halftone src={stockImages.team} alt={about.imageAlt} cell={8} className="aspect-[4/5] w-full text-foreground" />
              </div>
              <figcaption className="label-mono mt-3 flex gap-3 text-muted-foreground">
                <span className="text-foreground">Fig. 2</span>
                <span>{ui.illustrativeImage}</span>
              </figcaption>
            </figure>
          </div>

          <ol data-pillars className="mt-20 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {about.pillars.map((pillar, i) => (
              <li key={pillar.title} data-pillar className="bg-background p-6 pt-5">
                <p className="label-mono text-signal">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-6 font-serif text-3xl">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Scene>
  );
}
