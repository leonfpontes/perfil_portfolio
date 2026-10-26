import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useRouter } from '@/lib/router/Router';
import { navHref, pathOf } from '@/lib/router/routes';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Menu lateral do celular. Carregado sob demanda (React.lazy) no primeiro
 * toque: o Radix do Sheet não entra no JavaScript da primeira tela.
 */
export default function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { nav } = useContent();
  const { page, navigate } = useRouter();
  const go = (href: string) => {
    // Fecha o menu antes de navegar: o Sheet trava o scroll enquanto aberto.
    onOpenChange(false);
    window.setTimeout(() => navigate(href), 320);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-background">
        <SheetHeader className="border-b">
          <SheetTitle className="font-display text-2xl font-normal">{profile.brand}</SheetTitle>
          <SheetDescription className="font-serif text-lg italic">{profile.shortName}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="divide-y">
            {[{ id: 'home' as const, label: nav.home }, ...nav.items].map((item) => (
              <li key={item.id}>
                <TrackedLink
                  href={item.id === 'home' ? pathOf('home') : navHref(item.id)}
                  trackEvent="nav_click"
                  trackLabel={`mobile_${item.id}`}
                  aria-current={page === item.id ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(e.currentTarget.getAttribute('href')!);
                  }}
                  className="flex items-baseline gap-3 py-3 aria-[current=page]:text-signal"
                >
                  <span className="font-display text-3xl">{item.label}</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
          <Button asChild variant="signal" size="lg" className="mt-6 w-full">
            <TrackedLink
              href={profile.bookingUrl ?? '#contato'}
              trackLabel="mobile_cta"
              onClick={(e) => {
                if (profile.bookingUrl) return onOpenChange(false);
                e.preventDefault();
                go('#contato');
              }}
            >
              {nav.cta}
            </TrackedLink>
          </Button>
          {/* Para quem já é cliente: um link discreto, abaixo do convite. */}
          <TrackedLink href="/entrar" trackLabel="mobile_client_area" className="link-rule mt-6 block w-fit text-sm text-muted-foreground">
            {nav.clientArea}
          </TrackedLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
