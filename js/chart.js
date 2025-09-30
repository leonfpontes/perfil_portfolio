(() => {
  const competencyCanvas = document.getElementById('competency-radar');
  if (!competencyCanvas || !window.Chart) {
    return;
  }

  const competencyRadar = new Chart(competencyCanvas, {
    type: 'radar',
    data: {
      labels: [
        'Liderança de Pessoas',
        'Governança & PMO',
        'Visão de Produto',
        'Agilidade & Processos',
        'Comunicação Executiva',
      ],
      datasets: [
        {
          label: 'Nível de proficiência (0-100)',
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

  competencyCanvas.setAttribute(
    'aria-description',
    'Radar destaca liderança de pessoas, governança de PMO, visão de produto, agilidade em processos e comunicação executiva com níveis próximos ao topo.'
  );
})();
