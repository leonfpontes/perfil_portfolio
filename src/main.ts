/**
 * Main entry point for the portfolio application
 * Initializes all components and features
 */

import './styles/main.css';
import { initializeI18n } from './i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MobileNav } from './components/MobileNav';
import { ScrollSpy } from './components/ScrollSpy';
import { Carousel } from './components/Carousel';
import { Chart } from './components/Chart';
import { DevtoolsEasterEgg } from './components/DevtoolsEasterEgg';
import { initAnalyticsBindings } from './utils/analytics';
import { ScrollAnimation } from './utils/scrollAnimation';

// Initialize i18n system
initializeI18n();

// Initialize components
new LanguageSwitcher();
new MobileNav();

const mainNav = document.querySelector<HTMLElement>('#side-nav');
if (mainNav) {
  new ScrollSpy(mainNav);
}

Carousel.initializeAll();
new Chart();

// Initialize DevTools easter eggs (non-blocking, progressive)
new DevtoolsEasterEgg();

// Theme switcher removed; default light theme applied via CSS variables

// Bind basic analytics events (CTA, nav, language)
initAnalyticsBindings();

// Initialize Scroll Entrance Animations
new ScrollAnimation();

// Initialize Scroll Progress Bar
const progressEl = document.getElementById('scroll-progress');
if (progressEl) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressEl.style.width = `${scrollPercent}%`;
  });
}

// Update year in footer
const yearElement = document.querySelector<HTMLElement>('[data-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString();
}

// Update topbar offset for fixed positioning
const updateTopbarOffset = () => {
  const topbar = document.querySelector<HTMLElement>('.topbar');
  if (topbar) {
    const offset = topbar.offsetHeight;
    document.documentElement.style.setProperty('--topbar-offset', `${offset}px`);
  }
};

updateTopbarOffset();
window.addEventListener('resize', updateTopbarOffset);

console.log('Portfolio application loaded');

// Entry point - components will be initialized here
