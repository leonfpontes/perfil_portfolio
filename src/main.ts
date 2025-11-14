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

// Initialize i18n system
initializeI18n();

// Initialize components
new LanguageSwitcher();
new MobileNav();

const mainNav = document.querySelector<HTMLElement>('.topbar__nav');
if (mainNav) {
  new ScrollSpy(mainNav);
}

Carousel.initializeAll();
new Chart();

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
