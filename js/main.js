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
      const itemLabel = (carousel.dataset.carouselItemLabel || 'Depoimento').trim();
      const itemLabelLower = itemLabel.toLowerCase();
      const indicatorPrefix = (carousel.dataset.carouselIndicatorPrefix || 'Ir para').trim();

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
        const explicitSlideLabel = slide.dataset.carouselLabel?.trim();
        const computedSlideLabel = `${itemLabel} ${slideIndex + 1} de ${slides.length}`;
        slide.setAttribute('aria-label', explicitSlideLabel || computedSlideLabel);
        slide.setAttribute('aria-hidden', slideIndex === 0 ? 'false' : 'true');

        if (indicatorsWrapper) {
          const indicatorButton = document.createElement('button');
          indicatorButton.type = 'button';
          indicatorButton.className = 'testimonial-carousel__indicator';
          const personName = slide.querySelector('.testimonial-card__name')?.textContent?.trim();
          const indicatorLabel = (() => {
            if (personName) {
              return `${indicatorPrefix} ${itemLabelLower} de ${personName}`;
            }
            if (explicitSlideLabel) {
              return `${indicatorPrefix} ${explicitSlideLabel.toLowerCase()}`;
            }
            return `${indicatorPrefix} ${itemLabelLower} ${slideIndex + 1}`;
          })();
          indicatorButton.setAttribute('aria-label', indicatorLabel);
          indicatorButton.setAttribute('aria-controls', slideId);
          indicatorsWrapper.appendChild(indicatorButton);
          indicatorButtons.push(indicatorButton);
        }
      });

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
