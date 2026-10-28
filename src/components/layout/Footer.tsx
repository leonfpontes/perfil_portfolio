import { Container } from '@/components/common/Section';
import { MotionToggle } from './MotionControls';
import { SocialIcon, type SocialNetwork } from '@/components/common/SocialIcon';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { navHref, pathOf } from '@/lib/router/routes';
import { useServices } from '@/lib/services';

export function Footer() {
  const { footer, nav, contact: contactCopy } = useContent();
  const { contact } = useServices();
  const year = new Date().getFullYear();
  const socials: { name: SocialNetwork; href: string; label: string }[] = [
    { name: 'instagram', href: profile.instagram, label: `Instagram ${profile.instagramHandle}` },
    { name: 'whatsapp', href: contact.whatsapp(contactCopy.whatsappMessage), label: 'WhatsApp' },
    { name: 'linkedin', href: profile.linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-4xl leading-none">{profile.brand}</p>
          <p className="mt-2 font-serif text-xl text-signal italic">{profile.shortName}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{footer.tagline}</p>
          <ul className="mt-6 flex gap-3">
            {socials.map((s) => (
              <li key={s.name}>
                <TrackedLink
                  href={s.href}
                  trackEvent={s.name === 'whatsapp' ? undefined : 'outbound_click'}
                  trackLabel={`footer_icon_${s.name}`}
                  aria-label={s.label}
                  title={s.label}
                  className="glass flex size-11 items-center justify-center rounded-[10px] text-foreground transition-colors hover:text-signal"
                >
                  <SocialIcon name={s.name} />
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            <li>
              <a href={pathOf('home')} className="text-muted-foreground hover:text-foreground">
                {nav.home}
              </a>
            </li>
            {nav.items.map((item) => (
              <li key={item.id}>
                <a href={navHref(item.id)} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/entrar" className="text-muted-foreground hover:text-foreground">
                {nav.clientArea}
              </a>
            </li>
          </ul>
        </nav>
        <ul className="space-y-2 text-sm md:col-span-3">
          <li>
            <TrackedLink href={contact.email()} trackLabel="footer_email" className="link-rule">
              {profile.email}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={contact.whatsapp(contactCopy.whatsappMessage)} trackLabel="footer_whatsapp" className="link-rule">
              WhatsApp
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="footer_instagram" className="link-rule">
              Instagram {profile.instagramHandle}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.linkedin} trackEvent="outbound_click" trackLabel="footer_linkedin" className="link-rule">
              LinkedIn
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.github} trackEvent="outbound_click" trackLabel="footer_github" className="link-rule">
              GitHub
            </TrackedLink>
          </li>
        </ul>
      </Container>
      <Container className="label-caps flex flex-col gap-2 border-t py-5 text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}. {footer.rights}
        </p>
        <MotionToggle />
        <p>{footer.imageCredits}</p>
      </Container>
    </footer>
  );
}
