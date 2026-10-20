import { lazy, Suspense, useState } from 'react';
import { LogIn, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { useRouter } from '@/lib/router/Router';
import { navHref, pathOf } from '@/lib/router/routes';
import { useServices } from '@/lib/services';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { cn } from '@/lib/utils';

const MobileMenu = lazy(() => import('./MobileMenu'));

export function Header() {
  const { content, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { analytics } = useServices();
  const { nav } = content;
  const [open, setOpen] = useState(false);
  // O menu só é baixado no primeiro toque (ou ao passar o ponteiro por cima).
  const [menuLoaded, setMenuLoaded] = useState(false);
  // Destaca a página atual.
  const { page } = useRouter();

  const changeLocale = (next: typeof locale) => {
    if (next === locale) return;
    analytics.track('language_change', { label: next });
    setLocale(next);
  };

  const onToggleTheme = () => {
    analytics.track('theme_change', { label: theme === 'dark' ? 'light' : 'dark' });
    toggleTheme();
  };

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        {nav.skipToContent}
      </a>
      <Container className="flex h-14 items-center justify-between gap-3 sm:gap-6">
        {/* `marca-lp`: a marca voa daqui para o cabeçalho da Área do cliente (globals.css). */}
        <a href={pathOf('home')} className="marca-lp flex items-baseline gap-3">
          <span className="font-display text-xl leading-none whitespace-nowrap sm:text-2xl">{profile.shortName}</span>
          <span className="label-caps hidden text-muted-foreground 2xl:inline">{profile.brand}</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-5">
            {nav.items.map((item) => (
              <li key={item.id}>
                <TrackedLink
                  href={navHref(item.id)}
                  trackEvent="nav_click"
                  trackLabel={item.id}
                  aria-current={page === item.id ? 'page' : undefined}
                  className={cn(
                    'relative py-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
                    'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-500',
                    page === item.id && 'text-foreground after:scale-x-100',
                  )}
                >
                  {item.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div role="group" aria-label={nav.toggleLanguage} className="label-caps flex items-center">
            {(['pt-BR', 'en'] as const).map((code, i) => (
              <span key={code} className="flex items-center">
                {i > 0 && <span className="px-1 text-muted-foreground">/</span>}
                <button
                  type="button"
                  onClick={() => changeLocale(code)}
                  aria-pressed={locale === code}
                  className={cn('cursor-pointer px-0.5 py-2', locale === code ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground')}
                >
                  {code === 'pt-BR' ? 'PT' : 'EN'}
                </button>
              </span>
            ))}
          </div>
          {/*
            A Área do cliente (/entrar, aberta com a passagem animada): só o ícone, discreto —
            quem já é cliente sabe onde fica; o destaque do cabeçalho é o convite para conversar.
            No celular ela fica no menu e no rodapé (o cabeçalho não comporta mais um ícone).
          */}
          <TrackedLink
            href="/entrar"
            trackLabel="header_client_area"
            title={nav.clientArea}
            className="hidden min-h-11 items-center px-2 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <LogIn className="size-4" aria-hidden />
            <span className="sr-only">{nav.clientArea}</span>
          </TrackedLink>
          <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label={nav.toggleTheme}>
            {/* Os dois ícones vêm no HTML; o CSS escolhe (evita divergência na hidratação). */}
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
          </Button>
          <Button asChild variant="signal" className="ml-2 hidden sm:inline-flex lg:hidden xl:inline-flex">
            {/* Leva direto à agenda quando ela existe; senão, à seção de contato. */}
            <TrackedLink href={profile.bookingUrl ?? '#contato'} trackLabel="header_cta">
              {nav.cta}
            </TrackedLink>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={nav.openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              setMenuLoaded(true);
              setOpen(true);
            }}
            onPointerEnter={() => setMenuLoaded(true)}
          >
            <Menu />
          </Button>
          {menuLoaded && (
            <Suspense fallback={null}>
              <MobileMenu open={open} onOpenChange={setOpen} />
            </Suspense>
          )}
        </div>
      </Container>
    </header>
  );
}
