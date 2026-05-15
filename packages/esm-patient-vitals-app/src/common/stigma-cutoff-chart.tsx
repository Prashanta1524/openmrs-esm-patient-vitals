import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import type { StigmaData } from './stigma-data.resource';
import 'chart.js/auto';

interface StigmaCutoffSummary {
  totalPatients: number;
  matchedPatients: number;
  unmatchedPatients: number;
}

interface StigmaCutoffChartProps {
  stigmaCutoffSummary: StigmaCutoffSummary | null;
  patientsData?: any[];
  stigmaData?: StigmaData[];
  stigmaScoreLabel?: string;
  stigmaScoreThreshold?: number;
}

type StigmaTypeKey = 'anticipated' | 'enacted' | 'internalized';

interface ChartCounts {
  above: number;
  below: number;
  total: number;
}

const STIGMA_CUTOFFS: Record<StigmaTypeKey, number> = {
  anticipated: 40,
  enacted: 43,
  internalized: 33,
};

function normalizeStigmaType(entry: any): StigmaTypeKey | null {
  const type = (entry.stigmaType || entry.type || entry.display || '').toString().toLowerCase();
  if (type.includes('anticipated') || type.includes('अपेक्षित')) return 'anticipated';
  if (type.includes('enacted') || type.includes('व्यावहारिक')) return 'enacted';
  if (type.includes('internalized') || type.includes('आत्म')) return 'internalized';
  return null;
}

function getIntersectionalScore(entry: any, stigmaType: StigmaTypeKey | null = null): number | undefined {
  if (entry.intersectionalScore !== undefined && entry.intersectionalScore !== null) {
    return Number(entry.intersectionalScore);
  }
  if (stigmaType === 'anticipated' && entry.intersectional_stigma_as !== undefined) {
    return Number(entry.intersectional_stigma_as);
  }
  if (stigmaType === 'enacted' && entry.intersectional_stigma_es !== undefined) {
    return Number(entry.intersectional_stigma_es);
  }
  if (stigmaType === 'internalized' && entry.intersectional_stigma_is !== undefined) {
    return Number(entry.intersectional_stigma_is);
  }
  const scoreString = (entry.display || entry.stigmaScore || '').toString();
  const match = scoreString.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function calculateStigmaStrategyCounts(stigmaData: StigmaData[]) {
  const counts: Record<'overall' | StigmaTypeKey, ChartCounts> = {
    overall: { above: 0, below: 0, total: 0 },
    anticipated: { above: 0, below: 0, total: 0 },
    enacted: { above: 0, below: 0, total: 0 },
    internalized: { above: 0, below: 0, total: 0 },
  };

  stigmaData.forEach((entry) => {
    const stigmaType = normalizeStigmaType(entry);
    const intersectionalScore = getIntersectionalScore(entry, stigmaType);
    if (intersectionalScore === undefined || Number.isNaN(intersectionalScore) || !stigmaType) {
      return;
    }

    const threshold = STIGMA_CUTOFFS[stigmaType];
    const above = intersectionalScore >= threshold;

    if (above) counts.overall.above += 1;
    else counts.overall.below += 1;
    counts.overall.total += 1;

    if (above) counts[stigmaType].above += 1;
    else counts[stigmaType].below += 1;
    counts[stigmaType].total += 1;
  });

  return counts;
}

export function StigmaCutoffChart({
  stigmaCutoffSummary,
  patientsData,
  stigmaData,
  stigmaScoreLabel,
  stigmaScoreThreshold,
}: StigmaCutoffChartProps) {
  const chartCounts = useMemo(() => {
    if (stigmaData && stigmaData.length > 0) {
      return calculateStigmaStrategyCounts(stigmaData);
    }

    if (patientsData && stigmaScoreLabel && stigmaScoreThreshold) {
      const result = calculateStigmaThresholdCounts(patientsData, stigmaScoreLabel, stigmaScoreThreshold);
      const total = result.aboveThresholdCount + result.belowThresholdCount;
      return {
        overall: { above: result.aboveThresholdCount, below: result.belowThresholdCount, total },
        anticipated: { above: 0, below: 0, total: 0 },
        enacted: { above: 0, below: 0, total: 0 },
        internalized: { above: 0, below: 0, total: 0 },
      };
    }

    if (stigmaCutoffSummary) {
      return {
        overall: {
          above: stigmaCutoffSummary.matchedPatients,
          below: stigmaCutoffSummary.unmatchedPatients,
          total: stigmaCutoffSummary.totalPatients,
        },
        anticipated: { above: 0, below: 0, total: 0 },
        enacted: { above: 0, below: 0, total: 0 },
        internalized: { above: 0, below: 0, total: 0 },
      };
    }

    return null;
  }, [stigmaCutoffSummary, patientsData, stigmaData, stigmaScoreLabel, stigmaScoreThreshold]);

  if (!chartCounts) {
    return <p>तथ्यांक विश्लेषण गर्दै...</p>;
  }

  const makeChartConfig = (counts: ChartCounts) => ({
    labels: ['Above cut-off score', 'Below cut-off score'],
    datasets: [
      {
        data: [counts.above, counts.below],
        backgroundColor: ['#f7cc5c', '#28a6a4'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  });

  const chartCards = [
    { title: 'Overall Intersectional Stigma', counts: chartCounts.overall },
    { title: 'Anticipated Stigma', counts: chartCounts.anticipated },
    { title: 'Enacted Stigma', counts: chartCounts.enacted },
    { title: 'Internalized Stigma', counts: chartCounts.internalized },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          textRendering: 'optimizeLegibility',
          marginBottom: '1.5rem',
        }}
      >
        Above/Below Intersectional Stigma Cut-off Score
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {chartCards.map((card) => {
          const total = card.counts.total;
          const percentageAbove = total > 0 ? ((card.counts.above / total) * 100).toFixed(1) : '0.0';
          const percentageBelow = total > 0 ? ((card.counts.below / total) * 100).toFixed(1) : '0.0';
          return (
            <div
              key={card.title}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 6px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ margin: '0 0 0.75rem', color: '#111827', fontSize: '1.1rem' }}>{card.title}</h4>
              <Chart
                type="pie"
                data={makeChartConfig(card.counts)}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 12,
                        color: '#1f2937',
                      },
                    },
                    tooltip: {
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#111827',
                      bodyColor: '#111827',
                      borderColor: '#d1d5db',
                      borderWidth: 1,
                      callbacks: {
                        label: function (context) {
                          const value = context.raw as number;
                          const label = context.label || '';
                          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                          return `${label}: ${percentage}% (${value} patients)`;
                        },
                      },
                    },
                  },
                }}
              />
              <div style={{ marginTop: '1rem', textAlign: 'center', color: '#374151' }}>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                  Above cut-off score: {percentageAbove}% ({card.counts.above})
                </p>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                  Below cut-off score: {percentageBelow}% ({card.counts.below})
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                  Total patients: {total}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to calculate stigma threshold counts
function calculateStigmaThresholdCounts(patientsData: any[], stigmaScoreLabel: string, stigmaScoreThreshold: number) {
  let aboveThresholdCount = 0;
  let belowThresholdCount = 0;

  patientsData.forEach((patient: any[]) => {
    // Find the most recent stigma score for each patient
    let mostRecent: any = null;
    let mostRecentDate: Date | null = null;

    patient.forEach((obs: any) => {
      if (obs.display?.includes(stigmaScoreLabel)) {
        const date = new Date(obs.effectiveDateTime || obs.date);
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date;
          mostRecent = obs;
        }
      }
    });

    if (mostRecent) {
      // Extract the numeric value from the display string
      // Assuming the format is like "Stigma Score: 12"
      const valueMatch = mostRecent.display.match(/\d+(\.\d+)?/);
      if (valueMatch) {
        const value = parseFloat(valueMatch[0]);
        if (value >= stigmaScoreThreshold) {
          aboveThresholdCount++;
        } else {
          belowThresholdCount++;
        }
      }
    }
  });

  return { aboveThresholdCount, belowThresholdCount };
}
