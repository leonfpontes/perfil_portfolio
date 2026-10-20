import { Container } from '@/components/common/Section';
import { MotionToggle } from './MotionControls';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { navHref, pathOf } from '@/lib/router/routes';
import { useServices } from '@/lib/services';

export function Footer() {
  const { footer, nav } = useContent();
  const { contact } = useServices();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground">
      <Container className="grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-4xl leading-none">{profile.brand}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{footer.tagline}</p>
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
