/**
 * Carousel Component
 * Handles testimonial and certification carousels with keyboard navigation
 */

export interface CarouselOptions {
  itemLabel?: string;
  indicatorPrefix?: string;
}

export class Carousel {
  private element: HTMLElement;
  private track: HTMLElement;
  private slides: HTMLElement[];
  private prevButton: HTMLButtonElement | null;
  private nextButton: HTMLButtonElement | null;
  private indicatorsWrapper: HTMLElement | null;
  private indicatorButtons: HTMLElement[] = [];
  private activeIndex: number = 0;
  private resizeFrame: number | null = null;
  private prefersReducedMotion: MediaQueryList;

  constructor(element: HTMLElement) {
    this.element = element;
    this.track = element.querySelector('[data-carousel-track]')!;
    this.slides = Array.from(this.track.querySelectorAll('[data-carousel-slide]'));
    this.prevButton = element.querySelector('[data-carousel-prev]');
    this.nextButton = element.querySelector('[data-carousel-next]');
    this.indicatorsWrapper = element.querySelector('[data-carousel-indicators]');
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!this.track || !this.slides.length) {
      return;
    }

    this.initialize();
  }

  private initialize(): void {
    this.element.dataset.enhanced = 'true';
    this.element.dataset.activeIndex = '0';

    if (this.slides.length <= 1) {
      this.element.classList.add('testimonial-carousel--single');
      if (this.prevButton) this.prevButton.disabled = true;
      if (this.nextButton) this.nextButton.disabled = true;
      if (this.indicatorsWrapper) this.indicatorsWrapper.innerHTML = '';
      return;
    }

    this.setupSlides();
    this.setupIndicators();
    this.setupControls();
    this.setupKeyboardNavigation();
    this.setupResizeHandler();
    this.setupLanguageChange();
    
    this.goToSlide(0, { force: true });
  }

  private setupSlides(): void {
    this.slides.forEach((slide, index) => {
      const slideId = slide.id || `carousel-slide-${Date.now()}-${index}`;
      slide.id = slideId;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', this.buildSlideLabel(slide, index));
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });
  }

  private setupIndicators(): void {
    if (!this.indicatorsWrapper) return;

    this.indicatorsWrapper.innerHTML = '';

    this.slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'testimonial-carousel__indicator';
      button.setAttribute('aria-label', this.buildIndicatorLabel(slide, index));
      button.setAttribute('aria-controls', slide.id);

      button.addEventListener('click', () => {
        this.goToSlide(index);
      });

      button.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.goToSlide(index - 1, { focusIndicator: true });
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.goToSlide(index + 1, { focusIndicator: true });
        }
      });

      this.indicatorsWrapper?.appendChild(button);
      this.indicatorButtons.push(button);
    });
  }

  private setupControls(): void {
    this.prevButton?.addEventListener('click', () => {
      this.goToSlide(this.activeIndex - 1);
    });

    this.nextButton?.addEventListener('click', () => {
      this.goToSlide(this.activeIndex + 1);
    });
  }

  private setupKeyboardNavigation(): void {
    this.element.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      // Don't interfere with indicator button navigation
      if (event.target instanceof HTMLElement && 
          event.target.closest('[data-carousel-indicators]')) {
        return;
      }

      // Don't interfere with form inputs
      if (event.target instanceof HTMLElement) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          return;
        }
      }

      if (event.key === 'ArrowLeft') {
        this.goToSlide(this.activeIndex - 1);
      } else {
        this.goToSlide(this.activeIndex + 1);
      }
    });
  }

  private setupResizeHandler(): void {
    const handleResize = () => {
      if (this.resizeFrame) {
        cancelAnimationFrame(this.resizeFrame);
      }

      this.resizeFrame = requestAnimationFrame(() => {
        this.goToSlide(this.activeIndex, { force: true });
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }

  private setupLanguageChange(): void {
    document.addEventListener('languagechange', () => {
      this.updateAriaLabels();
    });
  }

  private updateAriaLabels(): void {
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-label', this.buildSlideLabel(slide, index));
    });

    this.indicatorButtons.forEach((indicator, index) => {
      const slide = this.slides[index];
      if (slide) {
        indicator.setAttribute('aria-label', this.buildIndicatorLabel(slide, index));
      }
    });
  }

  private buildSlideLabel(slide: HTMLElement, index: number): string {
    const explicitLabel = slide.dataset.carouselLabel?.trim();
    if (explicitLabel) return explicitLabel;

    const itemLabel = this.element.dataset.carouselItemLabel || 'Item';
    return `${itemLabel} ${index + 1}/${this.slides.length}`;
  }

  private buildIndicatorLabel(slide: HTMLElement, index: number): string {
    const explicitLabel = slide.dataset.carouselLabel?.trim();
    const indicatorPrefix = this.element.dataset.carouselIndicatorPrefix || 'Go to';

    // For testimonials, try to get person name
    const personName = slide.querySelector('.testimonial-card__name')?.textContent?.trim();
    if (personName) {
      const itemLabel = this.element.dataset.carouselItemLabel || 'Item';
      return `${indicatorPrefix} ${itemLabel} – ${personName}`;
    }

    if (explicitLabel) {
      return `${indicatorPrefix} ${explicitLabel}`;
    }

    const itemLabel = this.element.dataset.carouselItemLabel || 'Item';
    return `${indicatorPrefix} ${itemLabel} ${index + 1}`;
  }

  private goToSlide(
    targetIndex: number,
    options: { focusIndicator?: boolean; force?: boolean } = {}
  ): void {
    const { focusIndicator = false, force = false } = options;
    const normalizedIndex = Math.max(0, Math.min(this.slides.length - 1, targetIndex));

    if (normalizedIndex === this.activeIndex && !force) {
      return;
    }

    this.activeIndex = normalizedIndex;
    const activeSlide = this.slides[this.activeIndex];
    if (!activeSlide) return;

    const offset = activeSlide.offsetLeft;

    if (this.prefersReducedMotion.matches) {
      this.track.style.transitionDuration = '0ms';
    } else {
      this.track.style.transitionDuration = '';
    }

    this.track.style.transform = `translateX(-${offset}px)`;

    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index === this.activeIndex ? 'false' : 'true');
    });

    if (this.prevButton) {
      this.prevButton.disabled = this.activeIndex === 0;
    }

    if (this.nextButton) {
      this.nextButton.disabled = this.activeIndex === this.slides.length - 1;
    }

    this.indicatorButtons.forEach((indicator, index) => {
      const isActive = index === this.activeIndex;
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

    this.element.dataset.activeIndex = String(this.activeIndex);
  }

  public destroy(): void {
    if (this.resizeFrame) {
      cancelAnimationFrame(this.resizeFrame);
    }
  }

  public static initializeAll(): Carousel[] {
    const carousels: Carousel[] = [];
    const elements = document.querySelectorAll<HTMLElement>('[data-carousel]');

    elements.forEach((element) => {
      carousels.push(new Carousel(element));
    });

    return carousels;
  }
}
