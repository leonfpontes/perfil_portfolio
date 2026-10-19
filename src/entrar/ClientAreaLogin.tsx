import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, KeyRound, Mail, MailCheck } from 'lucide-react';
import { AzulejoEstatico } from '@/components/art/AzulejoEstatico';
import { cn } from '@/lib/utils';
import { api, APP_URL, destination, isTwoFactorStep, type Principal, type SignInResult, SignInError } from './api';
import { sairPara } from './passagem';

/**
 * /entrar — a porta da Área do cliente, no site. Mentorados e empresas entram por um link no
 * e-mail (sem senha para lembrar); o mentor, por senha (e o código do 2FA, quando ligado). O link
 * que chega por e-mail também abre aqui (`?token=`). Entrou, a cortina fecha e o app abre na área
 * da pessoa (ou no `?next=` que o app pediu).
 *
 * Painel da marca à esquerda no computador; no celular, uma coluna com uma faixa de azulejos.
 */

type Mode = 'link' | 'senha';

type Step =
  | { kind: 'form' }
  | { kind: 'sent'; email: string }
  | { kind: 'twofactor'; challenge: string }
  | { kind: 'verifying' }
  | { kind: 'entering'; name: string }
  | { kind: 'already'; principal: Principal };

const BULLETS = [
  'Próxima sessão, pauta e combinados, no celular.',
  'O roadmap da sua empresa, numa linha do tempo.',
  'Relatórios e recaps em PDF, sem precisar pedir.',
];

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? '';

const INPUT =
  'h-12 w-full border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30';
const PRIMARY =
  'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-foreground px-5 text-base font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60';
const LINK = 'font-semibold text-signal underline-offset-4 hover:underline';

export function ClientAreaLogin() {
  const [mode, setMode] = useState<Mode>('link');
  const [step, setStep] = useState<Step>({ kind: 'form' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const next = useRef<string | null>(null);

  // Ao abrir: o link do e-mail (?token=) entra direto; sem ele, vê se já há alguém conectado.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    next.current = params.get('next');
    const token = params.get('token');
    if (token) {
      // O token não fica na barra de endereço (nem no histórico) depois de usado.
      window.history.replaceState(null, '', window.location.pathname);
      setStep({ kind: 'verifying' });
      api
        .verifyLink(token)
        .then(finish)
        .catch((caught: Error) => {
          setStep({ kind: 'form' });
          setError(
            caught instanceof SignInError && caught.status === 400
              ? 'Este link de acesso já foi usado ou expirou. Peça um novo abaixo.'
              : caught.message,
          );
        });
      return;
    }
    api
      .me()
      .then((principal) => principal && setStep({ kind: 'already', principal }))
      .catch(() => {
        /* sem conexão com o app: o formulário continua ali, e o erro aparece ao tentar entrar */
      });
    // Voltando do app pelo "voltar" do navegador, a página vem da memória com a cortina fechada.
    const reabrir = (event: PageTransitionEvent) => {
      if (event.persisted) delete document.documentElement.dataset.passagem;
    };
    window.addEventListener('pageshow', reabrir);
    return () => window.removeEventListener('pageshow', reabrir);
  }, []);

  function finish(result: SignInResult) {
    if (isTwoFactorStep(result)) {
      setStep({ kind: 'twofactor', challenge: result.challenge });
      return;
    }
    setStep({ kind: 'entering', name: firstName(result.user.name) });
    void sairPara(destination(next.current));
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não deu certo agora. Tente de novo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="passagem relative flex min-h-dvh flex-col bg-background text-foreground">
      {/* A cortina: recua até o painel na chegada e cobre a tela na saída (entrar.css). */}
      <div className="passagem-cortina" aria-hidden />

      <a
        href="#formulario"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        Pular para o formulário
      </a>

      <header className="relative z-50 flex h-14 items-center justify-between gap-4 border-b px-4 sm:px-6 md:absolute md:inset-x-0 md:top-0 md:border-b-0">
        <a
          href="/"
          onClick={(event) => voltarAoSite(event)}
          aria-label="Leonardo Pontes — voltar ao site"
          className="marca-lp flex items-baseline gap-3 md:text-[var(--cal)]"
        >
          <span className="font-display text-2xl leading-none whitespace-nowrap">Leonardo Pontes</span>
          <span className="label-caps hidden opacity-80 lg:inline">Produto &amp; Portfólio</span>
        </a>
        <a
          href="/"
          onClick={(event) => voltarAoSite(event)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar ao site
        </a>
      </header>

      <div className="flex flex-1 flex-col md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <BrandPanel />

        <main id="formulario" className="flex flex-1 flex-col items-center px-4 pt-8 pb-12 sm:px-6 md:justify-center md:py-20">
          <div className="passagem-porta w-full max-w-md">
            <AzulejoEstatico seed="area-do-cliente" cols={12} rows={1} className="mb-8 aspect-[12/1] w-full md:hidden" />
            <p className="label-caps text-signal">Área do cliente</p>
            {step.kind === 'form' && (
              <FormStep mode={mode} onMode={setMode} busy={busy} error={error} onFinish={finish} onSent={(email) => setStep({ kind: 'sent', email })} run={run} />
            )}
            {step.kind === 'sent' && (
              <Message
                icon={<MailCheck className="size-6" aria-hidden />}
                title="Confira seu e-mail"
                body={
                  <>
                    Se <strong className="text-foreground">{step.email}</strong> tem acesso, o link chega em instantes.
                    Ele vale por 15 minutos e entra direto, sem senha.
                  </>
                }
                action={
                  <button type="button" className={LINK} onClick={() => setStep({ kind: 'form' })}>
                    Usar outro e-mail
                  </button>
                }
              />
            )}
            {step.kind === 'twofactor' && (
              <TwoFactorStep
                busy={busy}
                error={error}
                onSubmit={(code) => run(async () => finish(await api.twoFactor(step.challenge, code)))}
                onBack={() => {
                  setError(null);
                  setStep({ kind: 'form' });
                }}
              />
            )}
            {step.kind === 'verifying' && (
              <Message icon={<Spinner />} title="Abrindo seu link de acesso…" body="Só um instante." live />
            )}
            {step.kind === 'entering' && (
              <Message
                icon={<Check className="size-6" aria-hidden />}
                title={step.name ? `Bem-vindo, ${step.name}` : 'Bem-vindo'}
                body="Abrindo a sua área…"
                live
              />
            )}
            {step.kind === 'already' && (
              <Message
                icon={<Check className="size-6" aria-hidden />}
                title={`Você já está conectado, ${firstName(step.principal.user.name)}`}
                body={step.principal.user.email}
                action={
                  <div className="flex w-full flex-col gap-3">
                    <button
                      type="button"
                      className={PRIMARY}
                      onClick={() => {
                        setStep({ kind: 'entering', name: firstName(step.principal.user.name) });
                        void sairPara(destination(next.current));
                      }}
                    >
                      Continuar para a minha área
                      <ArrowRight className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={cn(LINK, 'self-center')}
                      onClick={() =>
                        run(async () => {
                          await api.logout();
                          setStep({ kind: 'form' });
                        })
                      }
                    >
                      Entrar com outra conta
                    </button>
                  </div>
                }
              />
            )}

            <nav aria-label="Links legais" className="mt-10 border-t pt-5 text-xs text-muted-foreground">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                <li>
                  <a href={`${APP_URL}/privacidade`} className="hover:text-foreground hover:underline">
                    Privacidade e termos
                  </a>
                </li>
                <li>
                  <a href="/#contato" className="hover:text-foreground hover:underline">
                    Ainda não é cliente? Fale comigo
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}

function voltarAoSite(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  void sairPara('/');
}

/** Computador: o painel anil com a parede de azulejos, a promessa e o que há lá dentro. */
function BrandPanel() {
  return (
    <aside
      aria-label="Sobre a Área do cliente"
      className="relative hidden overflow-hidden bg-[var(--anil)] text-[var(--cal)] md:flex md:flex-col"
    >
      <div className="passagem-surge flex flex-1 flex-col justify-between gap-12 px-10 pt-24 pb-10 lg:px-14">
        <div>
          <p className="label-caps text-[var(--ocre)]">Mentoria 1:1 · Diagnóstico de maturidade</p>
          <p className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight [font-stretch:115%] lg:text-5xl">
            Sua mentoria e seus diagnósticos <span className="bg-[var(--ocre)] px-1 text-[var(--breu)]">num lugar só</span>.
          </p>
          <ul className="mt-10 flex flex-col gap-4 text-base">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center bg-[var(--ocre)] text-[var(--breu)]">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="opacity-90">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <AzulejoEstatico seed="area-do-cliente" cols={8} rows={3} className="aspect-[8/3] w-full" />
      </div>
    </aside>
  );
}

function FormStep({
  mode,
  onMode,
  busy,
  error,
  onFinish,
  onSent,
  run,
}: {
  mode: Mode;
  onMode: (mode: Mode) => void;
  busy: boolean;
  error: string | null;
  onFinish: (result: SignInResult) => void;
  onSent: (email: string) => void;
  run: (action: () => Promise<void>) => Promise<void>;
}) {
  const ids = { email: useId(), password: useId(), error: useId() };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const address = email.trim();
    void run(async () => {
      if (mode === 'link') {
        await api.requestLink(address);
        onSent(address);
      } else {
        onFinish(await api.login(address, password));
      }
    });
  }

  return (
    <>
      <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight [font-stretch:112%] sm:text-5xl">
        Entre na sua área
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {mode === 'link'
          ? 'Mentorados e empresas: enviamos um link de acesso para o seu e-mail, sem senha.'
          : 'Acesso do mentor, com senha e verificação em duas etapas.'}
      </p>

      <div role="group" aria-label="Como entrar" className="mt-8 grid grid-cols-2 border border-input p-1">
        {(
          [
            ['link', 'Link por e-mail', Mail],
            ['senha', 'Senha', KeyRound],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onMode(value)}
            className={cn(
              'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 text-sm font-medium transition-colors',
              mode === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <form noValidate onSubmit={submit} className="mt-6 flex flex-col gap-5" aria-describedby={error ? ids.error : undefined}>
        <div className="flex flex-col gap-2">
          <label htmlFor={ids.email} className="text-sm font-semibold">
            E-mail
          </label>
          <input
            id={ids.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={INPUT}
          />
        </div>
        {mode === 'senha' && (
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.password} className="text-sm font-semibold">
              Senha
            </label>
            <input
              id={ids.password}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT}
            />
          </div>
        )}
        {error && <ErrorText id={ids.error}>{error}</ErrorText>}
        <button type="submit" disabled={busy || !email.trim() || (mode === 'senha' && !password)} className={PRIMARY}>
          {busy ? <Spinner /> : null}
          {mode === 'link' ? 'Enviar link de acesso' : 'Entrar'}
          {!busy && <ArrowRight className="size-4" aria-hidden />}
        </button>
      </form>
    </>
  );
}

function TwoFactorStep({
  busy,
  error,
  onSubmit,
  onBack,
}: {
  busy: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
  onBack: () => void;
}) {
  const ids = { code: useId(), error: useId() };
  const [code, setCode] = useState('');
  return (
    <>
      <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight [font-stretch:112%]">
        Verificação em duas etapas
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Digite o código de 6 dígitos do seu aplicativo autenticador, ou um código de recuperação.
      </p>
      <form
        noValidate
        className="mt-8 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(code.trim());
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor={ids.code} className="text-sm font-semibold">
            Código
          </label>
          <input
            id={ids.code}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className={cn(INPUT, 'text-center font-mono text-2xl tracking-[0.4em]')}
            aria-describedby={error ? ids.error : undefined}
          />
        </div>
        {error && <ErrorText id={ids.error}>{error}</ErrorText>}
        <button type="submit" disabled={busy || code.trim().length < 6} className={PRIMARY}>
          {busy ? <Spinner /> : null}
          Confirmar
        </button>
        <button type="button" className={cn(LINK, 'self-center text-sm')} onClick={onBack}>
          Voltar
        </button>
      </form>
    </>
  );
}

function Message({
  icon,
  title,
  body,
  action,
  live,
}: {
  icon: ReactNode;
  title: string;
  body: ReactNode;
  action?: ReactNode;
  live?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col items-start gap-4" role={live ? 'status' : undefined}>
      <span className="flex size-12 items-center justify-center bg-signal text-signal-foreground">{icon}</span>
      <h1 className="font-display text-4xl leading-tight font-bold tracking-tight [font-stretch:112%]">{title}</h1>
      <p className="text-base text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
      {children}
    </p>
  );
}

function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />;
}
