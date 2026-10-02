import React, { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSession } from '@openmrs/esm-framework';
import { getMaxVisitCount } from './visit-utils';

interface IntersectionalVisualizationProps {
  allPatientsData: any[];
  currentLocationUuid?: string;
}

const INTERSECTIONAL_UUIDS = {
  as: '260b7159-9cc9-442d-b641-133b5dbbce06',
  es: 'fb3a85e9-5154-46f7-8c00-54cce586332c',
  is: '54addbef-17f5-4678-988a-9d6a68ad38f7',
};

const TYPE_LABELS = {
  as: ['अपेक्षित (Intersectional)', 'Total Score = 120'],
  es: ['व्यावहारिक (Intersectional)', 'Total Score = 130'],
  is: ['आत्मलान्छना (Intersectional)', 'Total Score = 100'],
};

function extractIntersectionalScores(allPatientsData: any[]) {
  const scoresByType: Record<'as' | 'es' | 'is', number[]> = {
    as: [],
    es: [],
    is: [],
  };

  allPatientsData.forEach((patientObservations) => {
    patientObservations.forEach((obs: any) => {
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

      if (score === null || isNaN(score) || score < 0) return;

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
      // Round to 1 decimal place, same as the Dimensions chart
      return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
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
  let maxVisitCount = 0;

  allPatientsData.forEach((patientObservations) => {
    const encounters = new Map<string, { date: Date; scores: Record<'as' | 'es' | 'is', number[]> }>();

    patientObservations.forEach((obs: any) => {
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';
      const conceptDisplay = (obs.code?.coding?.[0]?.display || obs.code?.text || '').toString().toLowerCase();

      const isAs = conceptUuid === INTERSECTIONAL_UUIDS.as || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('anticipated'));
      const isEs = conceptUuid === INTERSECTIONAL_UUIDS.es || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('enacted'));
      const isIs = conceptUuid === INTERSECTIONAL_UUIDS.is || (conceptDisplay.includes('intersectional') && conceptDisplay.includes('internalized'));

      const dateValue = obs.effectiveDateTime || obs.date;
      const encounterKey =
        obs.encounter?.uuid ||
        obs.encounter?.reference ||
        obs.encounterUuid ||
        String(dateValue || 'unknown');
      if (!encounterKey) return;

      const date = new Date(dateValue || new Date().toISOString());
      if (Number.isNaN(date.getTime())) return;

      const group = encounters.get(encounterKey) || {
        date,
        scores: { as: [], es: [], is: [] },
      };
      if (!encounters.has(encounterKey)) {
        encounters.set(encounterKey, group);
      }

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
      if (score === null || isNaN(score) || score < 0) return;

      if (isAs) group.scores.as.push(score);
      if (isEs) group.scores.es.push(score);
      if (isIs) group.scores.is.push(score);
    });

    const sortedEncounterGroups = Array.from(encounters.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    maxVisitCount = Math.max(maxVisitCount, sortedEncounterGroups.length);

    sortedEncounterGroups.forEach((encounterGroup, encounterIndex) => {
      const current = visitScores[encounterIndex] || { as: [], es: [], is: [] };
      current.as.push(...encounterGroup.scores.as);
      current.es.push(...encounterGroup.scores.es);
      current.is.push(...encounterGroup.scores.is);
      visitScores[encounterIndex] = current;
    });
  });

  const visitCount = Math.max(visitScores.length, maxVisitCount, getMaxVisitCount(allPatientsData));
  const visitAverages = calculateVisitAverages(
    Array.from({ length: visitCount }, (_, index) => visitScores[index] || { as: [], es: [], is: [] }),
  );

  return visitAverages;
}

type SelectedIntersectionalType = 'all' | 'as' | 'es' | 'is';

export function IntersectionalVisualization({
  allPatientsData,
  currentLocationUuid,
}: IntersectionalVisualizationProps) {
  const session = useSession();
  const [selectedType, setSelectedType] = useState<SelectedIntersectionalType>('all');

  const locationUuid = currentLocationUuid || session?.sessionLocation?.uuid;

  const visitAverages = useMemo(() => {
    return calculateVisitScores(allPatientsData);
  }, [allPatientsData]);

  const stigmaTypeOptions = useMemo(
    () => [
      { value: 'all' as const, label: 'All intersectional types' },
      { value: 'as' as const, label: TYPE_LABELS.as[0] },
      { value: 'es' as const, label: TYPE_LABELS.es[0] },
      { value: 'is' as const, label: TYPE_LABELS.is[0] },
    ],
    [],
  );

  const scoreKeys = ['as', 'es', 'is'] as const;
  const typeLabels = scoreKeys.map((key) => TYPE_LABELS[key]);
  const colors = ['#9C27B0', '#FF9800', '#4CAF50', '#2196F3', '#6A1B9A', '#FF5722', '#009688', '#8E24AA'];
  const borderColors = ['#7B1FA2', '#F57C00', '#388E3C', '#1976D2', '#4A148C', '#E64A19', '#00796B', '#6A1B9A'];

  const chartData = useMemo(() => {
    const visitLabels = visitAverages.map((visit) => `${visit.visit}${getOrdinalSuffix(visit.visit)} visit`);
    const datasets =
      selectedType === 'all'
        ? scoreKeys.map((key, index) => ({
            label: TYPE_LABELS[key][0],
            data: visitAverages.map((visit) => visit[key]),
            borderColor: borderColors[index],
            backgroundColor: colors[index],
            pointBackgroundColor: borderColors[index],
            pointBorderColor: borderColors[index],
            fill: false,
            tension: 0.35,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            borderWidth: 2,
          }))
        : [
            {
              label: TYPE_LABELS[selectedType][0],
              data: visitAverages.map((visit) =>
                selectedType === 'as' ? visit.as : selectedType === 'es' ? visit.es : visit.is,
              ),
              borderColor:
                selectedType === 'as'
                  ? borderColors[0]
                  : selectedType === 'es'
                  ? borderColors[1]
                  : borderColors[2],
              backgroundColor:
                selectedType === 'as' ? colors[0] : selectedType === 'es' ? colors[1] : colors[2],
              pointBackgroundColor:
                selectedType === 'as' ? borderColors[0] : selectedType === 'es' ? borderColors[1] : borderColors[2],
              pointBorderColor:
                selectedType === 'as' ? borderColors[0] : selectedType === 'es' ? borderColors[1] : borderColors[2],
              fill: false,
              tension: 0.35,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 10,
              borderWidth: 2,
            },
          ];

    return {
      labels: visitLabels,
      datasets,
    };
  }, [selectedType, visitAverages, colors, borderColors]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 35,
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#000',
          font: {
            size: window.innerWidth <= 480 ? 11 : window.innerWidth <= 768 ? 13 : 15,
            weight: 'bold',
          },
          padding: window.innerWidth <= 480 ? 15 : window.innerWidth <= 768 ? 20 : 25,
          usePointStyle: true,
          pointStyle: 'rect',
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
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
          text: 'Average Score',
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
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Stigma type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as SelectedIntersectionalType)}
          style={{
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
            cursor: 'pointer',
          }}
        >
          {stigmaTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Chart type="line" data={chartData} options={options} />
      </div>
      <div style={{ marginTop: 16, color: '#444', fontSize: '0.95rem' }}>
        Total score: अपेक्षित (Intersectional) = 120, व्यावहारिक (Intersectional) = 130, आत्मलान्छना (Intersectional) = 100
      </div>
    </div>
  );
}