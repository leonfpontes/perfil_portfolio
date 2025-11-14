/**
 * Mobile Navigation Component
 * Handles hamburger menu toggle and mobile panel
 */

export class MobileNav {
  private toggle: HTMLElement | null;
  private sideNav: HTMLElement | null;

  constructor() {
    this.toggle = document.querySelector('.topbar__toggle');
    this.sideNav = document.getElementById('side-nav');
    this.initialize();
  }

  private initialize(): void {
    if (!this.toggle || !this.sideNav) {
      return;
    }

    // Toggle button click
    this.toggle.addEventListener('click', () => {
      this.togglePanel();
    });

    // Close panel when link is clicked
    this.sideNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isMobile()) {
          this.closePanel();
        }
      });
    });

    // Close panel when language buttons inside panel are clicked
    this.sideNav.querySelectorAll('.language-switcher__button').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.isMobile()) {
          this.closePanel();
        }
      });
    });

    // Ensure panel is closed when resizing to desktop
    window.addEventListener('resize', () => {
      this.ensureClosedOnDesktop();
    });
    
    this.ensureClosedOnDesktop();
  }

  private isMobile(): boolean {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  private togglePanel(): void {
    if (!this.toggle || !this.sideNav) return;
    
    const expanded = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    this.sideNav.dataset.visible = expanded ? 'false' : 'true';
  }

  private closePanel(): void {
    if (!this.toggle || !this.sideNav) return;
    
    this.sideNav.dataset.visible = 'false';
    this.toggle.setAttribute('aria-expanded', 'false');
  }

  private ensureClosedOnDesktop(): void {
    if (!this.isMobile()) {
      this.closePanel();
    }
  }
}
