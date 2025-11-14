/**
 * Language Switcher Component
 * Handles language selection buttons
 */

import { setLanguage } from '../i18n';

export class LanguageSwitcher {
  private buttons: HTMLElement[];

  constructor() {
    this.buttons = Array.from(
      document.querySelectorAll<HTMLElement>('.language-switcher__button')
    );
    this.initialize();
  }

  private initialize(): void {
    this.buttons.forEach((button) => {
      this.ensureFlag(button);
      button.addEventListener('click', () => {
        const targetLanguage = button.dataset.language;
        if (targetLanguage) {
          setLanguage(targetLanguage);
        }
      });
    });
  }

  private ensureFlag(button: HTMLElement): void {
    const flagSymbol = button.dataset.flag?.trim();
    if (!flagSymbol) {
      return;
    }

    let flagElement = button.querySelector('.language-switcher__flag');
    if (!flagElement) {
      flagElement = document.createElement('span');
      flagElement.className = 'language-switcher__flag';
      flagElement.setAttribute('aria-hidden', 'true');
      button.insertBefore(flagElement, button.firstChild);
    }

    if (flagElement.textContent !== flagSymbol) {
      flagElement.textContent = flagSymbol;
    }
  }
}
