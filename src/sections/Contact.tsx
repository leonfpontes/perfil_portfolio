import { Button } from '@/components/ui/button';
import { FlowField } from '@/components/art/FlowField';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile } from '@/content/profile';
import { sectionNumber } from '@/content/sections';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';

/** Encerramento: a página "escurece" e o convite fica sozinho no palco. */
export function Contact() {
  const { contact: copy } = useContent();
  const { contact } = useServices();
  const details = [copy.responseTime, copy.location, copy.languages, contact.displayPhone()];

  return (
    <Scene
      id="contato"
      label={copy.eyebrow}
      tone="ink"
      art={<FlowField seed="contato" density={0.6} className="absolute inset-0 size-full text-foreground/45" />}
    >
      <Container>
        <p className="label-mono border-t border-foreground/40 pt-5 text-muted-foreground">
          § {sectionNumber('contato')} — {copy.eyebrow}
        </p>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitReveal as="h2" id="contato-title" mode="chars" className="display text-6xl text-balance sm:text-8xl">
              {copy.title}
            </SplitReveal>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{copy.description}</p>
            <TrackedLink
              href={contact.email(copy.emailSubject)}
              trackLabel="contact_email_big"
              className="mt-10 inline-block font-serif text-3xl break-all underline decoration-1 underline-offset-8 transition-colors hover:text-signal sm:text-5xl"
            >
              {profile.email}
            </TrackedLink>
          </div>

          <div className="flex flex-col justify-end gap-8 lg:col-span-4">
            <Magnetic>
              <Button asChild variant="signal" size="lg" className="group h-16 w-full text-base">
                <TrackedLink href={contact.whatsapp(copy.whatsappMessage)} trackLabel="contact_whatsapp">
                  {copy.channels.whatsapp} <Arrow />
                </TrackedLink>
              </Button>
            </Magnetic>
            <ul className="label-mono divide-y border-y text-muted-foreground">
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
    </Scene>
  );
}
