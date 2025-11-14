/**
 * Scroll Spy Component
 * Highlights active navigation links based on scroll position
 */

export class ScrollSpy {
  private navLinks: HTMLAnchorElement[];
  private observedSections: HTMLElement[];
  private observer: IntersectionObserver | null = null;

  constructor(navElement: HTMLElement) {
    this.navLinks = Array.from(
      navElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="./#"]')
    );
    this.observedSections = [];
    this.initialize();
  }

  private initialize(): void {
    this.setupSections();
    
    if (this.observedSections.length) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
            .forEach((entry) => {
              this.activateLink(entry.target.id);
            });
        },
        {
          rootMargin: '-45% 0px -45% 0px',
          threshold: [0.1, 0.25, 0.5, 0.75],
        }
      );

      this.observedSections.forEach((section) => {
        if (this.observer) {
          this.observer.observe(section);
        }
      });

      // Activate first section on load
      this.activateLink(this.observedSections[0]?.id || '');
    }
  }

  private setupSections(): void {
    this.navLinks.forEach((link) => {
      const target = this.normalizeTarget(link.getAttribute('href') || '');
      if (!target) return;

      const element = document.getElementById(target);
      if (element && !this.observedSections.includes(element)) {
        this.observedSections.push(element);
      }

      link.addEventListener('click', () => {
        this.activateLink(target);
      });
    });
  }

  private normalizeTarget(value: string): string {
    if (!value) return '';

    let normalized = value.trim();
    if (normalized.startsWith('./')) {
      normalized = normalized.slice(2);
    }
    if (normalized.startsWith('#')) {
      normalized = normalized.slice(1);
    }

    return normalized;
  }

  private activateLink(id: string): void {
    if (!id) return;

    const normalizedId = this.normalizeTarget(id);

    this.navLinks.forEach((link) => {
      const linkTarget = link.getAttribute('href') || '';
      const linkId = this.normalizeTarget(linkTarget);
      const isActive = linkId === normalizedId;

      link.classList.toggle('is-active', isActive);
      
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
