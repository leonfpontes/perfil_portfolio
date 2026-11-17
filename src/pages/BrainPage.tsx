import { useContent } from '@/lib/i18n/LocaleProvider';
import { BrainAccess, BrainFeatures, BrainHero, BrainMobile, BrainTour } from '@/sections/Brain';
import { Contact } from '@/sections/Contact';
import { Faq } from '@/sections/Faq';
import { Lazy } from './Lazy';

/**
 * "/brain" — a página de produto do Brain Copilot: o que ele é, com capturas reais
 * do app (vault fictício), como usa a Conta do Google (o Google pede essa página
 * aberta para verificar o app) e, no fim, o convite para falar com o Leonardo.
 */
export function BrainPage() {
  const { brainPage } = useContent();

  return (
    <>
      <BrainHero />
      <Lazy>
        <BrainTour />
      </Lazy>
      <Lazy>
        <BrainFeatures />
      </Lazy>
      <Lazy>
        <BrainMobile />
      </Lazy>
      <Lazy>
        <Faq faq={brainPage.faq} />
      </Lazy>
      <Lazy>
        <BrainAccess />
      </Lazy>
      <Lazy>
        <Contact override={brainPage.contact} />
      </Lazy>
    </>
  );
}
