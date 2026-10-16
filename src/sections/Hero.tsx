import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';

export function Hero() {
  const { hero, contact: contactCopy, about } = useContent();
  const { contact } = useServices();
  const location = about.facts[0]?.value;

  return (
    <section id="inicio" aria-labelledby="inicio-title" className="pt-8 pb-16 sm:pt-12 sm:pb-24">
      <Container>
        {/* Linha de metadados, como o cabeçalho de um relatório */}
        <div className="label-mono flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-muted-foreground">
          <span>{hero.greeting}</span>
          <span>{location}</span>
          <a href="#mentoria" className="flex items-center gap-2 text-foreground hover:text-signal">
            <span aria-hidden="true" className="size-2 bg-signal" />
            {hero.badge}
          </a>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-14">
          <div className="lg:col-span-8">
            <h1 id="inicio-title" className="display text-[clamp(3.25rem,9vw,8rem)] text-balance">
              {hero.title} <em className="text-signal">{hero.titleHighlight}</em>
            </h1>
            <p className="mt-10 max-w-xl text-lg text-pretty sm:text-xl">{hero.description}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild size="lg" className="group h-12 px-6 text-base">
                <TrackedLink href="#mentoria" trackLabel="hero_offer">
                  {hero.primaryCta} <Arrow />
                </TrackedLink>
              </Button>
              <TrackedLink href={contact.whatsapp(contactCopy.whatsappMessage)} trackLabel="hero_whatsapp" className="link-rule text-base">
                {hero.secondaryCta}
              </TrackedLink>
            </div>
          </div>

          <figure className="lg:col-span-4">
            <div className="relative bg-signal pt-8">
              <img
                src={profile.images.portrait}
                alt={hero.portraitAlt}
                width={408}
                height={612}
                fetchPriority="high"
                className="mx-auto h-auto w-full max-w-xs grayscale contrast-110 lg:max-w-none"
              />
            </div>
            <figcaption className="label-mono mt-3 flex justify-between gap-3 text-muted-foreground">
              <span className="text-foreground">{profile.name}</span>
              <span className="text-right">{hero.availability}</span>
            </figcaption>
          </figure>
        </div>

        {/* Indicadores em formato de tabela-razão */}
        <dl className="mt-16 grid grid-cols-2 border-t border-foreground md:grid-cols-4">
          {hero.stats.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col-reverse justify-end gap-1 border-b py-5 pr-4 md:border-b-0 ${i % 2 ? 'pl-4 border-l' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}>
              <dt className="label-mono text-muted-foreground">{stat.label}</dt>
              <dd className="font-serif text-6xl leading-none">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-muted-foreground">
          <span className="label-mono mr-3 text-foreground">{hero.trustLine}</span>
          {hero.trustItems.join('  /  ')}
        </p>
      </Container>
    </section>
  );
}
