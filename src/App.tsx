import type { ComponentType } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SECTION_ORDER } from '@/content/sections';
import type { SectionId } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';
import { About } from '@/sections/About';
import { Contact } from '@/sections/Contact';
import { Education } from '@/sections/Education';
import { Experience } from '@/sections/Experience';
import { Faq } from '@/sections/Faq';
import { Hero } from '@/sections/Hero';
import { Offer } from '@/sections/Offer';
import { Products } from '@/sections/Products';
import { Services } from '@/sections/Services';
import { Skills } from '@/sections/Skills';
import { Testimonials } from '@/sections/Testimonials';

/**
 * Registro seção → componente. A ordem vem de `SECTION_ORDER` (a mesma que
 * numera os cabeçalhos), então reordenar a página é editar uma única lista.
 * Funil: oferta → serviços → prova (sobre, produtos, trajetória, competências,
 * formação, depoimentos) → objeções (FAQ) → ação (contato).
 */
const sectionComponents: Record<(typeof SECTION_ORDER)[number], ComponentType> = {
  mentoria: Offer,
  servicos: Services,
  sobre: About,
  produtos: Products,
  experiencia: Experience,
  competencias: Skills,
  formacao: Education,
  depoimentos: Testimonials,
  faq: Faq,
  contato: Contact,
};

export function App() {
  const { contact: copy, hero } = useContent();
  const { contact } = useServices();

  return (
    <>
      <Header />
      <main id="conteudo" className="pb-16 sm:pb-0">
        <Hero />
        {SECTION_ORDER.map((id: SectionId) => {
          const Component = sectionComponents[id as (typeof SECTION_ORDER)[number]];
          return <Component key={id} />;
        })}
      </main>
      <Footer />

      {/* Barra de ação fixa apenas no mobile */}
      <TrackedLink
        href={contact.whatsapp(copy.whatsappMessage)}
        trackLabel="mobile_bar_whatsapp"
        className="group fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-foreground bg-signal px-4 py-3 text-signal-foreground sm:hidden"
      >
        <span className="label-mono truncate">{hero.badge}</span>
        <span className="shrink-0 text-sm font-medium whitespace-nowrap">
          WhatsApp <Arrow />
        </span>
      </TrackedLink>
    </>
  );
}
