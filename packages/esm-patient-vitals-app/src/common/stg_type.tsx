import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export type StigmaType = 'आत्मलान्छना' | 'अपेक्षित लान्छना' | 'व्यावहारिक लान्छना';
export type MetricType = 'min' | 'max' | 'all';

export interface StgTypeProps {
  allPatientsData: any[];
  startDate?: string; // ISO yyyy-mm-dd
  endDate?: string; // ISO yyyy-mm-dd
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
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.internalized || conceptUuid === STIGMA_CONCEPT_UUIDS.internalized_inter) {
      return 'आत्मलान्छना';
    }
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.anticipated || conceptUuid === STIGMA_CONCEPT_UUIDS.anticipated_inter) {
      return 'अपेक्षित लान्छना';
    }
    if (conceptUuid === STIGMA_CONCEPT_UUIDS.enacted || conceptUuid === STIGMA_CONCEPT_UUIDS.enacted_inter) {
      return 'व्यावहारिक लान्छना';
    }
  }

  // Fallback: check by text patterns - but be STRICT to avoid matching individual questions
  const s = (raw || '').toLowerCase();
  if (!s) return '';

  // INCLUDE intersectional stigma scores - these are the aggregated scores we want
  if (s.includes('intersectional stigma score')) {
    if (s.includes('internalized')) return 'आत्मलान्छना';
    if (s.includes('anticipated')) return 'अपेक्षित लान्छना';
    if (s.includes('enacted')) return 'व्यावहारिक लान्छना';
    return '';
  }

  // EXCLUDE domain scores - these contain "domain" in the text (individual domain scores, not main scores)
  if (s.includes('domain score')) {
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

interface LatestTypeScores {
  internalized: number;
  anticipated: number;
  enacted: number;
  latestDate?: string;
}

// Format date key for grouping by date
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function computeLatestTypeScores(
  allPatientsData: any[],
  startDate?: string,
  endDate?: string,
  currentLocationUuid?: string,
): LatestTypeScores {
  const latestPerType = {
    internalized: { timestamp: 0, value: 0 },
    anticipated: { timestamp: 0, value: 0 },
    enacted: { timestamp: 0, value: 0 },
  };

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  let latestTimestamp = 0;

  (allPatientsData || []).forEach((patientObs) => {
    (patientObs || []).forEach((obs: any) => {
      const obsLocationUuid =
        obs.locationUuid ||
        obs.location?.uuid ||
        obs.location?.reference?.split('/').pop() ||
        obs.encounter?.location?.[0]?.location?.reference?.split('/').pop();

      if (currentLocationUuid && obsLocationUuid && obsLocationUuid !== currentLocationUuid) return;

      const ds = obs.effectiveDateTime || obs.date;
      if (!ds) return;
      const d = new Date(ds);
      if (start && d < start) return;
      if (end && d > end) return;

      const raw = (obs.stigmaType || obs.code?.coding?.[0]?.display || obs.code?.text || '').toString();
      const conceptUuid = obs.code?.coding?.[0]?.code || obs.concept?.uuid || '';
      const norm = normalizeStigmaType(raw, conceptUuid);
      if (!norm) return;

      const value = getNumericValueFromObservation(obs);
      if (value === null || Number.isNaN(value)) return;

      const timestamp = d.getTime();
      if (norm === 'आत्मलान्छना') {
        if (timestamp >= latestPerType.internalized.timestamp) {
          latestPerType.internalized = { timestamp, value };
        }
      } else if (norm === 'अपेक्षित लान्छना') {
        if (timestamp >= latestPerType.anticipated.timestamp) {
          latestPerType.anticipated = { timestamp, value };
        }
      } else if (norm === 'व्यावहारिक लान्छना') {
        if (timestamp >= latestPerType.enacted.timestamp) {
          latestPerType.enacted = { timestamp, value };
        }
      }

      if (timestamp > latestTimestamp) {
        latestTimestamp = timestamp;
      }
    });
  });

  const result: LatestTypeScores = {
    internalized: latestPerType.internalized.value,
    anticipated: latestPerType.anticipated.value,
    enacted: latestPerType.enacted.value,
  };

  if (latestTimestamp > 0) {
    result.latestDate = formatDateKey(new Date(latestTimestamp));
  }

  return result;
}

export const StgTypeVisualization: React.FC<StgTypeProps> = ({
  allPatientsData,
  startDate,
  endDate,
  currentLocationUuid,
}) => {
  const latestScores = useMemo(
    () => computeLatestTypeScores(allPatientsData, startDate, endDate, currentLocationUuid),
    [allPatientsData, startDate, endDate, currentLocationUuid],
  );

  const labels = ['आत्मलान्छना', 'अपेक्षित लान्छना', 'व्यावहारिक लान्छना'];
  const scoreValues = [
    latestScores.internalized || 0,
    latestScores.anticipated || 0,
    latestScores.enacted || 0,
  ];
  const latestDateLabel = latestScores.latestDate ? `Latest data: ${latestScores.latestDate}` : 'No data available';

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stigma Score',
        data: scoreValues,
        backgroundColor: ['#FF6B6B', '#4FC3F7', '#81C784'],
        borderColor: ['#D32F2F', '#0288D1', '#2E7D32'],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 24,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = typeof context.raw === 'number' ? context.raw.toFixed(1) : context.raw;
            return `${context.label}: ${value}`;
          },
        },
      },
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
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Stigma Type',
          font: {
            size: window.innerWidth <= 480 ? 11 : 13,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
          },
        },
        grid: {
          display: false,
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

        <div
          style={{
            height: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '380px' : '420px',
            width: '100%',
            position: 'relative',
          }}
        >
          <Chart
            type="bar"
            data={chartData}
            plugins={[
              {
                id: 'datalabels-stigmatype',
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
                      ctx.fillText(value, bar.x, bar.y - 8);
                    });
                  });
                  ctx.restore();
                },
              },
            ]}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};
  