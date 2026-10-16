import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function Experience() {
  const { experience } = useContent();
  return (
    <Section id="experiencia" heading={experience}>
      <ol className="border-b">
        {experience.items.map((item) => (
          <Reveal as="li" key={`${item.company}-${item.period}`} className="grid gap-4 border-t py-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <p className="label-mono">{item.period}</p>
              {item.current && (
                <p className="label-mono mt-2 flex items-center gap-2 text-signal">
                  <span aria-hidden="true" className="size-2 bg-signal" />
                  {experience.currentLabel}
                </p>
              )}
            </div>
            <div className="lg:col-span-9">
              <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{item.role}</h3>
              <p className="label-mono mt-2 text-muted-foreground">
                <span className="text-foreground">{item.company}</span> · {item.location}
              </p>
              <p className="mt-4 max-w-3xl text-pretty">{item.summary}</p>
              <ul className="mt-4 max-w-3xl space-y-2">
                {item.achievements.map((a) => (
                  <li key={a} className="flex gap-4 text-muted-foreground">
                    <span aria-hidden="true" className="text-signal">—</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
