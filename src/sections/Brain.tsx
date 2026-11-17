import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

/**
 * /brain — o que o Brain faz. Lista numerada, no mesmo desenho dos entregáveis do
 * diagnóstico: a página serve também de página inicial pública do app (o Google
 * pede uma página aberta que explique para que ele usa a conta).
 */
export function BrainFeatures() {
  const { brainPage } = useContent();
  const { features } = brainPage;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        gsap.from('[data-detail-item]', {
          x: -16,
          stagger: 0.05,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="recursos" label={features.eyebrow} tone="cal">
      <Container>
        <div ref={ref}>
          <SectionHeader id="recursos" heading={features} />
          <div className="lg:ml-[25%]">
            <h3 className="label-caps mb-3 text-muted-foreground">{features.itemsTitle}</h3>
            <ol className="grid border-t sm:grid-cols-2 sm:gap-x-10">
              {features.items.map((item, i) => (
                <li key={item.title} data-detail-item className="grid grid-cols-[3rem_1fr] gap-x-3 border-b py-4 sm:py-5">
                  <span aria-hidden="true" className="text-outline font-display text-4xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-2xl leading-tight">{item.title}</span>
                    <span className="mt-1 block text-muted-foreground">{item.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Scene>
  );
}

/** /brain — a porta de entrada: o botão leva ao login do app, com privacidade e termos ao lado. */
export function BrainAccess() {
  const { brainPage } = useContent();
  const { access } = brainPage;

  return (
    <Scene id="acesso" label={access.eyebrow} tone="anil">
      <Container>
        <SectionHeader id="acesso" heading={access} />
        <div className="flex flex-col gap-8 lg:ml-[25%]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button asChild size="lg" variant="signal" className="group h-12 px-6 text-base">
              <TrackedLink href={profile.brain.login} trackLabel="brain_access_login">
                {access.cta} <Arrow />
              </TrackedLink>
            </Button>
            <TrackedLink href={profile.brain.privacy} trackLabel="brain_access_privacy" className="link-rule text-base">
              {access.privacy}
            </TrackedLink>
            <TrackedLink href={profile.brain.terms} trackLabel="brain_access_terms" className="link-rule text-base">
              {access.terms}
            </TrackedLink>
          </div>
          <p lang="en" className="max-w-2xl border-l-2 border-signal pl-5 text-sm text-pretty text-muted-foreground sm:text-base">
            {access.note}
          </p>
        </div>
      </Container>
    </Scene>
  );
}
