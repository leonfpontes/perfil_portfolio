import { Funil } from '@/components/art/Funil';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { pathOf, type PageId } from '@/lib/router/routes';

/** 404 — servida pela Vercel com status 404 para qualquer endereço desconhecido. */
export function NotFoundPage() {
  const { notFound, nav, offer } = useContent();
  const links: { page: PageId; label: string; note: string }[] = [
    { page: 'home', label: nav.home, note: '' },
    { page: 'mentoring', label: nav.items[0]!.label, note: offer.plans[0]!.title },
    { page: 'diagnostic', label: nav.items[1]!.label, note: offer.plans[1]!.title },
    { page: 'about', label: nav.items[2]!.label, note: '' },
  ];

  return (
    <Scene
      id="inicio"
      label={notFound.eyebrow}
      tone="cal"
      customTransition
      className="pt-24 pb-16 lg:min-h-[80svh]"
      art={
        <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_top,black,transparent_80%)]">
          <Funil labels={false} />
        </div>
      }
    >
      <Container>
        <p className="label-caps border-b pb-3 text-muted-foreground">{notFound.eyebrow}</p>
        <div className="grid gap-10 pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitReveal as="h1" id="inicio-title" immediate className="display text-[clamp(2.6rem,7vw,7rem)] text-balance">
              {notFound.title}
            </SplitReveal>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">{notFound.description}</p>
          </div>
          <nav aria-label={notFound.linksTitle} className="lg:col-span-5">
            <ul className="divide-y border-y border-border">
              {links.map((link) => (
                <li key={link.page}>
                  <TrackedLink href={pathOf(link.page)} trackLabel={`404_${link.page}`} className="group flex items-baseline justify-between gap-4 py-4 hover:text-signal">
                    <span>
                      <span className="block font-display text-3xl">{link.label}</span>
                      {link.note && <span className="label-caps text-muted-foreground">{link.note}</span>}
                    </span>
                    <Arrow />
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </Scene>
  );
}
