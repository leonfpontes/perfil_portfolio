import { DEFAULT_LANGUAGE, translations } from './i18n.js';

(() => {
  const competencyCanvas = document.getElementById('competency-radar');
  if (!competencyCanvas || !window.Chart) {
    return;
  }

  const fallbackDictionary = translations[DEFAULT_LANGUAGE] || {};

  const getDictionary = (lang) => {
    if (lang && translations[lang]) {
      return translations[lang];
    }
    return fallbackDictionary;
  };

  const getLanguageFromDocument = () => {
    const attr = document.documentElement?.dataset?.language;
    return attr ? attr.toLowerCase() : DEFAULT_LANGUAGE;
  };

  const buildLocalizedConfig = (lang) => {
    const dictionary = getDictionary(lang);
    const labels = Array.isArray(dictionary.competencyRadarLabels)
      ? dictionary.competencyRadarLabels
      : Array.isArray(fallbackDictionary.competencyRadarLabels)
      ? fallbackDictionary.competencyRadarLabels
      : [
          'Liderança de Pessoas',
          'Governança & PMO',
          'Visão de Produto',
          'Agilidade & Processos',
          'Comunicação Executiva',
        ];

    const datasetLabel =
      dictionary.competencyRadarDatasetLabel ||
      fallbackDictionary.competencyRadarDatasetLabel ||
      'Nível de proficiência (0-100)';

    const ariaDescription =
      dictionary.competencyRadarAriaDescription ||
      fallbackDictionary.competencyRadarAriaDescription ||
      '';

    const ariaLabel =
      dictionary.competencyRadarAriaLabel ||
      fallbackDictionary.competencyRadarAriaLabel ||
      competencyCanvas.getAttribute('aria-label') ||
      '';

    return { labels, datasetLabel, ariaDescription, ariaLabel };
  };

  const initialLanguage = getLanguageFromDocument();
  const localizedConfig = buildLocalizedConfig(initialLanguage);

  const competencyRadar = new Chart(competencyCanvas, {
    type: 'radar',
    data: {
      labels: localizedConfig.labels,
      datasets: [
        {
          label: localizedConfig.datasetLabel,
          data: [95, 92, 90, 88, 94],
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: 'rgba(59, 130, 246, 0.75)',
          pointBackgroundColor: 'rgba(37, 99, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
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
            color: '#1f2937',
          },
          grid: {
            circular: true,
            color: 'rgba(37, 99, 235, 0.25)',
            lineWidth: 1,
          },
          angleLines: {
            color: 'rgba(37, 99, 235, 0.35)',
            lineWidth: 1,
          },
          pointLabels: {
            font: {
              size: 12,
              family: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
    },
  });

  competencyCanvas.setAttribute('aria-description', localizedConfig.ariaDescription);
  if (localizedConfig.ariaLabel) {
    competencyCanvas.setAttribute('aria-label', localizedConfig.ariaLabel);
  }

  const updateChartLanguage = (language) => {
    const nextConfig = buildLocalizedConfig(language);
    competencyRadar.data.labels = nextConfig.labels;
    if (competencyRadar.data.datasets[0]) {
      competencyRadar.data.datasets[0].label = nextConfig.datasetLabel;
    }
    competencyCanvas.setAttribute('aria-description', nextConfig.ariaDescription);
    if (nextConfig.ariaLabel) {
      competencyCanvas.setAttribute('aria-label', nextConfig.ariaLabel);
    }
    competencyRadar.update();
  };

  document.addEventListener('languagechange', (event) => {
    const nextLanguage = event.detail?.language || getLanguageFromDocument();
    updateChartLanguage(nextLanguage);
  });
})();
