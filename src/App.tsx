import { useEffect, type ComponentType } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { DocumentMeta } from '@/components/common/DocumentMeta';
import { SocialIcon } from '@/components/common/SocialIcon';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Footer } from '@/components/layout/Footer';
import { SceneIndicator } from '@/components/motion/SceneIndicator';
import { Header } from '@/components/layout/Header';
import { MotionNotice } from '@/components/layout/MotionControls';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useRouter } from '@/lib/router/Router';
import type { PageId } from '@/lib/router/routes';
import { useServices } from '@/lib/services';
import { AboutPage } from '@/pages/AboutPage';
import { DiagnosticPage } from '@/pages/DiagnosticPage';
import { HomePage } from '@/pages/HomePage';
import { MentoringPage } from '@/pages/MentoringPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/** Registro página → componente (as URLs ficam em lib/router/routes.ts). */
const pages: Record<PageId, ComponentType> = {
  home: HomePage,
  mentoring: MentoringPage,
  diagnostic: DiagnosticPage,
  about: AboutPage,
  notFound: NotFoundPage,
};

export function App() {
  const { contact: copy, hero } = useContent();
  const { contact } = useServices();
  const { page } = useRouter();
  const Page = pages[page];

  // Depois que tudo montou, recalcula uma vez. Sem ScrollTrigger.sort(): a ordem
  // natural de criação (pins internos antes do gatilho da cena que os contém) é a
  // correta — ordenar pela posição faria a cena ignorar o espaço do próprio pin.
  // (Nas trocas de página, o roteador recalcula: lib/router/Router.tsx.)
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <DocumentMeta />
      <Header />
      {/* tabIndex: o roteador põe o foco aqui ao trocar de página (leitores de tela). */}
      <main id="conteudo" tabIndex={-1} className="pb-12 outline-none sm:pb-0">
        {/* `key`: cada página monta do zero, com as próprias cenas e gatilhos. */}
        <Page key={page} />
      </main>
      <Footer />
      <SceneIndicator />
      <MotionNotice />

      {/* Barra de ação fixa apenas no mobile */}
      <TrackedLink
        href={contact.whatsapp(copy.whatsappMessage)}
        trackLabel="mobile_bar_whatsapp"
        className="group fixed inset-x-0 bottom-0 z-40 glass-bar flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-foreground sm:hidden"
      >
        <span className="label-caps truncate text-signal">{hero.badge}</span>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap">
          <SocialIcon name="whatsapp" className="size-4" />
          WhatsApp <Arrow />
        </span>
      </TrackedLink>
    </>
  );
}
