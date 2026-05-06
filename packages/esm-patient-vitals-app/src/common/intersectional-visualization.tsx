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

function calculateVisitAverages(scoresByVisit: Array<Record<'as' | 'es' | 'is', number[]>>) {
  return scoresByVisit.map((visitScores, index) => {
    const average = (values: number[]) => {
      if (!values.length) return 0;
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    };

    return {
      visit: index + 1,
      as: average(visitScores.as),
      es: average(visitScores.es),
      is: average(visitScores.is),
    };
  });
}

function getOrdinalSuffix(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  if (n % 10 === 1) return 'st';
  if (n % 10 === 2) return 'nd';
  if (n % 10 === 3) return 'rd';
  return 'th';
}

function calculateVisitScores(allPatientsData: any[]) {
  const visitScores: Array<Record<'as' | 'es' | 'is', number[]>> = [];

  allPatientsData.forEach((patientObservations) => {
    const encounters = new Map<string, { date: Date; scores: Record<'as' | 'es' | 'is', number[]> }>();

    patientObservations.forEach((obs: any) => {
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';
      const conceptDisplay = (obs.code?.coding?.[0]?.display || obs.code?.text || '').toString().toLowerCase();

      const isAs = conceptUuid === INTERSECTIONAL_UUIDS.as || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('anticipated'));
      const isEs = conceptUuid === INTERSECTIONAL_UUIDS.es || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('enacted'));
      const isIs = conceptUuid === INTERSECTIONAL_UUIDS.is || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('internalized'));
      if (!isAs && !isEs && !isIs) return;

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

      const dateValue = obs.effectiveDateTime || obs.date;
      const encounterKey = obs.encounter?.uuid || obs.encounter?.reference || String(dateValue || 'unknown');
      if (!encounterKey) return;

      const group = encounters.get(encounterKey) || {
        date: new Date(dateValue || new Date().toISOString()),
        scores: { as: [], es: [], is: [] },
      };
      if (!encounters.has(encounterKey)) {
        encounters.set(encounterKey, group);
      }

      if (isAs) group.scores.as.push(score);
      if (isEs) group.scores.es.push(score);
      if (isIs) group.scores.is.push(score);
    });

    const sortedEncounterGroups = Array.from(encounters.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

    sortedEncounterGroups.forEach((encounterGroup, encounterIndex) => {
      if (!visitScores[encounterIndex]) {
        visitScores[encounterIndex] = { as: [], es: [], is: [] };
      }
      visitScores[encounterIndex].as.push(...encounterGroup.scores.as);
      visitScores[encounterIndex].es.push(...encounterGroup.scores.es);
      visitScores[encounterIndex].is.push(...encounterGroup.scores.is);
    });
  });

  return calculateVisitAverages(visitScores);
}

export function IntersectionalVisualization({
  allPatientsData,
  currentLocationUuid,
  startDate,
  endDate,
}: IntersectionalVisualizationProps) {
  const session = useSession();
  const locationUuid = currentLocationUuid || session?.sessionLocation?.uuid;

  const visitAverages = useMemo(() => {
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

    return calculateVisitScores(filteredData);
  }, [allPatientsData, startDate, endDate]);

  const scoreKeys = ['as', 'es', 'is'] as const;
  const labels = scoreKeys.map((key) => TYPE_LABELS[key]);
  const colors = ['#9C27B0', '#FF9800', '#4CAF50', '#2196F3'];
  const borderColors = ['#7B1FA2', '#F57C00', '#388E3C', '#1976D2'];

  const chartData = {
    labels,
    datasets: visitAverages.map((visit, index) => ({
      label: `${visit.visit}${getOrdinalSuffix(visit.visit)} visit`,
      data: [visit.as, visit.es, visit.is],
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 2,
      borderRadius: 6,
      barPercentage: 0.8,
      categoryPercentage: 0.7,
    })),
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
