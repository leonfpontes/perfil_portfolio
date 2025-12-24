/**
 * Chart Component
 * Dynamically loads Chart.js only when the competencias section is visible
 */

import { getTranslation, getCurrentLanguage } from '../i18n';
import type { Chart as ChartType } from 'chart.js';

export class Chart {
  private canvas: HTMLCanvasElement | null;
  private observer: IntersectionObserver | null = null;
  private chartInstance: ChartType | null = null;
  private hasLoaded: boolean = false;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>('#competency-radar');
    
    if (!this.canvas) {
      return;
    }

    this.initialize();
  }

  private initialize(): void {
    // Set up intersection observer to load chart when visible
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasLoaded) {
            this.hasLoaded = true;
            this.loadChart();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    const competenciasSection = document.querySelector('#competencias');
    if (competenciasSection) {
      this.observer.observe(competenciasSection);
    }

    // Listen for language changes to update chart labels
    document.addEventListener('languagechange', () => {
      if (this.chartInstance) {
        this.updateChartLabels();
      }
    });
  }

  private async loadChart(): Promise<void> {
    if (!this.canvas) return;

    try {
      // Dynamically import Chart.js only when needed
      const { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } = await import('chart.js');

      // Register required components
      Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

      const localizedConfig = this.buildLocalizedConfig();

      // Read themed colors from CSS variables
      const styles = getComputedStyle(document.documentElement);
      const cFill = styles.getPropertyValue('--chart-fill').trim() || 'rgba(59, 130, 246, 0.15)';
      const cStroke = styles.getPropertyValue('--chart-stroke').trim() || 'rgba(59, 130, 246, 0.75)';
      const cPoint = styles.getPropertyValue('--chart-point').trim() || 'rgba(37, 99, 235, 1)';
      const cGrid = styles.getPropertyValue('--chart-grid').trim() || 'rgba(255, 255, 255, 0.9)';
      const cAngles = styles.getPropertyValue('--chart-angles').trim() || 'rgba(255, 255, 255, 0.9)';
      const cTick = styles.getPropertyValue('--chart-tick').trim() || '#f3f4f6';

      // Create chart
      this.chartInstance = new Chart(this.canvas, {
        type: 'radar',
        data: {
          labels: localizedConfig.labels,
          datasets: [
            {
              label: localizedConfig.datasetLabel,
              data: [95, 92, 90, 88, 94, 93],
              fill: true,
              backgroundColor: cFill,
              borderColor: cStroke,
              pointBackgroundColor: cPoint,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: cPoint,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              suggestedMin: 60,
              suggestedMax: 100,
              ticks: {
                showLabelBackdrop: false,
                stepSize: 10,
                color: cTick,
                backdropColor: 'transparent',
                display: true,
              },
              grid: {
                circular: true,
                color: cGrid,
                lineWidth: 2,
                display: true,
              },
              angleLines: {
                color: cAngles,
                lineWidth: 1.8,
                display: true,
              },
              pointLabels: {
                font: {
                  size: 12,
                  family: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                },
                padding: 20,
                callback(label): string | string[] {
                  if (typeof label !== 'string') return String(label);
                  if (label.includes(' & ')) {
                    const parts = label.split(' & ');
                    if (parts.length === 2) {
                      return [`${parts[0]} &`, parts[1]];
                    }
                  }
                  if (label.length > 18) {
                    const words = label.split(' ');
                    if (words.length > 1) {
                      const mid = Math.ceil(words.length / 2);
                      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
                    }
                  }
                  return label;
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label(context) {
                  return `${context.formattedValue} · ${context.label}`;
                },
              },
            },
          },
          layout: {
            padding: {
              top: 36,
              right: 44,
              bottom: 36,
              left: 44,
            },
          },
        },
      });

      // Set aria attributes
      this.canvas.setAttribute('aria-description', localizedConfig.ariaDescription);
      if (localizedConfig.ariaLabel) {
        this.canvas.setAttribute('aria-label', localizedConfig.ariaLabel);
      }
    } catch (error) {
      console.error('Failed to load Chart.js:', error);
    }
  }

  private buildLocalizedConfig(): {
    labels: string[];
    datasetLabel: string;
    ariaDescription: string;
    ariaLabel: string;
  } {
    const lang = getCurrentLanguage();
    const labelsTranslation = getTranslation(lang, 'competencyRadarLabels');
    const labels = Array.isArray(labelsTranslation)
      ? labelsTranslation
      : [
          'Liderança de Pessoas',
          'Governança & PMO',
          'Visão de Produto',
          'Agilidade & Processos',
          'Comunicação Executiva',
          'Tecnologia & IA',
        ];

    const datasetLabelTranslation = getTranslation(lang, 'competencyRadarDatasetLabel');
    const datasetLabel = typeof datasetLabelTranslation === 'string' 
      ? datasetLabelTranslation 
      : 'Nível de proficiência (0-100)';

    const ariaDescriptionTranslation = getTranslation(lang, 'competencyRadarAriaDescription');
    const ariaDescription = typeof ariaDescriptionTranslation === 'string' 
      ? ariaDescriptionTranslation 
      : '';

    const ariaLabelTranslation = getTranslation(lang, 'competencyRadarAriaLabel');
    const ariaLabel = typeof ariaLabelTranslation === 'string' 
      ? ariaLabelTranslation 
      : '';

    return { labels, datasetLabel, ariaDescription, ariaLabel };
  }

  private updateChartLabels(): void {
    if (!this.chartInstance || !this.canvas) return;

    const localizedConfig = this.buildLocalizedConfig();

    this.chartInstance.data.labels = localizedConfig.labels;
    if (this.chartInstance.data.datasets[0]) {
      this.chartInstance.data.datasets[0].label = localizedConfig.datasetLabel;
    }

    this.canvas.setAttribute('aria-description', localizedConfig.ariaDescription);
    if (localizedConfig.ariaLabel) {
      this.canvas.setAttribute('aria-label', localizedConfig.ariaLabel);
    }

    this.chartInstance.update();
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
