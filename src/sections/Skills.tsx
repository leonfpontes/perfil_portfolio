import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function Skills() {
  const { skills } = useContent();
  return (
    <Section id="competencias" heading={skills} className="bg-card">
      <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {skills.groups.map((group, i) => (
          <Reveal key={group.id} className="bg-card p-6 sm:p-8">
            <p className="label-mono text-signal">{String.fromCharCode(97 + i)})</p>
            <h3 className="mt-4 font-serif text-4xl">{group.label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-1 text-[0.95rem] leading-relaxed">
              {group.skills.map((skill, j) => (
                <li key={skill}>
                  {skill}
                  {j < group.skills.length - 1 && <span aria-hidden="true" className="px-1.5 text-muted-foreground">·</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
