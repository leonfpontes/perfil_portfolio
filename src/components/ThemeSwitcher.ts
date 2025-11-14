type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

function getSystemPreference(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemPreference() : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: resolved } }));
}

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return v === 'light' || v === 'dark' || v === 'system' ? v : null;
  } catch {
    return null;
  }
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export class ThemeSwitcher {
  private button: HTMLButtonElement | null = null;
  private current: Theme = 'system';

  constructor() {
    this.ensureButton();
    this.init();
  }

  private ensureButton() {
    // Try to find a host container near language switcher
    const host = document.querySelector('.topbar__lang-switch') || document.querySelector('.language-switcher');
    if (!host) return;
    let btn = host.querySelector<HTMLButtonElement>('.theme-switcher__button');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-switcher__button';
      btn.setAttribute('aria-label', 'Alternar tema');
      btn.title = 'Alternar tema';
      btn.textContent = '🌓';
      host.appendChild(btn);
    }
    this.button = btn;
  }

  private init() {
    const stored = readStoredTheme();
    this.current = stored ?? 'system';
    applyTheme(this.current);

    // React to system changes when using system mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (this.current === 'system') applyTheme('system');
    };
    mq.addEventListener?.('change', onSystem);

    this.button?.addEventListener('click', () => {
      this.cycle();
    });
  }

  private cycle() {
    // Cycle order: system -> light -> dark -> system
    this.current = this.current === 'system' ? 'light' : this.current === 'light' ? 'dark' : 'system';
    storeTheme(this.current);
    applyTheme(this.current);
  }
}
