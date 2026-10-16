import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { sectionNumber } from '@/content/sections';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';

/** Encerramento em bloco invertido (tinta sobre papel → papel sobre tinta). */
export function Contact() {
  const { contact: copy } = useContent();
  const { contact } = useServices();

  const details = [copy.responseTime, copy.location, copy.languages, contact.displayPhone()];

  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-foreground py-20 text-background sm:py-28">
      <Container>
        <p className="label-mono border-t border-background/40 pt-5 text-background/60">
          § {sectionNumber('contato')} — {copy.eyebrow}
        </p>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="contato-title" className="display text-6xl text-balance sm:text-8xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg text-background/70">{copy.description}</p>
            <TrackedLink
              href={contact.email(copy.emailSubject)}
              trackLabel="contact_email_big"
              className="mt-10 inline-block font-serif text-3xl break-all underline decoration-1 underline-offset-8 hover:text-signal sm:text-5xl"
            >
              {profile.email}
            </TrackedLink>
          </div>

          <div className="flex flex-col justify-end gap-8 lg:col-span-4">
            <Button asChild variant="signal" size="lg" className="group h-14 w-full text-base">
              <TrackedLink href={contact.whatsapp(copy.whatsappMessage)} trackLabel="contact_whatsapp">
                {copy.channels.whatsapp} <Arrow />
              </TrackedLink>
            </Button>
            <ul className="label-mono divide-y divide-background/20 border-y border-background/20 text-background/70">
              {details.map((d) => (
                <li key={d} className="py-3">
                  {d}
                </li>
              ))}
            </ul>
            <div className="flex gap-6 text-sm">
              <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="contact_linkedin" className="group underline underline-offset-4 hover:text-signal">
                {copy.channels.linkedin} <Arrow direction="up-right" />
              </TrackedLink>
              <TrackedLink href={profile.github} trackEvent="outbound_click" trackLabel="contact_github" className="group underline underline-offset-4 hover:text-signal">
                {copy.channels.github} <Arrow direction="up-right" />
              </TrackedLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
