import React, { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { getMaxVisitCount } from './visit-utils';

export type StigmaType = 'आत्मलान्छना' | 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना';
export type MetricType = 'min' | 'max' | 'all';

export interface StgTypeProps {
  allPatientsData: any[];
  currentLocationUuid?: string;
}

// Concept UUIDs for stigma types (from stigma-data.resource.tsx)
const STIGMA_CONCEPT_UUIDS = {
  // Main stigma type scores - ONLY match these for the main visualization
  anticipated: 'b5be0487-ef8e-4c39-ad86-39dd341cf0a7',
  enacted: '367a6a1f-b951-4eac-8068-a5f0801d6aff',
  internalized: '3f318839-599e-47d7-96f5-4c81ca64dfc3',
  // Intersectional scores - include these as well
  anticipated_inter: '260b7159-9cc9-442d-b641-133b5dbbce06',
  enacted_inter: 'fb3a85e9-5154-46f7-8c00-54cce586332c',
  internalized_inter: '54addbef-17f5-4678-988a-9d6a68ad38f7',
};

// All valid stigma concept UUIDs (for quick lookup)
const ALL_STIGMA_UUIDS = new Set([
  STIGMA_CONCEPT_UUIDS.anticipated,
  STIGMA_CONCEPT_UUIDS.enacted,
  STIGMA_CONCEPT_UUIDS.internalized,
  STIGMA_CONCEPT_UUIDS.anticipated_inter,
  STIGMA_CONCEPT_UUIDS.enacted_inter,
  STIGMA_CONCEPT_UUIDS.internalized_inter,
]);

function normalizeStigmaType(raw: string | undefined, conceptUuid?: string): string {
  // First check by concept UUID (most reliable)
  if (conceptUuid && ALL_STIGMA_UUIDS.has(conceptUuid)) {
    // Intersectional scores are on a different scale (/100, /120, /130) and have
    // their own chart; never average them with the total stigma scores here.
    if (
      conceptUuid === STIGMA_CONCEPT_UUIDS.internalized_inter ||
      conceptUuid === STIGMA_CONCEPT_UUIDS.anticipated_inter ||
      conceptUuid === STIGMA_CONCEPT_UUIDS.enacted_inter
    ) {
      return '';
    }
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.internalized) {
      return 'आत्मलान्छना';
    }
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.anticipated) {
      return 'अपेक्षित लान्छना';
    }
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.enacted) {
      return 'व्यावहारिक लान्छना';
    }
  }

  // Fallback: check by text patterns - but be STRICT to avoid matching individual questions
  const s = (raw || '').toLowerCase();
  if (!s) return '';

  // EXCLUDE intersectional stigma scores - they have their own chart and scale
  if (s.includes('intersectional')) {
    return '';
  }

  // EXCLUDE domain scores - these contain "domain" or domain-specific fields in the text
  if (s.includes('domain score') || s.includes('domain') || s.includes('hiv') || s.includes('mh') || s.includes('mental') || s.includes('sgm') || s.includes('gender') || s.includes('ethnic') || s.includes('जातीय') || s.includes('लैङ्गिक') || s.includes('मानसिक') || s.includes('एचआईभी')) {
    return ''; // Skip domain scores - they are not the main stigma type total scores
  }

  // Match EXACT Nepali stigma type names (these are the main scores)
  if (s === 'आत्मलान्छना' || s.includes('आत्मलान्छना')) {
    return 'आत्मलान्छना';
  }
  if (s === 'अपेक्षित लान्छना' || s.includes('अपेक्षित लान्छना')) {
    return 'अपेक्षित लान्छना';
  }
  if (s === 'व्यावहारिक लान्छना' || s.includes('व्यावहारिक लान्छना')) {
    return 'व्यावहारिक लान्छना';
  }

  // Match English names for main stigma type scores (not domain scores)
  if (s === 'internalized stigma' || s === 'internalized' || s.includes('internalized stigma score')) {
    return 'आत्मलान्छना';
  }
  if (s === 'anticipated stigma' || s === 'anticipated' || s.includes('anticipated stigma score')) {
    return 'अपेक्षित लान्छना';
  }
  if (s === 'enacted stigma' || s === 'enacted' || s.includes('enacted stigma score')) {
    return 'व्यावहारिक लान्छना';
  }

  return '';
}

function getNumericValueFromObservation(obs: any, debug = false): number | null {
  if (!obs) return null;

  // Helper to parse a value that might be in "X/Y" format (e.g., "31/36")
  const parseNumericValue = (v: any): number | null => {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number') return v;

    const s = String(v).trim();

    // Handle "X/Y" format - extract the first number (the score)
    const slashMatch = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*\d+/);
    if (slashMatch) {
      const n = parseFloat(slashMatch[1]);
      if (debug) console.log(`  Parsed from "X/Y" format: ${s} → ${n}`);
      return Number.isFinite(n) ? n : null;
    }

    // Handle regular numeric string
    const match = s.match(/-?\d+(?:\.\d+)?/);
    if (match) {
      const n = parseFloat(match[0]);
      return Number.isFinite(n) ? n : null;
    }

    return null;
  };

  // Try multiple possible value locations
  const vq = obs.valueQuantity?.value;
  if (typeof vq === 'number') {
    if (debug) console.log('  Value found in valueQuantity.value:', vq);
    return vq;
  }

  if (typeof obs.valueNumber === 'number') {
    if (debug) console.log('  Value found in valueNumber:', obs.valueNumber);
    return obs.valueNumber;
  }

  if (typeof obs.value === 'number') {
    if (debug) console.log('  Value found in value:', obs.value);
    return obs.value;
  }

  // Try parsing value if it's a string (handles "31/36" format)
  if (typeof obs.value === 'string') {
    const parsed = parseNumericValue(obs.value);
    if (parsed !== null) {
      if (debug) console.log('  Value parsed from string value:', parsed);
      return parsed;
    }
  }

  // Try value.display (common in REST API responses)
  if (obs.value?.display) {
    const parsed = parseNumericValue(obs.value.display);
    if (parsed !== null) {
      if (debug) console.log('  Value parsed from value.display:', parsed);
      return parsed;
    }
  }

  // Try valueString as number
  if (typeof obs.valueString === 'string') {
    const parsed = parseNumericValue(obs.valueString);
    if (parsed !== null) {
      if (debug) console.log('  Value parsed from valueString:', parsed);
      return parsed;
    }
  }

  // Try valueInteger
  if (typeof obs.valueInteger === 'number') {
    if (debug) console.log('  Value found in valueInteger:', obs.valueInteger);
    return obs.valueInteger;
  }

  // Try valueDecimal
  if (typeof obs.valueDecimal === 'number') {
    if (debug) console.log('  Value found in valueDecimal:', obs.valueDecimal);
    return obs.valueDecimal;
  }

  // Try component array
  if (Array.isArray(obs.component)) {
    for (const c of obs.component) {
      const cv = c.valueQuantity?.value ?? c.valueNumber ?? c.value ?? c.valueInteger ?? c.valueDecimal;
      if (typeof cv === 'number') {
        if (debug) console.log('  Value found in component:', cv);
        return cv;
      }
      // Try parsing component value string
      if (typeof c.value === 'string') {
        const parsed = parseNumericValue(c.value);
        if (parsed !== null) {
          if (debug) console.log('  Value parsed from component string:', parsed);
          return parsed;
        }
      }
    }
  }

  return null;
}

interface VisitTypeScores {
  visit: number;
  internalized: number;
  anticipated: number;
  enacted: number;
  latestDate?: string;
}

// Format date key for grouping by date
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getOrdinalSuffix(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  if (n % 10 === 1) return 'st';
  if (n % 10 === 2) return 'nd';
  if (n % 10 === 3) return 'rd';
  return 'th';
}

function calculateVisitScores(
  allPatientsData: any[],
  currentLocationUuid?: string,
): VisitTypeScores[] {
  const visitScores: Array<Record<'internalized' | 'anticipated' | 'enacted', number[]>> = [];
  const visitDates: Date[] = [];
  let maxVisitCount = 0;

  const flattenObservations = (observations: any[]): any[] =>
    observations.flatMap((observation: any) => [
      observation,
      ...flattenObservations(observation.groupMembers || observation.members || []),
    ]);

  (allPatientsData || []).forEach((patientObservations) => {
    const encounters = new Map<
      string,
      {
        date: Date;
        scores: Record<'internalized' | 'anticipated' | 'enacted', number[]>;
      }
    >();

    flattenObservations(patientObservations || []).forEach((obs: any) => {
      const obsLocationUuid =
        obs.locationUuid ||
        obs.location?.uuid ||
        obs.location?.reference?.split('/').pop() ||
        obs.encounter?.location?.[0]?.location?.reference?.split('/').pop();
      if (currentLocationUuid && obsLocationUuid && obsLocationUuid !== currentLocationUuid) return;

      const ds = obs.effectiveDateTime || obs.date;
      if (!ds) return;
      const d = new Date(ds);
      if (Number.isNaN(d.getTime())) return;

      const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';
      const encounterKey =
        obs.encounter?.uuid ||
        obs.encounter?.reference ||
        obs.encounterUuid ||
        String(ds);
      if (!encounterKey) return;

      const existing = encounters.get(encounterKey);
      if (!existing) {
        encounters.set(encounterKey, {
          date: d,
          scores: { internalized: [], anticipated: [], enacted: [] },
        });
      }

      const norm = normalizeStigmaType(raw, conceptUuid);
      if (!norm) return;

      const score = getNumericValueFromObservation(obs);
      if (score === null || Number.isNaN(score)) return;

      const maxScore = norm === 'आत्मलान्छना' ? 30 : norm === 'अपेक्षित लान्छना' ? 36 : norm === 'व्यावहारिक लान्छना' ? 13 : 0;
      if (maxScore <= 0 || score < 0 || score > maxScore) return;

      const encounter = encounters.get(encounterKey);
      if (encounter) {
        if (norm === 'आत्मलान्छना') {
          encounter.scores.internalized.push(score);
        } else if (norm === 'अपेक्षित लान्छना') {
          encounter.scores.anticipated.push(score);
        } else if (norm === 'व्यावहारिक लान्छना') {
          encounter.scores.enacted.push(score);
        }
      }
    });

    const sortedEncounters = Array.from(encounters.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    maxVisitCount = Math.max(maxVisitCount, sortedEncounters.length);
    sortedEncounters.forEach((encounterGroup, encounterIndex) => {
      if (!visitScores[encounterIndex]) {
        visitScores[encounterIndex] = { internalized: [], anticipated: [], enacted: [] };
      }
      visitScores[encounterIndex].internalized.push(...encounterGroup.scores.internalized);
      visitScores[encounterIndex].anticipated.push(...encounterGroup.scores.anticipated);
      visitScores[encounterIndex].enacted.push(...encounterGroup.scores.enacted);
      visitDates[encounterIndex] = encounterGroup.date;
    });
  });

  const average = (values: number[]) => {
    if (!values.length) return 0;
    // Round to 1 decimal place, same as the Dimensions chart
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
  };

  const visitCount = Math.max(visitScores.length, maxVisitCount, getMaxVisitCount(allPatientsData));

  return Array.from({ length: visitCount }, (_, index) => {
    const scores = visitScores[index] || { internalized: [], anticipated: [], enacted: [] };

    return {
      visit: index + 1,
      internalized: average(scores.internalized),
      anticipated: average(scores.anticipated),
      enacted: average(scores.enacted),
      latestDate: visitDates[index] ? formatDateKey(visitDates[index]) : undefined,
    };
  });
}

type SelectedStigmaType = 'all' | StigmaType;

export const StgTypeVisualization: React.FC<StgTypeProps> = ({
  allPatientsData,
  currentLocationUuid,
}) => {
  const [selectedType, setSelectedType] = useState<SelectedStigmaType>('all');

  const visitAverages = useMemo(
    () => calculateVisitScores(allPatientsData, currentLocationUuid),
    [allPatientsData, currentLocationUuid],
  );

  const stigmaTypeOptions = useMemo(
    () => [
      { value: 'all' as const, label: 'All stigma types' },
      { value: 'आत्मलान्छना' as const, label: 'आत्मलान्छना' },
      { value: 'अपेक्षित लान्छना' as const, label: 'अपेक्षित लान्छना' },
      { value: 'व्यावहारिक लान्छना' as const, label: 'व्यावहारिक लान्छना' },
    ],
    [],
  );

  const labels = visitAverages.map((visit) => `${visit.visit}${getOrdinalSuffix(visit.visit)} visit`);
  const colors = ['#FF6B6B', '#4FC3F7', '#81C784'];
  const borderColors = ['#D32F2F', '#0288D1', '#2E7D32'];

  const datasets = selectedType === 'all'
    ? [
        {
          label: 'आत्मलान्छना',
          data: visitAverages.map((visit) => visit.internalized),
          borderColor: borderColors[0],
          backgroundColor: colors[0],
        },
        {
          label: 'अपेक्षित लान्छना',
          data: visitAverages.map((visit) => visit.anticipated),
          borderColor: borderColors[1],
          backgroundColor: colors[1],
        },
        {
          label: 'व्यावहारिक लान्छना',
          data: visitAverages.map((visit) => visit.enacted),
          borderColor: borderColors[2],
          backgroundColor: colors[2],
        },
      ]
    : [
        {
          label: selectedType,
          data: visitAverages.map((visit) =>
            selectedType === 'आत्मलान्छना'
              ? visit.internalized
              : selectedType === 'अपेक्षित लान्छना'
              ? visit.anticipated
              : visit.enacted,
          ),
          borderColor:
            selectedType === 'आत्मलान्छना'
              ? borderColors[0]
              : selectedType === 'अपेक्षित लान्छना'
              ? borderColors[1]
              : borderColors[2],
          backgroundColor:
            selectedType === 'आत्मलान्छना'
              ? colors[0]
              : selectedType === 'अपेक्षित लान्छना'
              ? colors[1]
              : colors[2],
        },
      ];

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 3,
      fill: false,
      tension: 0.35,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointBackgroundColor: dataset.backgroundColor,
      pointBorderColor: '#fff',
    })),
  };

  const latestDateLabel = visitAverages.length
    ? `Latest data: ${visitAverages[visitAverages.length - 1].latestDate ?? 'N/A'}`
    : 'No data available';

  const totalPossibleScores: Record<SelectedStigmaType, string> = {
    all: 'Total score: आत्मलान्छना = 30, अपेक्षित लान्छना = 36, व्यावहारिक लान्छना = 13',
    'आत्मलान्छना': 'Total score: आत्मलान्छना = 30',
    'अपेक्षित लान्छना': 'Total score: अपेक्षित लान्छना = 36',
    'व्यावहारिक लान्छना': 'Total score: व्यावहारिक लान्छना = 13',
  };

  const totalPossibleLabel = totalPossibleScores[selectedType];

  const chartOptions: any = {
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            लान्छना प्रकार स्कोर
          </h4>
          <div style={{ fontSize: '0.9rem', color: '#555' }}>{latestDateLabel}</div>
        </div>

        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            Stigma Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as SelectedStigmaType)}
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
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
          />
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', color: '#444', fontSize: '0.95rem' }}>
          {totalPossibleLabel}
        </div>
      </div>
    </div>
  );
};
  