import { onChange, isOpen } from '../utils/devtools';
import { pickRandomEgg, canShowAgain, markShown } from '../utils/easterEggs';
import { getCurrentLanguage } from '../i18n';

export class DevtoolsEasterEgg {
  private unsubscribe: (() => void) | null = null;
  private disabled: boolean;

  constructor() {
    this.disabled = this.isDisabledByQuery();
    if (this.disabled) return;

    // If already open, show once on load
    if (isOpen() && canShowAgain()) {
      this.showMessage();
    }

    this.unsubscribe = onChange((open) => {
      if (open && canShowAgain()) {
        this.showMessage();
      }
    });
  }

  private isDisabledByQuery(): boolean {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('eggs') === '0';
    } catch {
      return false;
    }
  }

  private readAccentColor(): string {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    // Try common token names; fall back to a friendly blue
    return style.getPropertyValue('--accent-color').trim() || '#3B82F6';
  }

  private showMessage(): void {
    const lang = getCurrentLanguage();
    const egg = pickRandomEgg(lang);
    const accent = this.readAccentColor();

    const title = '%c👋 Olá, Dev!';
    const titleEn = '%c👋 Hey, Dev!';
    const isPt = lang.startsWith('pt');
    const heading = isPt ? title : titleEn;

    const base = 'font-family: Inter, system-ui, Segoe UI, Roboto, sans-serif; padding: 2px 6px;';
    const stylePrimary = `${base} color: white; background: ${accent}; border-radius: 6px; font-weight: 700;`;
    const styleSub = `${base} color: ${accent}; background: transparent;`;

    const cautionPt = 'Por segurança, não cole código aqui que você não entende.';
    const cautionEn = 'For your security, avoid pasting code here you don’t understand.';
    const caution = isPt ? cautionPt : cautionEn;

    // Print stylized lines
    // eslint-disable-next-line no-console
    console.log(heading, stylePrimary);
    // eslint-disable-next-line no-console
    console.log(`%c${egg.text}`, styleSub);
    // eslint-disable-next-line no-console
    console.log(`%c${caution}`, styleSub);

    markShown();
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
