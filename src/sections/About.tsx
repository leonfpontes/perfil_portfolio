import { Figure } from '@/components/common/Figure';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function About() {
  const { about, ui } = useContent();
  const [lead, ...rest] = about.story;

  return (
    <Section id="sobre" heading={about}>
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          {lead && <p className="font-serif text-3xl leading-snug text-pretty sm:text-4xl">{lead}</p>}
          <div className="mt-8 grid gap-6 text-muted-foreground sm:grid-cols-2">
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <dl className="mt-10 divide-y border-y">
            {about.facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-3 gap-4 py-3">
                <dt className="label-mono pt-0.5 text-muted-foreground">{fact.label}</dt>
                <dd className="col-span-2">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="lg:col-span-5">
          <Figure src={stockImages.team} alt={about.imageAlt} caption={ui.illustrativeImage} number={2} aspect="aspect-[4/5]" />
        </div>
      </div>

      <ol className="mt-20 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {about.pillars.map((pillar, i) => (
          <li key={pillar.title} className="bg-background p-6 pt-5">
            <p className="label-mono text-signal">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-6 font-serif text-3xl">{pillar.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
