import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, KeyRound, Mail } from 'lucide-react';
import { Funil } from '@/components/art/Funil';
import { cn } from '@/lib/utils';
import { api, APP_URL, destination, isTwoFactorStep, type Principal, type SignInResult, SignInError } from './api';
import { sairPara } from './passagem';
import { caixaDeEntrada, emailLembrado, guardarPedido, lembrarEmail, pedidoEmAndamento, type Pedido } from './lembrar';

/**
 * /entrar — a porta da Área do cliente, no site. Mentorados e empresas entram por um link no
 * e-mail (sem senha para lembrar) ou, sem e-mail, pela senha que o mentor deu; o mentor, por senha
 * (e o código do 2FA, quando ligado). O link
 * que chega por e-mail também abre aqui (`?token=`). Entrou, a cortina fecha e o app abre na área
 * da pessoa (ou no `?next=` que o app pediu).
 *
 * Painel da marca à esquerda no computador; no celular, uma coluna só com o formulário.
 */

type Mode = 'link' | 'senha';

type Step =
  | { kind: 'form' }
  | { kind: 'sent'; pedido: Pedido }
  | { kind: 'expirado' }
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
  'h-12 w-full rounded-sm border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30';
const PRIMARY =
  'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-action px-5 text-base font-semibold text-action-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60';
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
          // Vencido, já usado ou trocado por um pedido mais novo: um toque manda outro.
          if (caught instanceof SignInError && (caught.status === 401 || caught.status === 400)) {
            setStep({ kind: 'expirado' });
          } else {
            setStep({ kind: 'form' });
            setError(caught.message);
          }
        });
      return;
    }
    // Voltou do app de e-mail (e a página recarregou): o pedido continua esperando o código.
    const pedido = pedidoEmAndamento();
    if (pedido) setStep({ kind: 'sent', pedido });
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
    guardarPedido(null);
    if (isTwoFactorStep(result)) {
      setStep({ kind: 'twofactor', challenge: result.challenge });
      return;
    }
    setStep({ kind: 'entering', name: firstName(result.user.name) });
    void sairPara(destination(next.current));
  }

  /** O pedido saiu (ou o servidor manteve o que já havia): a página espera o código. */
  function enviado(email: string, requestId: string | undefined) {
    lembrarEmail(email);
    if (!requestId) {
      // Um app antigo, sem código: só o link.
      setStep({ kind: 'sent', pedido: { email, requestId: '', sentAt: Date.now() } });
      return;
    }
    const pedido = { email, requestId, sentAt: Date.now() };
    guardarPedido(pedido);
    setStep({ kind: 'sent', pedido });
  }

  function pedir(email: string) {
    return run(async () => enviado(email, (await api.requestLink(email)).requestId));
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
      {/* A cortina recua até o painel na chegada, com o fio champagne na borda, e cobre a tela na saída (entrar.css). */}
      <div className="passagem-cortina" aria-hidden />
      <div className="passagem-fio" aria-hidden />

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
          className="marca-lp flex items-baseline gap-3 md:text-[var(--noir-ivory)]"
        >
          <span className="font-display text-2xl leading-none whitespace-nowrap">
            LP<span className="hidden sm:inline"><span className="text-signal md:text-[var(--noir-champagne)]"> · </span><span lang="en">Product &amp; Portfolio</span></span>
          </span>
          <span className="hidden font-serif text-lg leading-none italic opacity-80 lg:inline">Leonardo Pontes</span>
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
            <p lang="en" className="label-caps text-signal">Client area</p>
            {step.kind === 'form' && (
              <FormStep mode={mode} onMode={setMode} busy={busy} error={error} onFinish={finish} onSent={enviado} run={run} />
            )}
            {step.kind === 'sent' && (
              <SentStep
                pedido={step.pedido}
                busy={busy}
                error={error}
                onCode={(code) => run(async () => finish(await api.verifyCode(step.pedido.requestId, code)))}
                onResend={() => pedir(step.pedido.email)}
                onOtherEmail={() => {
                  guardarPedido(null);
                  setError(null);
                  setStep({ kind: 'form' });
                }}
              />
            )}
            {step.kind === 'expirado' && (
              <ExpiredStep
                email={emailLembrado()}
                busy={busy}
                error={error}
                onResend={(email) => pedir(email)}
                onOtherEmail={() => {
                  setError(null);
                  setStep({ kind: 'form' });
                }}
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

/** Computador: o painel escuro com as curvas de nível, a promessa e o que há lá dentro. */
function BrandPanel() {
  return (
    <aside
      aria-label="Sobre a Área do cliente"
      data-glass-light
      className="tone-anil relative hidden overflow-hidden border-r border-border bg-background text-foreground md:flex md:flex-col"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="glass-spot" />
        <Funil labels={false} className="opacity-80" />
      </div>
      <div className="passagem-surge relative z-20 flex flex-1 flex-col justify-between gap-12 px-10 pt-24 pb-10 lg:px-14">
        <div>
          <p className="label-caps text-signal">Private mentoring · Portfolio Diagnostic</p>
          <p className="display mt-5 text-4xl lg:text-5xl">
            Sua mentoria e seus diagnósticos <span className="highlight">num lugar só</span>.
          </p>
          <ul className="mt-10 flex flex-col gap-4 text-base">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border border-signal/40 text-signal">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-foreground/85">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
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
  onSent: (email: string, requestId: string | undefined) => void;
  run: (action: () => Promise<void>) => Promise<void>;
}) {
  const ids = { email: useId(), password: useId(), error: useId() };
  const [email, setEmail] = useState(() => emailLembrado());
  const [password, setPassword] = useState('');
  // O botão fica sempre ativo; o que falta aparece quando a pessoa clica.
  const [falta, setFalta] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setFalta(address ? 'Confira o e-mail: ele precisa ter o formato voce@empresa.com.' : 'Digite o seu e-mail para receber o acesso.');
      return;
    }
    if (mode === 'senha' && !password) {
      setFalta('Digite a sua senha.');
      return;
    }
    setFalta(null);
    void run(async () => {
      if (mode === 'link') {
        onSent(address, (await api.requestLink(address)).requestId);
      } else {
        onFinish(await api.login(address, password));
      }
    });
  }

  return (
    <>
      <h1 className="mt-3 display text-4xl sm:text-5xl">
        Entre na sua área
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {mode === 'link'
          ? 'Mentorados e empresas: mandamos um código e um link de acesso para o seu e-mail, sem senha.'
          : 'Entre com o e-mail e a senha da sua conta. Quem usa a verificação em duas etapas confirma com o código.'}
      </p>

      <div role="group" aria-label="Como entrar" className="mt-8 grid grid-cols-2 rounded-lg border border-input p-1">
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
              'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors',
              mode === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <form noValidate onSubmit={submit} className="mt-6 flex flex-col gap-5" aria-describedby={falta || error ? ids.error : undefined}>
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
        {(falta || error) && <ErrorText id={ids.error}>{falta ?? error}</ErrorText>}
        <button type="submit" disabled={busy} className={PRIMARY}>
          {busy ? <Spinner /> : null}
          {mode === 'link' ? 'Enviar link de acesso' : 'Entrar'}
          {!busy && <ArrowRight className="size-4" aria-hidden />}
        </button>
      </form>
    </>
  );
}

/** Depois do pedido: o código do e-mail entra aqui; o link do e-mail também serve, em qualquer aparelho. */
function SentStep({
  pedido,
  busy,
  error,
  onCode,
  onResend,
  onOtherEmail,
}: {
  pedido: Pedido;
  busy: boolean;
  error: string | null;
  onCode: (code: string) => void;
  onResend: () => void;
  onOtherEmail: () => void;
}) {
  const ids = { code: useId(), error: useId(), hint: useId() };
  const [code, setCode] = useState('');
  const [agora, setAgora] = useState(() => Date.now());
  const [reenviado, setReenviado] = useState(false);
  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(relogio);
  }, []);
  const espera = Math.max(0, Math.ceil((pedido.sentAt + 60_000 - agora) / 1000));
  const caixa = caixaDeEntrada(pedido.email);
  const comCodigo = Boolean(pedido.requestId);

  function digitar(value: string) {
    const digitos = value.replace(/\D/g, '').slice(0, 6);
    setCode(digitos);
    // Seis números (digitados, colados ou preenchidos pelo celular): entra sem precisar de botão.
    if (digitos.length === 6 && !busy) onCode(digitos);
  }

  return (
    <>
      <h1 className="mt-3 display text-4xl">
        Confira seu e-mail
      </h1>
      <p className="mt-3 text-base text-muted-foreground" id={ids.hint}>
        Se <strong className="text-foreground">{pedido.email}</strong> tem acesso,{' '}
        {comCodigo
          ? 'o código e o link chegam em instantes. Digite o código aqui ou toque no link do e-mail.'
          : 'o link chega em instantes e entra direto, sem senha.'}{' '}
        Valem por 15 minutos.
      </p>

      {comCodigo && (
        <form
          noValidate
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (code.length === 6) onCode(code);
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.code} className="text-sm font-semibold">
              Código de 6 números
            </label>
            <input
              id={ids.code}
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              autoFocus
              value={code}
              onChange={(event) => digitar(event.target.value)}
              placeholder="000000"
              className={cn(INPUT, 'text-center font-mono text-3xl tracking-[0.5em] placeholder:text-muted-foreground/40')}
              aria-describedby={[ids.hint, error ? ids.error : null].filter(Boolean).join(' ')}
              aria-invalid={error ? true : undefined}
            />
          </div>
          {error && <ErrorText id={ids.error}>{error}</ErrorText>}
          <button type="submit" disabled={busy || code.length < 6} className={PRIMARY}>
            {busy ? <Spinner /> : null}
            Entrar
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t pt-5 text-sm">
        {caixa && (
          <a href={caixa.href} target="_blank" rel="noopener noreferrer" className={cn(LINK, 'inline-flex items-center gap-1.5')}>
            <Mail className="size-4" aria-hidden />
            Abrir o {caixa.nome}
          </a>
        )}
        <p className="text-muted-foreground" aria-live="polite">
          Não chegou? Veja no spam ou{' '}
          {espera > 0 ? (
            <span>
              reenvie em <span className="tabular-nums">0:{String(espera).padStart(2, '0')}</span>
            </span>
          ) : (
            <button
              type="button"
              className={LINK}
              disabled={busy}
              onClick={() => {
                setReenviado(true);
                setCode('');
                onResend();
              }}
            >
              reenviar
            </button>
          )}
          .{reenviado && espera > 0 ? ' Mandamos de novo; vale o e-mail mais recente.' : ''}
        </p>
        <button type="button" className={cn(LINK, 'self-start')} onClick={onOtherEmail}>
          Usar outro e-mail
        </button>
      </div>
    </>
  );
}

/** O link do e-mail venceu, já foi usado ou foi trocado por um mais novo: um toque manda outro. */
function ExpiredStep({
  email,
  busy,
  error,
  onResend,
  onOtherEmail,
}: {
  email: string;
  busy: boolean;
  error: string | null;
  onResend: (email: string) => void;
  onOtherEmail: () => void;
}) {
  const ids = { error: useId() };
  return (
    <>
      <h1 className="mt-3 display text-4xl">
        Este link já não vale
      </h1>
      <p className="mt-3 text-base text-muted-foreground" role="alert">
        Links e códigos valem por 15 minutos e funcionam uma vez, e um pedido novo cancela os anteriores. Sem problema:
        mandamos outro.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {error && <ErrorText id={ids.error}>{error}</ErrorText>}
        {email ? (
          <button type="button" className={PRIMARY} disabled={busy} onClick={() => onResend(email)}>
            {busy ? <Spinner /> : <Mail className="size-4" aria-hidden />}
            Mandar um novo para {email}
          </button>
        ) : null}
        <button type="button" className={cn(email ? LINK : PRIMARY, email && 'self-center text-sm')} onClick={onOtherEmail}>
          {email ? 'Usar outro e-mail' : 'Pedir um novo link'}
        </button>
      </div>
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
      <h1 className="mt-3 display text-4xl">
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
      <span className="flex size-12 items-center justify-center rounded-lg border border-signal/40 text-signal">{icon}</span>
      <h1 className="display text-4xl">{title}</h1>
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
