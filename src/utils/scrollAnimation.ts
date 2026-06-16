/**
 * ScrollAnimation utility
 * Adds '.is-visible' class to elements with 'data-animate' when they enter the viewport
 */
export class ScrollAnimation {
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Once visible, stop observing to avoid repeat triggers
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05, // trigger when at least 5% is visible
        rootMargin: '0px 0px -50px 0px', // trigger slightly before entering viewport
      }
    );

    animatedElements.forEach((el) => {
      this.observer?.observe(el);
    });
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
