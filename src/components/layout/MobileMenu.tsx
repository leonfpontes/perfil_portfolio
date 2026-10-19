import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useSmoothScroll } from '@/lib/motion/SmoothScroll';

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
  const { scrollTo } = useSmoothScroll();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-background">
        <SheetHeader className="border-b">
          <SheetTitle className="font-display text-2xl font-normal">{profile.shortName}</SheetTitle>
          <SheetDescription className="label-caps">{profile.brand}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="divide-y">
            {nav.items.map((item) => (
              <li key={item.id}>
                <TrackedLink
                  href={`#${item.id}`}
                  trackEvent="nav_click"
                  trackLabel={`mobile_${item.id}`}
                  onClick={(e) => {
                    // Fecha o menu antes de rolar: o Sheet trava o scroll enquanto aberto.
                    e.preventDefault();
                    onOpenChange(false);
                    window.setTimeout(() => scrollTo(`#${item.id}`), 320);
                  }}
                  className="flex items-baseline gap-3 py-3"
                >
                  <span className="font-display text-3xl">{item.label}</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
          <Button asChild variant="signal" size="lg" className="mt-6 w-full">
            <TrackedLink href="#contato" trackLabel="mobile_cta" onClick={() => onOpenChange(false)}>
              {nav.cta}
            </TrackedLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="mt-3 w-full">
            <TrackedLink href="/entrar" trackLabel="mobile_client_area">
              {nav.clientArea}
            </TrackedLink>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
