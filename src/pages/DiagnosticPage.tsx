import { PageHero } from '@/components/common/PageHero';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';
import { Contact } from '@/sections/Contact';
import { Faq } from '@/sections/Faq';
import { JourneyScene } from '@/sections/Offer';
import { DiagnosticDeliverables } from '@/sections/OfferDetails';
import { Lazy } from './Lazy';
import { PriceEmblem } from './MentoringPage';

/** "/diagnostico-pmo" — o diagnóstico para empresas: etapas, entregáveis, preço e dúvidas. */
export function DiagnosticPage() {
  const { diagnosticPage, offer, nav } = useContent();
  const { contact } = useServices();
  const plan = offer.plans.find((p) => p.id === 'diagnostic')!;

  return (
    <>
      <PageHero
        copy={diagnosticPage.hero}
        crumb={nav.items.find((i) => i.id === 'diagnostic')!.label}
        primaryHref={contact.whatsapp(plan.whatsappMessage)}
        secondaryHref="#processo"
        trackPrefix="diagnostic"
        seed="diagnostico"
        emblem={<PriceEmblem price={plan.price} note={plan.priceNote} regular={plan.regularPrice} />}
      />
      <Lazy>
        <JourneyScene id="processo" journey={diagnosticPage.process} tone="palha" />
      </Lazy>
      <Lazy>
        <DiagnosticDeliverables />
      </Lazy>
      <Lazy>
        <Faq faq={diagnosticPage.faq} />
      </Lazy>
      <Lazy>
        <Contact />
      </Lazy>
    </>
  );
}
