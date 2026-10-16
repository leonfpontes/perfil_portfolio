import { useRef } from 'react';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

export function Education() {
  const { education } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-degree]', { opacity: 0, y: 40, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-degrees]', start: 'top 80%' } });
        gsap.from('[data-cert]', { opacity: 0, x: 30, stagger: 0.05, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '[data-certs]', start: 'top 80%' } });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="formacao" label={education.eyebrow} tone="sand">
      <Container>
        <div ref={ref}>
          <SectionHeader id="formacao" heading={education} />
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="label-mono mb-4 text-muted-foreground">{education.degreesTitle}</h3>
              <ul data-degrees className="border-b">
                {education.degrees.map((degree) => (
                  <li key={degree.title} data-degree className="border-t py-6">
                    <p className="label-mono text-muted-foreground">{degree.period}</p>
                    <p className="mt-2 font-serif text-3xl leading-tight">{degree.title}</p>
                    <p className="mt-1 text-sm">{degree.institution}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{degree.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <h3 className="label-mono mb-4 text-muted-foreground">{education.certificationsTitle}</h3>
              <table data-certs className="w-full border-collapse text-left text-sm">
                <tbody>
                  {education.certifications.map((cert) => (
                    <tr key={cert.title} data-cert className="border-t align-baseline last:border-b">
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
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
