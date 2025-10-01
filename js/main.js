import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translations } from './i18n.js';

(() => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const topbar = document.querySelector('.topbar');
  const updateTopbarOffset = () => {
    if (!topbar) {
      return;
    }

    const offset = topbar.offsetHeight + 24;
    document.documentElement.style.setProperty('--topbar-offset', `${offset}px`);
  };

  const navigation = document.getElementById('primary-nav');
  const navigationToggle = document.querySelector('.topbar__toggle');
  const desktopQuery = window.matchMedia('(min-width: 721px)');

  const htmlElement = document.documentElement;
  const supportedLanguageSet = new Set(
    Array.isArray(SUPPORTED_LANGUAGES)
      ? SUPPORTED_LANGUAGES.map((lang) => String(lang).toLowerCase())
      : []
  );
  let currentLanguage = DEFAULT_LANGUAGE;

  const normalizeLanguage = (value) => {
    if (!value || typeof value !== 'string') {
      return null;
    }
    const lowered = value.toLowerCase();
    if (supportedLanguageSet.has(lowered)) {
      return lowered;
    }
    const fallback = Array.from(supportedLanguageSet).find((lang) => lowered.startsWith(lang));
    return fallback || null;
  };

  const getTranslation = (lang, key) => {
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
  };

  const applyTextTranslations = (lang) => {
    document.querySelectorAll('[data-i18n-key]').forEach((element) => {
      const key = element.getAttribute('data-i18n-key');
      const translation = getTranslation(lang, key);
      if (typeof translation === 'string') {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  };

  const applyAttributeTranslations = (lang) => {
    document.querySelectorAll('[data-i18n-attrs]').forEach((element) => {
      const mapping = element.getAttribute('data-i18n-attrs');
      if (!mapping) {
        return;
      }

      mapping.split(';').forEach((pair) => {
        const trimmed = pair.trim();
        if (!trimmed) {
          return;
        }
        const [attrName, key] = trimmed.split(':');
        if (!attrName || !key) {
          return;
        }
        const translation = getTranslation(lang, key.trim());
        element.setAttribute(attrName.trim(), translation);
      });
    });
  };

  const languageButtons = Array.from(document.querySelectorAll('.language-switcher__button'));

  const updateLanguageButtons = (lang) => {
    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const setLanguage = (lang, options = {}) => {
    const { force = false } = options;
    const normalized = normalizeLanguage(lang) || DEFAULT_LANGUAGE;

    if (normalized === currentLanguage && !force) {
      return;
    }

    currentLanguage = normalized;

    applyTextTranslations(normalized);
    applyAttributeTranslations(normalized);

    const htmlLangMap = {
      'pt-br': 'pt-BR',
      en: 'en',
    };
    htmlElement.lang = htmlLangMap[normalized] || normalized;
    htmlElement.dataset.language = normalized;

    try {
      localStorage.setItem('selectedLanguage', normalized);
    } catch (error) {
      // Ignore storage errors (e.g., private mode)
    }

    updateLanguageButtons(normalized);
    updateTopbarOffset();

    const dictionary = translations[normalized] || translations[DEFAULT_LANGUAGE] || {};
    document.dispatchEvent(
      new CustomEvent('languagechange', {
        detail: {
          language: normalized,
          dictionary,
        },
      })
    );
  };

  if (navigation && navigationToggle) {
    const closeMenu = () => {
      navigation.dataset.visible = 'false';
      navigationToggle.setAttribute('aria-expanded', 'false');
      updateTopbarOffset();
    };

    const setMenuForViewport = (mq) => {
      if (mq.matches) {
        navigation.dataset.visible = 'true';
        navigationToggle.setAttribute('aria-expanded', 'false');
      } else {
        closeMenu();
      }

      updateTopbarOffset();
    };

    navigationToggle.addEventListener('click', () => {
      const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        navigation.dataset.visible = 'true';
        navigationToggle.setAttribute('aria-expanded', 'true');
        updateTopbarOffset();
      }
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!desktopQuery.matches) {
          closeMenu();
        }
      });
    });

    setMenuForViewport(desktopQuery);

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', setMenuForViewport);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(setMenuForViewport);
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetLanguage = button.dataset.language;
      setLanguage(targetLanguage);
    });
  });

  const storedLanguage = (() => {
    try {
      return normalizeLanguage(localStorage.getItem('selectedLanguage'));
    } catch (error) {
      return null;
    }
  })();

  const browserLanguage = normalizeLanguage(navigator.language || navigator.userLanguage);
  setLanguage(storedLanguage || browserLanguage || DEFAULT_LANGUAGE, { force: true });

  const initializeTestimonialCarousels = () => {
    const carousels = document.querySelectorAll('[data-carousel]');
    if (!carousels.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    carousels.forEach((carousel, carouselIndex) => {
      const track = carousel.querySelector('[data-carousel-track]');
      const slides = track ? Array.from(track.querySelectorAll('[data-carousel-slide]')) : [];

      if (!track || !slides.length) {
        return;
      }

      const prevButton = carousel.querySelector('[data-carousel-prev]');
      const nextButton = carousel.querySelector('[data-carousel-next]');
      const indicatorsWrapper = carousel.querySelector('[data-carousel-indicators]');
      const indicatorButtons = [];
      let itemLabel = (carousel.dataset.carouselItemLabel || 'Depoimento').trim();
      let indicatorPrefix = (carousel.dataset.carouselIndicatorPrefix || 'Ir para').trim();

      const refreshLocalization = () => {
        itemLabel = (carousel.dataset.carouselItemLabel || 'Depoimento').trim();
        indicatorPrefix = (carousel.dataset.carouselIndicatorPrefix || 'Ir para').trim();
      };

      const buildSlideLabel = (slide, index, total) => {
        const explicitSlideLabel = slide.dataset.carouselLabel?.trim();
        return explicitSlideLabel || `${itemLabel} ${index + 1}/${total}`;
      };

      const buildIndicatorLabel = (slide, index) => {
        const explicitSlideLabel = slide.dataset.carouselLabel?.trim();
        const personName = slide
          .querySelector('.testimonial-card__name')
          ?.textContent?.trim();

        if (personName) {
          return `${indicatorPrefix} ${itemLabel} – ${personName}`;
        }

        if (explicitSlideLabel) {
          return `${indicatorPrefix} ${explicitSlideLabel}`;
        }

        return `${indicatorPrefix} ${itemLabel} ${index + 1}`;
      };

      refreshLocalization();

      carousel.dataset.enhanced = 'true';
      carousel.dataset.activeIndex = '0';

      if (slides.length <= 1) {
        carousel.classList.add('testimonial-carousel--single');
        if (prevButton) {
          prevButton.disabled = true;
        }
        if (nextButton) {
          nextButton.disabled = true;
        }
        if (indicatorsWrapper) {
          indicatorsWrapper.innerHTML = '';
        }
        return;
      }

      if (indicatorsWrapper) {
        indicatorsWrapper.innerHTML = '';
      }

      slides.forEach((slide, slideIndex) => {
        const slideId = slide.id || `testimonial-slide-${carouselIndex + 1}-${slideIndex + 1}`;
        slide.id = slideId;
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', buildSlideLabel(slide, slideIndex, slides.length));
        slide.setAttribute('aria-hidden', slideIndex === 0 ? 'false' : 'true');

        if (indicatorsWrapper) {
          const indicatorButton = document.createElement('button');
          indicatorButton.type = 'button';
          indicatorButton.className = 'testimonial-carousel__indicator';
          indicatorButton.setAttribute('aria-label', buildIndicatorLabel(slide, slideIndex));
          indicatorButton.setAttribute('aria-controls', slideId);
          indicatorsWrapper.appendChild(indicatorButton);
          indicatorButtons.push(indicatorButton);
        }
      });

      const updateAriaLabels = () => {
        refreshLocalization();
        const totalSlides = slides.length;
        slides.forEach((slide, index) => {
          slide.setAttribute('aria-label', buildSlideLabel(slide, index, totalSlides));
        });

        indicatorButtons.forEach((indicator, index) => {
          const slide = slides[index];
          if (slide) {
            indicator.setAttribute('aria-label', buildIndicatorLabel(slide, index));
          }
        });
      };

      updateAriaLabels();
      document.addEventListener('languagechange', updateAriaLabels);

      let activeIndex = 0;

      const goToSlide = (targetIndex, options = {}) => {
        const { focusIndicator = false, force = false } = options;
        const normalizedIndex = Math.max(0, Math.min(slides.length - 1, targetIndex));

        if (normalizedIndex === activeIndex && !force) {
          return;
        }

        activeIndex = normalizedIndex;
        const activeSlide = slides[activeIndex];
        const offset = activeSlide.offsetLeft;

        if (prefersReducedMotion.matches) {
          track.style.transitionDuration = '0ms';
        } else {
          track.style.transitionDuration = '';
        }

        track.style.transform = `translateX(-${offset}px)`;

        slides.forEach((slide, index) => {
          slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
        });

        if (prevButton) {
          prevButton.disabled = activeIndex === 0;
        }

        if (nextButton) {
          nextButton.disabled = activeIndex === slides.length - 1;
        }

        indicatorButtons.forEach((indicator, index) => {
          const isActive = index === activeIndex;
          indicator.classList.toggle('is-active', isActive);
          if (isActive) {
            indicator.setAttribute('aria-current', 'true');
            if (focusIndicator) {
              indicator.focus();
            }
          } else {
            indicator.removeAttribute('aria-current');
          }
        });

        carousel.dataset.activeIndex = String(activeIndex);
      };

      prevButton?.addEventListener('click', () => {
        goToSlide(activeIndex - 1);
      });

      nextButton?.addEventListener('click', () => {
        goToSlide(activeIndex + 1);
      });

      indicatorButtons.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          goToSlide(index);
        });

        indicator.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToSlide(index - 1, { focusIndicator: true });
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToSlide(index + 1, { focusIndicator: true });
          }
        });
      });

      carousel.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }

        if (event.target instanceof HTMLElement && event.target.closest('[data-carousel-indicators]')) {
          return;
        }

        if (event.target instanceof HTMLElement) {
          const tagName = event.target.tagName.toLowerCase();
          if (tagName === 'input' || tagName === 'textarea') {
            return;
          }
        }

        if (event.key === 'ArrowLeft') {
          goToSlide(activeIndex - 1);
        } else {
          goToSlide(activeIndex + 1);
        }
      });

      let resizeFrame;
      const handleResize = () => {
        if (resizeFrame) {
          cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
          goToSlide(activeIndex, { force: true });
        });
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      goToSlide(0, { force: true });
    });
  };

  initializeTestimonialCarousels();

  updateTopbarOffset();
  window.addEventListener('load', updateTopbarOffset);
  window.addEventListener('resize', updateTopbarOffset);
})();
