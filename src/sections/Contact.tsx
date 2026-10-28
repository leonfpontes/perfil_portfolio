import { Button } from '@/components/ui/button';
import { Funil } from '@/components/art/Funil';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { SocialIcon } from '@/components/common/SocialIcon';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile } from '@/content/profile';
import { sectionNumber } from '@/content/sections';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useRouter } from '@/lib/router/Router';
import { useServices } from '@/lib/services';
import { cn } from '@/lib/utils';

/** Encerramento: a página "escurece" e o convite fica sozinho no palco. */
export function Contact() {
  const { contact: copy } = useContent();
  const { contact } = useServices();
  const { page } = useRouter();
  const details = [copy.responseTime, copy.location, copy.languages, contact.displayPhone()];

  return (
    <Scene
      id="contato"
      label={copy.eyebrow}
      tone="mata"
      className="pb-36 lg:pb-40"
      art={
        <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_top,black,transparent_75%)]">
          <Funil labels={false} />
        </div>
      }
    >
      <Container>
        <p className="label-caps border-t border-border pt-5 text-muted-foreground">
          § {sectionNumber(page, 'contato')} — {copy.eyebrow}
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
              className="mt-10 inline-block font-display text-3xl break-all underline decoration-1 underline-offset-8 transition-colors hover:text-signal sm:text-5xl"
            >
              {profile.email}
            </TrackedLink>
          </div>

          <div className="flex flex-col justify-end gap-8 lg:col-span-4">
            {/* Com agenda configurada, ela é a ação principal; o WhatsApp vira secundário. */}
            <div className="flex flex-col gap-3">
              {profile.bookingUrl && (
                <Magnetic>
                  <Button asChild variant="signal" size="lg" className="group h-16 w-full text-base">
                    <TrackedLink href={profile.bookingUrl} trackLabel="contact_booking">
                      {copy.channels.booking} <Arrow direction="up-right" />
                    </TrackedLink>
                  </Button>
                </Magnetic>
              )}
              <Magnetic>
                <Button
                  asChild
                  variant={profile.bookingUrl ? 'outline' : 'signal'}
                  size="lg"
                  className={cn('group w-full text-base', profile.bookingUrl ? 'h-12 bg-transparent' : 'h-16')}
                >
                  <TrackedLink href={contact.whatsapp(copy.whatsappMessage)} trackLabel="contact_whatsapp">
                    <SocialIcon name="whatsapp" />
                    {copy.channels.whatsapp} <Arrow />
                  </TrackedLink>
                </Button>
              </Magnetic>
            </div>
            <ul className="label-caps divide-y border-y text-muted-foreground">
              {details.map((d) => (
                <li key={d} className="py-3">
                  {d}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="contact_instagram" className="group inline-flex items-center gap-2 underline underline-offset-4 hover:text-signal">
                <SocialIcon name="instagram" className="size-4" />
                {copy.channels.instagram} <Arrow direction="up-right" />
              </TrackedLink>
              <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="contact_linkedin" className="group inline-flex items-center gap-2 underline underline-offset-4 hover:text-signal">
                <SocialIcon name="linkedin" className="size-4" />
                {copy.channels.linkedin} <Arrow direction="up-right" />
              </TrackedLink>
              <TrackedLink href={profile.github} trackEvent="outbound_click" trackLabel="contact_github" className="group inline-flex items-center gap-2 underline underline-offset-4 hover:text-signal">
                <SocialIcon name="github" className="size-4" />
                {copy.channels.github} <Arrow direction="up-right" />
              </TrackedLink>
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
