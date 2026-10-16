import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function Education() {
  const { education } = useContent();
  return (
    <Section id="formacao" heading={education}>
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h3 className="label-mono mb-4 text-muted-foreground">{education.degreesTitle}</h3>
          <ul className="border-b">
            {education.degrees.map((degree) => (
              <li key={degree.title} className="border-t py-6">
                <p className="label-mono text-muted-foreground">{degree.period}</p>
                <p className="mt-2 font-serif text-3xl leading-tight">{degree.title}</p>
                <p className="mt-1 text-sm">{degree.institution}</p>
                <p className="mt-2 text-sm text-muted-foreground">{degree.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <h3 className="label-mono mb-4 text-muted-foreground">{education.certificationsTitle}</h3>
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {education.certifications.map((cert) => (
                <tr key={cert.title} className="border-t align-baseline last:border-b">
                  <td className="py-3 pr-4">
                    {cert.title}
                    {cert.inProgress && <span className="label-mono ml-2 text-signal">· {education.inProgressLabel}</span>}
                  </td>
                  <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">{cert.issuer}</td>
                  <td className="label-mono py-3 text-right whitespace-nowrap text-muted-foreground">{cert.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </Section>
  );
}
