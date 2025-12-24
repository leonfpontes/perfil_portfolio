/**
 * Internationalization (i18n) module
 * Handles language switching and translation lookups
 */

import { translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type LanguageCode } from './i18n-data';

export type { LanguageCode };
export type TranslationDictionary = Record<string, string | string[] | Record<string, any>>;

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES };

const supportedLanguageSet = new Set<string>(
  SUPPORTED_LANGUAGES.map((lang: string) => String(lang).toLowerCase())
);

let currentLanguage: LanguageCode = DEFAULT_LANGUAGE;

/**
 * Normalizes a language code to a supported language
 */
export function normalizeLanguage(value: string | null | undefined): LanguageCode | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const lowered = value.toLowerCase();
  if (supportedLanguageSet.has(lowered)) {
    return lowered as LanguageCode;
  }
  const fallback = Array.from(supportedLanguageSet).find((lang) => 
    lowered.startsWith(lang)
  );
  return (fallback as LanguageCode) || null;
}

/**
 * Gets a translation for a given language and key
 */
export function getTranslation(lang: LanguageCode, key: string): string | string[] | Record<string, any> {
  if (!key) {
    return '';
  }
  
  const dictionary = translations[lang];
  if (dictionary && key in dictionary) {
    return dictionary[key];
  }
  
  const fallbackDictionary = translations[DEFAULT_LANGUAGE];
  if (fallbackDictionary && key in fallbackDictionary) {
    return fallbackDictionary[key];
  }
  
  return '';
}

/**
 * Applies text translations to elements with data-i18n-key
 */
export function applyTextTranslations(lang: LanguageCode): void {
  document.querySelectorAll<HTMLElement>('[data-i18n-key]').forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    if (!key) return;
    
    const translation = getTranslation(lang, key);
    if (typeof translation === 'string') {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value = translation;
      } else {
        // Para botões com ícones, atualiza apenas o span de texto
        const textSpan = element.querySelector('span');
        if (textSpan) {
          textSpan.textContent = translation;
        } else {
          element.textContent = translation;
        }
      }
    }
  });
}

/**
 * Applies attribute translations to elements with data-i18n-attrs
 */
export function applyAttributeTranslations(lang: LanguageCode): void {
  document.querySelectorAll<HTMLElement>('[data-i18n-attrs]').forEach((element) => {
    const mapping = element.getAttribute('data-i18n-attrs');
    if (!mapping) return;

    mapping.split(';').forEach((pair) => {
      const trimmed = pair.trim();
      if (!trimmed) return;
      
      const [attrName, key] = trimmed.split(':');
      if (!attrName || !key) return;
      
      const translation = getTranslation(lang, key.trim());
      if (typeof translation === 'string') {
        element.setAttribute(attrName.trim(), translation);
      }
    });
  });
}

/**
 * Updates language button states
 */
export function updateLanguageButtons(lang: LanguageCode): void {
  const languageButtons = document.querySelectorAll<HTMLElement>('.language-switcher__button');
  
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === lang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/**
 * Sets the active language and applies all translations
 */
export function setLanguage(lang: string, options: { force?: boolean } = {}): LanguageCode {
  const { force = false } = options;
  const normalized = normalizeLanguage(lang) || DEFAULT_LANGUAGE;

  if (normalized === currentLanguage && !force) {
    return currentLanguage;
  }

  currentLanguage = normalized;

  applyTextTranslations(normalized);
  applyAttributeTranslations(normalized);

  const htmlLangMap: Record<string, string> = {
    'pt-br': 'pt-BR',
    'en': 'en',
  };
  
  const htmlElement = document.documentElement;
  htmlElement.lang = htmlLangMap[normalized] || normalized;
  htmlElement.dataset.language = normalized;

  try {
    localStorage.setItem('selectedLanguage', normalized);
  } catch (error) {
    // Ignore storage errors (e.g., private mode)
    console.warn('Could not save language to localStorage:', error);
  }

  updateLanguageButtons(normalized);

  const dictionary = translations[normalized] || translations[DEFAULT_LANGUAGE] || {};
  document.dispatchEvent(
    new CustomEvent('languagechange', {
      detail: {
        language: normalized,
        dictionary,
      },
    })
  );

  return normalized;
}

/**
 * Gets the currently active language
 */
export function getCurrentLanguage(): LanguageCode {
  return currentLanguage;
}

/**
 * Gets the stored language from localStorage
 */
export function getStoredLanguage(): LanguageCode | null {
  try {
    return normalizeLanguage(localStorage.getItem('selectedLanguage'));
  } catch (error) {
    return null;
  }
}

/**
 * Gets the browser's preferred language
 */
export function getBrowserLanguage(): LanguageCode | null {
  return normalizeLanguage(navigator.language || (navigator as any).userLanguage);
}

/**
 * Initializes the i18n system with auto-detection
 */
export function initializeI18n(): LanguageCode {
  const storedLanguage = getStoredLanguage();
  const browserLanguage = getBrowserLanguage();
  
  return setLanguage(storedLanguage || browserLanguage || DEFAULT_LANGUAGE, { force: true });
}
