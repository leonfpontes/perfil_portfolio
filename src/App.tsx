import { useEffect, type ComponentType } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Footer } from '@/components/layout/Footer';
import { SceneIndicator } from '@/components/motion/SceneIndicator';
import { Header } from '@/components/layout/Header';
import { MotionNotice } from '@/components/layout/MotionControls';
import { SECTION_ORDER } from '@/content/sections';
import { ScrollTrigger } from '@/lib/motion/gsap';
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
 * numera os capítulos), então reordenar a página é editar uma única lista.
 * Funil: oferta (+ jornada) → prova social → serviços → quem sou → produtos →
 * trajetória → competências → formação → objeções (FAQ) → ação (contato).
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

  // Depois que tudo montou, recalcula uma vez. Sem ScrollTrigger.sort(): a ordem
  // natural de criação (pins internos antes do gatilho da cena que os contém) é a
  // correta — ordenar pela posição faria a cena ignorar o espaço do próprio pin.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <Header />
      <main id="conteudo" className="pb-12 sm:pb-0">
        <Hero />
        {SECTION_ORDER.map((id: SectionId) => {
          const Component = sectionComponents[id as (typeof SECTION_ORDER)[number]];
          return <Component key={id} />;
        })}
      </main>
      <Footer />
      <SceneIndicator />
      <MotionNotice />

      {/* Barra de ação fixa apenas no mobile */}
      <TrackedLink
        href={contact.whatsapp(copy.whatsappMessage)}
        trackLabel="mobile_bar_whatsapp"
        className="group fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-foreground bg-signal px-4 py-3 text-signal-foreground sm:hidden"
      >
        <span className="label-caps truncate">{hero.badge}</span>
        <span className="shrink-0 text-sm font-medium whitespace-nowrap">
          WhatsApp <Arrow />
        </span>
      </TrackedLink>
    </>
  );
}
