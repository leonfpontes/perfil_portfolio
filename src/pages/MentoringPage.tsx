import { PageHero } from '@/components/common/PageHero';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';
import { Contact } from '@/sections/Contact';
import { Faq } from '@/sections/Faq';
import { JourneyScene } from '@/sections/Offer';
import { MentoringScope } from '@/sections/OfferDetails';
import { Lazy } from './Lazy';

/** "/mentoria-produto" — a mentoria 1:1: escopo, preço, como funciona e dúvidas. */
export function MentoringPage() {
  const { mentoringPage, offer, nav } = useContent();
  const { contact } = useServices();
  const plan = offer.plans.find((p) => p.id === 'mentoring')!;

  return (
    <>
      <PageHero
        copy={mentoringPage.hero}
        crumb={nav.items.find((i) => i.id === 'mentoring')!.label}
        primaryHref={contact.whatsapp(plan.whatsappMessage)}
        secondaryHref="#jornada"
        trackPrefix="mentoring"
        seed="mentoria"
        emblem={<PriceEmblem price={plan.price} note={plan.priceNote} regular={plan.regularPrice} />}
      />
      <Lazy>
        <MentoringScope />
      </Lazy>
      <Lazy>
        <JourneyScene id="jornada" journey={mentoringPage.journey} tone="cal" />
      </Lazy>
      <Lazy>
        <Faq faq={mentoringPage.faq} />
      </Lazy>
      <Lazy>
        <Contact />
      </Lazy>
    </>
  );
}

/** O preço "carimbado" sobre o painel de azulejos do hero. */
export function PriceEmblem({ price, note, regular }: { price: string; note: string; regular: string }) {
  return (
    <>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-5xl leading-none">{price}</span>
        <span className="label-caps">{note}</span>
      </p>
      <p className="label-caps mt-2 text-muted-foreground">{regular}</p>
    </>
  );
}
