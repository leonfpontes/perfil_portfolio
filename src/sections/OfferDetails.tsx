import { useRef } from 'react';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import type { Plan } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { PlanSheet } from './Offer';

/** A proposta entra pela direita enquanto as listas se escalonam — o mesmo gesto da página inicial. */
function useDetailChoreography() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const st = { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' };
        gsap.from('[data-plan]', { xPercent: 12, rotate: 1.5, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: st });
        gsap.from('[data-detail-item]', { opacity: 0, x: -16, stagger: 0.05, duration: 0.7, ease: 'expo.out', scrollTrigger: st });
      });
    },
    { scope: ref },
  );
  return ref;
}

function planOf(plans: Plan[], id: Plan['id']): { plan: Plan; index: number } {
  const index = plans.findIndex((p) => p.id === id);
  return { plan: plans[index]!, index };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="label-caps mb-3 text-muted-foreground">{title}</h3>
      <ul className="divide-y border-y">
        {items.map((item) => (
          <li key={item} data-detail-item className="flex gap-4 py-3 sm:text-lg">
            <span aria-hidden="true" className="text-signal">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** /mentoria-produto — para quem é, o que trabalhamos e a proposta com preço. */
export function MentoringScope() {
  const { mentoringPage, offer } = useContent();
  const { scope } = mentoringPage;
  const ref = useDetailChoreography();
  const { plan, index } = planOf(offer.plans, 'mentoring');

  return (
    <Scene id="mentoria" label={scope.eyebrow} tone="palha">
      <Container>
        <div ref={ref}>
          <SectionHeader id="mentoria" heading={scope} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-10 lg:col-span-6">
              <DetailList title={scope.audienceTitle} items={scope.audience} />
              <DetailList title={scope.topicsTitle} items={scope.topics} />
              <p className="max-w-xl border-l-2 border-signal pl-5 text-sm text-pretty sm:text-base">{offer.founderNote}</p>
            </div>
            <div className="lg:col-span-6">
              <PlanSheet plan={plan} index={index} bookingHint={offer.bookingHint} />
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  );
}

/** /diagnostico-pmo — os entregáveis e a proposta com preço. */
export function DiagnosticDeliverables() {
  const { diagnosticPage, offer } = useContent();
  const { deliverables } = diagnosticPage;
  const ref = useDetailChoreography();
  const { plan, index } = planOf(offer.plans, 'diagnostic');

  return (
    <Scene id="diagnostico" label={deliverables.eyebrow} tone="cal">
      <Container>
        <div ref={ref}>
          <SectionHeader id="diagnostico" heading={deliverables} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-8 lg:col-span-6">
              <div>
                <h3 className="label-caps mb-3 text-muted-foreground">{deliverables.itemsTitle}</h3>
                <ol className="divide-y border-y">
                  {deliverables.items.map((item, i) => (
                    <li key={item.title} data-detail-item className="grid grid-cols-[3rem_1fr] gap-x-3 py-4 sm:py-5">
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
              <p className="max-w-xl border-l-2 border-signal pl-5 text-sm text-pretty sm:text-base">{offer.founderNote}</p>
            </div>
            <div className="lg:col-span-6">
              <PlanSheet plan={plan} index={index} bookingHint={offer.bookingHint} />
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
