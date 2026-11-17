import { PageHero } from '@/components/common/PageHero';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { BrainAccess, BrainFeatures } from '@/sections/Brain';
import { Faq } from '@/sections/Faq';
import { Lazy } from './Lazy';

/** "/brain" — a página inicial pública do Brain: o que é, como usa a Conta do Google e o caminho para entrar. */
export function BrainPage() {
  const { brainPage, nav } = useContent();

  return (
    <>
      <PageHero
        copy={brainPage.hero}
        crumb={nav.brain}
        primaryHref={profile.brain.login}
        secondaryHref="#recursos"
        trackPrefix="brain"
        panel={brainPage.panel}
      />
      <Lazy>
        <BrainFeatures />
      </Lazy>
      <Lazy>
        <Faq faq={brainPage.faq} />
      </Lazy>
      <Lazy>
        <BrainAccess />
      </Lazy>
    </>
  );
}
