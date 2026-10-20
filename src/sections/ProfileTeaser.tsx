import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { pathOf } from '@/lib/router/routes';

/** Página inicial — "quem conduz": o resumo do perfil; a trajetória completa mora em /sobre. */
export function ProfileTeaser() {
  const { home, about } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-pillar]', {
          yPercent: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-pillars]', start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="perfil" label={home.profile.eyebrow} tone="cal">
      <Container>
        <div ref={ref}>
          <SectionHeader id="perfil" heading={home.profile} />
          <ol data-pillars className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
            {about.pillars.map((pillar, i) => (
              <li key={pillar.title} data-pillar className="bg-background p-4 pt-4 lg:p-6 lg:pt-5">
                <p className="label-caps text-signal">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-2xl lg:mt-6 lg:text-3xl">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex justify-end border-t pt-6">
            <TrackedLink href={pathOf('about')} trackLabel="home_profile_about" className="group link-rule font-display text-2xl">
              {home.profile.cta} <Arrow />
            </TrackedLink>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
