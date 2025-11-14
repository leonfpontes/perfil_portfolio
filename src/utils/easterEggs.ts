/**
 * Easter egg messages for DevTools
 * Themes: Project, Technology, Development.
 * Includes PT-BR and EN variants.
 */

export type EggCategory = 'project' | 'technology' | 'development';

type EggsByLang = Record<string, Record<EggCategory, string[]>>;

export const EGG_COOLDOWN_MS = 60_000; // 60s anti-spam
const STORAGE_KEY_LAST = 'eggs:last-shown';
const STORAGE_KEY_HISTORY = 'eggs:recent-ids';
const HISTORY_LIMIT = 8; // avoid repetition

// Minimal bilingual set (expandable)
export const eggs: EggsByLang = {
  'pt-br': {
    project: [
      'Você abriu o DevTools. Quer ver o backlog? 😉',
      'Roadmap claro, entregas de valor: essa é a vibe.',
      'OKRs alinhados e métricas na veia. Bora medir impacto!',
      'Produto bom é o que resolve problema de gente real.',
      'Feature pronta não é valor entregue. 😅',
      'Discovery não é luxo — é economia de futuro retrabalho.',
      'Se cabe no post-it, cabe no sprint (quase sempre).',
      '“Pronto” inclui acessibilidade, performance e DX. ✨',
      'Scope creep? Só se vier com KPI.',
      'Release pequeno, risco pequeno. Deploy feliz. 🚀',
    ],
    technology: [
      'Vite + TS + i18n + code-splitting — só o filé. 🔥',
      'Chart.js carrega sob demanda. Performance acima de tudo.',
      'HMR ligado, café pronto. Produtividade > 9000.',
      'Tipos bem definidos, bugs bem reduzidos.',
      'CSS isolado? Em breve com CSS Modules. 😉',
      'Prefers-reduced-motion: respeitado. UX não é só visual.',
      'Atenção aos headers de cache: assets voando! 🛫',
      'Lazy import é amor. Bundle feliz, usuário também.',
      'Propagar estado de idioma com eventos? Sim, senhor(a).',
      'DX conta: estrutura clara, scripts simples, build rápido.',
    ],
    development: [
      'Nenhum teste? Nenhuma paz. Vitest tá prontinho te esperando.',
      'Commit pequeno, mensagem clara. O futuro agradece.',
      'Refatorar é pagar o futuro a prazo com juros baixos.',
      'Acessibilidade não é extra — é obrigação.',
      'Performance é feature. LCP e CLS não perdoam.',
      '“Funciona na minha máquina” não é definição de pronto. 😅',
      'Comentários necessários; o resto, código limpo explica.',
      'Feature flags salvam releases — e reputações.',
      'Logs contam histórias; métricas contam resultados.',
      'Boas PRs são cartas de amor ao time. 💌',
    ],
  },
  en: {
    project: [
      'DevTools open — want to peek at the backlog? 😉',
      'Clear roadmap, value-focused delivery: that’s the vibe.',
      'OKRs aligned and metrics wired. Let’s measure impact!',
      'Great products solve real problems for real people.',
      '“Shipped” isn’t “valuable” by default. 😅',
      'Discovery saves future rework — not a luxury.',
      'If it fits a sticky note, it might fit a sprint.',
      '“Done” includes accessibility, performance, and DX. ✨',
      'Scope creep? Only if it comes with KPIs.',
      'Small releases, small risks. Happy deploys. 🚀',
    ],
    technology: [
      'Vite + TS + i18n + code-splitting — chef’s kiss. 🔥',
      'Chart.js loads on demand. Performance first.',
      'HMR on, coffee ready. Productivity > 9000.',
      'Strong types, fewer bugs.',
      'Scoped CSS? Coming soon via CSS Modules. 😉',
      'prefers-reduced-motion respected. UX is more than visuals.',
      'Cache headers on point — assets fly! 🛫',
      'Lazy import = happy bundles, happy users.',
      'Language state with custom events? You bet.',
      'DX matters: clear structure, simple scripts, fast builds.',
    ],
    development: [
      'No tests, no peace. Vitest is ready for you.',
      'Small commits, clear messages. Future you says thanks.',
      'Refactoring is paying future debt with low interest.',
      'Accessibility is not optional — it’s essential.',
      'Performance is a feature. LCP and CLS won’t forgive.',
      '“Works on my machine” is not a DoD. 😅',
      'Comment what’s needed; let clean code do the rest.',
      'Feature flags save releases — and reputations.',
      'Logs tell stories; metrics tell outcomes.',
      'Good PRs are love letters to your team. 💌',
    ],
  },
};

function now(): number { return Date.now(); }

export function canShowAgain(): boolean {
  try {
    const last = Number(localStorage.getItem(STORAGE_KEY_LAST) || 0);
    return now() - last > EGG_COOLDOWN_MS;
  } catch {
    return true;
  }
}

export function markShown(): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST, String(now()));
  } catch {}
}

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setHistory(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(ids.slice(-HISTORY_LIMIT)));
  } catch {}
}

export function pickRandomEgg(lang: string): { id: string; category: EggCategory; text: string } {
  const dict = (eggs[lang] ?? eggs['pt-br']) as Record<EggCategory, string[]>;
  const categories: EggCategory[] = ['project', 'technology', 'development'];
  const pool: Array<{ id: string; category: EggCategory; text: string }> = [];

  categories.forEach((cat) => {
    const list = dict[cat] ?? [];
    list.forEach((text, idx) => {
      pool.push({ id: `${lang}:${cat}:${idx}`, category: cat, text });
    });
  });

  const history = new Set(getHistory());
  const fresh = pool.filter((item) => !history.has(item.id));
  const source = fresh.length ? fresh : pool; // if all used recently, allow repeats

  if (source.length === 0) {
    // Safety fallback — should not happen with provided data
    return { id: `${lang}:project:0`, category: 'project', text: 'Olá, Dev! 👋' };
  }

  const idx = Math.floor(Math.random() * source.length);
  const chosen = source[idx]!;

  // update history
  const nextHistory = [...history, chosen.id];
  setHistory(nextHistory);
  return chosen;
}
