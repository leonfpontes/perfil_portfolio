import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Figure } from '@/components/common/Figure';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { stockImages } from '@/content/profile';
import type { Plan } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';
import { cn } from '@/lib/utils';

function PlanSheet({ plan, index }: { plan: Plan; index: number }) {
  const { contact } = useServices();
  return (
    <article
      className={cn(
        'flex flex-col border-t-4 bg-card p-6 sm:p-10',
        plan.highlighted ? 'border-signal' : 'border-foreground',
      )}
    >
      <p className="label-mono flex justify-between text-muted-foreground">
        <span>{plan.tag}</span>
        <span>{String.fromCharCode(65 + index)}</span>
      </p>
      <h3 className="display mt-6 text-4xl sm:text-5xl">{plan.title}</h3>
      <p className="mt-4 text-muted-foreground">{plan.description}</p>

      <div className="mt-8 border-y py-6">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-7xl leading-none">{plan.price}</span>
          <span className="label-mono">{plan.priceNote}</span>
        </p>
        <p className="label-mono mt-3 text-muted-foreground">{plan.regularPrice}</p>
      </div>

      <ul className="flex-1 divide-y">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-4 py-3 text-sm">
            <span aria-hidden="true" className="text-signal">—</span>
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

export function Offer() {
  const { offer, ui } = useContent();
  return (
    <Section id="mentoria" heading={offer}>
      <Reveal className="mb-10 max-w-2xl border-l-2 border-signal pl-5 text-pretty lg:ml-[25%]">
        {offer.founderNote}
      </Reveal>

      <div className="grid gap-px bg-border md:grid-cols-2">
        {offer.plans.map((plan, i) => (
          <PlanSheet key={plan.id} plan={plan} index={i} />
        ))}
      </div>

      {/* Jornada desenhada como "gates" — a linguagem de governança que a mentoria ensina */}
      <div className="mt-24">
        <h3 className="label-mono mb-8 text-muted-foreground">{offer.journey.title}</h3>
        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {offer.journey.steps.map((step, i) => (
            <Reveal as="li" key={step.title} className="relative border-t border-foreground pt-6">
              <span aria-hidden="true" className={cn('absolute -top-[5px] left-0 size-[9px]', i === 0 ? 'bg-signal' : 'bg-foreground')} />
              <p className="label-mono text-muted-foreground">G{i + 1}</p>
              <p className="mt-2 font-serif text-3xl leading-tight">{step.title}</p>
              <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-24 grid gap-10 lg:grid-cols-12">
        <Figure
          src={stockImages.workshop}
          alt=""
          caption={ui.illustrativeImage}
          number={1}
          className="lg:col-span-7"
          aspect="aspect-[16/10]"
        />
        <div className="lg:col-span-5 lg:pt-4">
          <h3 className="display text-4xl">{offer.isNot.title}</h3>
          <ul className="mt-6 divide-y border-y">
            {offer.isNot.items.map((item) => (
              <li key={item} className="flex gap-4 py-4">
                <span aria-hidden="true" className="font-mono text-signal">×</span>
                {item}
              </li>
            ))}
          </ul>
          <TrackedLink href="#faq" trackLabel="offer_faq" className="group link-rule mt-6 inline-block text-sm">
            FAQ <Arrow />
          </TrackedLink>
        </div>
      </div>
    </Section>
  );
}
