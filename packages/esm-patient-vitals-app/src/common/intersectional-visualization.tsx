import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSession } from '@openmrs/esm-framework';

interface IntersectionalVisualizationProps {
  allPatientsData: any[];
  currentLocationUuid?: string;
  startDate?: string;
  endDate?: string;
}

const INTERSECTIONAL_UUIDS = {
  as: '260b7159-9cc9-442d-b641-133b5dbbce06',
  es: 'fb3a85e9-5154-46f7-8c00-54cce586332c',
  is: '54addbef-17f5-4678-988a-9d6a68ad38f7',
};

const TYPE_LABELS = {
  as: 'अपेक्षित (Intersectional)',
  es: 'व्यावहारिक (Intersectional)',
  is: 'आत्मलान्छना (Intersectional)',
};

function extractIntersectionalScores(allPatientsData: any[]) {
  const scoresByType: Record<'as' | 'es' | 'is', number[]> = {
    as: [],
    es: [],
    is: [],
  };

  allPatientsData.forEach((patientObservations) => {
    patientObservations.forEach((obs: any) => {
      // Keep parity with DimensionVisualization: location filtering is done in conf_dashboard
      // before data reaches this component.

      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';
      const conceptDisplay = (obs.code?.coding?.[0]?.display || obs.code?.text || '').toString().toLowerCase();

      let score: number | null = null;
      if (typeof obs.valueQuantity?.value === 'number') {
        score = obs.valueQuantity.value;
      } else if (typeof obs.value === 'number') {
        score = obs.value;
      } else if (typeof obs.value === 'string') {
        const match = obs.value.match(/-?\d+(?:\.\d+)?/);
        if (match) score = parseFloat(match[0]);
      }

      if (score === null || isNaN(score) || score <= 0) return;

      if (
        conceptUuid === INTERSECTIONAL_UUIDS.as ||
        (conceptDisplay.includes('intersectional') && conceptDisplay.includes('anticipated'))
      ) {
        scoresByType.as.push(score);
      } else if (
        conceptUuid === INTERSECTIONAL_UUIDS.es ||
        (conceptDisplay.includes('intersectional') && conceptDisplay.includes('enacted'))
      ) {
        scoresByType.es.push(score);
      } else if (
        conceptUuid === INTERSECTIONAL_UUIDS.is ||
        (conceptDisplay.includes('intersectional') && conceptDisplay.includes('internalized'))
      ) {
        scoresByType.is.push(score);
      }
    });
  });

  return scoresByType;
}

function calculateMinMax(scoresByType: Record<'as' | 'es' | 'is', number[]>) {
  const keys: Array<'as' | 'es' | 'is'> = ['as', 'es', 'is'];
  return keys.map((key) => {
    const values = scoresByType[key];
    if (!values.length) {
      return { key, min: 0, max: 0, count: 0 };
    }
    return {
      key,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  });
}

export function IntersectionalVisualization({
  allPatientsData,
  currentLocationUuid,
  startDate,
  endDate,
}: IntersectionalVisualizationProps) {
  const session = useSession();
  const locationUuid = currentLocationUuid || session?.sessionLocation?.uuid;

  const minMaxData = useMemo(() => {
    let filteredData = allPatientsData;
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : null;
      const e = endDate ? new Date(endDate) : null;
      filteredData = allPatientsData.map((patientObservations) =>
        patientObservations.filter((obs: any) => {
          const ds = obs.effectiveDateTime || obs.date;
          if (!ds) return false;
          const d = new Date(ds);
          if (s && d < s) return false;
          if (e && d > e) return false;
          return true;
        }),
      );
    }

    const scores = extractIntersectionalScores(filteredData);
    return calculateMinMax(scores);
  }, [allPatientsData, startDate, endDate]);

  const labels = minMaxData.map((d) => TYPE_LABELS[d.key]);
  const maxValues = minMaxData.map((d) => d.max);
  const minValues = minMaxData.map((d) => d.min);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Max Score',
        data: maxValues,
        backgroundColor: ['#9C27B0', '#9C27B0', '#9C27B0'],
        borderColor: ['#7B1FA2', '#7B1FA2', '#7B1FA2'],
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
      {
        label: 'Min Score',
        data: minValues,
        backgroundColor: ['#FF9800', '#FF9800', '#FF9800'],
        borderColor: ['#F57C00', '#F57C00', '#F57C00'],
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 35,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
            weight: 'bold',
          },
          padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
          usePointStyle: true,
          pointStyle: 'rect',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
          font: {
            size: window.innerWidth <= 480 ? 11 : 13,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: window.innerWidth <= 480 ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
          },
          autoSkip: false,
          maxRotation: window.innerWidth <= 480 ? 45 : 0,
          minRotation: window.innerWidth <= 480 ? 45 : 0,
        },
      },
    },
  };

  const datalabelsPlugin = {
    id: 'datalabels-intersectional',
    afterDatasetsDraw: function (chart: any) {
      const ctx = chart.ctx;
      ctx.save();
      const fontSize = window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 14 : 16;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#333';
      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar: any, index: number) => {
          const value = dataset.data[index];
          if (value > 0) {
            ctx.fillText(value, bar.x, bar.y - 8);
          }
        });
      });
      ctx.restore();
    },
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        borderRadius: 10,
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Chart type="bar" data={chartData} options={options} plugins={[datalabelsPlugin]} />
      </div>
    </div>
  );
}
