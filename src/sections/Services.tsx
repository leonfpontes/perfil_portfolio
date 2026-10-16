import { Arrow } from '@/components/common/Arrow';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { useContent } from '@/lib/i18n/LocaleProvider';

/** Serviços como índice numerado — linhas de tabela, não cards. */
export function Services() {
  const { services, ui } = useContent();
  return (
    <Section id="servicos" heading={services} className="bg-card">
      <ol className="border-b">
        {services.items.map((service, i) => (
          <Reveal
            as="li"
            key={service.title}
            className="grid gap-4 border-t py-8 transition-colors hover:bg-accent/60 sm:px-4 lg:grid-cols-12 lg:gap-8"
          >
            <span className="label-mono text-signal lg:col-span-1">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-serif text-3xl leading-tight lg:col-span-4">{service.title}</h3>
            <p className="text-muted-foreground lg:col-span-4">{service.description}</p>
            <div className="lg:col-span-3">
              <p className="label-mono text-muted-foreground">
                {ui.audience}: <span className="text-foreground">{service.audience}</span>
              </p>
              <p className="label-mono mt-3 text-muted-foreground">{ui.deliverables}</p>
              <ul className="mt-1 space-y-1 text-sm">
                {service.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
      <TrackedLink href="#contato" trackLabel="services_cta" className="group link-rule mt-10 inline-block font-serif text-3xl">
        {services.cta} <Arrow />
      </TrackedLink>
    </Section>
  );
}
