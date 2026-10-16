import { useState } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Section } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';

/** Uma citação por vez, em destaque — leitura de revista, não mural de cards. */
export function Testimonials() {
  const { testimonials, ui } = useContent();
  const [index, setIndex] = useState(0);
  const total = testimonials.items.length;
  const current = testimonials.items[index];
  if (!current) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <Section id="depoimentos" heading={testimonials} className="bg-card">
      <figure className="grid gap-8 lg:grid-cols-12">
        <span aria-hidden="true" className="font-serif text-[10rem] leading-[0.7] text-signal lg:col-span-2">
          “
        </span>
        <div className="lg:col-span-10">
          <blockquote aria-live="polite" className="display min-h-[12rem] text-3xl leading-tight text-pretty sm:text-5xl">
            {current.quote}
          </blockquote>
          <figcaption className="mt-8 border-t pt-4">
            <p className="font-medium">{current.role}</p>
            <p className="label-mono mt-1 text-muted-foreground">{current.context}</p>
          </figcaption>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => go(-1)} className="group link-rule cursor-pointer">
                <Arrow direction="left" /> {ui.previous}
              </button>
              <span className="label-mono text-muted-foreground" aria-live="polite">
                {pad(index + 1)} {ui.of} {pad(total)}
              </span>
              <button type="button" onClick={() => go(1)} className="group link-rule cursor-pointer">
                {ui.next} <Arrow />
              </button>
            </div>
            <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="testimonials_linkedin" className="label-mono link-rule text-muted-foreground">
              {testimonials.sourceNote} <Arrow direction="up-right" />
            </TrackedLink>
          </div>
        </div>
      </figure>
    </Section>
  );
}
